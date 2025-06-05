import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, gql } from '@apollo/client';
import { Award, Download, Edit, CreditCard, Phone, User, MapPin, Calendar    } from 'lucide-react';
import PurchaseHistory from "../../components/PurchaseHistory";
import archivo from '../../../assets/archivo.pdf';
import Loading from "../../components/shared/Loading";
import ErrorPage from "../../components/shared/ErrorPage";

const CLIENT_INFO = gql`
    query GetClient($idCliente: Int) {
        getClient(idCliente: $idCliente) {
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

const ClientDetails = () => {
    
    const customer = {
        id: 'CUST-10285',
        firstName: 'Emma',
        lastName: 'Johnson',
        email: 'emma.johnson@example.com',
        phone: '+1 (555) 123-4567',
        address: {
            street: '123 Main Street, Apt 4B',
            city: 'San Francisco',
            state: 'CA',
            zip: '94105',
            country: 'United States'
        },
        status: 'Activo',
        membershipLevel: 'Premium',
        joinDate: 'Enero 15, 2022',
        lastPurchase: 'Enero 28, 2023',
        avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    };

    const {idCliente} = useParams();

    const { loading: loadingClient, error: errorClient, data: dataClient } = useQuery(CLIENT_INFO, {
        variables: {
            idCliente: parseInt(idCliente)
        }
    });

    if(loadingClient){
        return (
            <div className="min-h-screen flex items-center justify-center flex-col">
                <h1 className="text-3xl font-bold text-gray-800 mb-5">Cargando</h1>
                <Loading variant="wave" size="lg" color="green" />
            </div>
        );
    }

    if(errorClient) {
        return <ErrorPage message={"Inténtelo más tarde."}/>
    }

    return(
        <div className="md:pl-64 lg:pl-64">
            <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-md w-full mx-auto transition-all duration-300 hover:shadow-lg">
                <div className="bg-gray-600 p-6 flex items-center">
                    <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center flex-shrink-0 border-4 border-white overflow-hidden">
                        <div className="h-full w-full flex items-center justify-center bg-green-100 text-black text-2xl font-bold">
                            {dataClient.getClient.nombre.charAt(0)}
                            {dataClient.getClient.aPaterno.charAt(0)}
                        </div>
                    </div>
                    <div className="ml-4 text-white">
                        <h2 className="text-xl font-bold">{dataClient.getClient.nombre} {dataClient.getClient.aPaterno} {dataClient.getClient.aMaterno}</h2>
                        <p className="text-blue-100 text-sm flex items-center">
                            <CreditCard size={14} className="mr-1" />
                            Número de Cliente: {dataClient.getClient.idCliente}
                        </p>
                    </div>
                </div>
                <div className="p-6">
                    <div className="mb-6">
                        <h3 className="text-sm uppercase text-gray-800 font-medium mb-3 border-b pb-2">Información de Contacto</h3>     
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <Phone size={18} className="text-green-800 mr-3 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-gray-700">{dataClient.getClient.celular}</p>
                                </div>
                            </div>    
                            <div className="flex items-start">
                                <MapPin size={18} className="text-green-800 mr-3 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-gray-700">{dataClient.getClient.municipio_n} {dataClient.getClient.colonia_n}, {dataClient.getClient.calle} #{dataClient.getClient.numero_ext}</p>
                                    <span className="text-gray-700 text-sm">Descripción: {dataClient.getClient.descripcion}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm uppercase text-gray-500 font-medium mb-3 border-b pb-2">Detalles del Cliente</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center">
                                <User size={18} className="text-green-800 mr-2 flex-shrink-0" />
                                <div>
                                    <p className="text-xs text-gray-500">Estatus</p>
                                    <p className="text-gray-700 font-medium">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                            customer.status === 'Activo' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {customer.status}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Award size={18} className="text-yellow-500 mr-2 flex-shrink-0" />
                                <div>
                                    <p className="text-xs text-gray-500">Membresía</p>
                                    <p className="text-gray-700 font-medium">{dataClient.getClient.distinguido === 1 ? "Distinguido" : "No distinguido"}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Calendar size={18} className="text-green-800 mr-2 flex-shrink-0" />
                                <div>
                                    <p className="text-xs text-gray-500">Fecha de registro</p>
                                    <p className="text-gray-700">{customer.joinDate}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center">
                                <CreditCard size={18} className="text-green-800 mr-2 flex-shrink-0" />
                                <div>
                                    <p className="text-xs text-gray-500">Última compra</p>
                                    <p className="text-gray-700">{customer.lastPurchase}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 px-6 py-3 flex justify-between items-center border-t">
                    <button className="bg-green-700 inline-flex items-center px-3 py-1 border text-white rounded-md hover:bg-green-800 transition-colors duration-200 text-sm">
                        <Edit size={18} />
                    </button>
                    <a href={archivo} download target="_blank">
                        <button className="inline-flex items-center px-3 py-1 border bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors duration-200 text-sm">
                            <Download size={18} />
                        </button>
                    </a>
                </div>
            </div>
            <PurchaseHistory></PurchaseHistory>
        </div>
    );
}

export default ClientDetails;
