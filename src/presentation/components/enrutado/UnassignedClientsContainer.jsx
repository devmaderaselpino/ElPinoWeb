import React from 'react';
import ClientCard from './ClientCard';
import { useDroppable } from '@dnd-kit/core';
import { UserMinus } from 'lucide-react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

const UnassignedClientsContainer = ({ clientes = [], searchQuery = '', selectedCollectorId, refetchClientesSinAsignar}) => {
    const { setNodeRef, isOver } = useDroppable({
        id: 'sinAsignar',
        data: {
            origin: 'sinAsignar',
        },
    });

    const filteredClients = clientes.filter((client) => {
        const query = searchQuery.toLowerCase();
        return (
            !searchQuery ||
            client.nombreCliente.toLowerCase().includes(query) ||
            client.direccion.toLowerCase().includes(query)
        );
    });

    return (
        <div className="bg-white rounded-lg border-gray-500 shadow-card p-4 shadow-2xl mr-15">
            <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    Clientes sin Asignar
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-300 text-gray-600">
                        {filteredClients.length}
                    </span>
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    Arrastra estos clientes a una ruta para asignarlos
                </p>
            </div>
            <div
                ref={setNodeRef}
                className={`min-h-[200px] rounded-md border p-2 transition-colors duration-200 ${
                isOver ? 'bg-blue-50 ring-2 ring-blue-400' : 'bg-white border-gray-200'
                }`}
            >
                {filteredClients.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-28 text-gray-400">
                        <UserMinus className="h-6 w-6 mb-2" />
                        <p className="text-sm text-center">
                            {searchQuery
                                ? 'No hay resultados que coincidan con la búsqueda'
                                : 'No hay clientes sin asignar'
                            }
                        </p>
                    </div>
                    ) : (
                    <SortableContext
                        items={filteredClients.map(c => `client-${c.idCliente}`)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="grid grid-cols-1 gap-3 mt-2">
                            {filteredClients.map((client) => (
                                <ClientCard
                                    key={`from-sinAsignar-cliente-${client.idCliente}`}
                                    client={client}
                                    origin="sinAsignar"
                                    routeId={0}
                                />
                            ))}
                        </div>
                        </SortableContext>
                    )}

            </div>
        </div>
    );
};

export default UnassignedClientsContainer;
