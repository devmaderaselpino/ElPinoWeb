import React, { useState } from 'react';
import { X, Plus, Minus, MapPin } from 'lucide-react';
import Swal from 'sweetalert2';

const StockAdjustment = ({ product, onAdjust, onClose, refetchHistorial }) => {
    const [adjustments, setAdjustments] = useState({ rosario: '', escuinapa: '' });
    const [tab, setTab] = useState('rosario');
    const [notes, setNotes] = useState({ rosario: '', escuinapa: '' });

    const getCurrentStock = (location) =>
        location === 'rosario' ? Number(product.stock_rosario ?? 0) : Number(product.stock_escuinapa ?? 0);

    const getAdj = (location) => {
        const raw = adjustments[location];
        if (raw === '' || raw === '-' || raw === '+') return 0;
        const val = parseInt(raw, 10);
        return Number.isFinite(val) ? val : 0;
    };

    const getNewStock = (location) => {
        const current = getCurrentStock(location);
        const adj = getAdj(location);
        return current + adj;
    };

    const handleAdjustment = async (location) => {
        const currentStock = getCurrentStock(location);
        const rawAdj = getAdj(location);
        const nuevoStock = currentStock + rawAdj; // <- stock final que guardaremos
        const note = notes[location]?.trim();

        if (!note) return;
        if (!Number.isFinite(rawAdj) || rawAdj === 0) return;
        if (nuevoStock < 0) return;

        try {
            // Opción B: enviamos el STOCK FINAL (nuevoStock) al backend
            await onAdjust(product.idProducto, location, nuevoStock, note);

            await refetchHistorial?.();
            setAdjustments((prev) => ({ ...prev, [location]: '' }));
            setNotes((prev) => ({ ...prev, [location]: '' }));
            Swal.fire({ icon: 'success', title: 'Ajuste aplicado', timer: 1200, showConfirmButton: false });
        } catch (e) {
            Swal.fire({ icon: 'error', title: 'Error al aplicar ajuste' });
            console.error(e);
        }
    };

    const clampToStockFloor = (location, nextAdj) => {
        const currentStock = getCurrentStock(location);
        const minAdj = -currentStock; // nunca dejarlo por debajo de 0
        if (nextAdj < minAdj) return minAdj;
        return nextAdj;
    };

    const quickAdjustment = (location, value) => {
        setAdjustments((prev) => {
            const prevAdj = getAdj(location);
            const next = clampToStockFloor(location, prevAdj + value);
            return { ...prev, [location]: next.toString() };
        });
    };

    const sanitizeInput = (location, raw) => {
        let v = raw.replace(/[^\d-]/g, '');
        if (v.includes('-')) {
            v = (v.startsWith('-') ? '-' : '') + v.replace(/-/g, '');
        }
        if (v === '-' || v === '') {
            setAdjustments((prev) => ({ ...prev, [location]: v }));
            return;
        }
        const parsed = parseInt(v, 10);
        const clamped = clampToStockFloor(location, Number.isFinite(parsed) ? parsed : 0);
        setAdjustments((prev) => ({ ...prev, [location]: clamped.toString() }));
    };

    const blockInvalidKeys = (e) => {
        if (['e', 'E'].includes(e.key)) e.preventDefault();
        if (e.key === '-') {
            const input = e.currentTarget;
            const hasMinus = input.value.includes('-');
            const caretAtStart = input.selectionStart === 0;
            if (hasMinus || !caretAtStart) e.preventDefault();
        }
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-transparent flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-xl h-[69vh] flex flex-col overflow-hidden">
                <div className="flex justify-between items-center px-6 py-4 shrink-0">
                    <div className="flex items-center gap-2 text-xl font-semibold">
                        <MapPin className="h-5 w-5 text-green-800" />
                        Ajustar Stock
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto grow">
                    <div className="mb-6 bg-white p-4 rounded">
                        <h3 className="font-semibold text-2xl">{product.descripcion}</h3>
                        <img
                            src={product.img_producto}
                            className="w-50 h-50 ml-30 mt-3 object-cover rounded-md shadow"
                            alt={product.descripcion}
                        />
                        <div className="mt-2 flex items-center gap-2">
                            <p className="text-md">Categoria:</p>
                            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                                {product.categoria}
                            </span>
                        </div>
                    </div>

                    <div className="flex mb-4 gap-2">
                        <button
                            onClick={() => setTab('rosario')}
                            className={`w-full py-2 rounded ${tab === 'rosario' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
                        >
                            Rosario
                        </button>
                        <button
                            onClick={() => setTab('escuinapa')}
                            className={`w-full py-2 rounded ${tab === 'escuinapa' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
                        >
                            Escuinapa
                        </button>
                    </div>

                    {['rosario', 'escuinapa'].map(
                        (location) =>
                            tab === location && (
                                <div key={location} className="space-y-4">
                                    <div
                                        className={`grid grid-cols-2 gap-4 p-4 ${
                                            location === 'rosario' ? 'bg-green-50' : 'bg-blue-50'
                                        } rounded`}
                                    >
                                        <div>
                                            <p className="text-sm text-gray-600">Stock Actual</p>
                                            <p
                                                className={`text-2xl font-bold ${
                                                    location === 'rosario' ? 'text-green-700' : 'text-blue-700'
                                                }`}
                                            >
                                                {location === 'rosario' ? product.stock_rosario : product.stock_escuinapa}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Stock Mínimo</p>
                                            <p className="text-lg font-semibold">
                                                {location === 'rosario'
                                                    ? product.min_stock_rosario
                                                    : product.min_stock_escuinapa}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-center">
                                        <label className="block text-sm font-medium">Ajuste de Inventario</label>
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => quickAdjustment(location, -10)}
                                                className="px-2 py-1 text-sm border rounded text-red-600 hover:bg-red-100"
                                            >
                                                <Minus className="h-6 w-6 inline-block" /> -10
                                            </button>
                                            <button
                                                onClick={() => quickAdjustment(location, -1)}
                                                className="px-2 py-1 text-sm border rounded text-red-600 hover:bg-red-100"
                                            >
                                                <Minus className="h-6 w-6 inline-block" /> -1
                                            </button>
                                            <input
                                                type="text"
                                                value={adjustments[location]}
                                                onChange={(e) => sanitizeInput(location, e.target.value)}
                                                onKeyDown={blockInvalidKeys}
                                                inputMode="numeric"
                                                placeholder="0"
                                                className={`w-24 text-center border rounded px-2 py-1 outline-none focus:ring-2 focus:ring-offset-1 ${
                                                    location === 'rosario' ? 'focus:ring-green-600' : 'focus:ring-blue-600'
                                                }`}
                                            />
                                            <button
                                                onClick={() => quickAdjustment(location, 1)}
                                                className="px-2 py-1 text-sm border rounded text-green-600 hover:bg-green-100"
                                            >
                                                <Plus className="h-6 w-6 inline-block" /> +1
                                            </button>
                                            <button
                                                onClick={() => quickAdjustment(location, 10)}
                                                className="px-2 py-1 text-sm border rounded text-green-600 hover:bg-green-100"
                                            >
                                                <Plus className="h-6 w-6 inline-block" /> +10
                                            </button>
                                        </div>

                                        <div className="text-center">
                                            <span className="text-sm text-gray-600">Stock nuevo:</span>{' '}
                                            <span
                                                className={`text-lg font-semibold ${
                                                    getNewStock(location) < getCurrentStock(location)
                                                        ? 'text-red-600'
                                                        : 'text-emerald-700'
                                                }`}
                                            >
                                                {getNewStock(location)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nota del ajuste
                                        </label>
                                        <textarea
                                            value={notes[location]}
                                            onChange={(e) =>
                                                setNotes((prev) => ({ ...prev, [location]: e.target.value }))
                                            }
                                            rows={2}
                                            placeholder="Motivo del ajuste"
                                            className={`w-full border border-gray-300 rounded p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                                                location === 'rosario' ? 'focus:ring-green-600' : 'focus:ring-blue-600'
                                            }`}
                                        />
                                    </div>

                                    <button
                                        onClick={() => handleAdjustment(location)}
                                        disabled={
                                            !adjustments[location] ||
                                            getAdj(location) === 0 ||
                                            !notes[location]?.trim() ||
                        /* no permitir resultado negativo */
                                            getNewStock(location) < 0
                                        }
                                        className={`w-full h-12 py-2 rounded text-white ${
                                            location === 'rosario'
                                                ? 'bg-green-600 hover:bg-green-800 disabled:bg-green-300'
                                                : 'bg-blue-600 hover:bg-blue-800 disabled:bg-blue-300'
                                        }`}
                                    >
                                        Aplicar Ajuste en {location === 'rosario' ? 'Rosario' : 'Escuinapa'}
                                    </button>
                                </div>
                            )
                    )}
                </div>

                <div className="flex justify-end px-6 py-4 shrink-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StockAdjustment;
