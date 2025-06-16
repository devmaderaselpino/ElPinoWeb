import { gql, useMutation, useQuery } from '@apollo/client';
import Loading from "../../components/shared/Loading";
import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import ErrorPage from '../../components/shared/ErrorPage';

const INSERT_DISTRICT = gql`
    mutation InsertDistrict($input: ColoniaInput) {
        insertDistrict(input: $input)
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

const NewDistrictForm = () => {

    const navigate = useNavigate();

    const [municipio, setMunicipio] = useState(0);
    const [district, setDistrict] = useState("");
    const [cp, setCp] = useState("");

    const [errorDistrict, setErrorDistrict] = useState(false);
    const [errorMunicipio, setErrorMunicipio] = useState(false);
    const [errorCP, setErrorCP] = useState(false);
    
    const [insertDistrict, { loading: loadingUpdate}] = useMutation(INSERT_DISTRICT);
   
    const { loading: loadingMunicipios, error: errorMunicipios, data: dataMunicipios } = useQuery(MUNICIPIOS_LIST, {fetchPolicy: "network-only"});

    if(loadingUpdate || loadingMunicipios){
        return (
            <div className="min-h-screen flex items-center justify-center flex-col">
                <h1 className="text-3xl font-bold text-gray-800 mb-5">Cargando</h1>
                <Loading variant="wave" size="lg" color="green" />
            </div>
        );
    }

     if(errorMunicipios) {
        return  <ErrorPage message={"Inténtelo más tarde."}/>
    }

    const validateInput = (value, setError) => {
        if( !value || value === "0" || value === 0) {
            setError(true);
        }else{
            setError(false);
        }
    }

    const handleSubmit = async (e) => {
        validateInput(municipio, setErrorMunicipio);
        validateInput(district, setErrorDistrict);
        validateInput(cp, setErrorCP);
        e.preventDefault();


        if(errorDistrict || !district || errorMunicipio || municipio === "0" || municipio === 0 || errorCP || !cp){
            return;
        }
        
        try {
            const resp = await insertDistrict({
                variables: {
                    input : {
                        idMunicipio: parseInt(municipio),
                        nombre: district,
                        cp: parseInt(cp)
                    }
                }
            });
            
            if(resp.data.insertDistrict === "Colonia insertada"){
                Swal.fire({
                    title: "Colonia agregada con éxito!",
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
                title: "¡Ha ocurrido un error agregando la colonia!",
                text: "Inténtelo más tarde.",
                icon: "error",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#922b21",
            }); 
        }
    }

    return(
       <div className="flex justify-center items-center flex-col w-full h-screen">
            <form onSubmit={handleSubmit} className="space-y-6 w-4/5 lg:w-3/5 lg:rounded-lg lg:shadow-2xl md:rounded-lg md:shadow-2xl lg:p-10 md:p-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Agregar Colonia</h2>  
                <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2  gap-6">
                    <div>
                        <label htmlFor="municipio" className="block text-sm font-medium text-gray-700 mb-2">
                            Municipio
                        </label>
                        <div className="flex flex-col">
                            <select
                                value={municipio}
                                onBlur={()=>{validateInput(municipio, setErrorMunicipio)}}
                                onChange={(e) => setMunicipio(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm  focus:ring-2 focus:ring-green-600 focus:border-green-600"
                            >
                                {dataMunicipios.getMunicipios.map((municipio) => (
                                    <option key={municipio.idMunicipio} value={municipio.idMunicipio}>
                                        {municipio.nombre === "Todos los municipios" ? "Seleccione un municipio" : municipio.nombre}
                                    </option>
                                ))}
                            </select>
                            {errorMunicipio ? <span className="text-red-700 text-sm mt-2">Campo obligatorio.</span> : null}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Código Postal
                        </label>
                        <div className="flex flex-col">
                            <input
                                type="text"
                                id="cp"
                                name="cp"
                                value={cp}
                                onBlur={()=>{validateInput(cp, setErrorCP)}}
                                onChange={(e) => setCp(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                                placeholder="Código postal"
                            />
                            {errorCP ? <span className="text-red-700 text-sm mt-2">Campo obligatorio.</span> : null}
                        </div>
                    </div>         
                </div>
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre colonia
                        </label>
                        <div className="flex flex-col">
                            <input
                                type="text"
                                id="district"
                                name="district"
                                value={district}
                                onBlur={()=>{validateInput(district, setErrorDistrict)}}
                                onChange={(e) => setDistrict(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                                placeholder="Nombre colonia"
                            />
                            {errorDistrict ? <span className="text-red-700 text-sm mt-2">Campo obligatorio.</span> : null}
                        </div>
                    </div>    
                </div>
                <div>
                    <button
                        //onClick={handleSubmit}
                        type="submit"
                        className="w-full cursor-pointer bg-green-800 text-white py-2 px-4 rounded-md hover:bg-green-900 transition duration-200 font-medium"
                    >
                        Guardar colonia
                    </button>
                </div>
            </form>
        </div>
    );
}

export default NewDistrictForm;
