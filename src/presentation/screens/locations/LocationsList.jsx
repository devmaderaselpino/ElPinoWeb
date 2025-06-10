import React, { useState, useEffect } from "react";
import { useQuery, gql, useMutation } from '@apollo/client';
import { useNavigate } from "react-router-dom";
import { MapPin, Edit, Trash, Plus, ShieldCheck, Search } from 'lucide-react';
import Loading from "../../components/shared/Loading";
import ErrorPage from "../../components/shared/ErrorPage";
import Swal from "sweetalert2";

const COLONIAS_LIST = gql`
    query GetColoniasList {
        getColoniasList {
            idColonia
            nombre
            status
            nombreMunicipio
        }
    }
`;

const MUNICIPIOS_LIST = gql`
    query GetMunicipiosList {
        getMunicipiosList {
            idMunicipio
            nombre
            status
        }
    }
`;

const DELETE_MUNICIPIO = gql`
    mutation DeleteCity($idMunicipio: Int) {
        deleteCity(idMunicipio: $idMunicipio)
    }
`;

const ACTIVATE_MUNICIPIO = gql`
    mutation ActivateCity($idMunicipio: Int) {
        activateCity(idMunicipio: $idMunicipio)
    }
`;

const DELETE_COLONIA = gql`
    mutation DeleteDistrict($idColonia: Int) {
        deleteDistrict(idColonia: $idColonia)
    }
`;

const ACTIVATE_COLONIA = gql`
    mutation ActivateDistrict($idColonia: Int) {
        activateDistrict(idColonia: $idColonia)
    }
`;

const COLONIAS_PAGINATED = gql`
    query GetColoniasPaginated($skip: Int, $limit: Int) {
        getColoniasPaginated(skip: $skip, limit: $limit) {
            total
            items {
                idColonia
                nombre
                status
                nombreMunicipio
            }
        }
    }
`;

