
import { Package, DollarSign, Calendar, TrendingUp } from 'lucide-react';

const PurchaseStats = ({ purchases }) => {
    const totalSpent = purchases.reduce((sum, purchase) => sum + purchase.total, 0);
    const totalOrders = purchases.length;

    const stats = [
        {
            title: 'Total de compras',
            value: totalOrders.toString(),
            icon: Package,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-700'
        },
        {
            title: 'Total gastado',
            value: `$${totalSpent.toFixed(2)}`,
            icon: DollarSign,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50',
            textColor: 'text-green-700'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {stats.map((stat, index) => (
                <div key={index} className="rounded-lg   shadow-lg border-0 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300 p-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <p className="text-slate-600 text-sm font-medium">{stat.title}</p>
                            <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
                        </div>
                        <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                            <stat.icon className={`h-8 w-8 ${stat.textColor}`} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PurchaseStats;
