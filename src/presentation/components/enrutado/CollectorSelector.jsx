import { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { User } from 'lucide-react';

const GET_COBRADORES = gql`
    query {
        getCobradores {
            idUsuario
            nombre
        }
    }
`;

const CollectorSelector = ({ onSelect }) => {
    const { data, loading, error } = useQuery(GET_COBRADORES);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        if (selectedId !== null) {
            onSelect(selectedId);
        }
    }, [selectedId, onSelect]);

    if (loading) return <p className="text-sm text-gray-500">Cargando cobradores...</p>;
    if (error) return <p className="text-sm text-red-500">Error al cargar cobradores</p>;

    const collectors = data?.getCobradores || [];
    const selectedCollector = collectors.find(c => c.idUsuario === selectedId);

    return (
        <div className="bg-white space-y-4 border-gray-500">
            <div>
                <label htmlFor="collector-select" className="block text-sm font-medium text-gray-700">
                    Selecciona un Cobrador
                </label>
                <div className="relative mt-1">
                    <select
                        id="collector-select"
                        className="w-full border border-gray-500 rounded-md px-3 py-2 shadow-sm focus:ring-primary-500 focus:border-primary-500"
                        value={selectedId || ''}
                        onChange={(e) => setSelectedId(e.target.value ? Number(e.target.value) : null)}
                    >
                        <option value="">Seleccionar Cobrador</option>
                        {collectors.map((c) => (
                            <option key={c.idUsuario} value={c.idUsuario}>
                                {c.nombre}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {selectedCollector && (
                <div className="p-4 bg-white rounded-lg shadow-card border border-gray-100">
                    <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                            <User className="h-6 w-6 text-primary-700" />
                            </div>
                        <div>
                            <h3 className="text-base font-medium text-gray-900">{selectedCollector.nombre}</h3>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CollectorSelector;
