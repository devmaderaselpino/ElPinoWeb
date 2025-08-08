import React, { useState, useEffect } from 'react';
import { X, Package, ListPlus, Tag } from 'lucide-react';
import Swal from 'sweetalert2';

const ProductForm = ({ onSave, onCancel, categories, crearCategoria, imgUrl, onUploadImage ,clearImage}) => {
    const [activeTab, setActiveTab] = useState('producto');
    const [formData, setFormData] = useState({
        descripcion: '',
        categoria: '',
        nuevaCategoria: '',
        precio: '',
        img_producto: '',
        min_stock_rosario: '5',
        min_stock_escuinapa: '5',
    });
    const [errors, setErrors] = useState({});

    // Actualizar el campo img_producto cuando cambie la URL subida
    useEffect(() => {
        if (imgUrl) {
            setFormData(prev => ({
                ...prev,
                img_producto: imgUrl
            }));
        }
    }, [imgUrl]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const handleCategoriaCreada = async () => {
        try {
            const { data } = await crearCategoria({
                variables: { descripcion: formData.nuevaCategoria.trim() }
            });

            await Swal.fire({
                icon: 'success',
                title: 'Categoría registrada',
                text: 'La categoría fue creada exitosamente.',
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'bg-green-800 hover:bg-green-600 text-white px-4 py-2 rounded',
                },
                buttonsStyling: false
            });

            setFormData(prev => ({
                ...prev,
                categoria: data.crearCategoria?.idCategoria?.toString() || '',
                nuevaCategoria: ''
            }));
            setActiveTab('producto');
        } catch (error) {
            console.error('Error creando categoría', error);
            setErrors({ nuevaCategoria: 'Error al crear la categoría' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (activeTab === 'producto') {
            if (!formData.descripcion.trim()) newErrors.descripcion = 'La descripción es obligatoria';
           if(!formData.img_producto) newErrors.img_producto = 'La imagen es obligatoria';
            const categoriaInt = parseInt(formData.categoria, 10);
            if (!categoriaInt && !formData.nuevaCategoria.trim()) {
                newErrors.categoria = 'Selecciona o crea una categoría';
            }
             
            if (!formData.precio || parseFloat(formData.precio) <= 0) {
                newErrors.precio = 'El precio es obligatorio y debe ser mayor a 0';
            }
            if (formData.min_stock_rosario <= 0) {
                newErrors.min_stock_rosario = 'Debe ser mayor a 0';
                }
                if (formData.min_stock_escuinapa <= 0) {
                newErrors.min_stock_escuinapa = 'Debe ser mayor a 0';
                }

            if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

            // Si va a crear categoría primero
            if (!categoriaInt && formData.nuevaCategoria.trim()) {
                await handleCategoriaCreada();
                return;
            }

            // Guardar producto
            onSave({
                descripcion: formData.descripcion,
                categoria: categoriaInt,
                precio: parseFloat(formData.precio),
                img_producto: formData.img_producto,
                min_stock_rosario: Number(formData.min_stock_rosario),
                min_stock_escuinapa: Number(formData.min_stock_escuinapa),
            });

            await Swal.fire({
                icon: 'success',
                title: 'Producto registrado',
                text: 'El producto fue guardado correctamente.',
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'bg-green-800 hover:bg-green-700 text-white px-4 py-2 rounded',
                },
                buttonsStyling: false 
            });
               setErrors({});
               clearImage(); 
               onCancel();
        } else {
            if (!formData.nuevaCategoria.trim()) {
                setErrors({ nuevaCategoria: 'La descripción de la categoría es obligatoria' });
                return;
            }
            await handleCategoriaCreada();
        }
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-transparent flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                {/* Header */}
                <div className="flex justify-between mb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Package className="w-5 h-5 text-green-800" />
                        {activeTab === 'producto' ? 'Registrar Producto' : 'Crear Categoría'}
                    </h2>
                    <button onClick={onCancel}>
                        <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b mb-4">
                    <button
                        className={`flex-1 py-2 text-sm font-medium ${activeTab === 'producto' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('producto')}
                    >
                        <ListPlus className="inline w-4 h-4 mr-1" /> Producto
                    </button>
                    <button
                        className={`flex-1 py-2 text-sm font-medium ${activeTab === 'categoria' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('categoria')}
                    >
                        <Tag className="inline w-4 h-4 mr-1" /> Categoría
                    </button>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {activeTab === 'producto' ? (
                        <>
                            <div>
                                <label className="block text-sm text-gray-700">Descripción</label>
                                <input
                                    type="text"
                                    value={formData.descripcion}
                                    onChange={(e) => handleInputChange('descripcion', e.target.value)}
                                    className={`w-full mt-1 p-2 border rounded ${errors.descripcion ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.descripcion && <p className="text-xs text-red-500 mt-1">{errors.descripcion}</p>}
                            </div>

                            <div>
                                <label className="block text-sm text-gray-700">Categoría</label>
                                <select
                                    value={formData.categoria}
                                    onChange={(e) => handleInputChange('categoria', e.target.value)}
                                    className={`w-full mt-1 p-2 border rounded ${errors.categoria ? 'border-red-500' : 'border-gray-300'}`}
                                >
                                    <option value="">Seleccionar categoría</option>
                                    {categories.map(cat => (
                                        <option key={cat.idCategoria} value={cat.idCategoria}>{cat.descripcion}</option>
                                    ))}
                                </select>
                                {errors.categoria && <p className="text-xs text-red-500 mt-1">{errors.categoria}</p>}
                            </div>

                           <div>
                                <label className="block text-sm text-gray-700">Imagen</label>
                                <input
                                    type="file"
                                    onChange={onUploadImage}
                                    className={`w-full mt-1 p-2 border rounded ${errors.img_producto ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.img_producto && (
                                    <p className="text-xs text-red-500 mt-1">{errors.img_producto}</p>
                                )}
                                {imgUrl && (
                                    <img
                                    src={imgUrl}
                                    alt="Vista previa"
                                    className="w-32 h-32 mt-2 object-cover rounded border"
                                    />
                                )}
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700">Precio</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.precio}
                                    onChange={(e) => handleInputChange('precio', e.target.value)}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                                />
                                  {errors.precio && <p className="text-xs text-red-500 mt-1">{errors.precio}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-700">Min. Rosario</label>
                                   <input
                                    type="number"
                                    min={1}
                                    value={formData.min_stock_rosario}
                                    onChange={(e) => handleInputChange('min_stock_rosario', Number(e.target.value))}
                                    className={`appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                                                [&::-webkit-inner-spin-button]:m-0 w-full mt-1 p-2 border rounded 
                                                ${errors.min_stock_rosario ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700">Min. Escuinapa</label>
                                   <input
                                    type="number"
                                    min={1}
                                    value={formData.min_stock_escuinapa}
                                    onChange={(e) => handleInputChange('min_stock_escuinapa', Number(e.target.value))}
                                    className={`appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                                                [&::-webkit-inner-spin-button]:m-0 w-full mt-1 p-2 border rounded 
                                                ${errors.min_stock_escuinapa ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div>
                            <label className="block text-sm text-gray-700">Nombre de la Categoría</label>
                            <input
                                type="text"
                                value={formData.nuevaCategoria}
                                onChange={(e) => handleInputChange('nuevaCategoria', e.target.value)}
                                className={`w-full mt-1 p-2 border rounded ${errors.nuevaCategoria ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.nuevaCategoria && <p className="text-xs text-red-500 mt-1">{errors.nuevaCategoria}</p>}
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="w-full py-2 px-4 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            {activeTab === 'producto' ? 'Registrar Producto' : 'Crear Categoría'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;
