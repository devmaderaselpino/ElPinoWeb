import React from 'react';
import { Edit, AlertTriangle } from 'lucide-react';

const InventoryTable = ({ products, locationFilter, categories, onStockAdjustment }) => {

    const getCategoryDescription = (categoryName) => {
        return categoryName || 'Desconocida';
    };

    const formatPrice = (price) =>
        new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(price);

    const isLowStock = (stock, minStock) => stock < minStock;

    const getStockBadgeColor = (stock, minStock) => {
        if (stock === 0) return 'bg-red-600 text-white';
        if (stock < minStock) return 'bg-yellow-100 text-yellow-800';
        return 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="bg-white rounded-lg shadow-xl p-4">
            <div className="overflow-x-auto">
                <table className="w-full table-auto">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                                Producto
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                                Categoría
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                                Precio
                            </th>
                            {(locationFilter === 'all' || locationFilter === 'rosario') && (
                                <>
                                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase">
                                        Stock Rosario
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase">
                                        Min. Rosario
                                    </th>
                                </>
                            )}
                            {(locationFilter === 'all' || locationFilter === 'escuinapa') && (
                                <>
                                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase">
                                        Stock Escuinapa
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase">
                                        Min. Escuinapa
                                    </th>
                                </>
                            )}
                            <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase">
                                Acciones
                            </th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{product.descripcion}</div>
                                        </div>
                                        {(isLowStock(product.stock_rosario, product.min_stock_rosario) ||
                                            isLowStock(product.stock_escuinapa, product.min_stock_escuinapa)) && (
                                            <AlertTriangle className="h-4 w-4 text-red-500 ml-2" />
                                        )}
                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                        {getCategoryDescription(product.categoria)} {/* Aquí se muestra la descripción de la categoría */}
                                    </span>
                                </td>

                                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                    {formatPrice(product.precio)}
                                </td>

                                {(locationFilter === 'all' || locationFilter === 'rosario') && (
                                    <>
                                        <td className="px-6 py-4 text-center">
                                            <span
                                                className={`text-sm px-3 py-1 rounded-full ${getStockBadgeColor(
                                                    product.stock_rosario,
                                                    product.min_stock_rosario
                                                )}`}
                                            >
                                                {product.stock_rosario}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm text-gray-600">
                                            {product.min_stock_rosario}
                                        </td>
                                    </>
                                )}

                                {(locationFilter === 'all' || locationFilter === 'escuinapa') && (
                                    <>
                                        <td className="px-6 py-4 text-center">
                                            <span
                                                className={`text-sm px-3 py-1 rounded-full ${getStockBadgeColor(
                                                    product.stock_escuinapa,
                                                    product.min_stock_escuinapa
                                                )}`}
                                            >
                                                {product.stock_escuinapa}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm text-gray-600">
                                            {product.min_stock_escuinapa}
                                        </td>
                                    </>
                                )}

                                <td className="px-6 py-4 text-center">
                                    <button
                                        onClick={() => onStockAdjustment(product)}
                                        className="text-sm text-blue-600 border border-blue-300 rounded px-3 py-1 flex items-center justify-center hover:bg-blue-50 transition-colors"
                                    >
                                        <Edit className="h-4 w-4 mr-1" />
                                        Ajustar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {products.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No se encontraron productos
                    </div>
                )}
            </div>
        </div>
    );
};

export default InventoryTable;
