import React from 'react';
import { Trash2, FileText } from 'lucide-react';

export function PaymentTable({ payments = [], onDelete }) {

    if (!payments.length) {
        return (
            <div className="p-8 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No hay registros</h3>
                <p className="mt-1 text-sm text-gray-500">
                No se encontraron abonos que coincidan con los filtros aplicados.
                </p>
            </div>
        );
    }

    const totalAbono = payments.reduce((sum, p) => sum + (p.abono || 0), 0);

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de abono</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Abono</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cobrador</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {payments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {payment.fecha}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {payment.cliente}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {payment.tipo_abono}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right text-green-700">
                                ${payment.abono.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {payment.cobrador}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                <button
                                    className="text-primary-600 hover:text-primary-900 p-1 rounded-md hover:bg-primary-50"
                                    title="Ver detalle"
                                    onClick={ async () => {
                                        await onDelete(payment.id)
                                    }}
                                >
                                    <Trash2 className="text-red-700 h-4 w-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot className="bg-gray-50">
                    <tr className="font-medium">
                        <td colSpan={3} className="px-6 py-4 text-sm text-gray-900">
                            <strong>TOTAL ABONADO</strong>
                        </td>
                        <td className="px-6  py-4  whitespace-nowrap text-sm  text-green-700" colSpan={3}>
                            <strong>${totalAbono.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</strong>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}
