import React from 'react';
import { Edit, AlertTriangle, Wrench, Pencil, Trash2, ShieldCheck, Trash } from 'lucide-react';
import Swal from "sweetalert2";
import formatPrice from '../../../functions/FormatPrice';

const InventoryTable = ({
    products,
    locationFilter,
    categories,
    onStockAdjustment,
    onDeleteProduct,
    disableButtons,
    onActivateProduct,
    onEditProduct
}) => {

    const getCategoryDescription = (categoryName) => {
        return categoryName || 'Desconocida';
    };
    
    const isLowStock = (stock, minStock) => stock < minStock;

    const getStockBadgeColor = (stock, minStock) => {
        if (stock === 0) return 'bg-red-600 text-white';
        if (stock < minStock) return 'bg-yellow-100 text-yellow-800';
        return 'bg-gray-100 text-gray-800';
    };
    
    const handleEditClick = (product) => {
 
        onEditProduct(product);
    };

    return (
        <div className="bg-white rounded-lg shadow-xl p-4">
            <div className="overflow-x-auto">
                <table className="w-full table-auto">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-2 py-4 text-left text-xs font-medium text-gray-500 uppercase w-900">
                                Imagen
                            </th>
                            <th className="px-2 py-4 text-left text-xs font-medium text-gray-500 uppercase w-20">
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
                            <tr key={product.idProducto} className="hover:bg-gray-50 transition-colors">

                                {/* Imagen */}
                                <td className="px-2 py-2">
                                    <img
                                        src={product.img_producto|| "https://via.placeholder.com/150"}
                                        className="w-40 h-30 object-cover rounded-md shadow"
                                    />
                                </td>

                                {/* Producto */}
                                <td className="px-2 py-2">
                                    <div className="flex items-center">
                                        <span className="text-sm font-medium text-gray-900">{product.descripcion}</span>
                                        {(isLowStock(product.stock_rosario, product.min_stock_rosario) ||
                                            isLowStock(product.stock_escuinapa, product.min_stock_escuinapa)) && (
                                            <AlertTriangle className="h-4 w-4 text-red-500 ml-2" />
                                        )}
                                    </div>
                                </td>

                                {/* Categoría */}
                                <td className="px-6 py-4">
                                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                        {getCategoryDescription(product.categoria)}
                                    </span>
                                </td>

                                {/* Precio */}
                                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                    {formatPrice(product.precio)}
                                </td>

                                {/* Stock Rosario */}
                                {(locationFilter === 'all' || locationFilter === 'rosario') && (
                                    <>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`text-sm px-3 py-1 rounded-full ${getStockBadgeColor(
                                                product.stock_rosario,
                                                product.min_stock_rosario
                                            )}`}>
                                                {product.stock_rosario}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm text-gray-600">
                                            {product.min_stock_rosario}
                                        </td>
                                    </>
                                )}

                                {/* Stock Escuinapa */}
                                {(locationFilter === 'all' || locationFilter === 'escuinapa') && (
                                    <>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`text-sm px-3 py-1 rounded-full ${getStockBadgeColor(
                                                product.stock_escuinapa,
                                                product.min_stock_escuinapa
                                            )}`}>
                                                {product.stock_escuinapa}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm text-gray-600">
                                            {product.min_stock_escuinapa}
                                        </td>
                                    </>
                                )}

                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center space-x-2">
                                        {/* Mostrar Ajustar y Editar solo si el producto está activo */}
                                        {product.status === 1 && (
                                            <>
                                                <button
                                                    onClick={() => onStockAdjustment(product)}
                                                    className="flex items-center gap-1 text-sm px-3 py-1 border rounded transition-colors bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200"
                                                    title="Ajustar Stock"
                                                >
                                                    <Wrench className="h-4 w-4" />
                                                    Ajustar
                                                </button>

                                                <button
                                                    onClick={() => handleEditClick(product)} 
                                                    className="flex items-center gap-1 text-sm px-3 py-1 border rounded transition-colors bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                                                    title="Editar Producto"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                    Editar
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        Swal.fire({
                                                            title: '¿Estás seguro?',
                                                            text: 'Esta acción eliminará el producto.',
                                                            icon: 'warning',
                                                            showCancelButton: true,
                                                            confirmButtonText: 'Sí, eliminar',
                                                            cancelButtonText: 'Cancelar',
                                                            confirmButtonColor: '#e74c3c',
                                                            cancelButtonColor: '#95a5a6',
                                                        }).then((result) => {
                                                            if (result.isConfirmed) {
                                                                onDeleteProduct(product.idProducto); // Llamar la función de eliminación
                                                            }
                                                        });
                                                    }}
                                                    className="flex items-center gap-1 text-sm bg-red-100 text-red-700 border border-red-300 rounded px-3 py-1 hover:bg-red-200 transition-colors"
                                                    title="Eliminar Producto"
                                                >
                                                    <Trash className="h-4 w-4" />
                                                    Eliminar
                                                </button>
                                            </>
                                        )}

                                        {/* Mostrar botón Activar solo si el producto está inactivo */}
                                        {product.status === 0 && (
                                            <button
                                                onClick={() => {
                                                    Swal.fire({
                                                        title: '¿Deseas activar este producto?',
                                                        icon: 'question',
                                                        showCancelButton: true,
                                                        confirmButtonText: 'Sí, activar',
                                                        cancelButtonText: 'Cancelar',
                                                        confirmButtonColor: '#1e8449',
                                                        cancelButtonColor: '#95a5a6',
                                                    }).then((result) => {
                                                        if (result.isConfirmed) {
                                                            onActivateProduct(product.idProducto); // Llamar la función de activación
                                                        }
                                                    });
                                                }}
                                                className="flex items-center gap-1 text-sm bg-green-100 text-green-700 border border-green-300 rounded px-3 py-1 hover:bg-green-200 transition-colors"
                                                title="Activar Producto"
                                            >
                                                <ShieldCheck className="h-4 w-4" />
                                                Activar
                                            </button>
                                        )}
                                    </div>
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
