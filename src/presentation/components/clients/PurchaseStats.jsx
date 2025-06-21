
import { Package, DollarSign } from 'lucide-react';
import formatPrice from '../../../functions/FormatPrice';

const PurchaseStats = ({ purchases }) => {
    
    const stats = [
        {
            title: 'Total de compras',
            value:purchases.total_compras,
            icon: Package,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-700'
        },
        {
            title: 'Total gastado',
            value: formatPrice(purchases.total_comprado),
            icon: DollarSign,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50',
            textColor: 'text-green-700'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {stats.map((stat, index) => (
                <div key={index} className="rounded-lg   shadow-sm border-0 bg-white/70 p-6">
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
