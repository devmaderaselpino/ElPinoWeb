import { useState } from "react";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
const CustomTooltip = (props) => {
  const { active, payload, label } = props

  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 shadow-md rounded-md">
        <p className="font-medium text-gray-900">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }} className="text-sm">
            {entry.name}: ${entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function Home() {

    const salesData = [
        { day: "Lunes", lastWeek: 2400, currentWeek: 1300 },
        { day: "Martes", lastWeek: 1398, currentWeek: 2100 },
        { day: "Miércoles", lastWeek: 3800, currentWeek: 3500 },
        { day: "Jueves", lastWeek: 2908, currentWeek: 3908 },
        { day: "Viernes", lastWeek: 4800, currentWeek: 5200 },
        { day: "Sábado", lastWeek: 3800, currentWeek: 4300 },
        { day: "Domingo", lastWeek: 2400, currentWeek: 2900 },
    ]

    const lastWeekTotal = salesData.reduce((sum, item) => sum + item.lastWeek, 0)
    const currentWeekTotal = salesData.reduce((sum, item) => sum + item.currentWeek, 0)
    const percentChange = (((currentWeekTotal - lastWeekTotal) / lastWeekTotal) * 100).toFixed(1)
    
    const [data, setData] = useState({
        payments: {
            paid: 1500,
            pending: 400,
        },
        products: {
            totalItems: 48,
        },
    })

    const totalPayment = data.payments.paid + data.payments.pending

    return (

        <div className="w-full lg:pl-64 md:pl-64 mt-5">
            <h1 className="text-3xl text-gray-900 text-center mb-10 font-bold">Dashboard</h1>
            <div className="w-full flex justify-center mb-5">
                <div className="bg-white rounded-lg shadow-md w-8/10">
                    <div className="px-5 py-4 bg-gray-600">
                        <h2 className="text-white text-lg font-semibold">Rosario</h2>
                    </div>
                    <div className="p-5">
                        <div className="mb-6">
                            <div className="flex items-center mb-3">
                                <svg
                                className="w-5 h-5 mr-2 text-orange-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                                </svg>
                                <h3 className="font-medium text-gray-800">Pagos pendientes</h3>
                            </div>

                            <div className="space-y-2 pl-7">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Total de pagos:</span>
                                    <span className="font-semibold text-gray-600">3</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Cantidad:</span>
                                    <span className="font-semibold text-orange-600">${data.payments.pending.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 my-4"></div>

                        <div className="">
                            <div className="flex items-center mb-3">
                                <svg
                                className="w-5 h-5 mr-2 text-orange-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                                </svg>
                                <h3 className="font-medium text-gray-800">Productos pendientes</h3>
                            </div>

                            <div className="space-y-2 pl-7">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Total de productos:</span>
                                    <span className="font-semibold text-gray-600">3</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2  gap-6 mb-8 w-full p-10">
                <div className="">
                    <div className="flex flex-col space-y-1.5">
                        <h2 className="text-2xl font-bold tracking-tight">Gráfica de Ventas</h2>
                        <p className="text-sm text-gray-500 mb-5 mt-1">Comparación de ventas con la semana anterior.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                            <div className="text-sm font-medium text-gray-500">Semana anterior</div>
                            <div className="text-2xl font-bold">${lastWeekTotal.toLocaleString()}</div>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                            <div className="text-sm font-medium text-gray-500">Semana actual</div>
                            <div className="text-2xl font-bold">${currentWeekTotal.toLocaleString()}</div>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                            <div className="text-sm font-medium text-gray-500">Diferencia</div>
                            <div className={`text-2xl font-bold ${percentChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                                {percentChange >= 0 ? "+" : ""}
                                {percentChange}%
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-[300px] border border-gray-200 rounded-lg bg-white p-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={salesData}
                                margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#6b7280" }} />
                                <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#6b7280" }}
                                tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ paddingTop: "10px" }} />
                                <Bar dataKey="lastWeek" name="Semana anterior" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="currentWeek" name="Semana actual" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="">
                    <div className="flex flex-col space-y-1.5">
                        <h2 className="text-2xl font-bold tracking-tight">Gráfica de Ventas</h2>
                        <p className="text-sm text-gray-500 mb-5 mt-1">Comparación de ventas con la semana anterior.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                            <div className="text-sm font-medium text-gray-500">Semana anterior</div>
                            <div className="text-2xl font-bold">${lastWeekTotal.toLocaleString()}</div>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                            <div className="text-sm font-medium text-gray-500">Semana actual</div>
                            <div className="text-2xl font-bold">${currentWeekTotal.toLocaleString()}</div>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                            <div className="text-sm font-medium text-gray-500">Diferencia</div>
                            <div className={`text-2xl font-bold ${percentChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                                {percentChange >= 0 ? "+" : ""}
                                {percentChange}%
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-[300px] border border-gray-200 rounded-lg bg-white p-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={salesData}
                                margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#6b7280" }} />
                                <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#6b7280" }}
                                tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ paddingTop: "10px" }} />
                                <Bar dataKey="lastWeek" name="Semana anterior" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="currentWeek" name="Semana actual" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}
