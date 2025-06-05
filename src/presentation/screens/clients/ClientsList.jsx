import React, { useEffect, useState } from "react";
import { useQuery, gql } from '@apollo/client';
import { useNavigate } from "react-router-dom";
import { UserRoundPlus, Filter } from 'lucide-react';
import Loading from "../../components/shared/Loading";
import ErrorPage from "../../components/shared/ErrorPage";

const CLIENTS_LIST = gql`
    query GetClients($input: ClientsInput) {
        getClients(input: $input) {
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

    const { loading: loadingClients, error: errorClients, data: dataClients } = useQuery(CLIENTS_LIST, {
        variables: {
            input: {
                idMunicipio: parseInt(municipio),
                idColonia: parseInt(colonia)
            }
        }, fetchPolicy: "network-only"
    });
    
    const { loading: loadingColonias, error: errorColonias, data: dataColonias } = useQuery(COLONIAS_LIST, {
        variables: {
            filter: parseInt(municipio)
        }, fetchPolicy: "network-only"
    });
    
    const { loading: loadingMunicipios, error: errorMunicipios, data: dataMunicipios } = useQuery(MUNICIPIOS_LIST, {fetchPolicy: "network-only"});
    
    if(loadingClients || loadingColonias || loadingMunicipios){
        return (
            <div className="min-h-screen flex items-center justify-center flex-col">
                <h1 className="text-3xl font-bold text-gray-800 mb-5">Cargando</h1>
                <Loading variant="wave" size="lg" color="green" />
            </div>
        );
    }

    if(errorClients || errorColonias || errorMunicipios) {
        return <ErrorPage message={"Inténtelo más tarde."}/>
    }

    const clearFilters = () => {
        setColonia(0);
        setMunicipio(0);
    }
    
    return(
        <div className="lg:pl-64 md:pl-64 flex justify-center items-center flex-col">
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
                            onChange={(e) => setMunicipio(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                            onChange={(e) => setColonia(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                            onClick={clearFilters}
                            className="w-full bg-green-800 hover:bg-green-900 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                        >
                            Limpiar Filtros
                        </button>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden w-9/10">
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-base font-bold text-black tracking-wider">
                                    Nombre
                                </th>
                                <th className="px-6 py-4 text-left text-base font-bold text-black tracking-wider">
                                    Calle
                                </th>
                                <th className="px-6 py-4 text-left text-base font-bold text-black tracking-wider">
                                    Colonia
                                </th>
                                <th className="px-6 py-4 text-left text-base font-bold text-black tracking-wider">
                                    Municipio
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {dataClients.getClients.map((client) => (
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
                    {dataClients.getClients.map((client) => (
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
        </div>
    );
}

export default ClientsList;
