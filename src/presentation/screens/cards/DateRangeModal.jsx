import React, { useEffect, useState } from "react";
import { CalendarDays, Calculator, X } from "lucide-react";

export const DateRangeModal = ({
    isOpen,
    onClose,
    cobrador,
    clientesAsignados,
    loading,
    errorMsg,
    abonos,
    onBuscarAbonos
}) => {
    const [fechaInicio, setFechaInicio] = useState("");
    const [horaInicio, setHoraInicio] = useState("00:00");
    const [fechaFin, setFechaFin] = useState("");
    const [horaFin, setHoraFin] = useState("23:59");
    const [mostrarResultados, setMostrarResultados] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFechaInicio("");
            setHoraInicio("00:00");
            setFechaFin("");
            setHoraFin("23:59");
            setMostrarResultados(false);
        }
    }, [isOpen]);

    const handleCalcular = () => {
        if (!fechaInicio || !horaInicio || !fechaFin || !horaFin) return;
        onBuscarAbonos && onBuscarAbonos(fechaInicio, horaInicio, fechaFin, horaFin);
        setMostrarResultados(true);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-auto backdrop-blur-sm bg-opacity-40" onClick={onClose}>
            <div className="relative p-6 sm:max-w-md bg-white mx-auto mt-10 rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-lg">
                            <CalendarDays className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="text-xl font-semibold">Sumar Abonos por Rango de Fecha</h2>
                    </div>
                    <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {cobrador && (
                    <div className="bg-white p-4 rounded-lg mb-6 border">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {cobrador.avatar || "?"}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">{cobrador.nombre}</p>
                                <p className="text-sm text-gray-500">
                                    {typeof clientesAsignados === "number" ? `${clientesAsignados} clientes` : "…"}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label htmlFor="fechaInicio" className="text-sm font-medium text-gray-700">Fecha de Inicio</label>
                                <input id="fechaInicio" type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className="mt-1 p-2 border rounded-lg w-full" />
                            </div>
                            <div>
                                <label htmlFor="horaInicio" className="text-sm font-medium text-gray-700">Hora de Inicio</label>
                                <input id="horaInicio" type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} className="mt-1 p-2 border rounded-lg w-full" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label htmlFor="fechaFin" className="text-sm font-medium text-gray-700">Fecha de Fin</label>
                                <input id="fechaFin" type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} className="mt-1 p-2 border rounded-lg w-full" />
                            </div>
                            <div>
                                <label htmlFor="horaFin" className="text-sm font-medium text-gray-700">Hora de Fin</label>
                                <input id="horaFin" type="time" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} className="mt-1 p-2 border rounded-lg w-full" />
                            </div>
                        </div>
                    </div>

                    {loading && <p className="text-sm text-gray-500">Calculando total…</p>}
                    {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

                    {mostrarResultados && (
                        <div className="rounded border mt-2">
                            <div className="flex items-center justify-between p-3 bg-gray-50">
                                <div className="text-sm text-gray-600">Total de abonos en rango</div>
                                <div className="text-lg font-semibold">
                                    ${Number(abonos || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                            </div>
                            <div className="p-3 text-xs text-gray-500">
                                Rango: {fechaInicio || "—"} {horaInicio || "--:--"}:00 a {fechaFin || "—"} {horaFin || "--:--"}:59
                            </div>
                        </div>
                    )}

                    <div className="flex space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 py-2 px-4 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 hover:text-gray-800" disabled={loading}>
                            <X className="h-4 w-4 mr-2" />
                            Cerrar
                        </button>
                        <button type="button" onClick={handleCalcular} className="flex-1 py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-600  text-white rounded-lg flex items-center justify-center" disabled={loading || !fechaInicio || !horaInicio || !fechaFin || !horaFin}>
                            <Calculator className="h-4 w-4 mr-2" />
                            Calcular Abonos
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
