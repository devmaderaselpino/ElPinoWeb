import { useState } from "react"
import { useQuery, gql } from '@apollo/client';

const COLONIAS_LIST = gql`
    query GetColonias($filter: Int) {
        getColonias(filter: $filter) {
            idColonia
            nombre
        }
    }
`;

const MUNICIPIOS_LIST = gql`
    query GetMunicipios {
        getMunicipios {
            idMunicipio
            nombre
        }
    }
`;

const NewClientForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        dadLastName: "",
        momLastName: "",
        phone: "",
        file: null,
        municipio: "",
        colonia: "",
        description: "",
    })

    const [municipioSearch, setMunicipioSearch] = useState("")
    const [coloniaSearch, setColoniaSearch] = useState("")
    const [showMunicipioDropdown, setShowMunicipioDropdown] = useState(false);
    const [showColoniaDropdown, setShowColoniaDropdown] = useState(false);

    const { loading: loadingColonias, error: errorColonias, data: dataColonias } = useQuery(COLONIAS_LIST, {
        variables: {
            filter: 0
        }
    });
    const { loading: loadingMunicipios, error: errorMunicipios, data: dataMunicipios } = useQuery(MUNICIPIOS_LIST);

    const municipios = [
        "Guadalajara",
        "Zapopan",
        "Tlaquepaque",
        "Tonalá",
        "Tlajomulco de Zúñiga",
        "El Salto",
        "Ixtlahuacán de los Membrillos",
        "Juanacatlán",
    ]

    const colonias = [
        "Centro",
        "Americana",
        "Providencia",
        "Chapalita",
        "Las Águilas",
        "Jardines del Bosque",
        "Colinas de San Javier",
        "Lomas del Valle",
        "Santa Tere",
        "Oblatos",
    ]

    const filteredMunicipios = municipios.filter((municipio) =>
        municipio.toLowerCase().includes(municipioSearch.toLowerCase()),
    )

    const filteredColonias = colonias.filter((colonia) => colonia.toLowerCase().includes(coloniaSearch.toLowerCase()))

    const handleInputChange = (e) => {
        const { name, value, files } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }))
    }

    const handleMunicipioSelect = (municipio) => {
        setFormData((prev) => ({ ...prev, municipio }))
        setMunicipioSearch(municipio)
        setShowMunicipioDropdown(false)
    }

    const handleColoniaSelect = (colonia) => {
        setFormData((prev) => ({ ...prev, colonia }))
        setColoniaSearch(colonia)
        setShowColoniaDropdown(false)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("Form submitted:", formData)
    }

    if(loadingColonias || loadingMunicipios){
        return <p className="text-6xl text-black">Cargando...</p>
    }

    if( errorColonias || errorMunicipios) {
        return <p className="text-6xl text-black">{errorClients.message}.</p>
    }

    console.log(dataMunicipios, dataColonias);
    

    return (
        <div className="lg:pl-64 md:pl-64 flex justify-center items-center flex-col w-full">
            <form onSubmit={handleSubmit} className="space-y-6 w-4/5 lg:rounded-lg lg:shadow-2xl md:rounded-lg md:shadow-2xl lg:p-10 md:p-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Formulario de Contacto</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre(s)
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                            placeholder="Nombre(s)"
                            required
                        />
                    </div>   
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                            Teléfono
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                            placeholder="Teléfono"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="dadLastName" className="block text-sm font-medium text-gray-700 mb-2">
                            Apellido Paterno
                        </label>
                        <input
                            type="text"
                            id="dadLastName"
                            name="dadLastName"
                            value={formData.dadLastName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                            placeholder="Apellido Paterno"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="momLastName" className="block text-sm font-medium text-gray-700 mb-2">
                            Apellido Materno
                        </label>
                        <input
                            type="text"
                            id="momLastName"
                            name="momLastName"
                            value={formData.momLastName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                            placeholder="Apellido Materno"
                            required
                        />
                    </div>
                    <div className="relative">
                        <label htmlFor="municipio" className="block text-sm font-medium text-gray-700 mb-2">
                            Municipio
                        </label>
                        <input
                            type="text"
                            id="municipio"
                            value={municipioSearch}
                            onChange={(e) => {
                                setMunicipioSearch(e.target.value)
                                setShowMunicipioDropdown(true)
                            }}
                            onFocus={() => setShowMunicipioDropdown(true)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                            placeholder="Buscar municipio..."
                            required
                        />
                        {showMunicipioDropdown && filteredMunicipios.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                                {filteredMunicipios.map((municipio, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleMunicipioSelect(municipio)}
                                        className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                                    >
                                        {municipio}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="relative">
                        <label htmlFor="colonia" className="block text-sm font-medium text-gray-700 mb-2">
                            Colonia
                        </label>
                        <input
                            type="text"
                            id="colonia"
                            value={coloniaSearch}
                            onChange={(e) => {
                                setColoniaSearch(e.target.value)
                                setShowColoniaDropdown(true)
                            }}
                            onFocus={() => setShowColoniaDropdown(true)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                            placeholder="Buscar colonia..."
                            required
                        />
                        {showColoniaDropdown && filteredColonias.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                                {filteredColonias.map((colonia, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleColoniaSelect(colonia)}
                                    className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                                >
                                    {colonia}
                                </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                        Archivo
                    </label>
                    <input
                        type="file"
                        id="file"
                        name="file"
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-white file:text-green-700 hover:file:bg-white"
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm resize-vertical focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                        placeholder="Ingrese una descripción..."
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        className="w-full bg-green-800 text-white py-2 px-4 rounded-md hover:bg-green-900 transition duration-200 font-medium"
                    >
                        Enviar Formulario
                    </button>
                </div>
            </form>
            {(showMunicipioDropdown || showColoniaDropdown) && (
                <div
                    className="fixed inset-0 z-0"
                    onClick={() => {
                        setShowMunicipioDropdown(false)
                        setShowColoniaDropdown(false)
                    }}
                />
            )}
        </div>
    )
}

export default NewClientForm;
