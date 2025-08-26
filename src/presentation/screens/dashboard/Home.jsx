import { useEffect, useState } from "react";
import { useQuery, gql, useLazyQuery } from '@apollo/client';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, PieChart, Pie, Tooltip } from "recharts";
import Loading from "../../components/shared/Loading";
import ErrorPage from "../../components/shared/ErrorPage";
import { Warehouse, Banknote, HandCoins } from 'lucide-react';
import formatPrice from "../../../functions/FormatPrice";

const INVENTARIO_INFO = gql`
    query GetPendingInventory($tipo: Int) {
        getPendingInventory(tipo: $tipo) {
            name
            value
            color
            description
            productos
        }
    }
`;

const SALES_INFO = gql`
    query GetSalesAmount($tipo: Int) {
        getSalesAmount(tipo: $tipo) {
            month
            amount
            color
        }
    }
`;

const PAYMENT_INFO = gql`
    query GetPayments($tipo: Int) {
        getPayments(tipo: $tipo) {
            month
            amount
            color
        }
    }
`;

const CustomTooltip = ({ active, payload }) => {
    
    if (active && payload && payload.length) {

        return (
            <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                <span>{payload[0].name}: {payload[0].value}</span>
            </div>
        )
    }
  return null
}

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor={x > cx ? "start" : "end"}
            dominantBaseline="central"
            className="font-bold text-sm"
        >
            {`${(percent * 100).toFixed(1)}%`}
        </text>
    )
}

