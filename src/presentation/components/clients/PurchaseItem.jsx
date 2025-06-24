
import { Package, Eye, HandCoins } from 'lucide-react';
import { useState } from 'react';
import formatPrice from '../../../functions/FormatPrice';
import { format } from "@formkit/tempo";
import { useNavigate } from 'react-router-dom';

const statusColors = {
    0: 'bg-green-100 text-green-800 border-green-200',
    1: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    2: 'bg-red-100 text-red-800 border-red-200',
};

const statusIcons = {
    0: '✓',
    1: '⏳',
    2: '✗',
};

const PurchaseItem = ({ purchase }) => {

    const navigate = useNavigate();
    
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="rounded-lg  bg-white shadow-lg border-0  backdrop-blur-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 flex flex-col space-y-1.5 p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center gap-3">
                            <Package className="h-5 w-5 text-slate-600" />
                            <span className="font-semibold text-lg text-slate-800">Orden #{purchase.idVenta}</span>
                        </div>
                        <p className="text-slate-600 text-sm">{format(new Date(parseInt(purchase.fecha)), { date: 'long' })}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${statusColors[purchase.status]}`}>
                        <span className="mr-1">{statusIcons[purchase.status]}</span>
                            {purchase.status === 1 ? "Pendiente" : purchase.status === 0 ? "Liquidado" : "Cancelado"}
                        </span>
                        <span className="text-2xl font-bold text-slate-800">{formatPrice(purchase.total)}</span>
                    </div>
                </div>
            </div>

            <div className="p-6 pt-0">
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3">
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="mt-5 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white hover:bg-accent hover:text-accent-foreground h-9  px-3"
                        >
                            <Eye className="h-4 w-4" />
                            {expanded ? 'Ocultar detalle' : 'Ver detalle'}
                        </button>
                        
                        <button
                            onClick={() => navigate(`/TablaPagos/${purchase.idVenta}`)}
                            className="mt-5 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white hover:bg-accent hover:text-accent-foreground h-9  px-3"
                        >
                            <Eye className="h-4 w-4" />
                            Tabla de pagos
                        </button>
                        
                        {purchase.status === 1 ? 
                            <button
                                onClick={() => navigate(`/AplicarAbono/${purchase.idVenta}`)}
                                className="mt-5 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white hover:bg-accent hover:text-accent-foreground h-9  px-3"
                            >
                                <HandCoins className="h-4 w-4" />
                                Abonar
                            </button>
                        : null}
                    </div>
                    {expanded && (
                        <div className="mt-4 pt-4 border-t border-slate-200">
                            <h4 className="font-semibold text-slate-800 mb-3">Productos</h4>
                            <div className="space-y-3">
                                {purchase.getProducts.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg bg-slate-50">
                                        <img 
                                            src={item.img_producto} 
                                            alt={item.descripcion}
                                            className="size-16 object-cover rounded-md"
                                        />
                                        <div className="flex-1">
                                            <h5 className="font-medium text-slate-800">{item.descripcion}</h5>
                                            <p className="text-sm text-slate-600">Cantidad: {item.cantidad}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-slate-800">{formatPrice(item.precio)}</p>
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
