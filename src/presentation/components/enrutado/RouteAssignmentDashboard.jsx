import React from 'react';
import { Search,CirclePlus } from 'lucide-react';
import CollectorSelector from './CollectorSelector';
import RoutesContainer from './RoutesContainer';
import UnassignedClientsContainer from './UnassignedClientsContainer';
import Loading from '../shared/Loading';
import ErrorPage from '../shared/ErrorPage';

const RouteAssignmentDashboard = ({ selectedCollectorId, onCollectorSelect, searchQuery, setSearchQuery, rutas, clientesSinAsignar, loading, error, refetchRutas,refetchClientesSinAsignar,crearRuta,}) => {
    const handleCrearRuta = async (idCobrador) => {
    try {
      await crearRuta(idCobrador);
    } catch (err) {
      console.error("Error al crear ruta:", err);
    }
  };
    return (
        <div className="bg-white space-y-6">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Asignación de Rutas a Cobradores</h1>
            </div>

            <div className="md:w-96">
                <CollectorSelector onSelect={onCollectorSelect} />
            </div>

            {selectedCollectorId && (
                <>      <div className="flex justify-end pr-140">
                           <button
                                onClick={() => handleCrearRuta(selectedCollectorId)}
                                className="bg-green-800 hover:bg-green-600 text-white px-5 py-2 rounded-md text-lg flex items-center gap-2"
                            >
                                <CirclePlus className="w-5 h-5" />
                                Crear Ruta
                            </button>
                       </div>
                        
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar cliente..."
                            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {loading && 
                        <div className="min-h-screen flex items-center justify-center flex-col">
                            <h1 className="text-3xl font-bold text-gray-800 mb-5">Cargando</h1>
                            <Loading variant="wave" size="lg" color="green" />
                        </div>
                    }
                    {error && <ErrorPage message={"Inténtelo más tarde."}/>}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <RoutesContainer
                                rutas={rutas}
                                refetchRutas={refetchRutas}
                                selectedCollectorId={selectedCollectorId}
                                searchQuery={searchQuery}
                            />
                        </div>
                        <div>
                            <UnassignedClientsContainer
                                clientes={clientesSinAsignar}
                                refetchClientesSinAsignar={refetchClientesSinAsignar}
                                selectedCollectorId={selectedCollectorId}
                                searchQuery={searchQuery}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default RouteAssignmentDashboard;
