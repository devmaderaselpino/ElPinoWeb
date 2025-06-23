import React from 'react';
import { DollarSign, ShoppingCart, Users } from 'lucide-react';

const SalesSummary = ({ ventas = [] }) => {
    const totalVentas = ventas
        .filter(v => v.status === 'Liquidada')
        .reduce((sum, venta) => sum + venta.total, 0);

    const ventasCompletadas = ventas.filter(v => v.status === 'Liquidada').length;
    const clientesUnicos = new Set(ventas.map(v => v.cliente)).size;
    const promedioVenta = ventasCompletadas > 0 ? totalVentas / ventasCompletadas : 0;

    const stats = [
        {
            title: 'Total de Ventas',
            value: `$${totalVentas.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
            icon: DollarSign,
            color: 'from-green-500 to-emerald-600',
            bgColor: 'from-green-50 to-emerald-50'
        },
        {
            title: 'Ventas Completadas',
            value: ventasCompletadas.toString(),
            icon: ShoppingCart,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'from-blue-50 to-blue-50'
        },
        {
            title: 'Clientes',
            value: clientesUnicos.toString(),
            icon: Users,
            color: 'from-purple-500 to-purple-600',
            bgColor: 'from-purple-50 to-purple-50'
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

export default SalesSummary;
