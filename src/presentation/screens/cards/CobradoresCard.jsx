import React from "react";
import { CalendarDays, Users, Phone, MapPin, Clock } from "lucide-react";

export const CobradorCard = ({ cobrador, clientesAsignados, onSumarAbonos, onVerClientes }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300 group">
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {cobrador.avatar}
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {cobrador.nombre}
                        </h3>
                    </div>
                </div>
                <div className="text-right">
                    <div className="bg-blue-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        {clientesAsignados} clientes
                    </div>
                </div>
            </div>

            <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-3 text-gray-400" />
                    <span className="text-sm">{cobrador.telefono}</span>
                </div>
            </div>

            <div className="space-y-3">
                <button
                    onClick={onSumarAbonos}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:text-gray-800 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-lg py-3 flex items-center justify-center"
                >
                    <CalendarDays className="h-4 w-4 mr-2 transform group-hover:scale-110 transition-transform" />
                    Sumar Abonos por Fecha
                </button>

                <button
                    onClick={onVerClientes}
                    className="w-full border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 shadow-sm hover:shadow-md transition-all duration-200 rounded-lg py-3 flex items-center justify-center"
                >
                    <Users className="h-4 w-4 mr-2 transform group-hover:scale-110 transition-transform" />
                    Ver Lista de Clientes
                </button>
            </div>
        </div>
    );
};
