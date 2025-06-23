import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, MapPin, User } from 'lucide-react';

const ClientCard = ({ client, origin, routeId }) => {
    
    const idCliente = client.idCliente;
    const uniqueId = `from-${origin}-cliente-${idCliente}${routeId ? `-ruta-${routeId}` : ''}`;

    const {attributes, listeners, setNodeRef, transform, transition, isDragging,} = useSortable({
        id: uniqueId,
        data: {
            client,
            origin,
            routeId,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const fullName = client.nombreCliente || client.nombre || 'Cliente sin nombre';

    return (
        <div ref={setNodeRef} style={style} className={`rounded-md border p-3 shadow-sm hover:shadow-md transition-colors duration-200 ${isDragging ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-white'}`}>
            <div className="flex items-start space-x-2">
                <div className="drag-handle flex items-center self-stretch px-1 -ml-1 cursor-grab active:cursor-grabbing"
                    {...listeners}
                    {...attributes}
                >
                    <GripVertical className="h-4 w-4 text-gray-400" />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                        <User className="h-3.5 w-3.5 text-gray-500 mr-1.5" />
                        <h4 className="text-sm font-medium text-gray-900 truncate" title={fullName}>
                            {fullName}
                        </h4>
                    </div>
                    <div className="mt-1 flex items-start">
                        <MapPin className="h-3.5 w-3.5 text-gray-500 mr-1.5 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-gray-500 space-y-0.5">
                            <p className="line-clamp-2">{client.direccion}</p>
                            {client.municipio && (
                                <p className="text-xs text-gray-800">
                                    Municipio: {client.municipio}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientCard;