const LocationList = () => {

    const navigate = useNavigate();

    const [tabActive, setTabActive] = useState(1);
    const [buttonText, setButtonText] = useState("Municipio");
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [isVisible, setIsVisible] = useState(true);

    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const skip = (currentPage - 1) * itemsPerPage;

    const { loading: loadingColonias, error: errorColonias, data: dataColonias, refetch: refetchColonias } = useQuery(COLONIAS_PAGINATED, {
        variables: { skip, limit: itemsPerPage },
        fetchPolicy: "network-only"
    });
    
    const { loading: loadingMunicipios, error: errorMunicipios, data: dataMunicipios, refetch: refetchMunicipios } = useQuery(MUNICIPIOS_LIST, {fetchPolicy: "network-only"});

    const [deleteCity, { loading: loadingDeleteCity}] = useMutation(DELETE_MUNICIPIO);

    const [activateCity, { loading: loadingActivateCity}] = useMutation(ACTIVATE_MUNICIPIO);

    const [deleteDistrict, { loading: loadingDeleteDistrict}] = useMutation(DELETE_COLONIA);

    const [activateDistrict, { loading: loadingActivateDistrict}] = useMutation(ACTIVATE_COLONIA);

    useEffect(() => {
        if (searchTerm.length >= 3) {
            handleSearch();
        }else if(searchTerm.length < 3 ){
            setFilteredData([]);
            setIsVisible(true);
        }
    }, [searchTerm, dataMunicipios, dataColonias]);

    const handleSearch = () => {
        if(tabActive === 1){
            if (searchTerm.length >= 3 && dataMunicipios ) {
                const filteredMunicipios = dataMunicipios.getMunicipiosList.filter(municipio => {
                    return municipio.nombre.toLowerCase().includes(searchTerm.toLowerCase())
                })
    
                if (filteredMunicipios.length === 0) {
                    setFilteredData([]);
                    setIsVisible(false);
                } else {
                    setIsVisible(false);
                    setFilteredData(filteredMunicipios);
                }
            } 

        }else{
            if (searchTerm.length >= 3 && dataColonias ) {
                const filteredColonias = items.filter(colonia => {
                    return colonia.nombre.toLowerCase().includes(searchTerm.toLowerCase())
                })
    
                if (filteredColonias.length === 0) {
                    setFilteredData([]);
                    setIsVisible(false);
                } else {
                    setIsVisible(false);
                    setFilteredData(filteredColonias);
                }
            } 
        }
    };
    
    if(loadingColonias || loadingMunicipios || loadingDeleteCity || loadingDeleteDistrict || loadingActivateCity || loadingActivateDistrict){
        return (
            <div className="min-h-screen flex items-center justify-center flex-col">
                <h1 className="text-3xl font-bold text-gray-800 mb-5">Cargando</h1>
                <Loading variant="wave" size="lg" color="green" />
            </div>
        );
    }

    if(errorColonias || errorMunicipios) {
        return <ErrorPage message={"Inténtelo más tarde."}/>
    }

    const handleDeleteCity = async (idMunicipio) => {

        try {
            const resp = await deleteCity({
                variables: {
                    idMunicipio: parseInt(idMunicipio)
                }
            });

            if(resp.data.deleteCity === "Municipio eliminado"){
                refetchMunicipios();
            }
           
        } catch (error) {
            console.log(error);
            
        }
       
    }

    const handleActivateCity = async (idMunicipio) => {

        try {
            const resp = await activateCity({
                variables: {
                    idMunicipio: parseInt(idMunicipio)
                }
            });

            if(resp.data.activateCity === "Municipio activado"){
                refetchMunicipios();
            }
           
        } catch (error) {
            console.log(error);
            
        }
       
    }

    const handleDeleteDistrict = async (idColonia) => {

        try {
            const resp = await deleteDistrict({
                variables: {
                    idColonia: parseInt(idColonia)
                }
            });

            if(resp.data.deleteDistrict === "Colonia eliminada"){
                refetchColonias();
            }
           
        } catch (error) {
            console.log(error);
            
        }
       
    }

    const handleActivateDistrict = async (idColonia) => {

        try {
            const resp = await activateDistrict({
                variables: {
                    idColonia: parseInt(idColonia)
                }
            });

            if(resp.data.activateDistrict === "Colonia activada"){
                refetchColonias();
            }
           
        } catch (error) {
            console.log(error);
            
        }
       
    }

    const { total, items } = dataColonias.getColoniasPaginated;
    const totalPages = Math.ceil(total / itemsPerPage);
  
    return(
        <div className="lg:pl-64 md:pl-64 flex justify-center items-center flex-col mt-10">
           <div className="flex w-9/10 justify-between items-center mb-8">
                <div>
                    <h1 className="lg:text-4xl md:text-4xl text-2xl font-bold text-gray-800 mb-2">Lista de Ubicaciones</h1>
                </div>
                <button
                    onClick={() => {
                        tabActive === 1 ? navigate(`/AgregarMunicipio`) : navigate(`/AgregarColonia`);
                    }}
                    className="bg-green-800 hover:bg-green-900 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
                >
                    <Plus size={20} />
                    Agregar {buttonText}
                </button>
            </div>
            <div className="bg-white mb-3 w-9/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-end">
                        <button
                            onClick={() => {
                                setTabActive(1); 
                                setButtonText("Municipio");
                                if(tabActive === 2){
                                    setSearchTerm("");
                                }
                            }}
                            className={`w-full bg-white ${tabActive === 1 ? "border-b-green-800" : "border-b-gray-300"} border-b-2 ${tabActive === 1 ? "text-green-900" : "text-gray-500"} font-semibold py-3 px-6 flex items-center gap-2`}
                        >
                            <MapPin size={20} />
                            Municipios
                        </button>
                    </div>

                    <div className="flex items-end">
                        <button
                             onClick={() => {
                                setTabActive(2); 
                                setButtonText("Colonia");
                                if(tabActive === 1){
                                    setSearchTerm("");
                                }
                            }}
                            className={`w-full bg-white ${tabActive === 2 ? "border-b-green-800" : "border-b-gray-300"} border-b-2 ${tabActive === 2 ? "text-green-900" : "text-gray-500"} font-semibold py-3 px-6 flex items-center gap-2`}
                        >
                            <MapPin size={20} />
                            Colonias
                        </button>
                    </div>
                </div>
            </div>
            <div className="relative flex-1 w-9/10 mb-4">
                <Search className="absolute left-3 top-8 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 mt-3"
                />
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden w-9/10">
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full min-h-fit">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-base font-bold text-black tracking-wider">
                                    Nombre
                                </th>
                                <th className="px-6 py-4 text-left text-base font-bold text-black tracking-wider">
                                    Opciones
                                </th>
                            </tr>
                        </thead>
                        {tabActive === 1 ?  
                            <tbody className="bg-white divide-y divide-gray-200">
                                {dataMunicipios.getMunicipiosList.map((municipio) => (
                                    isVisible && (
                                        <tr key={municipio.idMunicipio} className="w-full">
                                            <td className="px-6 py-4 whitespace-nowrap w-3/5">
                                                <div className="text-sm font-medium text-gray-900">{municipio.nombre}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="bg-white w-full">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <button
                                                            onClick={() => {
                                                                navigate(`/EditarCiudad/${municipio.idMunicipio}`);
                                                            }}
                                                            className={`w-full cursor-pointer shadow-sm shadow-gray-400 ${municipio.status === 0 ? "text-gray-400" : "text-orange-600"}  justify-center rounded-2xl font-semibold  flex items-center p-2`}
                                                            disabled={municipio.status === 0}
                                                        >
                                                            <Edit size={20} className="mr-2" />
                                                            Editar
                                                        </button>
                                                        {municipio.status === 1 ? 
                                                            <button
                                                                onClick={() => {

                                                                    Swal.fire({
                                                                        title: "¿Desea eliminar el municipio?",
                                                                        showCancelButton: true,
                                                                        confirmButtonText: "Aceptar",
                                                                        cancelButtonText: "Cancelar",
                                                                        confirmButtonColor: "#1e8449",
                                                                        cancelButtonColor: "#f39c12"
                                                                        
                                                                        }).then((result) => {

                                                                        if (result.isConfirmed) {
                                                                            handleDeleteCity(municipio.idMunicipio);
                                                                        }
                                                                    }); 
                                                                    
                                                                }}
                                                                className={`w-full cursor-pointer shadow-sm  shadow-gray-400 text-red-600 justify-center rounded-2xl font-semibold  flex items-center p-2`}
                                                            >
                                                                <Trash size={20} className="mr-2"/>
                                                                Eliminar
                                                            </button>
                                                            : 
                                                            <button
                                                                onClick={() => {

                                                                    Swal.fire({
                                                                        title: "¿Desea activar el municipio?",
                                                                        showCancelButton: true,
                                                                        confirmButtonText: "Aceptar",
                                                                        cancelButtonText: "Cancelar",
                                                                        confirmButtonColor: "#1e8449",
                                                                        cancelButtonColor: "#f39c12"
                                                                        
                                                                        }).then((result) => {

                                                                        if (result.isConfirmed) {
                                                                            handleActivateCity(municipio.idMunicipio);
                                                                        }
                                                                    }); 
                                                                    
                                                                }}
                                                                className={`w-full cursor-pointer shadow-sm  shadow-gray-400 text-green-800 justify-center rounded-2xl font-semibold  flex items-center p-2`}
                                                            >
                                                                <ShieldCheck size={20} className="mr-2"/>
                                                                Activar
                                                            </button>
                                                        }
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                ))}
                                {!isVisible && filteredData.length > 0 ? (
                                    filteredData.map((municipio) => (
                                        <tr key={municipio.idMunicipio} className="w-full">
                                            <td className="px-6 py-4 whitespace-nowrap w-3/5">
                                                <div className="text-sm font-medium text-gray-900">{municipio.nombre}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="bg-white w-full">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <button
                                                            onClick={() => {
                                                                navigate(`/EditarCiudad/${municipio.idMunicipio}`);
                                                            }}
                                                            className={`w-full cursor-pointer shadow-sm shadow-gray-400 ${municipio.status === 0 ? "text-gray-400" : "text-orange-600"}  justify-center rounded-2xl font-semibold  flex items-center p-2`}
                                                            disabled={municipio.status === 0}
                                                        >
                                                            <Edit size={20} className="mr-2" />
                                                            Editar
                                                        </button>
                                                        {municipio.status === 1 ? 
                                                            <button
                                                                onClick={() => {

                                                                    Swal.fire({
                                                                        title: "¿Desea eliminar el municipio?",
                                                                        showCancelButton: true,
                                                                        confirmButtonText: "Aceptar",
                                                                        cancelButtonText: "Cancelar",
                                                                        confirmButtonColor: "#1e8449",
                                                                        cancelButtonColor: "#f39c12"
                                                                        
                                                                        }).then((result) => {

                                                                        if (result.isConfirmed) {
                                                                            handleDeleteCity(municipio.idMunicipio);
                                                                        }
                                                                    }); 
                                                                    
                                                                }}
                                                                className={`w-full cursor-pointer shadow-sm  shadow-gray-400 text-red-600 justify-center rounded-2xl font-semibold  flex items-center p-2`}
                                                            >
                                                                <Trash size={20} className="mr-2"/>
                                                                Eliminar
                                                            </button>
                                                            : 
                                                            <button
                                                                onClick={() => {

                                                                    Swal.fire({
                                                                        title: "¿Desea activar el municipio?",
                                                                        showCancelButton: true,
                                                                        confirmButtonText: "Aceptar",
                                                                        cancelButtonText: "Cancelar",
                                                                        confirmButtonColor: "#1e8449",
                                                                        cancelButtonColor: "#f39c12"
                                                                        
                                                                        }).then((result) => {

                                                                        if (result.isConfirmed) {
                                                                            handleActivateCity(municipio.idMunicipio);
                                                                        }
                                                                    }); 
                                                                    
                                                                }}
                                                                className={`w-full cursor-pointer shadow-sm  shadow-gray-400 text-green-800 justify-center rounded-2xl font-semibold  flex items-center p-2`}
                                                            >
                                                                <ShieldCheck size={20} className="mr-2"/>
                                                                Activar
                                                            </button>
                                                        }
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                                            
                                ) : null }
                            </tbody> 
                        :  
                            <tbody className="bg-white divide-y divide-gray-200">
                                {items.map((colonia) => (
                                    isVisible && (
                                        <tr key={colonia.idColonia} className="w-full">
                                            <td className="px-6 py-4 whitespace-nowrap w-3/5">
                                                <div className="text-sm font-medium text-gray-900">{colonia.nombre} ({colonia.nombreMunicipio})</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="bg-white w-full">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">     
                                                        <button
                                                            onClick={() => {
                                                                navigate(`/EditarColonia/${colonia.idColonia}`);
                                                            }}
                                                            className={`w-full cursor-pointer shadow-sm  shadow-gray-400 ${colonia.status === 0 ? "text-gray-400" : "text-orange-600"} justify-center rounded-2xl font-semibold  flex items-center p-2`}
                                                            disabled={colonia.status === 0}
                                                        >
                                                            <Edit size={20} className="mr-2" />
                                                            Editar
                                                        </button>
                                                        { colonia.status === 1 ? 
                                                            <button
                                                                onClick={() => {

                                                                    Swal.fire({
                                                                        title: "¿Desea eliminar la colonia?",
                                                                        showCancelButton: true,
                                                                        confirmButtonText: "Aceptar",
                                                                        cancelButtonText: "Cancelar",
                                                                        confirmButtonColor: "#1e8449",
                                                                        cancelButtonColor: "#f39c12"
                                                                        
                                                                        }).then((result) => {

                                                                        if (result.isConfirmed) {
                                                                            handleDeleteDistrict(colonia.idColonia);
                                                                        }
                                                                    }); 
                                                                    
                                                                }}
                                                                className={`w-full cursor-pointer shadow-sm shadow-gray-400 text-red-600 justify-center rounded-2xl font-semibold  flex items-center p-2`}
                                                            >
                                                                <Trash size={20} className="mr-2"/>
                                                                Eliminar
                                                            </button>
                                                            : 
                                                            <button
                                                                onClick={() => {

                                                                    Swal.fire({
                                                                        title: "¿Desea activar la colonia?",
                                                                        showCancelButton: true,
                                                                        confirmButtonText: "Aceptar",
                                                                        cancelButtonText: "Cancelar",
                                                                        confirmButtonColor: "#1e8449",
                                                                        cancelButtonColor: "#f39c12"
                                                                        
                                                                        }).then((result) => {

                                                                        if (result.isConfirmed) {
                                                                            handleActivateDistrict(colonia.idColonia);
                                                                        }
                                                                    }); 
                                                                    
                                                                }}
                                                                className={`w-full cursor-pointer shadow-sm  shadow-gray-400 text-green-800 justify-center rounded-2xl font-semibold  flex items-center p-2`}
                                                            >
                                                                <ShieldCheck size={20} className="mr-2"/>
                                                                Activar
                                                            </button>
                                                        }
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                ))}
                                {!isVisible && filteredData.length > 0 ? (
                                    filteredData.map((colonia) => (
                                         <tr key={colonia.idColonia} className="w-full">
                                            <td className="px-6 py-4 whitespace-nowrap w-3/5">
                                                <div className="text-sm font-medium text-gray-900">{colonia.nombre} ({colonia.nombreMunicipio})</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="bg-white w-full">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">     
                                                        <button
                                                            onClick={() => {
                                                                navigate(`/EditarColonia/${colonia.idColonia}`);
                                                            }}
                                                            className={`w-full cursor-pointer shadow-sm  shadow-gray-400 ${colonia.status === 0 ? "text-gray-400" : "text-orange-600"} justify-center rounded-2xl font-semibold  flex items-center p-2`}
                                                            disabled={colonia.status === 0}
                                                        >
                                                            <Edit size={20} className="mr-2" />
                                                            Editar
                                                        </button>
                                                        { colonia.status === 1 ? 
                                                            <button
                                                                onClick={() => {

                                                                    Swal.fire({
                                                                        title: "¿Desea eliminar la colonia?",
                                                                        showCancelButton: true,
                                                                        confirmButtonText: "Aceptar",
                                                                        cancelButtonText: "Cancelar",
                                                                        confirmButtonColor: "#1e8449",
                                                                        cancelButtonColor: "#f39c12"
                                                                        
                                                                        }).then((result) => {

                                                                        if (result.isConfirmed) {
                                                                            handleDeleteDistrict(colonia.idColonia);
                                                                        }
                                                                    }); 
                                                                    
                                                                }}
                                                                className={`w-full cursor-pointer shadow-sm shadow-gray-400 text-red-600 justify-center rounded-2xl font-semibold  flex items-center p-2`}
                                                            >
                                                                <Trash size={20} className="mr-2"/>
                                                                Eliminar
                                                            </button>
                                                            : 
                                                            <button
                                                                onClick={() => {

                                                                    Swal.fire({
                                                                        title: "¿Desea activar la colonia?",
                                                                        showCancelButton: true,
                                                                        confirmButtonText: "Aceptar",
                                                                        cancelButtonText: "Cancelar",
                                                                        confirmButtonColor: "#1e8449",
                                                                        cancelButtonColor: "#f39c12"
                                                                        
                                                                        }).then((result) => {

                                                                        if (result.isConfirmed) {
                                                                            handleActivateDistrict(colonia.idColonia);
                                                                        }
                                                                    }); 
                                                                    
                                                                }}
                                                                className={`w-full cursor-pointer shadow-sm  shadow-gray-400 text-green-800 justify-center rounded-2xl font-semibold  flex items-center p-2`}
                                                            >
                                                                <ShieldCheck size={20} className="mr-2"/>
                                                                Activar
                                                            </button>
                                                        }
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))                       
                                ) : null }
                            </tbody>
                        }
                    </table>
                </div>
                <div className="md:hidden">
                    {tabActive === 1 ? 
                        <div>
                            {dataMunicipios.getMunicipiosList.map((municipio) => (
                                <div key={municipio.idMunicipio} className="p-6 border-b border-gray-200 last:border-b-0">
                                    <div className="space-y-3">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{municipio.nombre}</h3>
                                        </div>
                                        <div className="grid grid-cols-1 gap-2 text-sm">
                                            <button
                                                onClick={() => {
                                                    navigate(`/EditarCiudad/${municipio.idMunicipio}`);
                                                }}
                                                className={`w-full cursor-pointer shadow-sm shadow-gray-400 ${municipio.status === 0 ? "text-gray-400" : "text-orange-600"}  justify-center rounded-2xl font-semibold  flex items-center p-2 mb-3`}
                                                disabled={municipio.status === 0}
                                            >
                                                <Edit size={20} className="mr-2" />
                                                Editar
                                            </button>
                                            {municipio.status === 1 ? 
                                                <button
                                                    onClick={() => {
                                                        Swal.fire({
                                                            title: "¿Desea eliminar el municipio?",
                                                            showCancelButton: true,
                                                            confirmButtonText: "Aceptar",
                                                            cancelButtonText: "Cancelar",
                                                            confirmButtonColor: "#1e8449",
                                                            cancelButtonColor: "#f39c12"
                                                            
                                                            }).then((result) => {

                                                            if (result.isConfirmed) {
                                                                handleDeleteCity(municipio.idMunicipio);
                                                            }
                                                        }); 
                                                        
                                                    }}
                                                    className={`w-full cursor-pointer shadow-sm  shadow-gray-400 text-red-600 justify-center rounded-2xl font-semibold  flex items-center p-2`}
                                                >
                                                    <Trash size={20} className="mr-2"/>
                                                    Eliminar
                                                </button>
                                                : 
                                                <button
                                                    onClick={() => {

                                                        Swal.fire({
                                                            title: "¿Desea activar el municipio?",
                                                            showCancelButton: true,
                                                            confirmButtonText: "Aceptar",
                                                            cancelButtonText: "Cancelar",
                                                            confirmButtonColor: "#1e8449",
                                                            cancelButtonColor: "#f39c12"
                                                            
                                                            }).then((result) => {

                                                            if (result.isConfirmed) {
                                                                handleActivateCity(municipio.idMunicipio);
                                                            }
                                                        }); 
                                                        
                                                    }}
                                                    className={`w-full cursor-pointer shadow-sm  shadow-gray-400 text-green-800 justify-center rounded-2xl font-semibold  flex items-center p-2`}
                                                >
                                                    <ShieldCheck size={20} className="mr-2"/>
                                                    Activar
                                                </button>
                                            }
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                    : 
                        <div>
                            {items.map((colonia) => (
                                <div key={colonia.idColonia} className="p-6 border-b border-gray-200 last:border-b-0">
                                    <div className="space-y-3">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{colonia.nombre}</h3>
                                        </div>
                                        <div className="grid grid-cols-1 gap-2 text-sm">
                                            <button
                                                onClick={() => {
                                                    navigate(`/EditarColonia/${colonia.idColonia}`);
                                                }}
                                                className={`w-full cursor-pointer shadow-sm  shadow-gray-400  ${colonia.status === 0 ? "text-gray-400" : "text-orange-600"} justify-center rounded-2xl font-semibold  flex items-center p-2 mb-3`}
                                                disabled={colonia.status === 0}
                                            >
                                                <Edit size={20} className="mr-2" />
                                                Editar
                                            </button>
                                            { colonia.status === 1 ? 
                                                <button
                                                    onClick={() => {
                                                        Swal.fire({
                                                            title: "¿Desea eliminar la colonia?",
                                                            showCancelButton: true,
                                                            confirmButtonText: "Aceptar",
                                                            cancelButtonText: "Cancelar",
                                                            confirmButtonColor: "#1e8449",
                                                            cancelButtonColor: "#f39c12"
                                                            
                                                            }).then((result) => {

                                                            if (result.isConfirmed) {
                                                                handleDeleteDistrict(colonia.idColonia);
                                                            }
                                                        }); 
                                                        
                                                    }}
                                                    className={`w-full cursor-pointer shadow-sm shadow-gray-400 text-red-600 justify-center rounded-2xl font-semibold  flex items-center p-2`}
                                                >
                                                    <Trash size={20} className="mr-2"/>
                                                    Eliminar
                                                </button>
                                                : 
                                                <button
                                                    onClick={() => {

                                                        Swal.fire({
                                                            title: "¿Desea activar la colonia?",
                                                            showCancelButton: true,
                                                            confirmButtonText: "Aceptar",
                                                            cancelButtonText: "Cancelar",
                                                            confirmButtonColor: "#1e8449",
                                                            cancelButtonColor: "#f39c12"
                                                            
                                                            }).then((result) => {

                                                            if (result.isConfirmed) {
                                                                handleActivateDistrict(colonia.idColonia);
                                                            }
                                                        }); 
                                                        
                                                    }}
                                                    className={`w-full cursor-pointer shadow-sm  shadow-gray-400 text-green-800 justify-center rounded-2xl font-semibold  flex items-center p-2`}
                                                >
                                                    <ShieldCheck size={20} className="mr-2"/>
                                                    Activar
                                                </button>
                                            }
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    }
                </div>
            </div>
            <div className="flex justify-center mt-6 space-x-2">
                {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-4 py-2 border rounded ${
                        currentPage === index + 1
                            ? 'bg-blue-500 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default LocationList;
