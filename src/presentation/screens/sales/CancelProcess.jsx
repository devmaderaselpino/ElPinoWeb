import { useState } from "react";
import Swal from "sweetalert2";
import { useQuery, gql, useMutation } from '@apollo/client';
import { format } from "@formkit/tempo";
import {useParams } from "react-router-dom";
import { Trash, Minus } from "lucide-react";

import Loading from "../../components/shared/Loading";
import ErrorPage from "../../components/shared/ErrorPage";
import formatPrice from "../../../functions/FormatPrice";

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
                idProducto
                descripcion
                cantidad
                precio
                img_producto
            }
            getCancelados {
                id
                idProducto
                descripcion
                cantidad
                precio
                img_producto
            }
        }
    }
`;

const EDIT_SALE = gql`
    mutation EditSale($input: EditSale) {
        editSale(input: $input)
    }
`;

const INFO = gql`
    query GetPorcentajePagado($idVenta: Int) {
        getPorcentajePagado(idVenta: $idVenta) {
            nombre
            porcentaje_abonado
            abonos_total
        }
    }
`;

const CancelProcess = () => {

    const {idVenta} = useParams();

    const [motivo, setMotivo] = useState(0);

    const [saldo, setSaldo] = useState(0);

    const { loading, error, data, refetch } = useQuery(SALE, {
        variables: {
            idVenta: parseInt(idVenta)
        }, fetchPolicy:" no-cache"
    });

    const { loading: loadingP, error: errorP, data: dataP, refetch: refetchP } = useQuery(INFO, {
        variables: {
            idVenta: parseInt(idVenta)
        }, fetchPolicy:" no-cache"
    });

    const [editarVenta, { loadingInsert }] = useMutation(EDIT_SALE);

    const [cancellationArray, setCancellationArray] = useState([]);

    const calculateCancellationTotal = () => {
        return cancellationArray.reduce((total, item) => total + item.precio * item.cantidad, 0)
    }

    const removeFromCancellationArray = (productId) => {

        const existingIndex = cancellationArray.findIndex((item) => item.idProducto === productId)

        if (existingIndex !== -1) {
           
            const updatedArray = [...cancellationArray]

            if (updatedArray[existingIndex].cantidad === 1) {
                updatedArray.splice(existingIndex, 1)
                setCancellationArray(updatedArray)
            } else {
                updatedArray[existingIndex].cantidad -= 1
                setCancellationArray(updatedArray)
            
            }

        }
    }

    const addToCancellationArray = (productId, precio) => {
        const existingIndex = cancellationArray.findIndex((item) => item.idProducto === productId)

        if (existingIndex !== -1) {
        
        const updatedArray = [...cancellationArray]
        updatedArray[existingIndex].cantidad += 1
        setCancellationArray(updatedArray)

        } else {

            const newItem = {
                idProducto: productId,
                idVenta: parseInt(idVenta),
                precio: precio,
                cantidad: 1,
            }

            setCancellationArray((prev) => [...prev, newItem])
        }

    }

    const editSale = async (cancelaciones, historial) => {
        
        try {
            const resp = await editarVenta({
                variables: {
                    input: {
                        productos: cancelaciones,
                        historial,
                        idVenta: parseInt(idVenta),
                        totalCancelado: calculateCancellationTotal(),
                        opcion: parseInt(motivo),
                        saldo: parseInt(saldo) === 1 ? dataP.getPorcentajePagado.abonos_total : 0
                    }
                }
            })

            if(resp.data.editSale === "Modificación realizada."){
                setCancellationArray([]);
                Swal.fire({
                    title: "Venta editada con éxito!",
                    text: "Se han cancelado los productos",
                    icon: "success",
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#1e8449",
                }).then((result) => {
                    if (result.isConfirmed) {
                        refetch(),
                        refetchP()
                    }
                }); 
               
            }
            
        } catch (error) {
             Swal.fire({
                title: "Ocurrió un error!",
                text: "No se han podido cancelar los productos",
                icon: "error",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#1e8449",
            })
        }
    }

    const processCancellations = async () => {
 
        const mappedProducts = data.getSaleByClient.getProducts.map(product => ({
            idProducto: product.idProducto,
            idVenta: parseInt(idVenta),
            precio: product.precio,
            cantidad: product.cantidad,
        }));

        const totalCantidad = mappedProducts.reduce((acc, obj) => acc + obj.cantidad, 0);
        const totalCantidadCompra = cancellationArray.reduce((acc, obj) => acc + obj.cantidad, 0);

        if(motivo === 3 && (totalCantidadCompra - totalCantidad) === 0){
            
            Swal.fire({
                title: "No es posible cancelar todo en cancelación parcial.",
                text: "Seleccione otra opción o reduzca las cancelaciones.",
                icon: "warning",
                confirmButtonColor: "#1e8449",
                confirmButtonText: "Aceptar",
            })
            
            return;
        }
        
        if (cancellationArray.length === 0) {
            Swal.fire({
                title: "Sin cancelaciones",
                text: "No hay productos en el arreglo de cancelaciones",
                icon: "warning",
                confirmButtonText: "Entendido",
            })
            return
        }

        const totalAmount = calculateCancellationTotal()
        const confirmationHtml = `
        <div class="text-left">
            <p class="font-semibold mb-3">Productos a cancelar:</p>
            ${cancellationArray
            .map((item) => {
                console.log(item);
                const product = data.getSaleByClient.getProducts.find((p) => p.id === item.idProducto)
                console.log(product);
                
                return `
                <div class="mb-2 p-2 bg-gray-50 rounded">
                <p><strong>${product.descripcion}</strong></p>
                <p class="text-sm">Cancelar: ${item.cantidad} unidades | Total: ${formatPrice(item.precio * item.cantidad)}</p>
                </div>
            `
            })
            .join("")}
            <div class="mt-3 p-3 bg-red-50 rounded border-l-4 border-red-400">
                <p class="font-semibold text-red-800">Total a cancelar: ${formatPrice(totalAmount)}</p>
            </div>
        </div>
        `
        
        const result = await Swal.fire({
            title: "Confirmar Cancelaciones",
            html: confirmationHtml,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#1e8449",
            cancelButtonColor: "#f39c12",
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cancelar",
        })

        if (result.isConfirmed) {
            //setCancellationArray([]);
            editSale(cancellationArray, mappedProducts)
        }
    }

    const getCancellationQuantityForProduct = (productId) => {
        const item = cancellationArray.find((item) => item.idProducto === productId)
        return item ? item.cantidad : 0
    }

    const canAddMoreCancellations = (productId, productQuantity) => {
        const currentCancellations = getCancellationQuantityForProduct(productId)
        return currentCancellations < productQuantity
    }

    const canRemoveCancellations = (productId) => {
        const currentCancellations = getCancellationQuantityForProduct(productId)
        return currentCancellations > 0
    }

    const calculateTotal = (purchase) => {
        
        const total = purchase.getCancelados.reduce((accumulator, item) => {
            return accumulator + (item.cantidad * item.precio);
        }, 0);

        return total;
    };

    const handleChange = (e) => {
        const valor = Number(e.target.value);
        setMotivo(valor);

        const mappedProducts = data.getSaleByClient.getProducts.map(product => ({
            idProducto: product.id,
            idVenta: parseInt(idVenta),
            precio: product.precio,
            cantidad: product.cantidad,
        }));

        if (valor === 1) {
            
            setCancellationArray(mappedProducts);
            setSaldo(0);

        } else if (valor === 2) {
            setCancellationArray(mappedProducts);
        
        } else {
            setCancellationArray([]);
            setSaldo(0);
        } 
    };

    if(loading || loadingInsert || loadingP){
        return (
            <div className="min-h-screen flex items-center justify-center flex-col">
                <h1 className="text-3xl font-bold text-gray-800 mb-5">Cargando</h1>
                <Loading variant="wave" size="lg" color="green" />
            </div>
        );
    }

    if(error || errorP) {
        return <ErrorPage message={"Inténtelo más tarde."}/>
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
                <div className="text-center mb-8">
                    <div className="flex justify-center items-center space-x-3 mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Orden #{data.getSaleByClient.idVenta}</h1>
                            <p className="text-md text-gray-500 mt-3">{format(new Date(parseInt(data.getSaleByClient.fecha)), "YYYY-MM-DD HH:mm")}</p>
                        </div>
                    </div>
                    <span className="text-md text-gray-500">{dataP.getPorcentajePagado.nombre}</span>
                    <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 mt-3">
                        <span
                        className={`px-4 py-2 rounded-full text-sm font-medium ${
                            data.getSaleByClient.status === 1
                            ? "bg-yellow-100 text-yellow-800"
                            : data.getSaleByClient.status === 2
                                ? "bg-red-100 text-red-800"
                                : "bg-green-600 text-white"
                        }`}
                        >
                            {data.getSaleByClient.status === 1? "Pendiente" : data.getSaleByClient.status === 0 ? "Liquidada" : "Cancelada"}
                        </span>
                        <span className="text-3xl font-bold text-gray-800">{data.getSaleByClient.status === 2? formatPrice(calculateTotal(data.getSaleByClient)): formatPrice(data.getSaleByClient.total)}</span>
                    </div>
                </div>
                <div className="mb-8">
                    {data.getSaleByClient.status !== 2 ? 
                        <select
                            id="motivo"
                            name="motivo"
                            value={motivo}
                            onChange={handleChange}
                            className={`mb-6 w-full px-3 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 pr-8`}
                        >
                            <option value={0}>Seleccione el motivo</option>
                            <option value={1}>Cancelación total - Cliente moroso</option>
                            {dataP.getPorcentajePagado.porcentaje_abonado < 30 ? 
                                <>
                                    <option value={2}>Cancelación total - Cliente activo</option>
                                    <option value={3}>Cancelación parcial - Cliente activo</option>
                                </>
                            : null}
                        </select>
                        
                    : 
                        null
                    }
                    {dataP.getPorcentajePagado.abonos_total > 0 && motivo === 2 ? 
                        <select
                            id="saldo"
                            name="saldo"
                            value={saldo}
                            onChange={(e) => setSaldo(e.target.value)}
                            className={`mb-6 w-full px-3 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 pr-8`}
                        >
                            <option value={0}>¿Desea agregar saldo a favor?</option>
                            <option value={1}>Sí, guardar saldo a favor.</option>
                            <option value={2}>No, no tomar en cuenta.</option>
                        </select>
                    :  
                        null
                    }
                   
                    {motivo === 2 && dataP.getPorcentajePagado.abonos_total > 0 ? 
                        <div className="text-center">
                            <span className="text-md text-gray-500">Saldo a favor: {formatPrice(dataP.getPorcentajePagado.abonos_total)}</span>
                        </div>
                    : 
                        null
                    }

                    <h2 className="text-xl font-bold text-gray-800 text-center mb-6 mt-6">Productos</h2>

                    {data.getSaleByClient.status === 2 ? (
                        <div className="space-y-4 max-w-3xl mx-auto">
                            {data.getSaleByClient.getCancelados.map((product) => {
                                return (
                                    <div
                                        key={product.id}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4 sm:space-y-0"
                                    >
                                        <div className="flex items-center space-x-4 justify-center sm:justify-start">
                                            <img
                                                src={product.img_producto || "/placeholder.svg"}
                                                alt={product.descripcion}
                                                className="w-20 h-20 object-cover rounded-lg bg-gray-100 flex-shrink-0"
                                            />
                                            <div className="text-center sm:text-left">
                                                <h3 className="font-semibold text-gray-800 text-lg">{product.descripcion}</h3>
                                                <p className="text-gray-500">Cantidad: {product.cantidad}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center sm:justify-end space-x-6">
                                            <div className="text-center">
                                                <p className="font-bold text-gray-800 text-lg">{formatPrice(product.precio)}</p>
                                                <p className="text-sm text-gray-500">Unitario</p>
                                                <p className="text-sm font-semibold text-gray-700">
                                                    Total: {formatPrice(product.precio * product.cantidad)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="space-y-4 max-w-3xl mx-auto">
                            {data.getSaleByClient.getProducts.map((product) => {
                                const cancellationQuantity = getCancellationQuantityForProduct(product.id)
                                const canAddMore = canAddMoreCancellations(product.id, product.cantidad)
                                const canRemove = canRemoveCancellations(product.id)

                                return (
                                    <div
                                        key={product.id}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4 sm:space-y-0"
                                    >
                                        <div className="flex items-center space-x-4 justify-center sm:justify-start">
                                            <img
                                                src={product.img_producto || "/placeholder.svg"}
                                                alt={product.descripcion}
                                                className="w-20 h-20 object-cover rounded-lg bg-gray-100 flex-shrink-0"
                                            />
                                            <div className="text-center sm:text-left">
                                                <h3 className="font-semibold text-gray-800 text-lg">{product.descripcion}</h3>
                                                <p className="text-gray-500">Cantidad: {product.cantidad}</p>
                                                {cancellationQuantity > 0 && (
                                                    <p className="text-red-600 text-sm font-medium">
                                                        A cancelar: {cancellationQuantity} unidades
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center sm:justify-end space-x-6">
                                            <div className="text-center">
                                                <p className="font-bold text-gray-800 text-lg">{formatPrice(product.precio)}</p>
                                                <p className="text-sm text-gray-500">Unitario</p>
                                                <p className="text-sm font-semibold text-gray-700">
                                                Total: {formatPrice(product.precio * product.cantidad)}
                                                </p>
                                            </div>
                                            {motivo === 3 ? 
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => removeFromCancellationArray(product.id)}
                                                        disabled={!canRemove}
                                                        className={`p-3 rounded-lg transition-colors flex-shrink-0 ${
                                                            canRemove
                                                            ? "text-green-600 hover:bg-green-50"
                                                            : "text-gray-400 bg-gray-100 cursor-not-allowed"
                                                        }`}
                                                        title={canRemove ? "Regresar 1 unidad" : "No hay unidades para regresar"}
                                                        >
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                                            />
                                                        </svg>
                                                    </button>

                                                    <button
                                                        onClick={() => addToCancellationArray(product.id, product.precio)}
                                                        disabled={!canAddMore}
                                                        className={`p-3 rounded-lg transition-colors flex-shrink-0 ${
                                                        canAddMore ? "text-red-600 hover:bg-red-50" : "text-gray-400 bg-gray-100 cursor-not-allowed"
                                                        }`}
                                                        title={canAddMore ? "Agregar 1 unidad a cancelar" : "No se pueden cancelar más unidades"}
                                                    >
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                            : 
                                                null
                                            }
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
                
                {(
                    (cancellationArray.length > 0 && motivo !== 2) ||
                    (cancellationArray.length > 0 && motivo === 2 && parseInt(saldo) !== 0)
                )  && (
                    <div className="text-center mb-8">
                        <button
                        onClick={processCancellations}
                        className="inline-flex items-center space-x-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg font-medium mr-4"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span>Procesar cancelaciones</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CancelProcess
