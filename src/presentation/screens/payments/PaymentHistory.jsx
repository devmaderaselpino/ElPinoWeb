import React, { useState, useEffect } from 'react'; 
import { useQuery, gql, useMutation } from '@apollo/client';
import { startOfWeek, endOfWeek, format, parseISO, isAfter, isBefore, isEqual } from 'date-fns';
import { PaymentFilters } from '../../components/payments/PaymentFilters';
import { PaymentTable } from '../../components/payments/PaymentTable';
import { PaymentSummary } from '../../components/payments/PaymentSummary';
import { HandCoins } from 'lucide-react';
import Swal from "sweetalert2";
import Loading from '../../components/shared/Loading';
import ErrorPage from '../../components/shared/ErrorPage';

const GET_ABONOS = gql`
    query GetAbonos {
        GetAbonos {
            id
            fecha
            cliente
            abono
            tipo_abono
            cobrador
            tipo
        }
    }
`;

const CANCELAR_PAGO = gql`
    mutation CancelPayment($idAbono: Int) {
        cancelPayment(idAbono: $idAbono)
    }
`;

const HistorialAbonos = () => {
    const { data, loading, error, refetch } = useQuery(GET_ABONOS, {fetchPolicy:"no-cache"});
    const [cancelPayment, { loading: loadingCancel }] = useMutation(CANCELAR_PAGO);
    const abonos = data?.GetAbonos || [];

    const now = new Date();
    const inicioSemana = format(startOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd');
    const finSemana = format(endOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd');

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClient, setSelectedClient] = useState('');
    const [startDate, setStartDate] = useState(inicioSemana);
    const [endDate, setEndDate] = useState(finSemana);
    const [filteredPayments, setFilteredPayments] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const filtered = abonos.filter(p => {
            const fechaPago = parseISO(p.fecha);

            const matchesSearch = [p.cliente, p.tipo_abono, p.cobrador]
                .some(field => field?.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesClient = !selectedClient || p.cliente === selectedClient;

            const matchesDate =
                (!startDate || isAfter(fechaPago, parseISO(startDate)) || isEqual(fechaPago, parseISO(startDate))) &&
                (!endDate || isBefore(fechaPago, parseISO(endDate)) || isEqual(fechaPago, parseISO(endDate)));

            return matchesSearch && matchesClient && matchesDate;
        });

        setFilteredPayments(filtered);
        setCurrentPage(1);
    }, [abonos, searchQuery, selectedClient, startDate, endDate]);

    if (loading || loadingCancel) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col">
                <h1 className="text-3xl font-bold text-gray-800 mb-5">Cargando</h1>
                <Loading variant="wave" size="lg" color="green" />
            </div>
        );
    }
    
        
    if (error){
        return <ErrorPage message={"Inténtelo más tarde."}/>
    }

    const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
    const paginatedPayments = filteredPayments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const alerta = async (id) => {
       
        try {
            Swal.fire({
                title: "¿Desea cancelar el abono?",
                showCancelButton: true,
                confirmButtonText: "Aceptar",
                cancelButtonText: "Cancelar",
                confirmButtonColor: "#1e8449",
                cancelButtonColor: "#f39c12"
                
                }).then((result) => {

                if (result.isConfirmed) {
                    cancelarAbono(id);
                }
            }); 
            
            
        } catch (error) {
            console.log(error);
        }
    }

    const cancelarAbono = async (id) => {
       
        
        try {
            const resp = await cancelPayment({
                variables: {
                    idAbono: id
                }
            })

            if(resp.data.cancelPayment === "Abono cancelado."){
                Swal.fire({
                    title: "Abono cancelado con éxito!",
                    text: "Se ha cancelado el abono seleccionado.",
                    icon: "success",
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#1e8449",
                }).then((result) => {
                    if (result.isConfirmed) {
                        refetch()
                    }
                }); 
            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "Ha ocurrido un error",
                text: "No se ha podido cancelar el abono.",
                icon: "error",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#1e8449",
            })
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7x">
            <div className="flex items-center justify-between mt-10">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                    <HandCoins className="h-7 w-7 mr-3 text-primary-600" />
                    Historial de Abonos
                </h1>
            
            </div>

            <PaymentSummary payments={filteredPayments} />

            <div className="bg-white rounded-lg shadow-card">
                <div className="p-6 border-b border-gray-200">
                    <PaymentFilters
                        payments={abonos}
                        filteredPayments={filteredPayments}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        selectedClient={selectedClient}
                        setSelectedClient={setSelectedClient}
                        startDate={startDate}
                        endDate={endDate}
                        setDateRange={(start, end) => {
                            setStartDate(start);
                            setEndDate(end);
                        }}
                    />
                </div>

                <PaymentTable payments={paginatedPayments} onDelete={alerta}/>

                {totalPages > 1 && (
                    <div className="flex justify-center items-center py-4 space-x-4 border-t border-gray-100">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                        >
                            Anterior
                        </button>
                        <span className="text-sm text-gray-600">
                            Página {currentPage} de {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                        >
                            Siguiente
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistorialAbonos;
