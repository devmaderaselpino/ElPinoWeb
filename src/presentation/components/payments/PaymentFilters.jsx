import React from 'react';
import { Search, Filter, Calendar, Printer, FunnelX } from 'lucide-react';

export const PaymentFilters = ({ payments, filteredPayments, searchQuery, setSearchQuery, selectedClient, setSelectedClient, startDate, endDate, setDateRange}) => {
  

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const printContent = 
        `
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Reporte de Abonos</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 40px;
                            color: #333;
                        }
                        .header {
                            display: flex;
                            align-items: center;
                            border-bottom: 2px solid #333;
                            padding-bottom: 10px;
                            margin-bottom: 30px;
                        }
                        .logo {
                            width: 60px;
                            height: 60px;
                            margin-right: 15px;
                        }
                        .title {
                            font-size: 20px;
                            font-weight: bold;
                        }
                        .subtitle {
                            font-size: 14px;
                            color: #555;
                        }
                        .filters {
                            margin-bottom: 20px;
                            padding: 10px;
                            background-color: #f5f5f5;
                            border-left: 4px solid #196e04;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-top: 20px;
                            font-size: 13px;
                        }
                        th, td {
                            border: 1px solid #ddd;
                            padding: 8px;
                            text-align: left;
                        }
                        th {
                            background-color: #f2f2f2;
                            font-weight: bold;
                        }
                        .amount {
                            text-align: right;
                        }
                        .total-row {
                            background-color: #e8f4fd;
                            font-weight: bold;
                        }
                        @media print {
                            .no-print {
                                display: none;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <img src="/maderas.png" alt="Logo" class="logo" />
                        <div>
                            <div class="title">Maderas y Ensambles El Pino</div>
                            <div class="subtitle">Reporte de Abonos - Fecha de generación: ${new Date().toLocaleDateString('es-MX')}</div>
                        </div>
                    </div>

                    <div class="filters">
                        <strong>Filtros aplicados:</strong><br />
                        ${selectedClient ? `Cliente: ${selectedClient}<br>` : ''}
                        ${startDate && endDate ? `Período: ${new Date(startDate).toLocaleDateString('es-MX')} - ${new Date(endDate).toLocaleDateString('es-MX')}<br>` : ''}
                        ${searchQuery ? `Búsqueda: ${searchQuery}<br>` : ''}
                        <strong>Total de registros: ${filteredPayments.length}</strong>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Cliente</th>
                                <th>Tipo</th>
                                <th>Abono</th>
                                <th>Cobrador</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredPayments.map(payment => `
                                <tr>
                                    <td>${payment.fecha}</td>
                                    <td>${payment.cliente}</td>
                                    <td>${payment.tipo_abono}</td>
                                    <td class="amount">$${payment.abono.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                                    <td>${payment.cobrador}</td>
                                </tr>`).join('')
                            }
                        </tbody>
                        <tfoot>
                            <tr class="total-row">
                                <td colspan="3">Total</td>
                                <td class="amount">$${filteredPayments.reduce((acc, p) => acc + p.abono, 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </body>
            </html>
        `;

        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <div className="flex items-center gap-2 mb-6">
                <Filter className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="relative col-span-2">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por cliente, concepto, artículo..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-200"
                    />
                </div>

                <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setDateRange(e.target.value, endDate)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-200"
                    />
                </div>

                <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setDateRange(startDate, e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-200"
                    />
                </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t border-gray-100">
                <span>Mostrando {filteredPayments.length} de {payments.length} registros</span>
                <div className="flex gap-4">
                    <button
                        onClick={handlePrint}
                        disabled={filteredPayments.length === 0}
                        className="flex items-center bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 disabled:opacity-50 transition"
                    >
                        <Printer className="h-5 w-5 mr-2" /> Imprimir
                    </button>
                    {(searchQuery || selectedClient || (startDate && endDate)) && (
                        <button
                        onClick={() => {
                            setSearchQuery('');
                            setSelectedClient('');
                            setDateRange('', '');
                        }}
                        className="flex items-center text-red-600 hover:text-red-700 font-medium gap-2"
                        >
                        <FunnelX className="h-4 w-4" /> Limpiar filtros
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
