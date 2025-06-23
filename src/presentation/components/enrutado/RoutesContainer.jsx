import React from 'react';
import { MapPin, Route } from 'lucide-react';
import ClientCard from './ClientCard';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

const RouteCard = ({ ruta }) => {
    
    const { setNodeRef, isOver } = useDroppable({
        id: String(ruta.idRuta),
        data: {
            origin: 'ruta',
            routeId: ruta.idRuta,
        },
    });

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
                    {ruta.clientes.length} Cliente{ruta.clientes.length !== 1 ? 's' : ''}
                </span>
            </div>

            <SortableContext
                items={ruta.clientes.map((c) => `from-ruta-${ruta.idRuta}-cliente-${c.idCliente}`)}
                strategy={verticalListSortingStrategy}
            >
                <div className="grid grid-cols-1 gap-3 mt-3 min-h-[80px]">
                    {ruta.clientes.map((client) => (
                        <ClientCard
                            key={`ruta-${ruta.idRuta}-cliente-${client.idCliente}`}
                            client={{
                                idCliente: client.idCliente,
                                nombre: client.nombreCliente,
                                direccion: client.direccion,
                                municipio: client.municipio,
                            }}
                            origin="ruta"
                            routeId={ruta.idRuta}
                        />
                    ))}
                </div>
            </SortableContext>
        </div>
    );
};

const RoutesContainer = ({ rutas = [], loading, error }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: 'placeholder',
        data: {
            origin: 'placeholder',
            routeId: null,
        },
    });

    if (loading) {
        return (
            <div className="text-center text-gray-500 p-6">
                Cargando rutas asignadas...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 p-6">
                Error al cargar las rutas asignadas.
            </div>
        );
    }

    if (!rutas.length) {
        return (
            <div className="grid grid-cols-1 gap-6">
                <div
                    ref={setNodeRef}
                    className={`border-l-4 rounded-lg shadow-2xl p-6 min-h-[140px] flex flex-col justify-center items-center transition ${
                        isOver ? 'bg-blue-50 ring-2 ring-blue-300 border-blue-500' : 'bg-white border-blue-400'
                    }`}
                >
                    <Route className="h-8 w-8 text-blue-400 mb-2" />
                    <p className="text-sm text-gray-500 text-center">
                        Este cobrador no tiene rutas asignadas. Arrastra un cliente aquí para comenzar una.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Rutas Asignadas</h2>
                <span className="text-sm font-medium px-2.5 py-0.5 rounded-full bg-blue-200 text-blue-600">
                    {rutas.length} Ruta{rutas.length !== 1 ? 's' : ''}
                </span>
            </div>
            <div className="grid grid-cols-1 gap-6">
                {rutas.map((ruta) => (
                    <RouteCard key={ruta.idRuta} ruta={ruta} />
                ))}
            </div>
        </div>
    );
};

export default RoutesContainer;
