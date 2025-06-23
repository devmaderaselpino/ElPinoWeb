import React, { useState, useMemo } from 'react';
import { useQuery, gql } from '@apollo/client';
import { TrendingUp } from 'lucide-react';
import { parseISO, isToday, isThisWeek, isThisMonth } from 'date-fns';
import SalesTable from '../../components/sales/SalesTable';
import SalesFilters from '../../components/sales/SalesFilters';
import SalesSummary from '../../components/sales/SalesSummary';

const GET_VENTAS = gql`
    query GetVentas {
        GetVentas {
            fecha
            articulos
            cliente
            total
            tipo
            status
        }
    }
`;

const SalesHistory = () => {
    const { data, loading, error } = useQuery(GET_VENTAS);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('todos');
    const [tipoFilter, setTipoFilter] = useState('todos');
    const [dateRange, setDateRange] = useState('todos');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const ventas = data?.GetVentas || [];

    const filteredVentas = useMemo(() => {
        return ventas.filter((venta) => {
            const matchesSearch =
                venta.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                venta.articulos.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'todos' || venta.status === statusFilter;
            const matchesTipo = tipoFilter === 'todos' || venta.tipo === tipoFilter;

            const fechaVenta = parseISO(venta.fecha);
            const matchesDate =
                dateRange === 'todos' ||
                (dateRange === 'hoy' && isToday(fechaVenta)) ||
                (dateRange === 'semana' && isThisWeek(fechaVenta, { weekStartsOn: 1 })) ||
                (dateRange === 'mes' && isThisMonth(fechaVenta));

            return matchesSearch && matchesStatus && matchesTipo && matchesDate;
        });
    }, [searchTerm, statusFilter, tipoFilter, dateRange, ventas]);

    const totalPages = Math.ceil(filteredVentas.length / itemsPerPage);
    const paginatedVentas = filteredVentas.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (loading) return <div className="p-8 text-center">Cargando ventas...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error al cargar ventas</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-8xl">
            
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                    <TrendingUp className="h-8 w-8 text-green-700" />
                    </div>
                    <div>
                    <h1 className="text-4xl font-bold text-gray-900">Historial de Ventas</h1>
                    </div>
                </div>
            </div>

            <SalesSummary ventas={filteredVentas} />

            <SalesFilters
                ventas={filteredVentas}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                tipoFilter={tipoFilter}
                setTipoFilter={setTipoFilter}
                dateRange={dateRange}
                setDateRange={setDateRange}
            />

            <SalesTable ventas={paginatedVentas} />


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
    );
};

export default SalesHistory;
