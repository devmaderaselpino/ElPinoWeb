
import { Package, CreditCard, MapPin, Eye, RotateCcw } from 'lucide-react';
import { useState } from 'react';

const statusColors = {
    Liquidado: 'bg-green-100 text-green-800 border-green-200',
    Pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Cancelado: 'bg-red-100 text-red-800 border-red-200',
};

const statusIcons = {
    Liquidado: '✓',
    Pendiente: '⏳',
    Cancelado: '✗',
};

const PurchaseItem = ({ purchase }) => {
    const [expanded, setExpanded] = useState(false);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="rounded-lg  bg-white shadow-lg border-0  backdrop-blur-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 flex flex-col space-y-1.5 p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center gap-3">
                            <Package className="h-5 w-5 text-slate-600" />
                            <span className="font-semibold text-lg text-slate-800">Orden #{purchase.orderNumber}</span>
                        </div>
                        <p className="text-slate-600 text-sm">{formatDate(purchase.date)}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${statusColors[purchase.status]}`}>
                        <span className="mr-1">{statusIcons[purchase.status]}</span>
                            {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                        </span>
                        <span className="text-2xl font-bold text-slate-800">${purchase.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div className="p-6 pt-0">
                <div className="space-y-4">
                    

                    <div className="flex">
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="mt-5 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white hover:bg-accent hover:text-accent-foreground h-9  px-3"
                        >
                            <Eye className="h-4 w-4" />
                            {expanded ? 'Ocultar detalle' : 'Ver detalle'}
                        </button>
                    </div>

                    {expanded && (
                        <div className="mt-4 pt-4 border-t border-slate-200">
                            <h4 className="font-semibold text-slate-800 mb-3">Productos</h4>
                            <div className="space-y-3">
                                {purchase.items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg bg-slate-50">
                                        <img 
                                            src={item.image} 
                                            alt={item.name}
                                            className="size-16 object-cover rounded-md"
                                        />
                                        <div className="flex-1">
                                            <h5 className="font-medium text-slate-800">{item.name}</h5>
                                            <p className="text-sm text-slate-600">Cantidad: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-slate-800">${item.price.toFixed(2)}</p>
                                            <p className="text-sm text-slate-600">Unitario</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PurchaseItem;
