import { useState, useEffect } from "react";
import React from "react";
import { useQuery, gql, useLazyQuery, useMutation } from '@apollo/client';
import Loading from "../../components/shared/Loading";
import ErrorPage from "../../components/shared/ErrorPage";
import { MapPinned, Filter, ArrowLeft, ArrowRight, Trash2 } from "lucide-react";
import formatPrice from "../../../functions/FormatPrice";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const INSERT_SALE = gql`
    mutation InsertSale($input: NewSale) {
        insertSale(input: $input)
    }
`;

const CLIENTS_LIST = gql`
    query GetClientsPaginated($input: PaginatedInput) {
        getClientsPaginated(input: $input) {
            total
            items {
                idCliente
                nombre
                aPaterno
                aMaterno
                municipio
                municipio_n
                colonia
                colonia_n
                calle
                numero_ext
                celular
                distinguido
                img_domicilio
                descripcion
                fecha_reg
                status
            }
        }
    }
`;

const CATEGORIES_LIST = gql`
    query GetCategories {
        getCategories {
            idCategoria
            descripcion
        }
    }
`;

const PRODUCT_LIST = gql`
    query GetProducts($categoria: Int, $municipio: Int) {
        getProducts(categoria: $categoria, municipio: $municipio) {
            idProducto
            descripcion
            precio
            img_producto
            stock
        }
     }
`;

