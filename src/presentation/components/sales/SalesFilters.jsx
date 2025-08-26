import React from 'react';
import { Search, Filter, Calendar, Printer } from 'lucide-react';

const SalesFilters = ({ searchTerm, setSearchTerm, statusFilter, setStatusFilter, tipoFilter, setTipoFilter, dateRange, setDateRange, setCurrentPage, ventas = []}) => {
    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const printContent = `
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Reporte de Ventas</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            padding: 40px;
                            color: #333;
                        }
                        .logo {
                            width: 60px;
                            height: 60px;
                            margin-right: 15px;
                        }
                        .header {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            border-bottom: 2px solid #333;
                            padding-bottom: 10px;
                            margin-bottom: 30px;
                        }
                        .title {
                            font-size: 22px;
                            font-weight: bold;
                        }
                        .subtitle {
                            font-size: 14px;
                            color: #555;
                        }
                        .table-container {
                            margin-top: 30px;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            font-size: 13px;
                        }
                        th, td {
                            border: 1px solid #ccc;
                            padding: 8px;
                            text-align: left;
                        }
                        th {
                            background-color: #f2f2f2;
                            font-weight: bold;
                        }
                        .no-data {
                            text-align: center;
                            padding: 20px;
                            color: #999;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <img src="/maderas.png" alt="Logo" class="logo" />
                        <div>
                            <div class="title">Maderas y Ensambles El Pino</div>
                            <div class="subtitle">Reporte de Ventas generado el ${new Date().toLocaleDateString('es-MX')}</div>
                        </div>
                    </div>

                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Cliente</th>
                                    <th>Artículos</th>
                                    <th>Total</th>
                                    <th>Tipo</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${ventas.length > 0 ? ventas.map(v => `
                                    <tr>
                                    <td>${v.fecha}</td>
                                    <td>${v.cliente}</td>
                                    <td>${v.articulos}</td>
                                    <td>$${(v.total || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                                    <td>${v.tipo}</td>
                                    <td>${v.status}</td>
                                    </tr>
                                `).join('') : '<tr><td colspan="6" class="no-data">No hay registros para mostrar</td></tr>'
                                }
                            </tbody>
                        </table>
                    </div>
                </body>
            </html>
        `;

        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
                </div>
                <button
                    onClick={handlePrint}
                    className="flex items-center bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                >
                    <Printer className="h-5 w-5 mr-2" />
                    Imprimir Reporte
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar cliente o artículo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) => {setStatusFilter(e.target.value); setCurrentPage(1)}}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                >
                    <option value="todos">Todos los estados</option>
                    <option value="Liquidada">Liquidada</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Cancelada">Cancelada</option>
                </select>

                <select
                    value={tipoFilter}
                    onChange={(e) => {setTipoFilter(e.target.value); setCurrentPage(1)}}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                >
                    <option value="todos">Todos los tipos</option>
                    <option value="contado">Contado</option>
                    <option value="credito 6 meses">Crédito 6 meses</option>
                    <option value="credito 12 meses">Crédito 12 meses</option>
                </select>

                <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <select
                        value={dateRange}
                        onChange={(e) => {setDateRange(e.target.value); setCurrentPage(1)}}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                    >
                        <option value="todos">Todas las fechas</option>
                        <option value="hoy">Hoy</option>
                        <option value="semana">Esta semana</option>
                        <option value="mes">Este mes</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default SalesFilters;