export default function Dashboard() {
  
    const [activeTab, setActiveTab] = useState(1);
    const [activeGraph, setActiveGraph] = useState(1);

    const { loading, data, error } = useQuery(INVENTARIO_INFO, 
        { 
            fetchPolicy:"no-cache", 
            variables:{
                tipo: activeTab
            }
        }
    );

    const { loading: loadingSales, data: dataSales, error: errorSales } = useQuery(SALES_INFO, 
        { 
            fetchPolicy:"no-cache", 
            variables:{
                tipo: activeTab
            }
        }
    );

    const { loading: loadingPayment, data: dataPayment, error: errorPayment } = useQuery(PAYMENT_INFO, 
        { 
            fetchPolicy:"no-cache", 
            variables:{
                tipo: activeTab
            }
        }
    );

    if(loading || loadingSales || loadingPayment){
        return (
            <div className="min-h-screen flex items-center justify-center flex-col">
                <h1 className="text-3xl font-bold text-gray-800 mb-5">Cargando</h1>
                <Loading variant="wave" size="lg" color="green" />
            </div>
        );
    }

    if(error || errorSales || errorPayment) {
        return <ErrorPage message={"Inténtelo más tarde."}/>
    }

    return (
        <div className="w-full  min-h-screen flex justify-center">
            <div className="w-full max-w-7xl mx-auto p-6 mt-10">
                <div className="flex items-center justify-center gap-4 mb-4">
                    <button className="p-3 bg-white rounded-full shadow-md" onClick={() => setActiveTab(1)}>
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className="bg-white px-8 py-4 rounded-xl text-center">
                        <h1 className="text-2xl font-bold text-gray-800">{ activeTab === 1 ? "Rosario" : "Escuinapa"}</h1>
                    </div>
                    <button className="p-3 bg-white rounded-full shadow-md" onClick={() => setActiveTab(2)}>
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
                <div className="bg-white mb-3 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-end">
                            <button
                                onClick={() => {
                                    setActiveGraph(1); 
                                }}
                                className={`w-full bg-white ${activeGraph === 1 ? "border-b-green-800" : "border-b-gray-300"} border-b-2 ${activeGraph === 1 ? "text-green-900" : "text-gray-500"} font-semibold py-3 px-6 flex items-center gap-2`}
                            >
                                <Warehouse size={20} />
                                Inventario
                            </button>
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={() => {
                                    setActiveGraph(2); 
                                }}
                                className={`w-full bg-white ${activeGraph === 2 ? "border-b-green-800" : "border-b-gray-300"} border-b-2 ${activeGraph === 2 ? "text-green-900" : "text-gray-500"} font-semibold py-3 px-6 flex items-center gap-2`}
                            >
                                <Banknote size={20} />
                                Ventas
                            </button>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={() => {
                                    setActiveGraph(3); 
                                }}
                                className={`w-full bg-white ${activeGraph === 3 ? "border-b-green-800" : "border-b-gray-300"} border-b-2 ${activeGraph === 3 ? "text-green-900" : "text-gray-500"} font-semibold py-3 px-6 flex items-center gap-2`}
                            >
                                <HandCoins size={20} />
                                Cobranza
                            </button>
                        </div>
                    </div>
                </div>
                {activeGraph ===  1  ? 
                    <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Estado del Inventario</h2>
                            <p className="text-gray-600">Distribución actual de productos en stock</p>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-8">
                        
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data.getPendingInventory}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={CustomLabel}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="value"
                                            strokeWidth={3}
                                            stroke="#ffffff"
                                        >
                                            {data.getPendingInventory.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="space-y-4  flex flex-col justify-center">
                                
                                {data.getPendingInventory.map((item, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                                <h5 className="font-semibold text-gray-800 text-sm">{item.name}</h5>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Cantidad:</span>
                                                <span className="font-medium">{item.productos}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                className="h-2 rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${(item.value / (data.getPendingInventory[0].value + data.getPendingInventory[1].value)) * 100}%`,
                                                    backgroundColor: item.color,
                                                }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                : 
                    null
                }
                {activeGraph ===  2 ? 
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Comparación de Ventas</h2>
                            <p className="text-gray-600">Total de ingresos entre meses</p>
                        </div>
                        <div className="grid lg:grid-cols-2 gap-8">
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={dataSales.getSalesAmount}
                                        margin={{
                                            top: 20,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                        barCategoryGap="40%"
                                    >
                                        <XAxis
                                            dataKey="month"
                                            tick={{ fontSize: 12, fill: "#374151", fontWeight: 500 }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 10, fill: "#6b7280" }}
                                            axisLine={false}
                                            tickLine={false}
                                            tickFormatter={formatPrice}
                                        />
                                        <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                                            {dataSales.getSalesAmount.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="space-y-4">
                                {dataSales.getSalesAmount.map((month, index) => (
                                    <div
                                        key={month.month}
                                        className={`p-4 rounded-lg border ${
                                        month.month === "Mes Actual" ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"
                                        }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h4 className="font-semibold text-gray-800">{month.month}</h4>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-bold" style={{ color: month.color }}>
                                                {formatPrice(month.amount)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div
                                className={`p-4 rounded-lg border-2 ${
                                    dataSales.getSalesAmount[0].amount <= dataSales.getSalesAmount[1].amount ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                                }`}
                                >
                                    <div className="">
                                        <h4 className="font-semibold text-gray-800 mb-2 text-center">Cambio Mensual</h4>
                                        <p className={`text-lg font-bold ${dataSales.getSalesAmount[0].amount <= dataSales.getSalesAmount[1].amount ? "text-green-600" : "text-red-600"} text-center`}>
                                            {dataSales.getSalesAmount[0].amount <= dataSales.getSalesAmount[1].amount ? "+" : ""}
                                            {formatPrice(dataSales.getSalesAmount[1].amount - dataSales.getSalesAmount[0].amount)} 
                                        </p>
                                        <p className={`text-lg font-bold ${dataSales.getSalesAmount[0].amount <= dataSales.getSalesAmount[1].amount ? "text-green-600" : "text-red-600"} text-center`}>
                                            ({dataSales.getSalesAmount[0].amount <= dataSales.getSalesAmount[1].amount ? "+" : ""}
                                                {dataSales.getSalesAmount[0].amount > 0 ?  (((dataSales.getSalesAmount[0].amount - dataSales.getSalesAmount[1].amount) / dataSales.getSalesAmount[0].amount) * 100).toFixed(2) : 0}%)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                : 
                    null
                }
                {activeGraph ===  3 ? 
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Comparación de Cobranza</h2>
                            <p className="text-gray-600">Total de cobranza entre meses</p>
                        </div>
                        <div className="grid lg:grid-cols-2 gap-8">
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={dataPayment.getPayments}
                                        margin={{
                                            top: 20,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                        barCategoryGap="40%"
                                    >
                                        <XAxis
                                            dataKey="month"
                                            tick={{ fontSize: 12, fill: "#374151", fontWeight: 500 }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 10, fill: "#6b7280" }}
                                            axisLine={false}
                                            tickLine={false}
                                            tickFormatter={formatPrice}
                                        />
                                        <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                                            {dataPayment.getPayments.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="space-y-4">
                                {dataPayment.getPayments.map((month, index) => (
                                    <div
                                        key={month.month}
                                        className={`p-4 rounded-lg border ${
                                        month.month === "Mes Actual" ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"
                                        }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h4 className="font-semibold text-gray-800">{month.month}</h4>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-bold" style={{ color: month.color }}>
                                                {formatPrice(month.amount)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div
                                className={`p-4 rounded-lg border-2 ${
                                    dataPayment.getPayments[0].amount <= dataPayment.getPayments[1].amount ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                                }`}
                                >
                                    <div className="">
                                        <h4 className="font-semibold text-gray-800 mb-2 text-center">Cambio Mensual</h4>
                                        <p className={`text-lg font-bold ${dataPayment.getPayments[0].amount <= dataPayment.getPayments[1].amount ? "text-green-600" : "text-red-600"} text-center`}>
                                            {dataPayment.getPayments[0].amount <= dataPayment.getPayments[1].amount ? "+" : ""}
                                            {formatPrice(dataPayment.getPayments[1].amount - dataPayment.getPayments[0].amount)} 
                                        </p>
                                        <p className={`text-lg font-bold ${dataPayment.getPayments[0].amount <= dataPayment.getPayments[1].amount ? "text-green-600" : "text-red-600"} text-center`}>
                                            ({dataPayment.getPayments[0].amount <= dataPayment.getPayments[1].amount ? "+" : ""}
                                                {dataPayment.getPayments[0].amount > 0 ?  (((dataPayment.getPayments[0].amount - dataPayment.getPayments[1].amount) / dataPayment.getPayments[0].amount) * 100).toFixed(2) : 0}%)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                : 
                    null
                }
            </div>
        </div>
    )
}
