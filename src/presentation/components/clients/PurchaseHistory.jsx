import { useState } from 'react';
import { Search, Filter, Package} from 'lucide-react';
import PurchaseItem from './PurchaseItem';
import PurchaseStats from './PurchaseStats';

const PurchaseHistory = ({ purchases, stats, status, setStatus }) => {
    
    return (
        <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <PurchaseStats purchases={stats} />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-end">
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-slate-500" />
                        <select
                            value={status}
                            onChange={(e) => setStatus(parseInt(e.target.value))}
                            className="flex h-10 w-full items-center justify-between rounded-md border-gray-300 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-green-600 focus:border-green-600 min-w-[120px]"
                        >
                            <option value={0}>Todas</option>
                            <option value={1}>Liquidadas</option>
                            <option value={2}>Pendientes</option>
                            <option value={3}>Canceladas</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-6">
                    {purchases.length > 0 ? (
                        purchases.map((purchase) => (
                            <PurchaseItem key={purchase.idVenta} purchase={purchase} />
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-600 mb-2">No se encontraron compras.</h3>
                            <p className="text-slate-500">Prueba con otro filtro.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PurchaseHistory;