export default function SellProcess() {

    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1)
    const [selectedClient, setSelectedClient] = useState("")
    const [cart, setCart] = useState([])
    const [paymentPlan, setPaymentPlan] = useState("")
    const [currentProductIndex, setCurrentProductIndex] = useState(0)
    const [clientSearch, setClientSearch] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [categoria, setCategoria] = useState(0);
    const [enganche,setEnganche] = useState(0);
    const [engancheMin,setEngancheMin] = useState(0);
    const [isPremium, setIsPremium] = useState(false);
    const [municipio, setMunicipio] = useState(1);
    const [nombre, setNombre] = useState("");

    const [insertVenta, { loadingInsert }] = useMutation(INSERT_SALE);

    const [loadClients, { data: dataClients, loading: loadingClients, error: errorClients }] = useLazyQuery(CLIENTS_LIST,  {fetchPolicy:"network-only"});

    const { loading: loadingCategories, error: errorCategories, data: dataCategories } = useQuery(CATEGORIES_LIST, {fetchPolicy:"network-only"});

    const { loading: loadingProducts, error: errorProducts, data: dataProducts } = useQuery(PRODUCT_LIST, {fetchPolicy:"network-only", 
        variables: {
            categoria: parseInt(categoria),
            municipio: municipio
        }
    });

    const fetchClients = async () => {
        
        loadClients({
            variables: {
                input: {
                    idMunicipio: 0,
                    idColonia: 0,
                    skip:0,
                    limit: 10,
                    searchName: clientSearch,
                },
            },
        });
    };

    useEffect(() => {
        loadClients({
            variables: {
                input: {
                    idMunicipio: 0,
                    idColonia: 0,
                    skip:0,
                    limit: 10,
                    searchName: clientSearch,
                },
            },
        });
    }, [dataClients]);

    React.useEffect(() => {
        setCurrentProductIndex(0)
    }, [selectedCategory])

    const addToCart = (product, quantity) => {
   
        const existingItem = cart.find((item) => item.idProducto === product.idProducto);
        
        const currentQuantity = existingItem ? existingItem.quantity : 0;
        const totalQuantity = currentQuantity + quantity;

        if (totalQuantity > product.stock) {
            Swal.fire({
                title: "¡No hay inventario suficiente del producto!",
                text: "",
                icon: "error",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#922b21",
            });
            return;
        }

        if (existingItem) {
            setCart(cart.map((item) =>
                item.idProducto === product.idProducto
                    ? { ...item, quantity: totalQuantity }
                    : item
            ));
        } else {
            setCart([...cart, { ...product, quantity }]);
        }
    };


    const removeFromCart = (productId) => {
        setCart(cart.filter((item) => item.idProducto !== productId))
    }

    const getTotalAmountContado = () => {
        return Math.ceil(cart.reduce((total, item) => total + item.precio * item.quantity, 0))
    }

    const getTotalAmount = () => {
        return Math.ceil(cart.reduce((total, item) => total + item.precio * item.quantity, 0) * 1.43)
    }

    const getMonthlyPayment = (months) => {
        if(months === 1){
            return formatPrice(getTotalAmountContado());
        }
        
        const total = Math.ceil((getTotalAmount() - enganche) / months)
        return formatPrice(total)
    }

    const nextStep = () => {
        if(currentStep === 2 && !isPremium ){
            const totalCompra = getTotalAmount();
            setEngancheMin(Math.ceil(totalCompra * .10));
            setEnganche(Math.ceil(totalCompra * .10));
        }
        if (currentStep < 4) {
            if(currentStep === 3 && paymentPlan === 1){
                setEnganche(0);
                setEngancheMin(0);
            }
            if(currentStep === 3 && !isPremium && (enganche < engancheMin)){
                Swal.fire({
                    title: "¡Debe cubrir el enganche mínimo!",
                    text: "",
                    icon: "warning",
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#f39c12",
                });
                return;
            }
            if(currentStep === 3 && (enganche > getTotalAmount())){
                Swal.fire({
                    title: "¡El enganche no debe ser mayor al total!",
                    text: "",
                    icon: "warning",
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#f39c12",
                });
                return;
            }
            setCurrentStep(currentStep + 1)
        }
    }

    const prevStep = () => {
        if(currentStep === 4 && !isPremium){
            const totalCompra = getTotalAmount();
            setEngancheMin(Math.ceil(totalCompra * .10));
            setEnganche(Math.ceil(totalCompra * .10));
        }   
        if (currentStep > 1){
            setCurrentStep(currentStep - 1);
            
        }
    }

    const handleSubmit = async () => {

        let tipoCompra = paymentPlan;

        if(paymentPlan === 6){
            tipoCompra = 2;
        }

        if(paymentPlan === 12){
            tipoCompra = 3;
        }

        const products = cart.map((product) => ({
            idProducto: product.idProducto,
            cantidad: product.quantity,
            precio: tipoCompra > 1 ? Math.ceil(product.precio * 1.43) : product.precio
        }));
        
        try {
            const resp = await insertVenta({
                variables: {
                    input: {
                        total:  tipoCompra === 1 ? getTotalAmountContado() : getTotalAmount(),
                        idCliente: selectedClient,
                        tipo: tipoCompra,
                        productos: products,
                        abono: parseFloat(enganche),
                        municipio
                    }
                }
            });

            if(resp.data.insertSale === "Venta realizada."){
                Swal.fire({
                    title: "Venta agregada con éxito!",
                    text: "Serás redirigido a la lista de clientes.",
                    icon: "success",
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#1e8449",
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate(`/ListaClientes`)
                    }
                }); 
            }
            
        } catch (error) {
            console.log(error);
                
        }
        
    }

    const canProceedStep1 = selectedClient !== ""
    const canProceedStep2 = cart.length > 0
    const canProceedStep3 = paymentPlan !== ""

    if(loadingClients || loadingCategories || loadingProducts || loadingInsert){
        return (
            <div className="min-h-screen flex items-center justify-center flex-col">
                <h1 className="text-3xl font-bold text-gray-800 mb-5">Cargando</h1>
                <Loading variant="wave" size="lg" color="green" />
            </div>
        );
    }

    if(errorClients || errorCategories || errorProducts) {
        
        return <ErrorPage message={"Inténtelo más tarde."}/>
    }

    return (
        <div className="max-w-7xl mx-auto h-screen bg-white p-6">
            <div className="mb-8">
                <div className="flex items-center w-full">
                    {[1, 2, 3, 4].map((step, index) => (
                        <React.Fragment key={step}>
                            <div className="flex flex-col items-center flex-1">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                                        currentStep >= step ? "bg-green-700" : "bg-gray-300"
                                    }`}
                                >
                                    {step}
                                </div>
                                <div className="mt-2 text-xs sm:text-sm text-gray-600 text-center">
                                    {step === 1 && "Cliente"}
                                    {step === 2 && "Productos"}
                                    {step === 3 && "Pago"}
                                    {step === 4 && "Resumen"}
                                </div>
                            </div>
                            {index < 3 && <div className={`h-1 flex-1 ${currentStep > step ? "bg-green-600" : "bg-gray-300"}`}></div>}
                        </React.Fragment>
                    ))}
                </div>
            </div>
            <div className="min-h-96">
                {currentStep === 1 && (
                    <div>
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Buscar cliente..."
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        fetchClients();
                                    }
                                }}
                                value={clientSearch}
                                onChange={(e) => setClientSearch(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {dataClients?.getClientsPaginated?.items?.map((client) => (
                                <div
                                    key={client.idCliente}
                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                        selectedClient === client.idCliente
                                        ? "border-green-500 bg-white"
                                        : "border-gray-200 hover:border-gray-300"
                                    }`}
                                    onClick={() => {
                                        setPaymentPlan("");
                                        setCart([]);
                                        setEngancheMin(0);
                                        setEnganche(0);
                                        setCurrentProductIndex(0);
                                        setSelectedClient(client.idCliente);
                                        setNombre(client.nombre + " " + client.aPaterno + " " + client.aMaterno);
                                        setMunicipio(client.municipio); 
                                        if(client.distinguido === 1){
                                            setIsPremium(true);
                                        }else{
                                            setIsPremium(false);
                                        }
                                    }}
                                >
                                    <h3 className="font-semibold text-lg">{client.nombre} {client.aPaterno} {client.aMaterno}</h3>
                                    <div className="w-full flex flex-row items-center">
                                        <MapPinned className="h-5 w-5 text-gray-400 mr-2" />
                                        <span>{client.municipio_n}, {client.colonia_n}, {client.calle} #{client.numero_ext}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {dataClients?.getClientsPaginated?.total?.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                No se encontraron clientes que coincidan con la búsqueda
                            </div>
                        )}
                    </div>
                )}

                {currentStep === 2 && (
                    <div>
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Filter size={20} className="text-gray-600" />
                                <h3 className="text-lg font-semibold text-gray-700">Filtros</h3>
                            </div>
                            <select
                                value={categoria}
                                onChange={(e) => {setCategoria(e.target.value); setCurrentProductIndex(0)}}
                                className="w-full md:w-auto pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                            >
                                {dataCategories.getCategories.map((category) => (
                                    <option key={category.idCategoria} value={category.idCategoria}>
                                        {category.descripcion}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="relative mb-6">
                            <div className="overflow-hidden">
                                <div
                                    className="flex transition-transform duration-300"
                                    style={{ transform: `translateX(-${currentProductIndex * 100}%)` }}
                                >
                                {dataProducts.getProducts.map((product) => (
                                    <div key={product.idProducto} className="w-full flex-shrink-0">
                                        <div className="p-6 rounded-lg text-center">
                                            <img
                                                src={product.img_producto || "/placeholder.svg"}
                                                alt={product.descripcion}
                                                className="w-48 h-48 mx-auto mb-4 object-cover rounded"
                                            />
                                            <h3 className="text-xl font-semibold mb-2">{product.descripcion}</h3>
                                            <p>Stock: {product.stock}</p>
                                            <p className="text-2xl font-bold text-green-600 mb-4">{formatPrice(product.precio)}</p>
                                            <ProductQuantitySelector product={product} onAddToCart={addToCart} />
                                        </div>
                                    </div>
                                ))}
                                </div>
                            </div>

                            <button
                                onClick={() => setCurrentProductIndex(Math.max(0, currentProductIndex - 1))}
                                disabled={currentProductIndex === 0}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md disabled:opacity-50"
                            >
                                <ArrowLeft className="h-5 w-5 text-gray-700" />
                            </button>
                            <button
                                onClick={() =>
                                    setCurrentProductIndex(Math.min(dataProducts.getProducts.length - 1, currentProductIndex + 1))
                                }
                                disabled={currentProductIndex === dataProducts.getProducts.length - 1}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md disabled:opacity-50"
                            >
                                <ArrowRight className="h-5 w-5 text-gray-700" />
                            </button>
                        </div>

                        {dataProducts.getProducts.length === 0 && (
                            <div className="text-center py-8 text-gray-500">No hay productos disponibles en esta categoría</div>
                        )}

                        {cart.length > 0 && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold mb-3">Productos en carrito:</h3>
                                
                                {cart.map((item) => (
                                    
                                    <div key={item.idProducto} className="flex justify-between items-center py-2 border-b">
                                        <span>
                                            {item.descripcion} x {item.quantity}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold">{formatPrice(item.precio * item.quantity)}</span>
                                            <button onClick={() => removeFromCart(item.idProducto)} className="text-red-500 hover:text-red-700">
                                                <Trash2 className="h-5 w-5 text-red-700" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <div className="pt-2 font-bold text-lg">Total: {formatPrice(getTotalAmount())}</div>
                            </div>
                        )}
                    </div>
                )}

                {currentStep === 3 && (
                    <div>
                        <div className="text-lg mb-6 font-bold">
                            Compra total: <span className="font-bold text-green-700">{paymentPlan !== 1 && paymentPlan ? formatPrice(getTotalAmount()) : formatPrice(getTotalAmountContado())}</span>
                        </div>
                        {paymentPlan !== 1 && paymentPlan? 
                            <div className="text-lg mb-6 font-bold">
                                Enganche mínimo: <span className="font-bold text-green-700">{formatPrice(engancheMin)}</span>
                            </div>
                        : null}
                        {paymentPlan !== 1 && paymentPlan !== ""? 
                            <div className="text-lg mb-6 font-bold">
                                Cantidad a financiar: <span className="font-bold text-green-700">{paymentPlan !== 1 && paymentPlan ? formatPrice(getTotalAmount() - enganche) : formatPrice(getTotalAmountContado() - enganche)}</span>
                            </div> 
                        : null}  
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div
                                className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                                paymentPlan === 1 ? "border-green-500 bg-white" : "border-gray-200 hover:border-gray-300"
                                }`}
                                onClick={() => {setPaymentPlan(1);}}
                            >
                                <h3 className="text-xl font-semibold mb-2">Contado</h3>
                                <p className="text-3xl font-bold text-green-600 mb-2">{getMonthlyPayment(1)}</p>
                            </div>
                            <div
                                className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                                paymentPlan === 6 ? "border-green-500 bg-white" : "border-gray-200 hover:border-gray-300"
                                }`}
                                onClick={() => {
                                    setPaymentPlan(6);
                                    
                                    if(!isPremium ){
                                        const totalCompra = getTotalAmount();
                                        setEnganche(Math.ceil(totalCompra * .10));
                                        setEngancheMin(Math.ceil(totalCompra * .10));
                                    }else{
                                        setEnganche(0);
                                    }
                                }}
                            >
                                <h3 className="text-xl font-semibold mb-2">6 Meses</h3>
                                <p className="text-3xl font-bold text-green-600 mb-2">{getMonthlyPayment(6)}/mes</p>
                            </div>
                            {getTotalAmountContado() > 3500 ? <div
                                className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                                paymentPlan === 12 ? "border-green-500 bg-white" : "border-gray-200 hover:border-gray-300"
                                }`}
                                onClick={() => {
                                    setPaymentPlan(12);
                                    
                                    if(!isPremium ){
                                        const totalCompra = getTotalAmount();
                                        setEnganche(Math.ceil(totalCompra * .10));
                                        setEngancheMin(Math.ceil(totalCompra * .10));
                                    }else{
                                        setEnganche(0);
                                    }
                                }}
                            >
                                <h3 className="text-xl font-semibold mb-2">12 Meses</h3>
                                <p className="text-3xl font-bold text-green-600 mb-2">{getMonthlyPayment(12)}/mes</p>
                            </div>: null}
                        
                        </div>
                        {paymentPlan !== 1 && paymentPlan !== ""? 
                            <div>
                                <label htmlFor="enganche" className="block text-sm font-medium text-gray-700 mt-3 mb-2">
                                    Enganche
                                </label>
                                <input
                                    type="text"
                                    id="enganche"
                                    name="enganche"
                                    value={enganche}
                                    onChange={(e) => {
                                        const onlyNums = e.target.value.replace(/\D/g, "");
                                        setEnganche(onlyNums);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                                    placeholder="Enganche"
                                />
                            </div> 
                        : null }
                    </div>
                )}

                {currentStep === 4 && (
                <div>
                    <h2 className="text-2xl font-bold mb-6">Resumen de Venta</h2>

                    <div className="bg-gray-50 p-6 rounded-lg">
                    
                        <div className="mb-6">
                            <h3 className="font-semibold text-lg mb-2">Cliente:</h3>
                            <p className="text-lg">{nombre}</p>
                        </div>

                        <div className="mb-6">
                            <h3 className="font-semibold text-lg mb-2">Productos:</h3>
                            {cart.map((item) => (
                                <div key={item.idProducto} className="flex justify-between py-2 border-b">
                                    <div>
                                        <span className="font-medium">{item.quantity} {item.descripcion}</span>
                                        <span className="text-gray-600 ml-2">({formatPrice(item.precio)} c/u)</span>
                                    </div>
                                    <span className="font-semibold">{formatPrice(item.precio * item.quantity)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4">
                            {paymentPlan !== 1 ? 
                                <div className="flex justify-between text-lg">
                                    <span>Plan de pago:</span>
                                    <span>{paymentPlan} meses</span>
                                </div>
                            : null}
                            {paymentPlan !== 1 ? 
                                <div className="flex justify-between text-lg text-green-600 font-semibold mb-3">
                                    <span>Pago mensual:</span>
                                    <span>{getMonthlyPayment(paymentPlan)}</span>
                                </div>
                            : null}
                            <div className="flex justify-between text-md font-bold mb-2">
                                <span>SubTotal:</span>
                                <span>{paymentPlan !== 1 && paymentPlan ?  formatPrice(getTotalAmount()) :  formatPrice(getTotalAmountContado())}</span>
                            </div>
                            <div className="flex justify-between text-md font-bold mb-2">
                                <span>Enganche:</span>
                                <span>{formatPrice(enganche)}</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold mb-2">
                                <span>Total:</span>
                                <span>{paymentPlan !== 1 && paymentPlan ? formatPrice(getTotalAmount() - enganche) : formatPrice(getTotalAmountContado())}</span>
                            </div>
                        </div>
                    </div>

                    <button onClick={handleSubmit} className="w-full mt-6 bg-green-700 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-green-800 transition-colors">
                        Confirmar Venta
                    </button>
                </div>
                )}
            </div>
            <div className="flex justify-between mt-8">
                <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-400 transition-colors"
                >
                    Anterior
                </button>

                {currentStep < 4 ? (
                    <button
                        onClick={nextStep}
                        disabled={
                            (currentStep === 1 && !canProceedStep1) ||
                            (currentStep === 2 && !canProceedStep2) ||
                            (currentStep === 3 && !canProceedStep3)
                        }
                        className="px-6 py-2 bg-green-700 text-white rounded-lg disabled:opacity-50 hover:bg-green-800 transition-colors"
                    >
                        Siguiente
                    </button>
                ) : null}
            </div>
        </div>
    )
}

function ProductQuantitySelector({ product, onAddToCart }) {
    const [quantity, setQuantity] = useState(1)

    const handleAddToCart = () => {
        onAddToCart(product, quantity)
        setQuantity(1)
    }

    return (
        <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                >
                    -
                </button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                    >
                +
                </button>
            </div>
            <button
                onClick={handleAddToCart}
                className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-colors"
            >
                Agregar al Carrito
            </button>
        </div>
    )
}
