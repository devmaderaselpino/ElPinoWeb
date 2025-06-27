import React, { useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { Search, Plus, Package, AlertTriangle, Filter, Store, Boxes } from 'lucide-react';
import InventoryTable from '../../components/inventory/InventoryTable';
import ProductForm from '../../components/inventory/ProductForm';
import StockAdjustment from '../../components/inventory/StockAdjustment';


const GET_PRODUCTOS_INVENTARIOS = gql`
    query GetProductosInventarios {
        GetProductosInventarios {
            idProducto
            nombre
            categoria
            precio
            stock_rosario
            min_stock_rosario
            stock_escuinapa
            min_stock_escuinapa
        }
    }
`;

const GET_CATEGORIAS = gql`
    query GetCategorias {
        getCategorias {
            idCategoria
            descripcion
        }
    }
`;

const CREAR_CATEGORIA = gql`
    mutation Mutation($descripcion: String!) {
        crearCategoria(descripcion: $descripcion) {
            idCategoria
            descripcion
        }
    }
`;

const CREAR_PRODUCTO_CON_INVENTARIOS = gql`
    mutation crearProductoConInventarios(
        $descripcion: String!,
        $categoria: Int!,
        $precio: Float!,
        $stockMinRosario: Int!,
        $stockMinEscuinapa: Int!
    ) {
        crearProductoConInventarios(
            descripcion: $descripcion,
            categoria: $categoria,
            precio: $precio,
            stockMinRosario: $stockMinRosario,
            stockMinEscuinapa: $stockMinEscuinapa
        ) {
            idProducto
            descripcion
            precio
        }
    }
`;

const ACTUALIZAR_STOCK_ESCINAPA = gql`
    mutation ActualizarStockEscuinapa($idProducto: Int!, $nuevoStock: Int!) {
        actualizarStockEscuinapa(idProducto: $idProducto, nuevoStock: $nuevoStock) {
            message
            success
        }
    }
`;

const ACTUALIZAR_STOCK_ROSARIO = gql`
    mutation ActualizarStockRosario($idProducto: Int!, $nuevoStock: Int!) {
        actualizarStockRosario(idProducto: $idProducto, nuevoStock: $nuevoStock) {
            success
            message
        }
    }
`;

const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [locationFilter, setLocationFilter] = useState('all');
    const [lowStockFilter, setLowStockFilter] = useState(false);
    const [showProductForm, setShowProductForm] = useState(false);

    
    const { data, loading, error, refetch } = useQuery(GET_PRODUCTOS_INVENTARIOS);
  
    
    const { data: categoriasData, loading: categoriasLoading, error: categoriasError, refetch: refetchCategories } = useQuery(GET_CATEGORIAS);

    const [crearProducto] = useMutation(CREAR_PRODUCTO_CON_INVENTARIOS, {
        onCompleted: () => {
            setShowProductForm(false);
            refetch();
        },
    });

    const [crearCategoria] = useMutation(CREAR_CATEGORIA, {
        onCompleted: () => {
            refetchCategories();
        }
    });

    const [actualizarStockEscuinapa] = useMutation(ACTUALIZAR_STOCK_ESCINAPA);
    const [actualizarStockRosario] = useMutation(ACTUALIZAR_STOCK_ROSARIO);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        if (data?.GetProductosInventarios) {
            const productsWithId = data.GetProductosInventarios.map((p) => ({
                id: p.idProducto,
                descripcion: p.nombre,
                categoria: p.categoria,
                precio: p.precio || 0,
                fecha_reg: new Date().toISOString().split('T')[0],
                stock_rosario: p.stock_rosario,
                min_stock_rosario: p.min_stock_rosario,
                stock_escuinapa: p.stock_escuinapa,
                min_stock_escuinapa: p.min_stock_escuinapa,
            }));
            setProducts(productsWithId);
        }
    }, [data]);

    useEffect(() => {
        const filtered = products.filter(product => {
            const matchesSearch = product.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.categoria.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = categoryFilter === 'all' || product.categoria === categoryFilter;
            const matchesLowStock = !lowStockFilter ||
                product.stock_rosario < product.min_stock_rosario ||
                product.stock_escuinapa < product.min_stock_escuinapa;
            return matchesSearch && matchesCategory && matchesLowStock;
        });
        setFilteredProducts(filtered);
    }, [products, searchTerm, categoryFilter, locationFilter, lowStockFilter]);

    const categories = ['all', ...Array.from(new Set(products.map(p => p.categoria)))];
    const lowStockCount = products.filter(
        p => p.stock_rosario < p.min_stock_rosario || p.stock_escuinapa < p.min_stock_escuinapa
    ).length;

    if (loading || categoriasLoading) return <p className="text-center mt-10 text-gray-500">Cargando productos y categorías...</p>;
    if (error || categoriasError) return <p className="text-center mt-10 text-red-500">Error al cargar inventario o categorías.</p>;

    const handleCreateProduct = (newProductData) => {
        crearProducto({
            variables: {
                descripcion: newProductData.descripcion,
                categoria: newProductData.categoria,
                precio: newProductData.precio,
                stockMinRosario: newProductData.min_stock_rosario,
                stockMinEscuinapa: newProductData.min_stock_escuinapa,
            },
        });
    };

    const handleStockAdjustment = async (productId, location, newStock) => {
        try {
            if (location === 'rosario') {
                await actualizarStockRosario({ variables: { idProducto: productId, nuevoStock: newStock } });
            } else if (location === 'escuinapa') {
                await actualizarStockEscuinapa({ variables: { idProducto: productId, nuevoStock: newStock } });
            }
            await refetch();
        } catch (error) {
            console.error("Error ajustando el stock:", error);
        }
    };

    const handleOpenStockAdjustment = (product) => {
        setSelectedProduct(product);
    };

    return (
        <div className="min-h-screen bg-white p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                            <Package className="h-8 w-8 text-green-800" />
                            Gestión de Inventario
                        </h1>
                        <p className="text-gray-600 mt-1">Control de stock en Rosario y Escuinapa</p>
                    </div>
                    <button
                        className="bg-green-800 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center"
                        onClick={() => setShowProductForm(true)}  // Mostrar formulario
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Nuevo Producto
                    </button>
                </div>

               
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[{label: 'Total Productos', value: products.length, icon: <Package className="h-5 w-5 text-blue-500" />},
                    {label: 'Stock Rosario', value: products.reduce((sum, p) => sum + p.stock_rosario, 0), icon: <Store className="h-5 w-5 text-green-700" />},
                    {label: 'Stock Escuinapa', value: products.reduce((sum, p) => sum + p.stock_escuinapa, 0), icon: <Store className="h-5 w-5 text-indigo-800" />},
                    {label: 'Alertas Stock Bajo', value: lowStockCount, icon: <AlertTriangle className="h-5 w-5 text-red-500" />, color: 'text-red-600'}]
                    .map(({ label, value, color = 'text-gray-900', icon }) => (
                        <div key={label} className="bg-white shadow-xl rounded p-4 flex items-center space-x-3">
                            <div className="flex-shrink-0">{icon}</div>
                            <div>
                                <p className="text-sm text-gray-600">{label}</p>
                                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                            </div>
                        </div>
                    ))}
                </div>

               
                <div className="bg-white rounded p-6 shadow-xl space-y-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Buscar por descripción o categoría..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded"
                            />
                        </div>

                        <select
                            value={categoryFilter}
                            onChange={e => setCategoryFilter(e.target.value)}
                            className="w-full lg:w-48 px-3 py-2 border border-gray-300 rounded"
                        >
                            <option value="all">Todas las categorías</option>
                            {categories.slice(1).map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>

                        <select
                            value={locationFilter}
                            onChange={e => setLocationFilter(e.target.value)}
                            className="w-full lg:w-48 px-3 py-2 border border-gray-300 rounded"
                        >
                            <option value="all">Todas las ubicaciones</option>
                            <option value="rosario">Rosario</option>
                            <option value="escuinapa">Escuinapa</option>
                        </select>

                        <button
                            onClick={() => setLowStockFilter(!lowStockFilter)}
                            className={`w-full lg:w-auto px-4 py-2 rounded border ${lowStockFilter ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-700'}`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Filter className="h-4 w-4" />
                                Stock Bajo
                                {lowStockCount > 0 && (
                                    <span className="bg-red-100 text-red-600 px-2 rounded text-xs">
                                        {lowStockCount}
                                    </span>
                                )}
                            </div>
                        </button>
                    </div>
                </div>

               
                <InventoryTable
                    products={filteredProducts}
                    locationFilter={locationFilter}
                    categories={categoriasData?.getCategorias || []}
                    onStockAdjustment={handleOpenStockAdjustment}
                />

                
                {showProductForm && (
                    <ProductForm
                        onSave={handleCreateProduct}
                        onCancel={() => setShowProductForm(false)}
                        categories={categoriasData?.getCategorias || []}
                        crearCategoria={crearCategoria}
                    />
                )}

                {selectedProduct && (
                    <StockAdjustment
                        product={selectedProduct}
                        onAdjust={handleStockAdjustment}
                        onClose={() => setSelectedProduct(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default Inventory;
