import { useQuery, gql } from '@apollo/client';
import { useParams } from 'react-router-dom';
import Loading from '../../components/shared/Loading';
import ErrorPage from '../../components/shared/ErrorPage';
import formatPrice from '../../../functions/FormatPrice';
import { format, isAfter } from '@formkit/tempo';
import { isBefore } from 'date-fns';

const PAYMENT_TABLE = gql`
    query GetPaymentsBySale($idVenta: Int) {
        getPaymentsBySale(idVenta: $idVenta) {
            idAbonoProgramado
            num_pago
            cantidad
            abono
            interes
            abono_interes
            fecha_programada
            fecha_liquido
            pagado
        }
    }
`;

export default function PaymentTable() {

    const {idVenta} = useParams();
    
    const { loading, error, data } = useQuery(PAYMENT_TABLE, {
        variables: {
            idVenta: parseInt(idVenta)
        }, fetchPolicy:"network-only"
    });

    const getEstado = (pagado, fecha) => {
        
        if(pagado === 0 && isBefore(fecha, new Date())){
            return "Vencido";
        }

        return pagado === 0 ? "Pendiente" : "Completado"
    }

    const getEstadoColor = (pagado, fecha) => {

        if(pagado === 0 && isBefore(fecha, new Date())){
            return "text-red-600 bg-red-100";
        }

        return pagado === 0 ? "text-orange-600 bg-orange-100" : "text-green-600 bg-green-100"
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

    console.log(data);
    

    return (
        <div className="p-4 sm:p-6 max-w-8xl mx-auto">
            <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">Tabla de Pagos</h1>

            <div className="hidden md:block overflow-x-auto shadow-lg rounded-lg">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-gray-200">
                                No. Pago
                            </th>
                            <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-gray-200">
                                Cantidad
                            </th>
                            <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-gray-200">
                                Abono
                            </th>
                             <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-gray-200">
                                Interés
                            </th>
                            <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-gray-200">
                                Abono interés
                            </th>
                            <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-gray-200">
                                Fecha Programada
                            </th>
                            <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-gray-200">
                                Fecha de Líquido
                            </th>
                            <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-gray-200">
                                Estado
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.getPaymentsBySale.map((payment, index) => (
                            <tr key={payment.idAbonoProgramado} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {payment.num_pago}
                                </td>
                                <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatPrice(payment.cantidad)}
                                </td>
                                <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatPrice(payment.abono)}
                                </td>
                                <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatPrice(payment.interes)}
                                </td>
                                <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatPrice(payment.abono_interes)}
                                </td>
                                <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.fecha_programada}</td>
                                <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {payment.fecha_liquido}
                                </td>
                                <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(payment.pagado, payment.fecha_programada)}`}
                                    >
                                        {getEstado(payment.pagado, payment.fecha_programada)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        
            <div className="md:hidden space-y-4">
                {data.getPaymentsBySale.map((payment) => (
                    <div key={payment.idAbonoProgramado} className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-500">Pago #</span>
                                <span className="text-lg font-bold text-gray-900">{payment.num_pago}</span>
                            </div>
                            <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(payment.pagado)}`}
                            >
                                {getEstado(payment.pagado)}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <span className="text-gray-500 block">Cantidad:</span>
                                <span className="font-medium text-gray-900">{formatPrice(payment.cantidad)}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block">Abono:</span>
                                <span className="font-medium text-gray-900">{formatPrice(payment.abono)}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block">Interés:</span>
                                <span className="font-medium text-gray-900">{formatPrice(payment.interes)}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block">Abono interés:</span>
                                <span className="font-medium text-gray-900">{formatPrice(payment.abono_interes)}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block">F. Programada:</span>
                                <span className="font-medium text-gray-900">{payment.fecha_programada}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block">F. Líquido:</span>
                                <span className="font-medium text-gray-900">{payment.fecha_liquido || "N/A"}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
