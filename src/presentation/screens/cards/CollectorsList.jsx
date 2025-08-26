import React, { useEffect, useState } from 'react';
import { useQuery, useLazyQuery, gql, useApolloClient } from '@apollo/client';
import { CobradorCard } from './CobradoresCard';
import { DateRangeModal } from './DateRangeModal';
import { ClientListModal } from './ClientListModal';

const GET_COBRADORES = gql`
    query GetCobradores {
        getCobradores {
            idUsuario
            nombre
            aPaterno
            aMaterno
            celular
        }
    }
`;

const GET_TOTALES = gql`
    query GetTotalesClientesAsignados {
        getTotalesClientesAsignados {
            idCobrador
            total_clientes
        }
    }
`;

const GET_RUTAS = gql`
    query GetRutas($idCobrador: Int!) {
        getRutas(idCobrador: $idCobrador) {
            idRuta
            idCobrador
            clientes {
                idCliente
                nombreCliente
                direccion
                municipio
                celular
                distinguido
            }
        }
    }
`;

const GET_ABONOS_RANGO_COBRADOR = gql`
    query GetAbonosRangoCobrador($idCobrador: Int!, $fechaInicial: String!, $fechaFinal: String!) {
        getAbonosRangoCobrador(idCobrador: $idCobrador, fechaInicial: $fechaInicial, fechaFinal: $fechaFinal)
    }
`;

const CollectorsList = () => {
    const { data: cobradoresData, loading: cobradoresLoading, error: cobradoresError } = useQuery(GET_COBRADORES, {
        fetchPolicy: 'cache-first',
    });

    const { data: totalesData, loading: totalesLoading } = useQuery(GET_TOTALES, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        notifyOnNetworkStatusChange: true,
    });

    const [selectedCobrador, setSelectedCobrador] = useState(null);
    const [rutas, setRutas] = useState([]);
    const [isDateModalOpen, setIsDateModalOpen] = useState(false);
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [clientesSinDuplicados, setClientesSinDuplicados] = useState([]);
    const client = useApolloClient();

    const [fetchAbonos, { data: sumData, loading: sumLoading, error: sumError }] =
        useLazyQuery(GET_ABONOS_RANGO_COBRADOR, { fetchPolicy: 'network-only' });

    const {
        data: rutasData,
        loading: rutasLoading,
        refetch: refetchRutas,
    } = useQuery(GET_RUTAS, {
        variables: { idCobrador: selectedCobrador?.id },
        skip: !selectedCobrador,
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        notifyOnNetworkStatusChange: true,
    });

    useEffect(() => {
        setRutas(rutasData?.getRutas || []);
    }, [rutasData]);

    useEffect(() => {
        if (!selectedCobrador) {
            setClientesSinDuplicados([]);
            return;
        }
        const all = (rutas || [])
            .filter((r) => r.idCobrador === selectedCobrador.id)
            .flatMap((r) => r.clientes || []);
        const unique = all.filter(
            (c, idx, self) => idx === self.findIndex((x) => x.idCliente === c.idCliente)
        );
        setClientesSinDuplicados(unique);
    }, [rutas, selectedCobrador]);

    if (cobradoresLoading || totalesLoading) {
        return <p className="text-center mt-10 text-gray-500">Cargando...</p>;
    }
    if (cobradoresError) {
        return <p className="text-center mt-10 text-red-500">Error al cargar cobradores.</p>;
    }

    const cobradores = (cobradoresData?.getCobradores || []).map((c) => ({
        id: c.idUsuario,
        nombre: `${c.nombre} ${c.aPaterno}`,
        telefono: c.celular,
        avatar: `${c.nombre?.[0] || ''}${c.aPaterno?.[0] || ''}`,
    }));

    const totalesMap = (totalesData?.getTotalesClientesAsignados || []).reduce((acc, t) => {
        acc[t.idCobrador] = t.total_clientes || 0;
        return acc;
    }, {});

    const handleSumarAbonos = (cobrador) => {
        setSelectedCobrador(cobrador);
        setIsDateModalOpen(true);
    };

    const handleBuscarAbonos = async (fechaInicio, horaInicio, fechaFin, horaFin) => {
        const fechaInicial = `${fechaInicio} ${horaInicio}:00`;
        const fechaFinal = `${fechaFin} ${horaFin}:59`;
        await fetchAbonos({
            variables: {
                idCobrador: selectedCobrador?.id,
                fechaInicial,
                fechaFinal
            }
        });
    };

    const handleVerClientes = async (cobrador) => {
        setSelectedCobrador(cobrador);
        await client.query({
            query: GET_RUTAS,
            variables: { idCobrador: cobrador.id },
            fetchPolicy: 'network-only',
        });
        await refetchRutas?.({ idCobrador: cobrador.id });
        setIsClientModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 mt-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Cobradores</h1>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cobradores.map((cobrador) => (
                        <CobradorCard
                            key={cobrador.id}
                            cobrador={cobrador}
                            clientesAsignados={totalesMap[cobrador.id] || 0}
                            onSumarAbonos={() => handleSumarAbonos(cobrador)}
                            onVerClientes={() => handleVerClientes(cobrador)}
                            onMouseEnter={async () => {
                                await client.query({
                                    query: GET_RUTAS,
                                    variables: { idCobrador: cobrador.id },
                                    fetchPolicy: 'cache-first',
                                });
                            }}
                        />
                    ))}
                </div>
            </div>

            <DateRangeModal
                isOpen={isDateModalOpen}
                onClose={() => setIsDateModalOpen(false)}
                cobrador={selectedCobrador}
                abonos={sumData?.getAbonosRangoCobrador}
                loading={sumLoading}
                errorMsg={sumError?.message}
                onBuscarAbonos={handleBuscarAbonos}
                clientesAsignados={selectedCobrador ? totalesMap[selectedCobrador.id] ?? 0 : undefined}
            />

            <ClientListModal
                isOpen={isClientModalOpen}
                onClose={() => setIsClientModalOpen(false)}
                cobrador={selectedCobrador}
                clientes={clientesSinDuplicados}
                loading={rutasLoading && !clientesSinDuplicados.length}
            />
        </div>
    );
};

export default CollectorsList;
