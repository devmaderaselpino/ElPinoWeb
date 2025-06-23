import React, { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay} from "@dnd-kit/core";
import RouteAssignmentDashboard from "../../components/enrutado/RouteAssignmentDashboard";
import ClientCard from "../../components/enrutado/ClientCard";

const GET_RUTAS = gql`
    query GetRutas($idCobrador: Int!) {
        getRutas(idCobrador: $idCobrador) {
            idRuta
            idCobrador
            description
            color
            clientes {
                idCliente
                nombreCliente
                direccion
                municipio
            }
        }
    }
`;

const GET_CLIENTES_SIN_ASIGNAR = gql`
    query GetClientesSinAsignar {
        getClientesSinAsignar {
            idCliente
            nombreCliente
            direccion
            municipio
        }
    }
`;

const ASIGNAR_CLIENTE_A_RUTA = gql`
    mutation AsignarClienteARuta($input: AsignacionRutaInput!) {
        asignarClienteARuta(input: $input)
    }
`;

const ELIMINAR_CLIENTE_DE_RUTA = gql`
    mutation EliminarClienteDeRuta($input: EliminarAsignacionInput!) {
        eliminarClienteDeRuta(input: $input)
    }
`;

const Enrutado = () => {
    const [selectedCollectorId, setSelectedCollectorId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeClient, setActiveClient] = useState(null);

    const sensors = useSensors(useSensor(PointerSensor));

    const { data: dataRutas, refetch: refetchRutas, loading: loadingRutas, error: errorRutas} = useQuery(GET_RUTAS, {
        variables: { idCobrador: Number(selectedCollectorId) },
        skip: !selectedCollectorId,
    });

    const { data: dataClientesSinAsignar, refetch: refetchClientesSinAsignar, loading: loadingClientes, error: errorClientes} = useQuery(GET_CLIENTES_SIN_ASIGNAR, {
        skip: !selectedCollectorId,
    });

    const [asignarClienteARuta] = useMutation(ASIGNAR_CLIENTE_A_RUTA, {
        refetchQueries: [
            { query: GET_RUTAS, variables: { idCobrador: selectedCollectorId } },
            { query: GET_CLIENTES_SIN_ASIGNAR },
        ],
    });

  
    const [eliminarClienteDeRuta] = useMutation(ELIMINAR_CLIENTE_DE_RUTA, {
        refetchQueries: [
            { query: GET_RUTAS, variables: { idCobrador: selectedCollectorId } },
            { query: GET_CLIENTES_SIN_ASIGNAR },
        ],
    });

    const handleDragStart = (event) => {
        const { client, origin } = event.active.data.current;
        setActiveClient({ ...client, origin });
    };


    const handleDragEnd = async (event) => {
        const { active, over } = event;
        setActiveClient(null);
        if (!over) return;

        const client = active?.data?.current?.client;
        const clientId = Number(client?.idCliente);
        const origin = active?.data?.current?.origin;
        const destination = over?.data?.current?.origin;
        const destinationRouteId = over?.data?.current?.routeId;

        if (origin === destination && !destinationRouteId) return;

        try {
            if (origin === "ruta" && destination === "sinAsignar") {
                await eliminarClienteDeRuta({
                    variables: { input: { idCliente: clientId } },
                });
            } else if (origin === "sinAsignar") {
                await asignarClienteARuta({
                    variables: {
                        input: {
                            idCliente: clientId,
                            idCobrador: selectedCollectorId,
                        },
                    },
                });
            }
        } catch (err) {
            console.error("Error en movimiento de cliente:", err);
        }
    };

    return (
        <div className="p-6">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <RouteAssignmentDashboard
                    selectedCollectorId={selectedCollectorId}
                    onCollectorSelect={setSelectedCollectorId}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    rutas={dataRutas?.getRutas || []}
                    clientesSinAsignar={dataClientesSinAsignar?.getClientesSinAsignar || []}
                    loading={loadingRutas || loadingClientes}
                    error={errorRutas || errorClientes}
                    refetchRutas={refetchRutas}
                    refetchClientesSinAsignar={refetchClientesSinAsignar}
                    asignarClienteARuta={asignarClienteARuta}
                    eliminarClienteDeRuta={eliminarClienteDeRuta} 
                />

                <DragOverlay>
                    {activeClient && (
                        <ClientCard client={activeClient} origin={activeClient.origin} />
                    )}
                </DragOverlay>
            </DndContext>
        </div>
    );
};

export default Enrutado;
