import { useState } from "react";
import { useQuery, gql } from '@apollo/client';
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/shared/Loading";
import ErrorPage from "../../components/shared/ErrorPage";
import formatPrice from "../../../functions/FormatPrice";

const SALE_INFO = gql`
    query GetTotalsBySale($idVenta: Int) {
        getTotalsBySale(idVenta: $idVenta) {
            nombre
            abono
            pendiente
        }
    }
`;

export default function PaymentForm() {

    const {idVenta} = useParams();
    
    const [paymentAmount, setPaymentAmount] = useState("");

    const { loading, error, data } = useQuery(SALE_INFO, {
        variables: {
            idVenta: parseInt(idVenta)
        }, fetchPolicy:"network-only"
    });

    const handleSubmit = (e) => {
        e.preventDefault()
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
            <div className="w-full max-w-4xl">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                
                    <div className="bg-gray-600 text-white px-6 py-4">
                        <h1 className="text-2xl font-bold">Abono de Compra</h1>
                    </div>

                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800 mb-3">Información del Cliente</h2>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-xl font-medium text-gray-900">{data.getTotalsBySale.nombre}</p>
                        </div>
                    </div>

                
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Detalles de la Deuda</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <p className="text-sm font-medium text-green-800">Total Pendiente</p>
                                <p className="text-2xl font-bold text-green-600">{formatPrice(data.getTotalsBySale.pendiente)}</p>
                            </div>

                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                <p className="text-sm font-medium text-orange-800">Cantidad a Abonar</p>
                                <p className="text-2xl font-bold text-orange-600">{formatPrice(data.getTotalsBySale.abono)}</p>
                            </div>

                            {/* <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 md:col-span-2">
                                <p className="text-sm font-medium text-yellow-800">Moratorio</p>
                                <p className="text-xl font-bold text-yellow-600">{formatCurrency(customerData.lateFee)}</p>
                            </div> */}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="px-6 py-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Procesar Abono</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                                    Cantidad a Pagar
                                </label>
                                <input
                                    type="text"
                                    id="amount"
                                    value={paymentAmount}
                                    onChange={(e) => {
                                        const onlyNums = e.target.value.replace(/\D/g, "");
                                        setPaymentAmount(onlyNums);
                                    }}
                                    placeholder="0.00"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-700 focus:border-green-700 text-lg"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 mt-6">
                            <button
                                type="submit"
                                disabled={!paymentAmount || Number.parseFloat(paymentAmount) <= 0}
                                className="flex-1 bg-green-700 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-800"
                            >
                                Aplicar Pago
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    )
}
