import React, { useState } from 'react';
import { Users, Phone, MapPin, Search,Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ClientListModal = ({ isOpen, onClose, cobrador, clientes = [] }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredClientes = clientes.filter(cliente =>
        cliente.nombreCliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.celular?.includes(searchTerm)
    );

    return (
        <div className={`fixed inset-0 z-50 ${isOpen ? 'flex' : 'hidden'} items-center justify-center`}>
            
            <div
                className="fixed inset-0 bg-opacity-40 backdrop-blur-sm"
                onClick={onClose}
            />

            
            <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full mx-4 p-6 z-10">
                
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="bg-blue-500 p-2 rounded-full">
                            <Users className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">Lista de Clientes</h2>
                    </div>
                </div>

                
                {cobrador && (
                    <div className="bg-gray-50 p-4 rounded-lg  mb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    {cobrador.avatar}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">{cobrador.nombre}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-blue-600">{cobrador.clientesAsignados}</p>
                                <p className="text-sm text-gray-500">Clientes asignados</p>
                            </div>
                        </div>
                    </div>
                )}

               
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o celular..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                
                <div className="max-h-96 overflow-y-auto space-y-4 mt-6">
                    {filteredClientes.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                            <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                            <p>No se encontraron clientes</p>
                        </div>
                    ) : (
                        filteredClientes.map(cliente => (
                            <div key={cliente.idCliente} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition">
                                <div className="mb-2">
                                    <p className="text-base font-semibold text-gray-900">{cliente.nombreCliente}</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                                    <div className="flex items-center">
                                        <Phone className="h-7 w-7 mr-2 text-gray-400" />
                                        {cliente.celular}
                                    </div>
                                    <div className="flex items-center">
                                        <MapPin className="h-10 w-10 mr-2 text-gray-400" />
                                        {cliente.direccion} - Municipio: {cliente.municipio}
                                    </div>
                                    <div className="mt-1 ml-90">
                                             <Link
                                                   to={`/DetalleClientes/${cliente.idCliente}`}
                                                    className="text-green-800 hover:text-green-500 text-lg font-medium"
                                                 >
                                                        Detalle
                                               </Link>
                                             </div>
                                </div>

                              
                                <div className="flex items-center mt-[-25px]">
                                    <Award size={24} className="text-yellow-500 mr-2 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-500">Membresía</p>
                                        <p className="text-gray-700 font-medium">
                                            {cliente.distinguido === 1 ? (
                                                <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">Distinguido</span>
                                            ) : (
                                                <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">No distinguido</span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                
                                    </div>
                        ))
                    )}
                </div>
                
                <div className="flex justify-between items-center pt-4 mt-4 ">
                    <p className="text-sm text-gray-600">
                        Mostrando {filteredClientes.length} de {clientes.length} clientes
                    </p>
                    <button
                        onClick={onClose}
                        className="py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};
