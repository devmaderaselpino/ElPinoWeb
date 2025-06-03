import { useState } from 'react';
import { Search, Filter, Package} from 'lucide-react';
import PurchaseItem from './PurchaseItem';
import PurchaseStats from './PurchaseStats';

const mockPurchases = [
    {
        id: '1',
        orderNumber: 'ORD-2024-001',
        date: '2024-01-15',
        total: 159.99,
        status: 'Liquidado',
        items: [
        {
            id: '3',
            name: 'Silla mesedora',
            quantity: 2,
            price: 79.99,
            image: 'https://m.media-amazon.com/images/I/81uvgBzvTlL._AC_SX679_.jpg'
        },
        {
            id: '2',
            name: 'Juego de 4 sillas Aruba Duna',
            quantity: 3,
            price: 40.00,
            image: 'https://chedrauimx.vtexassets.com/arquivos/ids/46834007-800-auto?v=638798659658370000&width=800&height=auto&aspect=true'
        }
        ],
    },
    {
        id: '2',
        orderNumber: 'ORD-2024-002',
        date: '2024-02-01',
        total: 49.99,
        status: 'Liquidado',
        items: [
        {
            id: '3',
            name: 'Silla concordia',
            quantity: 1,
            price: 49.99,
            image: 'https://d2sapt5dytmohl.cloudfront.net/images/upload/36085/card/652739c2a9b8c2.70464163.png'
        }
        ],
    },
    {
        id: '3',
        orderNumber: 'ORD-2024-003',
        date: '2024-02-15',
        total: 29.99,
        status: 'Pendiente',
        items: [
        {
            id: '4',
            name: 'Ropero aquila',
            quantity: 1,
            price: 29.99,
            image: 'https://i5.walmartimages.com/asr/43df2ed2-e67b-467e-9d67-1b10eedc08de.7690d9f8e7e1d9b3b2388c60d1971828.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF'
        }
        ],
    },
    {
        id: '4',
        orderNumber: 'ORD-2024-004',
        date: '2024-03-01',
        total: 99.99,
        status: 'Cancelado',
        items: [
        {
            id: '5',
            name: 'Ropero cantabria',
            quantity: 1,
            price: 99.99,
            image: 'https://i5.walmartimages.com/asr/2f6d0b3b-4aa0-47d3-a5f2-e2fc59054882.eae79dfb62377f58324447bac1d7ed33.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF'
        }
        ],
    }
];

const PurchaseHistory = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredPurchases = mockPurchases.filter(purchase => {
        const matchesSearch = purchase.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            purchase.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter === 'all' || purchase.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <PurchaseStats purchases={mockPurchases} />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Buscar compra..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 pl-10 focus:border-yellow-800"
                        />
                    </div>
                
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-slate-500" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="flex h-10 w-full items-center justify-between rounded-md border-gray-300 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-w-[120px]"
                        >
                            <option value="all">Todas</option>
                            <option value="Liquidado">Liquidadas</option>
                            <option value="Pendiente">Pendientes</option>
                            <option value="Cancelado">Canceladas</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-6">
                    {filteredPurchases.length > 0 ? (
                        filteredPurchases.map((purchase) => (
                            <PurchaseItem key={purchase.id} purchase={purchase} />
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
