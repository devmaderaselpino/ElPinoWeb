import React, { useEffect, useState } from "react";
import { useQuery, gql, useLazyQuery } from '@apollo/client';
import { useNavigate } from "react-router-dom";
import { UserRoundPlus, Filter, Search } from 'lucide-react';
import Loading from "../../components/shared/Loading";
import ErrorPage from "../../components/shared/ErrorPage";

const CLIENTS_LIST = gql`
    query GetClientsPaginated($input: PaginatedInput) {
        getClientsPaginated(input: $input) {
            total
            items {
                idCliente
                nombre
                aPaterno
                aMaterno
                municipio
                municipio_n
                colonia
                colonia_n
                calle
                numero_ext
                celular
                distinguido
                img_domicilio
                descripcion
                fecha_reg
                status
            }
        }
    }
`;

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

const ClientsList = () => {

    const navigate = useNavigate();

    const [colonia, setColonia] = useState(0);
    const [municipio, setMunicipio] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
   
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const skip = (currentPage - 1) * itemsPerPage;

    const [loadClients, { data: dataClients, loading: loadingClients, error: errorClients }] = useLazyQuery(CLIENTS_LIST,  {fetchPolicy:"network-only"});
    
    const { loading: loadingColonias, error: errorColonias, data: dataColonias } = useQuery(COLONIAS_LIST, {
        variables: {
            filter: parseInt(municipio)
        }, fetchPolicy: "no-cache"
    });
    
    const { loading: loadingMunicipios, error: errorMunicipios, data: dataMunicipios } = useQuery(MUNICIPIOS_LIST, {fetchPolicy: "no-cache"});

    useEffect(() => {
        loadClients({
            variables: {
                input: {
                    idMunicipio: parseInt(municipio),
                    idColonia: parseInt(colonia),
                    skip,
                    limit: itemsPerPage,
                    searchName: searchTerm,
                },
            },
        });
    }, [municipio, colonia, currentPage, dataClients]);

    const fetchClients = async () => {
        
        loadClients({
            variables: {
                input: {
                    idMunicipio: parseInt(municipio),
                    idColonia: parseInt(colonia),
                    skip,
                    limit: itemsPerPage,
                    searchName: searchTerm,
                },
            },
        });
    };
 
    if(loadingClients || loadingColonias || loadingMunicipios){
        return (
            <div className="min-h-screen flex items-center justify-center flex-col">
                <h1 className="text-3xl font-bold text-gray-800 mb-5">Cargando</h1>
                <Loading variant="wave" size="lg" color="green" />
            </div>
        );
    }

    if(errorClients || errorColonias || errorMunicipios) {
        console.log(errorClients);
        
        return <ErrorPage message={"Inténtelo más tarde."}/>
    }

    const { total, items } = dataClients.getClientsPaginated;
    const totalPages = Math.ceil(total / itemsPerPage);

    return(
        <div className="flex justify-center items-center flex-col mt-10">
            <div className="flex w-9/10 justify-between items-center mb-8">
                <div>
                    <h1 className="lg:text-4xl md:text-4xl text-2xl font-bold text-gray-800 mb-2">Lista de Clientes</h1>
                </div>
                <button
                    onClick={() => navigate(`/AgregarCliente`)}
                    className="bg-green-800 hover:bg-green-900 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
                >
                    <UserRoundPlus size={20} />
                    Agregar Cliente
                </button>
            </div>
            <div className="bg-white mb-6 w-9/10">
                <div className="flex items-center gap-2 mb-4">
                    <Filter size={20} className="text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-700">Filtros</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Municipio
                        </label>
                        <select
                            value={municipio}
                            onChange={(e) => {setMunicipio(e.target.value);}}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 h-11"
                        >
                            {dataMunicipios.getMunicipios.map((municipio) => (
                                <option key={municipio.idMunicipio} value={municipio.idMunicipio}>
                                    {municipio.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Colonia
                        </label>
                        <select
                            value={colonia}
                            onChange={(e) => {setColonia(e.target.value);}}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 h-11"
                        >
                            {dataColonias.getColonias.map((colonia) => (
                                <option key={colonia.idColonia} value={colonia.idColonia}>
                                    {colonia.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={() => {
                                if(searchTerm || colonia !== 0 || municipio !== 0){
                                    window.location.reload();
                                }
                            }}
                            className="w-full h-11 bg-green-800 hover:bg-green-900 text-white font-medium py-2 px-3 rounded-md transition-colors duration-200"
                        >
                            Limpiar Filtros
                        </button>
                    </div>
                </div>
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Buscar cliente..."
                        value={searchTerm}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                fetchClients();
                                setCurrentPage(1);
                            }
                        }}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 mt-3"
                    />
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden w-9/10">
                <div className="hidden md:block overflow-x-auto min-h-120">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-base font-bold text-black tracking-wider">
                                    Nombre
                                </th>
                                <th className="px-6 py-4 text-left text-base font-bold text-black tracking-wider">
                                    Municipio
                                </th>
                                <th className="px-6 py-4 text-left text-base font-bold text-black tracking-wider">
                                    Colonia
                                </th>
                                <th className="px-6 py-4 text-left text-base font-bold text-black tracking-wider">
                                    Calle
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {items.map((client) => (
                                
                                <tr key={client.idCliente} className="hover:bg-gray-50 transition-colors duration-150" onClick={() => navigate(`/DetalleClientes/${client.idCliente}`)}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{client.nombre} {client.aPaterno} {client.aMaterno} </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-600">{client.municipio_n}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-600">{client.colonia_n}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-600">{client.calle} #{client.numero_ext}</div>
                                    </td>
                                </tr>
                                
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="md:hidden">
                    {items.map((client) => (
                        <div key={client.idCliente} className="p-6 border-b border-gray-200 last:border-b-0" onClick={() => navigate(`/DetalleClientes/${client.idCliente}`)}>
                            <div className="space-y-3">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{client.nombre} {client.aPaterno} {client.aMaterno}</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-2 text-sm">
                                    <div>
                                        <span className="font-medium text-gray-600">Municipio:</span>
                                        <span className="ml-2 text-gray-800">{client.municipio_n}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-600">Colonia:</span>
                                        <span className="ml-2 text-gray-800">{client.colonia_n}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-600">Calle:</span>
                                        <span className="ml-2 text-gray-800">{client.calle} #{client.numero_ext}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {totalPages > 1 ? (
                <div className="hidden sm:flex justify-center items-center mt-16 mb-10 gap-2">
                    {Math.ceil(currentPage / 10) > 1 && (
                        <button
                            onClick={() => setCurrentPage(Math.max(1, (Math.ceil(currentPage / 10) - 2) * 10 + 1))}
                            className="px-3 py-2 shadow-md rounded bg-white text-gray-700 hover:bg-gray-100"
                        >
                            ...
                        </button>
                    )}
        
    
                    {Array.from({ length: Math.min(10, totalPages - Math.floor((currentPage - 1) / 10) * 10) })
                        .map((_, index) => {
                            const pageNumber = Math.floor((currentPage - 1) / 10) * 10 + index + 1;
                            return (
                                <button
                                    key={pageNumber}
                                    onClick={() => setCurrentPage(pageNumber)}
                                    className={`px-4 py-2 shadow-md rounded ${
                                    currentPage === pageNumber
                                        ? 'bg-green-800 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    {pageNumber}
                                </button>
                            );
                        })
                    }
                    {Math.ceil(currentPage / 10) < Math.ceil(totalPages / 10) && (
                        <button
                            onClick={() => setCurrentPage(Math.ceil(currentPage / 10) * 10 + 1)}
                            className="px-3 py-2 shadow-md rounded bg-white text-gray-700 hover:bg-gray-100"
                        >
                            ...
                        </button>
                    )}
                </div>
            ) : null}
            {totalPages > 1 ? 
                <div className="sm:hidden flex flex-row justify-around items-center w-9/10 mt-10 mb-10">
                    <button className={`${currentPage !== 1 ? "bg-green-800" : "bg-gray-400" } hover:bg-green-900 text-white font-semibold p-3 rounded-lg shadow-lg flex items-center gap-2`}
                    onClick={()=>{
                        if(currentPage !== 1){
                            setCurrentPage(currentPage - 1);
                        }
                    }}>
                        Anterior
                    </button>
                    <button className={`${currentPage < totalPages  ? "bg-green-800" : "bg-gray-400" } hover:bg-green-900 text-white font-semibold p-3 rounded-lg shadow-lg flex items-center gap-2`}
                    onClick={()=>{
                        
                        if(currentPage < totalPages){
                            setCurrentPage(currentPage + 1);
                        }
                    }}>
                        Siguiente
                    </button>
                </div> 
            :
                null
            }
        </div>
    );
}

export default ClientsList;
