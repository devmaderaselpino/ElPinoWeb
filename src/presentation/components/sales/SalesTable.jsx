import React from 'react';
import { Calendar, User, Package, CreditCard, Check, Clock, X } from 'lucide-react';
import formatPrice from '../../../functions/FormatPrice';

const SalesTable = ({ ventas = [] }) => {
    const getStatusBadge = (status) => {
        switch (status) {
            case 'Liquidada':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <Check className="h-3 w-3" />
                        Liquidada
                    </span>
                );
            case 'Pendiente':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="h-3 w-3" />
                        Pendiente
                    </span>
                );
            case 'Cancelada':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        <X className="h-3 w-3" />
                        Cancelada
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        {status}
                    </span>
                );
        }
    };

    const getTipoBadge = (tipo) => {
        if (tipo === 'contado') {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
                    <CreditCard className="h-3 w-3" />
                    Contado
                </span>
            );
        } else if (tipo === 'credito 6 meses') {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium bg-indigo-100 text-indigo-800">
                    <CreditCard className="h-3 w-3" />
                    6 meses
                </span>
            );
        } else if (tipo === 'credito 12 meses') {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium bg-purple-100 text-purple-800">
                    <CreditCard className="h-3 w-3" />
                    12 meses
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
                    {tipo}
                </span>
            );
        }
    };


    if (ventas.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No se encontraron ventas</h3>
                <p className="text-gray-500">Intenta ajustar los filtros para ver más resultados.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Historial de Ventas</h3>
                <p className="text-sm text-gray-600">Mostrando {ventas.length} ventas</p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Fecha
                                </div>
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Cliente
                                </div>
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                <div className="flex items-center gap-2">
                                    <Package className="h-4 w-4" />
                                    Artículos
                                </div>
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tipo</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {ventas.map((venta, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {venta.fecha}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">{venta.cliente}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-600 max-w-xs truncate" title={venta.articulos}>
                                        {venta.articulos}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-semibold text-gray-900">
                                        {venta.status !== "Cancelada" ? formatPrice(venta.total)  : formatPrice(venta.cantidad_cancelada)}
                                    </div>
                                </td>
                                <td className="px-6 py-4">{getTipoBadge(venta.tipo)}</td>
                                <td className="px-6 py-4">{getStatusBadge(venta.status)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SalesTable;
