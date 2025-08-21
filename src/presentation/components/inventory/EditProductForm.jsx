import React, { useState, useEffect } from 'react';
import { X, Package } from 'lucide-react';
import Swal from 'sweetalert2';

const EditProductForm = ({ onSave, onCancel, categories, imgUrl, onUploadImage, clearImage, initialValues }) => {
    const [formData, setFormData] = useState({
        descripcion: '',
        categoria: '',
        precio: '',
        img_producto: '',
        min_stock_rosario: '5',
        min_stock_escuinapa: '5',
    });
    const [errors, setErrors] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);  

    useEffect(() => {
        if (initialValues) {
            const categoriaSeleccionada = categories.find(cat => cat.descripcion === initialValues.categoria);

            setFormData({
                descripcion: initialValues.descripcion || '',
                categoria: categoriaSeleccionada ? categoriaSeleccionada.idCategoria : '',  // Aquí asignas el idCategoria
                precio: initialValues.precio || '',
                img_producto: initialValues.img_producto || '',
                min_stock_rosario: initialValues.min_stock_rosario || '',
                min_stock_escuinapa: initialValues.min_stock_escuinapa || '',
            });
            setSelectedImage(initialValues.img_producto || null); 
        }
    }, [initialValues, categories]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    useEffect(() => {
        if (imgUrl) {
            setFormData(prev => ({
                ...prev,
                img_producto: imgUrl
            }));
        }
    }, [imgUrl]);


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);  
                onUploadImage(e); 
            };
            reader.readAsDataURL(file);  
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!formData.descripcion.trim()) newErrors.descripcion = 'La descripción es obligatoria';
        if (!formData.img_producto && !initialValues.img_producto) newErrors.img_producto = 'La imagen es obligatoria';  // Solo validar si no hay imagen nueva ni anterior
        const categoriaInt = parseInt(formData.categoria, 10);
        if (!categoriaInt) newErrors.categoria = 'Selecciona una categoría';

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

        const updatedData = {
            idProducto: initialValues.idProducto, 
            descripcion: formData.descripcion,
            categoria: categoriaInt,
            precio: parseFloat(formData.precio),
            img_producto: formData.img_producto || initialValues.img_producto,  
            min_stock_rosario: Number(formData.min_stock_rosario),
            min_stock_escuinapa: Number(formData.min_stock_escuinapa),
        };

        onSave(updatedData);

        await Swal.fire({
            icon: 'success',
            title: 'Producto actualizado',
            text: 'El producto fue actualizado correctamente.',
            confirmButtonText: 'OK',
            customClass: {
                confirmButton: 'bg-green-800 hover:bg-green-700 text-white px-4 py-2 rounded',
            },
            buttonsStyling: false
        });

        setErrors({});
        clearImage();
        onCancel();
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-transparent flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                {/* Header */}
                <div className="flex justify-between mb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Package className="w-5 h-5 text-green-800" />
                        Editar Producto
                    </h2>
                    <button onClick={onCancel}>
                        <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                    </button>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-5">
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
                            <option key={cat.idCategoria} value={cat.idCategoria}>
                                {cat.descripcion}
                            </option>
                        ))}
                    </select>
                    {errors.categoria && <p className="text-xs text-red-500 mt-1">{errors.categoria}</p>}
                </div>

                  <div>
                    <label className="block text-sm text-gray-700">Imagen</label>
                
                    <input
                        type="file"
                        onChange={handleImageChange}  
                        className={`w-full mt-1 p-2 border rounded ${errors.img_producto ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.img_producto && (
                        <p className="text-xs text-red-500 mt-1">{errors.img_producto}</p>
                    )}

                    
                    {selectedImage && (
                        <div className="mt-2">
                            <img
                                src={selectedImage}  
                                alt="Imagen actual"
                                className="w-32 h-32 object-cover rounded"
                            />
                        </div>
                    )}

                   
                    {!selectedImage && initialValues && initialValues.img_producto && (
                        <div className="mt-2 text-sm text-gray-600">
                            <span>Imagen actual: </span>
                            <a href={initialValues.img_producto} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                                Ver imagen
                            </a>
                        </div>
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
                                className={`w-full mt-1 p-2 border rounded ${errors.min_stock_rosario ? 'border-red-500' : 'border-gray-300'}`}
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700">Min. Escuinapa</label>
                            <input
                                type="number"
                                min={1}
                                value={formData.min_stock_escuinapa}
                                onChange={(e) => handleInputChange('min_stock_escuinapa', Number(e.target.value))}
                                className={`w-full mt-1 p-2 border rounded ${errors.min_stock_escuinapa ? 'border-red-500' : 'border-gray-300'}`}
                            />
                        </div>
                    </div>

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
                            Editar Producto
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProductForm;
