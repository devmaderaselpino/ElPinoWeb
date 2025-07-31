import { useState } from "react";
import { useQuery, gql, useMutation } from '@apollo/client';
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/shared/Loading";
import ErrorPage from "../../components/shared/ErrorPage";
import formatPrice from "../../../functions/FormatPrice";
import Swal from "sweetalert2";

const SALE_INFO = gql`
    query GetTotalsBySale($idVenta: Int) {
        getTotalsBySale(idVenta: $idVenta) {
            nombre
            abono
            pendiente
            atrasado
            interes
        }
    }
`;

const INSERT_PAY = gql`
    mutation InsertPayment($abono: Float, $idVenta: Int, $saldo_anterior: Float, $saldo_nuevo: Float, $liquidado: Int) {
        insertPayment(abono: $abono, idVenta: $idVenta, saldo_anterior: $saldo_anterior, saldo_nuevo: $saldo_nuevo liquidado: $liquidado)
    }
`;

export default function PaymentForm() {
    
    const navigate = useNavigate();

    const {idVenta} = useParams();
    
    const [paymentAmount, setPaymentAmount] = useState("");
    
    const [errorAbono, setErrorAbono] = useState(false);

    const [insertPayment, { loading: loadingInsert }] = useMutation(INSERT_PAY);

    const { loading, error, data } = useQuery(SALE_INFO, {
        variables: {
            idVenta: parseInt(idVenta)
        }, fetchPolicy:"network-only"
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(paymentAmount, "-",  data.getTotalsBySale.pendiente);
        
        if(parseFloat(paymentAmount) > parseFloat(data.getTotalsBySale.pendiente.toFixed(2))){
            Swal.fire({
                title: "¡El abono no debe ser mayor al total!",
                text: "",
                icon: "warning",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#f39c12",
            });
            return;
        }

        try {
            const resp = await insertPayment({
                variables: {
                    idVenta: parseInt(idVenta),
                    abono: parseFloat(paymentAmount),
                    saldo_anterior: data.getTotalsBySale.pendiente,
                    saldo_nuevo: data.getTotalsBySale.pendiente - parseFloat(paymentAmount),
                    liquidado: parseFloat(paymentAmount) === (parseFloat(data.getTotalsBySale.pendiente.toFixed(2)) + parseFloat(data.getTotalsBySale.interes.toFixed(2))) ? 1 : 0
                }
            });

            console.log(resp);
            if(resp.data.insertPayment){

                Swal.fire({
                    title: "¡Abono realizado con éxito!",
                    text: "Serás redirigido a la tabla de pagos.",
                    icon: "success",
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#1e8449",
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate(`/TablaPagos/${idVenta}`);
                    }
                }); 
            }

        } catch (error) {
            
        }
    }

    const validateInput = (value, setError) => {
        if( !value || value === 0 || value === "0") {
            setError(true);
        }else{
            setError(false);
        }
    }

    if(loading || loadingInsert){
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
                        <h2 className="text-lg font-semibold text-gray-800 mb-3">Nombre del cliente</h2>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-xl font-medium text-gray-900">{data.getTotalsBySale.nombre}</p>
                        </div>
                    </div>

                
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Detalles de la Deuda</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <p className="text-sm font-medium text-green-800">Para liquidar</p>
                                <p className="text-2xl font-bold text-green-600">{formatPrice(data.getTotalsBySale.pendiente)}</p>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <p className="text-sm font-medium text-black">Saldo mensual</p>
                                <p className="text-2xl font-bold text-black">{formatPrice(data.getTotalsBySale.abono)}</p>
                            </div>
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                <p className="text-sm font-medium text-yellow-800">Saldo vencido</p>
                                <p className="text-xl font-bold text-yellow-600">{formatPrice(data.getTotalsBySale.atrasado)}</p>
                            </div>
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                <p className="text-sm font-medium text-yellow-800">Interés moratorio</p>
                                <p className="text-xl font-bold text-yellow-600">{formatPrice(data.getTotalsBySale.interes)}</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="px-6 py-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                                    Cantidad a Pagar
                                </label>
                                <input
                                    type="text"
                                    id="amount"
                                    value={paymentAmount}
                                    onBlur={ () => {validateInput(paymentAmount, setErrorAbono)} }
                                    onChange={(e) => {

                                        if (/^\d*\.?\d*$/.test(e.target.value)) {
                                            setPaymentAmount(e.target.value);
                                        }
                                        // const onlyNums = e.target.value.replace(/\D/g, "");
                                        // setPaymentAmount(onlyNums);
                                    }}
                                    placeholder="0.00"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-700 focus:border-green-700 text-lg"
                                />
                                {errorAbono ? <span className="text-red-700">Campo obligatorio.</span> : null}   
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
