import React from 'react';
import { DollarSign, Users, FileText } from 'lucide-react';

export const PaymentSummary = ({ payments = [] }) => {
    const totalAbonos = payments.reduce((sum, payment) => sum + (payment.abono || 0), 0);
    const uniqueClients = new Set(payments.map(p => p.cliente)).size;
    const uniqueCollectors = new Set(payments.map(p => p.cobrador)).size;

    const stats = [
        {
            title: 'Total Abonos',
            value: `$${totalAbonos.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
            icon: DollarSign,
            color: 'from-green-500 to-emerald-600',
            bgColor: 'from-green-50 to-emerald-50'
        },
        {
            title: 'Clientes Únicos',
            value: uniqueClients.toString(),
            icon: Users,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'from-blue-50 to-blue-50'
        },
        {
            title: 'Cobradores Únicos',
            value: uniqueCollectors.toString(),
            icon: Users,
            color: 'from-purple-500 to-purple-600',
            bgColor: 'from-purple-50 to-purple-50'
        },
        {
            title: 'Total Registros',
            value: payments.length.toString(),
            icon: FileText,
            color: 'from-green-500 to-emerald-600',
            bgColor: 'from-green-50 to-emerald-50'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.bgColor} border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
                >
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                                <stat.icon className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`}></div>
                </div>
            ))}
        </div>
    );
};
