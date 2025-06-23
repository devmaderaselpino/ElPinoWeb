import React from 'react';
import { MapPin } from 'lucide-react';
import ClientCard from './ClientCard';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

const RouteCard = ({ ruta }) => {
    
    const { setNodeRef, isOver } = useDroppable({
        id: `droppable-ruta-${ruta.idRuta}`,
        data: {
            origin: 'ruta',
            routeId: ruta.idRuta,
        },
    });

    const clientes = ruta.clientes || [];

    const sortableItems = clientes.length
        ? clientes.map(c => `from-ruta-${ruta.idRuta}-cliente-${c.idCliente}`)
        : ['placeholder-cliente'];

    return (
        <div ref={setNodeRef} className={`border-l-4 rounded-lg shadow-2xl p-4 transition-colors duration-200 ${isOver ? 'bg-blue-50 ring-2 ring-blue-300' : 'bg-white'}`} style={{ borderLeftColor: ruta.color || '#3b82f6' }}
        >
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        <MapPin className="h-5 w-5 mr-1" style={{ color: ruta.color || '#3b82f6' }} />
                        {ruta.name}
                    </h3>
                    {ruta.description && (
                        <p className="text-sm text-gray-500 mt-1">{ruta.description}</p>
                    )}
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-200 text-green-600">
                    {clientes.length} Cliente{clientes.length !== 1 ? 's' : ''}
                </span>
            </div>

            <SortableContext id={`sortable-ruta-${ruta.idRuta}`} items={sortableItems} strategy={verticalListSortingStrategy}>
                <div className="grid grid-cols-1 gap-3 mt-3 min-h-[80px]">
                    {clientes.length === 0 ? (
                        <div className="text-sm text-gray-500 italic p-2 border rounded bg-gray-50 text-center">
                            No cuenta con clientes asignados. Arrastre uno aquí para asignarlo.
                        </div>
                    ) : (
                        clientes.map((client) => (
                            <ClientCard
                                key={`from-ruta-${ruta.idRuta}-cliente-${client.idCliente}`}
                                client={{
                                idCliente: client.idCliente,
                                nombre: client.nombreCliente,
                                direccion: client.direccion,
                                municipio: client.municipio,
                                }}
                                origin="ruta"
                                routeId={ruta.idRuta}
                            />
                        ))
                    )}
                </div>
            </SortableContext>
        </div>
    );
};

export default RouteCard;
