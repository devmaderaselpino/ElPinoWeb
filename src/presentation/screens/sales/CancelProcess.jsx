import { useState } from "react";
import Swal from "sweetalert2";
import { useQuery, gql } from '@apollo/client';

import Loading from "../../components/shared/Loading";
import ErrorPage from "../../components/shared/ErrorPage";
import formatPrice from "../../../functions/FormatPrice";
import { format } from "@formkit/tempo";
import { useNavigate, useParams } from "react-router-dom";

const SALE = gql`
    query GetSaleByClient($idVenta: Int) {
        getSaleByClient(idVenta: $idVenta) {
            idVenta
            total
            fecha
            usuario_reg
            idCliente
            status
            tipo
            getProducts {
                id
                descripcion
                cantidad
                precio
                img_producto
            }
        }
    }
`;

const CancelProcess = () => {

    const navigate = useNavigate();

    const {idVenta} = useParams();


    const { loading, error, data } = useQuery(SALE, {
        variables: {
            idVenta: parseInt(idVenta)
        }, fetchPolicy:"network-only"
    });

    const [sale, setSale] = useState({
        id: 3,
        date: "22 de julio de 2025",
        status: "Pendiente",
        products: [
            {
                id: 1,
                name: "Ropero aquila",
                quantity: 3,
                unitPrice: 1200.0,
                image: "/placeholder.svg?height=60&width=60",
            },
            {
                id: 2,
                name: "Ropero cantabria",
                quantity: 1,
                unitPrice: 5431.76,
                image: "/placeholder.svg?height=60&width=60",
            },
        ],
    })

    const calculateTotal = () => {
        return sale.products.reduce((total, product) => total + product.unitPrice * product.quantity, 0)
    }

    const removeProduct = async (productId) => {
        console.log("Se retirarán: ", productId);
    }

    const cancelEntireSale = async () => {
        const totalAmount = calculateTotal()
        const result = await Swal.fire({
            title: "¿Cancelar venta completa?",
            html: `
                <div class="text-left">
                <p><strong>Orden:</strong> #${sale.id}</p>
                <p><strong>Fecha:</strong> ${sale.date}</p>
                <p><strong>Productos:</strong> ${sale.products.length}</p>
                <p><strong>Total a cancelar:</strong> ${formatCurrency(totalAmount)}</p>
                <br>
                <p class="text-red-600"><strong>⚠️ Esta acción no se puede deshacer</strong></p>
                </div>
            `,
            icon: "error",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, cancelar venta",
            cancelButtonText: "No cancelar",
            reverseButtons: true,
        })

        if (result.isConfirmed) {
            addLog(`Venta #${sale.id} cancelada completamente - Total: ${formatCurrency(totalAmount)}`)
            setSale((prev) => ({
                ...prev,
                status: "Cancelada",
                products: [],
            }))

            Swal.fire({
                title: "¡Venta cancelada!",
                text: `La venta #${sale.id} ha sido cancelada completamente`,
                icon: "success",
                confirmButtonText: "Entendido",
            })
        }
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
        }).format(amount)
    }

    if(loading){
        return (
            <div className="min-h-screen flex items-center justify-center flex-col">
                <h1 className="text-3xl font-bold text-gray-800 mb-5">Cargando</h1>
                <Loading variant="wave" size="lg" color="green" />
            </div>
        );
    }

    if(error) {
        return <ErrorPage message={"Inténtelo más tarde."}/>
    }

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white min-h-screen">
        
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 border-2 border-gray-400 rounded transform rotate-45"></div>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800">Orden #{data.getSaleByClient.idVenta}</h1>
                        <p className="text-sm text-gray-500">{format(new Date(parseInt(data.getSaleByClient.fecha)), "YYYY-MM-DD HH:mm")}</p>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <span
                        className={`px-3 py-1 rounded-full text-sm font-medium text-center bg-yellow-100 text-yellow-800`}
                    >
                       Pendiente
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-gray-800 text-center sm:text-right">
                        {formatPrice(data.getSaleByClient.total)}
                    </span>
                </div>
            </div>

            <div className="mb-6">
                <button
                    onClick={cancelEntireSale}
                    disabled={sale.status === "Cancelada" || sale.products.length === 0}
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Cancelar Venta</span>
                </button>
            </div>

            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Productos</h2>

                {sale.products.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>No hay productos en esta venta</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {data.getSaleByClient.getProducts.map((product) => (
                            <div
                                key={product.id}
                                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-200 rounded-lg space-y-4 sm:space-y-0"
                            >
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={product.img_producto || "/placeholder.svg"}
                                        alt={product.descripcion}
                                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg bg-gray-100 flex-shrink-0"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-800 text-sm sm:text-base">{product.descripcion}</h3>
                                        <p className="text-sm text-gray-500">Cantidad: {product.cantidad}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end space-x-4">
                                    <div className="text-left sm:text-right">
                                        <p className="font-semibold text-gray-800 text-sm sm:text-base">
                                            {formatPrice(product.precio)}
                                        </p>
                                        <p className="text-xs sm:text-sm text-gray-500">Unitario</p>
                                        <p className="text-sm font-medium text-gray-700">
                                            Total: {formatPrice(product.precio * product.cantidad)}
                                        </p>
                                    </div>
                                {product.cantidad > 1 ? (
                                    <button
                                        onClick={() => removeProduct(product.id)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0"
                                        title="Reducir cantidad"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                        </svg>
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => removeProduct(product.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                                        title="Eliminar producto"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                    </button>
                                )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default CancelProcess;
