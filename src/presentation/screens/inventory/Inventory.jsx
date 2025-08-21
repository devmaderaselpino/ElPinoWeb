import React, { useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { Search, Plus, Package, AlertTriangle, Filter, Store, Boxes,Bell } from 'lucide-react';
import InventoryTable from '../../components/inventory/InventoryTable';
import ProductForm from '../../components/inventory/ProductForm';
import StockAdjustment from '../../components/inventory/StockAdjustment';
import NotificationButton from '../../components/inventory/NotificationButton';
import EditProductForm from '../../components/inventory/EditProductForm';
import Swal from "sweetalert2";

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
    status
    img_producto
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
        $img_producto: String,
        $stockMinRosario: Int!,
        $stockMinEscuinapa: Int!
    ) {
        crearProductoConInventarios(
            descripcion: $descripcion,
            categoria: $categoria,
            precio: $precio,
            img_producto: $img_producto,
            stockMinRosario: $stockMinRosario,
            stockMinEscuinapa: $stockMinEscuinapa
        ) {
            idProducto
            descripcion
            img_producto
            precio

        }
    }
`;

const ACTUALIZAR_STOCK_ESCINAPA = gql`
    mutation ActualizarStockEscuinapa(
        $idProducto: Int!
        $nuevoStock: Int!
        $nota: String!
    ) {
        actualizarStockEscuinapa(
            idProducto: $idProducto
            nuevoStock: $nuevoStock
            nota: $nota
        ) {
            success
            message
        }
    }
`;

const ACTUALIZAR_STOCK_ROSARIO = gql`
    mutation ActualizarStockRosario(
        $idProducto: Int!
        $nuevoStock: Int!
        $nota: String!
    ) {
        actualizarStockRosario(
            idProducto: $idProducto
            nuevoStock: $nuevoStock
            nota: $nota
        ) {
            success
            message
        }
    }
`;
const GET_HISTORIAL_AJUSTES = gql`
  query GetHistorialAjustes {
    getHistorialAjustes {
      id
      idProducto
      producto
      idUsuario
      usuario
      ubicacion
      stockAnterior
      cantidad
      nota
      fecha
    }
  }
`;

const ELIMINAR_PRODUCTO = gql`
  mutation EliminarProducto($idProducto: Int!) {
    eliminarProducto(idProducto: $idProducto) {
      message
      success
    }
    
  }
`;

const ACTIVAR_PRODUCTO = gql`
  mutation ActivarProducto($idProducto: Int!) {
    activarProducto(idProducto: $idProducto) {
     message
     success
      }
  }
