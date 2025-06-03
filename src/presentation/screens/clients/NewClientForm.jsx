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
    
    const [name, setName] = useState("");
    const [lastNameP, setLastNameP] = useState("");
    const [lastNameM, setLastNameM] = useState("");
    const [phone, setPhone] = useState("");
    const [image, setImage] = useState(null);
    const [municipio, setMunicipio] = useState(0);
    const [colonia, setColonia] = useState(0);
    const [street, setStreet] = useState("");
    const [number, setNumber] = useState("");
    const [distinguido, setDistinguido] = useState(0);
    const [description, setDescription] = useState("");

    const { loading: loadingColonias, error: errorColonias, data: dataColonias } = useQuery(COLONIAS_LIST, {
        variables: {
            filter: parseInt(municipio)
        }
    });
    const { loading: loadingMunicipios, error: errorMunicipios, data: dataMunicipios } = useQuery(MUNICIPIOS_LIST);

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("Nombre:", name);
        console.log("Paterno:", lastNameP);
        console.log("Materno:", lastNameM);
        console.log("Teléfono:", phone);
        console.log("Municipio:", municipio);
        console.log("Colonia:", colonia);
        console.log("Calle: ", street);
        console.log("Número exterior: ", number);
        console.log("Imagen:", image);
        console.log("Distinguido:", distinguido);
        console.log("Descripción:", description);
    }

    if(loadingColonias || loadingMunicipios){
        return <p className="text-6xl text-black">Cargando...</p>
    }

    if( errorColonias || errorMunicipios) {
        return <p className="text-6xl text-black">{errorClients.message}.</p>
    }

    const uploadImage = async (e) => {           
        try {
            const files = e.target.files            
            const data = new FormData()             
            
            data.append('file', files[0])           
            data.append('upload_preset',"elpinotumbado")  
            
            const response = await fetch(`https://api.cloudinary.com/v1_1/dqh6utbju/image/upload`, {
                method: 'POST',
                body: data
            });

            const file = await response.json();     
            setImage(file.secure_url);              
        } catch (error) {
            console.error('Error uploading image:', error);
            setLoading(false);
        }

    }

    return (
        <div className="lg:pl-64 md:pl-64 flex justify-center items-center flex-col w-full">
            <form onSubmit={handleSubmit} className="space-y-6 w-4/5 lg:rounded-lg lg:shadow-2xl md:rounded-lg md:shadow-2xl lg:p-10 md:p-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Registro de Cliente</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre(s)
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                            placeholder="Nombre(s)"
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
                            value={lastNameP}
                            onChange={(e) => setLastNameP(e.target.value)}
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
                            value={lastNameM}
                            onChange={(e) => setLastNameM(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                            placeholder="Apellido Materno"
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
                            minLength={10}
                            maxLength={10}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                            placeholder="Teléfono"
                            required
                        />
                    </div>
                    <div className="relative">
                        <label htmlFor="municipio" className="block text-sm font-medium text-gray-700 mb-2">
                            Municipio
                        </label>
                        <select
                            value={municipio}
                            onChange={(e) => setMunicipio(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm  focus:ring-2 focus:ring-green-600 focus:border-green-600"
                        >
                            {dataMunicipios.getMunicipios.map((municipio) => (
                                <option key={municipio.idMunicipio} value={municipio.idMunicipio}>
                                    {municipio.nombre === "Todos los municipios" ? "Seleccione un municipio" : municipio.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="relative">
                        <label htmlFor="colonia" className="block text-sm font-medium text-gray-700 mb-2">
                            Colonia
                        </label>
                        <select
                            value={colonia}
                            onChange={(e) => setColonia(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-600 focus:border-green-600"
                        >
                            {dataColonias.getColonias.map((colonia) => (
                                <option key={colonia.idColonia} value={colonia.idColonia}>
                                    {colonia.nombre === "Todas las colonias" ? "Seleccione una colonia" : colonia.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
                            Calle
                        </label>
                        <input
                            type="text"
                            id="street"
                            name="street"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                            placeholder="Calle"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                            Número Exterior
                        </label>
                        <input
                            type="text"
                            id="number"
                            name="number"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                            placeholder="Número exterior"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                            Archivo
                        </label>
                        <input
                            type="file"
                            id="file"
                            name="file"
                            onChange={uploadImage}
                            className="w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 file:mr-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-white file:text-green-700 hover:file:bg-white"
                        />
                    </div>
                    <div className="relative">
                        <label htmlFor="municipio" className="block text-sm font-medium text-gray-700 mb-2">
                            Distinguido
                        </label>
                        <select
                            value={distinguido}
                            onChange={(e) => setDistinguido(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm  focus:ring-2 focus:ring-green-600 focus:border-green-600"
                        >
                            <option value="0">Seleccione una opción</option>
                            <option value="1">Sí</option>
                            <option value="2">No</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm resize-vertical focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                        placeholder="Ingrese una descripción..."
                    />
                </div>
                <div>
                    <button
                        onClick={handleSubmit}
                        type="submit"
                        className="w-full cursor-pointer bg-green-800 text-white py-2 px-4 rounded-md hover:bg-green-900 transition duration-200 font-medium"
                    >
                        Guardar cliente
                    </button>
                </div>
            </form>
        </div>
    )
}

export default NewClientForm;
