import { useParams } from "react-router-dom";
import { useQuery, gql, useMutation } from '@apollo/client';
import Loading from "../../components/shared/Loading";
import ErrorPage from "../../components/shared/ErrorPage";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const CITY_INFO = gql`
    query GetMunicipio($idMunicipio: Int) {
        getMunicipio(idMunicipio: $idMunicipio) {
            idMunicipio
            nombre
        }
    }
`;

const UPDATE_CITY = gql`
    mutation UpdateCity($input: MunicipioInput) {
        updateCity(input: $input)
    }
`;

const EditCity = () => {

    const {idCiudad} = useParams();

     const navigate = useNavigate();

    const [city, setCity] = useState("")
    const [errorCity, setErrorCity] = useState(false);

    const { loading, error, data } = useQuery(CITY_INFO, {
        variables: {
            idMunicipio: parseInt(idCiudad)
        }, fetchPolicy: "network-only"
    });

    const [updateCity, { loading: loadingUpdate}] = useMutation(UPDATE_CITY);

    useEffect(()=> {
        if(data){
            setCity(data.getMunicipio.nombre);
        }
    },[data])

    if(loading || loadingUpdate){
        return (
            <div className="min-h-screen flex items-center justify-center flex-col">
                <h1 className="text-3xl font-bold text-gray-800 mb-5">Cargando</h1>
                <Loading variant="wave" size="lg" color="green" />
            </div>
        );
    }

    if(error) {
        return  <ErrorPage message={"Inténtelo más tarde."}/>
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(errorCity){
            return;
        }
        
        try {
            const resp = await updateCity({
                variables: {
                    input: {
                        idMunicipio: parseInt(idCiudad),
                        nombre: city
                    }
                }
            });

            if(resp.data.updateCity === "Municipio actualizado"){
                Swal.fire({
                    title: "¡Municipio actualizado con éxito!",
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
                title: "¡Ha ocurrido un error actualizando el municipio!",
                text: "Inténtelo más tarde.",
                icon: "error",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#922b21",
            }); 
        }
    }
    
    const validateInput = (value, setError) => {
        if( !value ) {
            setError(true);
        }else{
            setError(false);
        }
    }

    return(
       <div className="lg:pl-64 md:pl-64 flex justify-center items-center flex-col w-full">
            <form onSubmit={handleSubmit} className="space-y-6 w-4/5 lg:w-3/5 lg:rounded-lg lg:shadow-2xl md:rounded-lg md:shadow-2xl lg:p-10 md:p-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Editar Municipio</h2>
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre municipio
                        </label>
                        <div className="flex flex-col">
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={city}
                                onBlur={()=>{validateInput(city, setErrorCity)}}
                                onChange={(e) => setCity(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                                placeholder="Nombre municipio"
                            />
                            {errorCity ? <span className="text-red-700 text-sm mt-2">Campo obligatorio.</span> : null}
                        </div>
                    </div>   
                </div>
                <div>
                    <button
                        //onClick={handleSubmit}
                        type="submit"
                        className="w-full cursor-pointer bg-green-800 text-white py-2 px-4 rounded-md hover:bg-green-900 transition duration-200 font-medium"
                    >
                        Guardar cambio
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditCity;