`;

const UPDATE_PRODUCTO = gql`
  mutation UpdateProducto($idProducto: Int!, $descripcion: String, $categoria: Int, $precio: Float, $img_producto: String, $min_stock_rosario: Int,
  $min_stock_escuinapa: Int) {
    updateProducto(idProducto: $idProducto, descripcion: $descripcion, categoria: $categoria, precio: $precio, img_producto: $img_producto, min_stock_rosario: $min_stock_rosario, min_stock_escuinapa: $min_stock_escuinapa) {
      success
      message
      producto {
        idProducto
        descripcion
        categoria
        precio
        img_producto
      }
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
    const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
    const [showEditProductForm, setShowEditProductForm] = useState(false);
   const [movimientos, setMovimientos] = useState([]);
   const [unreadCount, setUnreadCount] = useState(0); 

    const { data, loading, error, refetch } = useQuery(GET_PRODUCTOS_INVENTARIOS);
    const { data: ajustesData, loading: ajustesLoading, error: ajustesError } = useQuery(GET_HISTORIAL_AJUSTES);
    
    const { data: categoriasData, loading: categoriasLoading, error: categoriasError, refetch: refetchCategories } = useQuery(GET_CATEGORIAS, {fetchPolicy:"no-cache"});
    const [updateProducto, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_PRODUCTO, {
            onCompleted: (data) => {
            Swal.fire({
                title: '¡Éxito!',
                text: data.updateProducto.message,
                icon: 'success',
            });
            refetch(); 
            },
            onError: (error) => {
            Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error',
            });
            },
        });

    const [eliminarProducto] = useMutation(ELIMINAR_PRODUCTO, {
        onCompleted: () => {
            refetch(); 
            
        },
        onError: (error) => {
            console.error("Error al eliminar producto:", error);
        },
        });

         const handleDeleteProduct = async (idProducto) => {
                try {
                    const resp = await eliminarProducto({ variables: { idProducto } });

                    if (resp.data.eliminarProducto.success) {
                        setProducts(prev =>
                            prev.map(p =>
                                p.idProducto === idProducto ? { ...p, status: 0 } : p // Cambiar el status a 0
                            )
                        );
                        Swal.fire("Éxito", resp.data.eliminarProducto.message, "success");
                    } else {
                        Swal.fire("Error", resp.data.eliminarProducto.message, "error");
                    }
                } catch (error) {
                    console.error("Error al eliminar producto:", error);
                    Swal.fire("Error", "Ocurrió un error al eliminar el producto.", "error");
                }
            };

            const handleActivateProduct = async (idProducto) => {
                try {
                    const resp = await activarProducto({ variables: { idProducto } });

                    if (resp.data.activarProducto.success) {
                        setProducts(prev =>
                            prev.map(p =>
                                p.idProducto === idProducto ? { ...p, status: 1 } : p // Cambiar el status a 1
                            )
                        );
                        Swal.fire("Éxito", resp.data.activarProducto.message, "success");
                    } else {
                        Swal.fire("Error", resp.data.activarProducto.message, "error");
                    }
                } catch (error) {
                    console.error("Error al activar producto:", error);
                    Swal.fire("Error", "Ocurrió un error al activar el producto.", "error");
                }
            };


        const handleEditProduct = (product) => {
       console.log("Producto a editar:", product); 
        setSelectedProduct(product);
        setShowEditProductForm(true);
    };
     const handleEditClick = (product) => {
    onEditProduct(product); // Llama la función onEditProduct pasada como prop
   };
    const handleCloseEditProductForm = () => {
        setShowEditProductForm(false);
        setSelectedProduct(null);
    };

    const handleUpdateProduct = (formData) => {
 
     console.log("Producto a actualizar:", selectedProduct); // Verifica que selectedProduct tiene los datos correctos
    console.log("idProducto:", selectedProduct?.idProducto); // Asegúrate de que idProducto esté presente

    if (!selectedProduct || !selectedProduct.idProducto) {
        console.error("Error: idProducto no está presente");
        return;  // Si no está presente, salimos de la función
    }


        updateProducto({
            variables: {
                idProducto: selectedProduct.idProducto,
                descripcion: formData.descripcion,
                categoria: formData.categoria,
                precio: formData.precio,
                img_producto: formData.img_producto || selectedProduct.img_producto,
                min_stock_rosario: formData.min_stock_rosario,
                min_stock_escuinapa: formData.min_stock_escuinapa,
            },
        });
    };
            

    
                
    
    
    
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
    const [activarProducto] = useMutation(ACTIVAR_PRODUCTO);
    
    const [selectedProduct, setSelectedProduct] = useState(null);
    const resetImage = () => setUploadedImageUrl(null); 

    useEffect(() => {
        if (data?.GetProductosInventarios) {
            const productsWithId = data.GetProductosInventarios.map((p) => ({
                idProducto: p.idProducto,
                descripcion: p.nombre,
                categoria: p.categoria,
                precio: p.precio || 0,
                img_producto: p.img_producto || 'https://placehold.co/150x150',
                fecha_reg: new Date().toISOString().split('T')[0],
                stock_rosario: p.stock_rosario,
                min_stock_rosario: p.min_stock_rosario,
                stock_escuinapa: p.stock_escuinapa,
                min_stock_escuinapa: p.min_stock_escuinapa,
                status:  p.status !== undefined && p.status !== null ? Number(p.status) : 1,
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
}, [products, searchTerm, categoryFilter, locationFilter, lowStockFilter])


     useEffect(() => {
    if (ajustesData?.getHistorialAjustes) {
        console.log("Movimientos actualizados:", ajustesData.getHistorialAjustes);
        setMovimientos(ajustesData.getHistorialAjustes); // Actualiza los movimientos
        setUnreadCount(ajustesData.getHistorialAjustes.length); // Actualiza el contador de notificaciones
    }
}, [ajustesData]);


    const categories = ['all', ...Array.from(new Set(products.map(p => p.categoria)))];
    const lowStockCount = products.filter(
        p => p.stock_rosario < p.min_stock_rosario || p.stock_escuinapa < p.min_stock_escuinapa
    ).length;

    if (loading || categoriasLoading) return <p className="text-center mt-10 text-gray-500">Cargando productos y categorías...</p>;

    if (error || categoriasError) {
        console.log(error)
        console.error("Error productos:", error);
        console.error("Error categorías:", categoriasError);
        return <p className="text-center mt-10 text-red-500">Error al cargar inventario o categorías.</p>;
    }

    const handleCreateProduct = (newProductData) => {
        crearProducto({
            variables: {
                descripcion: newProductData.descripcion,
                categoria: newProductData.categoria,
                precio: newProductData.precio,
                img_producto: newProductData.img_producto || uploadedImageUrl,
                stockMinRosario: newProductData.min_stock_rosario,
                stockMinEscuinapa: newProductData.min_stock_escuinapa,
            },
        });
    };
     
   




    const uploadImage = async (e) => {
        try {
            const files = e.target.files;
            const data = new FormData();
            data.append('file', files[0]);
            data.append('upload_preset', 'elpino');

            const response = await fetch(`https://api.cloudinary.com/v1_1/dv1kiff9a/image/upload`, {
            method: 'POST',
            body: data,
            });

            const file = await response.json();
            setUploadedImageUrl(file.secure_url);  
        } catch (error) {
            console.error('Error uploading image:', error);
        }
        };


            const disableButtons = (product) => {
            return product.status === 0; // o cualquier lógica que desees
            };

      const handleStockAdjustment = async (productId, location, newStock, nota, idUsuario) => {
                    try {
                        if (location === 'rosario') {
                            await actualizarStockRosario({
                                variables: {
                                    idProducto: productId,
                                    nuevoStock: newStock,
                                    nota,
                                    idUsuario,
                                },
                            });

                            setSelectedProduct(prev => ({
                                ...prev,
                                stock_rosario: newStock,
                            }));
                        } else if (location === 'escuinapa') {
                            await actualizarStockEscuinapa({
                                variables: {
                                    idProducto: productId,
                                    nuevoStock: newStock,
                                    nota,
                                    idUsuario,
                                },
                            });

                            setSelectedProduct(prev => ({
                                ...prev,
                                stock_escuinapa: newStock,
                            }));
                        }

                        // Refetch para obtener los movimientos más recientes
                        const result = await refetch(); 
                          console.log("Refetch result:", result);
                        // Verificar que result.data.getHistorialAjustes no sea undefined y que sea un array
                        const nuevosMovimientos = result.data?.getHistorialAjustes || [];  // Usar un array vacío como valor predeterminado si no se obtiene la respuesta esperada
                        
                        setMovimientos(nuevosMovimientos);  // Actualizamos el estado de movimientos
                        setUnreadCount(nuevosMovimientos.length);  // Actualizamos el contador de notificaciones
                    } catch (error) {
                        console.error("Error ajustando el stock:", error);
                    }
                };

     

  

    const handleOpenStockAdjustment = (product) => {
         console.log("Producto seleccionado:", product); 
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
                    <div>
                        <NotificationButton
                        unreadCount={unreadCount}
                        movimientos={ajustesData?.getHistorialAjustes || []}/>
                    </div>
                    
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
                    onDeleteProduct={handleDeleteProduct}
                    disableButtons={disableButtons}
                    onActivateProduct={handleActivateProduct}
                    onEditProduct={handleEditProduct}

                />

                
                {showProductForm && (
                    <ProductForm
                        onSave={handleCreateProduct}
                        onCancel={() => {
                            setShowProductForm(false);
                            setUploadedImageUrl(null);
                        }}
                        categories={categoriasData?.getCategorias || []}
                        crearCategoria={crearCategoria}
                        imgUrl={uploadedImageUrl} 
                        onUploadImage={uploadImage}
                        clearImage={() => setUploadedImageUrl(null)}
                    />
                )}
                


                {selectedProduct && (
                    <StockAdjustment
                        product={selectedProduct}
                        setProduct={setSelectedProduct}
                        onAdjust={handleStockAdjustment}
                        onClose={() => setSelectedProduct(null)}
                    />
                )}

                {showEditProductForm && selectedProduct && (
                    <EditProductForm
                        onSave={handleUpdateProduct}
                        onCancel={handleCloseEditProductForm}
                        categories={categoriasData?.getCategorias || []}
                        imgUrl={uploadedImageUrl}
                        onUploadImage={uploadImage}
                        clearImage={() => setUploadedImageUrl(null)}
                        initialValues={selectedProduct}
                    />
                )}
            </div>
        </div>
    );
};

export default Inventory;
