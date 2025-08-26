import { gql, useMutation, useQuery } from '@apollo/client';
import Loading from "../../components/shared/Loading";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import ErrorPage from '../../components/shared/ErrorPage';

const DISTRICT_INFO = gql`
    query GetColonia($idColonia: Int) {
        getColonia(idColonia: $idColonia) {
            idColonia
            idMunicipio
            nombre
            cp
    }
}
`;

const UPDATE_DISTRICT = gql`
    mutation Mutation($input: ColoniaInput) {
        updateDistrict(input: $input)
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

export default function EditDistrict() {

    const {idColonia} = useParams();

    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        municipio: 0,
        codigoPostal: "",
        nombreColonia: "",
    });

    const [errors, setErrors] = useState({});

    const { loading, error, data } = useQuery(DISTRICT_INFO, {
        variables: {
            idColonia: parseInt(idColonia)
        }, 
        fetchPolicy: "no-cache"
    });

    const { loading: loadingMunicipios, error: errorMunicipios, data: dataMunicipios } = useQuery(MUNICIPIOS_LIST, {fetchPolicy: "no-cache"});

    const [updateDistrict, { loading: loadingUpdate}] = useMutation(UPDATE_DISTRICT);

    useEffect(()=> {
        if(data){

            const datosActualizados = {
                municipio: data.getColonia.idMunicipio,
                codigoPostal: data.getColonia.cp,
                nombreColonia: data.getColonia.nombre,
            };

            setFormData(datosActualizados)
            
        }
    },[data])

    const handleChange = (e) => {
        const { name, value } = e.target
        
        setFormData({ ...formData, [name]: value });

        if(name === "codigoPostal"){
            const onlyNums = e.target.value.replace(/\D/g, "");
            setFormData({ ...formData, [name]: onlyNums })

        }else {
            setErrors({ ...errors, [name]: "" })
        }
    }

    const validate = () => {
        const newErrors = {}
        if (!formData.municipio) newErrors.municipio = "Debe seleccionar un municipio."
        if (!formData.codigoPostal.toString().trim()) newErrors.codigoPostal = "El código postal es obligatorio."
        if (!formData.nombreColonia.trim()) newErrors.nombreColonia = "El nombre de la colonia es obligatorio."
        return newErrors
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        const validationErrors = validate()
        
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
        } else {
        
            try {
                const resp = await updateDistrict({
                    variables: {
                        input : {
                            idColonia: parseInt(idColonia),
                            idMunicipio: parseInt(formData.municipio),
                            nombre: formData.nombreColonia,
                            cp: parseInt(formData.codigoPostal)
                        }
                    }
                });
            
                if(resp.data.updateDistrict === "Colonia actualizada"){

                    Swal.fire({
                        title: "¡Colonia actualizada con éxito!",
                        text: "Serás redirigido a la lista de ubicaciones.",
                        icon: "success",
                        confirmButtonText: "Aceptar",
                        confirmButtonColor: "#1e8449",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate(`/Ubicaciones`)
                        }
                    });

                }

            } catch (error) {
                Swal.fire({
                    title: "¡Ha ocurrido un error actualizando la colonia!",
                    text: "Inténtelo más tarde.",
                    icon: "error",
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#922b21",
                });  
            }
    
        }
    }

    if(loading || loadingUpdate || loadingMunicipios){
        return (
            <div className="min-h-screen flex items-center justify-center flex-col">
                <h1 className="text-3xl font-bold text-gray-800 mb-5">Cargando</h1>
                <Loading variant="wave" size="lg" color="green" />
            </div>
        );
    }

    if(error || errorMunicipios) {
        return  <ErrorPage message={"Inténtelo más tarde."}/>
    }

    console.log(formData.codigoPostal);
    

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
                <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Editar Colonia</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="municipio" className="block text-sm font-medium text-gray-700 mb-1">
                                Municipio
                            </label>
                            <div className="relative">
                                <select
                                    id="municipio"
                                    name="municipio"
                                    value={formData.municipio}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border ${errors.municipio ? "border-red-500" : "border-gray-300"} rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 pr-8`}
                                >
                                    {dataMunicipios.getMunicipios.map((municipio) => (
                                        <option key={municipio.idMunicipio} value={municipio.idMunicipio}>
                                            {municipio.nombre === "Todos los municipios" ? "Seleccione un municipio" : municipio.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {errors.municipio && <p className="text-red-500 text-sm mt-1">{errors.municipio}</p>}
                        </div>
                        <div>
                            <label htmlFor="codigoPostal" className="block text-sm font-medium text-gray-700 mb-1">
                                Código Postal
                            </label>
                            <input
                                type="text"
                                id="codigoPostal"
                                name="codigoPostal"
                                placeholder="Código postal"
                                value={formData.codigoPostal}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border ${errors.codigoPostal ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                            />
                            {errors.codigoPostal && <p className="text-red-500 text-sm mt-1">{errors.codigoPostal}</p>}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="nombreColonia" className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre colonia
                        </label>
                        <input
                            type="text"
                            id="nombreColonia"
                            name="nombreColonia"
                            placeholder="Nombre colonia"
                            value={formData.nombreColonia}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border ${errors.nombreColonia ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                        />
                        {errors.nombreColonia && <p className="text-red-500 text-sm mt-1">{errors.nombreColonia}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#166534] text-white py-3 rounded-md font-semibold hover:bg-green-800 transition-colors duration-200"
                    >
                        Guardar colonia
                    </button>
                </form>
            </div>
        </div>
    )
}
