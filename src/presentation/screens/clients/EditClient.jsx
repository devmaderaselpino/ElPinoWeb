import { useState, useEffect } from "react"
import { useQuery, gql, useMutation } from '@apollo/client';
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { Trash } from "lucide-react";
import Loading from "../../components/shared/Loading";
import ErrorPage from "../../components/shared/ErrorPage";

const CLIENT_INFO = gql`
    query GetClient($idCliente: Int) {
        getClient(idCliente: $idCliente) {
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
        }
    }
`;

const COLONIAS_LIST = gql`
    query GetColonias($filter: Int) {
        getColonias(filter: $filter) {
            idColonia
            nombre
        }
    }
`;

const MUNICIPIOS_LIST = gql`
    query GetMunicipios {
        getMunicipios {
            idMunicipio
            nombre
        }
    }
`;

const UPDATE_CLIENT = gql`
    mutation UpdateClient($input: ClientInput) {
        updateClient(input: $input)
    }
`;

const EditClient = () => {

    const navigate = useNavigate();

    const {idCliente} = useParams();

    const [name, setName] = useState("");
    const [lastNameP, setLastNameP] = useState("");
    const [lastNameM, setLastNameM] = useState("");
    const [phone, setPhone] = useState("");
    const [image, setImage] = useState(null);
    const [municipio, setMunicipio] = useState(0);
    const [colonia, setColonia] = useState(0);
    const [street, setStreet] = useState("");
    const [number, setNumber] = useState("");
    const [distinguido, setDistinguido] = useState(0);
    const [description, setDescription] = useState("");

    const [errorName, setErrorName] = useState(false);
    const [errorLastNameP, setErrorLastNameP] = useState(false);
    const [errorLastNameM, setErrorLastNameM] = useState(false);
    const [errorPhone, setErrorPhone] = useState(false);
    const [errorPhoneT, setErrorPhoneT] = useState(false);
    const [errorMunicipio, setErrorMunicipio] = useState(false);
    const [errorColonia, setErrorColonia] = useState(false);
    const [errorStreet, setErrorStreet] = useState(false);
    const [errorNumber, setErrorNumber] = useState(false);
    const [errorFile, setErrorFile] = useState(false);
    const [errorDistinguido, setErrorDistinguido] = useState(false);
    const [errorDescription, setErrorDescription] = useState(false);

    const { loading: loadingClient, error: errorClient, data: dataClient } = useQuery(CLIENT_INFO, {
        variables: {
            idCliente: parseInt(idCliente)
        }
    });

    const { loading: loadingColonias, error: errorColonias, data: dataColonias } = useQuery(COLONIAS_LIST, {
        variables: {
            filter: parseInt(municipio)
        }, fetchPolicy: "network-only"
    });
    
    const { loading: loadingMunicipios, error: errorMunicipios, data: dataMunicipios } = useQuery(MUNICIPIOS_LIST, {fetchPolicy: "network-only"});

    const [updateCliente, { loading: loadingUpdate}] = useMutation(UPDATE_CLIENT);

    useEffect( () =>{
        if(dataClient){
            setName(dataClient.getClient.nombre);
            setLastNameP(dataClient.getClient.aPaterno);
            setLastNameM(dataClient.getClient.aMaterno);
            setPhone(dataClient.getClient.celular);
            setImage(dataClient.getClient.img_domicilio);
            setMunicipio(dataClient.getClient.municipio);
            setColonia(dataClient.getClient.colonia);
            setStreet(dataClient.getClient.calle);
            setNumber(dataClient.getClient.numero_ext);
            setDistinguido(dataClient.getClient.distinguido === 0 ? 2  : 1);
            setDescription(dataClient.getClient.descripcion);
        }
    },[dataClient])

    const handleSubmit = async (e) => {

        e.preventDefault();

        if(!name || !lastNameP || !lastNameM || !phone || phone.length < 10 || (municipio === 0 || municipio === "0") || (colonia === 0 || colonia === "0") || !street || !number || !image || (distinguido === 0 || distinguido === "0") || !description){
            
            validateInput(name, setErrorName);
            validateInput(lastNameP, setErrorLastNameP)
            validateInput(lastNameM, setErrorLastNameM)
            validatePhone(phone, setErrorPhone)
            validateInput(municipio, setErrorMunicipio)
            validateInput(colonia, setErrorColonia)
            validateInput(street, setErrorStreet)
            validateInput(number, setErrorNumber)
            validateInput(image, setErrorFile)
            validateInput(distinguido, setErrorDistinguido)
            validateInput(description, setErrorDescription)
            
            return;
        }

        try {
            const resp = await updateCliente({
                variables: {
                    input: {
                        idCliente: parseInt(idCliente),
                        aMaterno: lastNameM,
                        aPaterno: lastNameP,
                        calle: street,
                        celular: phone,
                        colonia: parseInt(colonia),
                        descripcion: description,
                        distinguido: parseInt(distinguido) === 2 ? 0 : 1,
                        img_domicilio: image,
                        municipio: parseInt(municipio),
                        nombre: name,
                        numero_ext: number 
                    }
                }
            })
     
            if(resp.data.updateClient === "Cliente actualizado"){
                Swal.fire({
                    title: "¡Cliente actualizado con éxito!",
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
            Swal.fire({
                title: "¡Ha ocurrido un error actualizando el cliente!",
                text: "Inténtelo más tarde.",
                icon: "error",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#922b21",
            });
        }

    }

    if(loadingColonias || loadingMunicipios || loadingUpdate || loadingClient){
        return (
            <div className="min-h-screen flex items-center justify-center flex-col">
                <h1 className="text-3xl font-bold text-gray-800 mb-5">Cargando</h1>
                <Loading variant="wave" size="lg" color="green" />
            </div>
        );
    }

    if( errorColonias || errorMunicipios || errorClient) {
        return  <ErrorPage message={"Inténtelo más tarde."}/>
    }

    const uploadImage = async (e) => {           
        try {
            const files = e.target.files            
            const data = new FormData()             
            
            data.append('file', files[0])           
            data.append('upload_preset',"elpinotumbado")  
            
            const response = await fetch(`https://api.cloudinary.com/v1_1/dqh6utbju/image/upload`, {
                method: 'POST',
                body: data
            });

            const file = await response.json();
            setErrorFile(false);     
            setImage(file.secure_url);              
        } catch (error) {
            console.error('Error uploading image:', error);
        }

    }

    const validateInput = (value, setError) => {
        if( !value || value === 0 || value === "0") {
            setError(true);
        }else{
            setError(false);
        }
    }

    const validatePhone = (value, setError) => {
        if( !value) {
            setError(true);
            setErrorPhoneT("Campo obligatorio.");
            return;
        }if( value.length < 10) {
            setError(true);
            setErrorPhoneT("Número inválido.")
            return;
        }
        else{
            setError(false);
        }
    }

    return (
        <>
            <div className="flex justify-center items-center flex-col w-full h-screen">
                <form onSubmit={handleSubmit} className="space-y-6 w-4/5 lg:rounded-lg lg:shadow-2xl md:rounded-lg md:shadow-2xl lg:p-10 md:p-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Edición de Cliente</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre(s)
                            </label>
                            <div className="flex flex-col">
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={name}
                                    onBlur={()=>{validateInput(name, setErrorName)}}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                                    placeholder="Nombre(s)"
                                />
                                {errorName ? <span className="text-red-700 text-sm mt-2">Campo obligatorio.</span> : null}
                            </div>
                        </div>   
                        <div>
                            <label htmlFor="dadLastName" className="block text-sm font-medium text-gray-700 mb-2">
                                Apellido Paterno
                            </label>
                            <div className="flex flex-col">    
                                <input
                                    type="text"
                                    id="dadLastName"
                                    name="dadLastName"
                                    value={lastNameP}
                                    onBlur={ () => {validateInput(lastNameP, setErrorLastNameP)} }
                                    onChange={(e) => setLastNameP(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                                    placeholder="Apellido Paterno"
                                />
                                {errorLastNameP ? <span className="text-red-700 text-sm mt-2">Campo obligatorio.</span> : null}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="momLastName" className="block text-sm font-medium text-gray-700 mb-2">
                                Apellido Materno
                            </label>
                            <div className="flex flex-col">
                                <input
                                    type="text"
                                    id="momLastName"
                                    name="momLastName"
                                    value={lastNameM}
                                    onBlur={ () => { validateInput(lastNameM, setErrorLastNameM) } }
                                    onChange={(e) => setLastNameM(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                                    placeholder="Apellido Materno"
                                />
                                {errorLastNameM ? <span className="text-red-700 text-sm mt-2">Campo obligatorio.</span> : null}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                Teléfono
                            </label>
                            <div className="flex flex-col">
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    maxLength={10}
                                    value={phone}
                                    onBlur={ () => { validatePhone(phone, setErrorPhone) } }
                                    onChange={(e) => {
                                        const onlyNums = e.target.value.replace(/\D/g, "");
                                        setPhone(onlyNums);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                                    placeholder="Teléfono"
                                />
                                {errorPhone ? <span className="text-red-700 text-sm mt-2">{errorPhoneT}</span> : null}
                            </div>
                        </div>
                        <div className="relative">
                            <label htmlFor="municipio" className="block text-sm font-medium text-gray-700 mb-2">
                                Municipio
                            </label>
                            <div className="flex flex-col">
                                <select
                                    value={municipio}
                                    onBlur={()=>{validateInput(municipio, setErrorMunicipio)}}
                                    onChange={(e) => setMunicipio(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm  focus:ring-2 focus:ring-green-600 focus:border-green-600"
                                >
                                    {dataMunicipios.getMunicipios.map((municipio) => (
                                        <option key={municipio.idMunicipio} value={municipio.idMunicipio}>
                                            {municipio.nombre === "Todos los municipios" ? "Seleccione un municipio" : municipio.nombre}
                                        </option>
                                    ))}
                                </select>
                                {errorMunicipio ? <span className="text-red-700 text-sm mt-2">Campo obligatorio.</span> : null}
                            </div>
                        </div>
                        <div className="relative">
                            <label htmlFor="colonia" className="block text-sm font-medium text-gray-700 mb-2">
                                Colonia
                            </label>
                            <div className="flex flex-col">
                                <select
                                    value={colonia}
                                    onChange={(e) => setColonia(e.target.value)}
                                    onBlur={()=>{validateInput(colonia, setErrorColonia)}}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-600 focus:border-green-600"
                                >
                                    {dataColonias.getColonias.map((colonia) => (
                                        <option key={colonia.idColonia} value={colonia.idColonia}>
                                            {colonia.nombre === "Todas las colonias" ? "Seleccione una colonia" : colonia.nombre}
                                        </option>
                                    ))}
                                </select>
                                {errorColonia ? <span className="text-red-700 text-sm mt-2">Campo obligatorio.</span> : null}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
                                Calle
                            </label>
                            <div className="flex flex-col">
                                <input
                                    type="text"
                                    id="street"
                                    name="street"
                                    value={street}
                                    onBlur={()=>{validateInput(street, setErrorStreet)}}
                                    onChange={(e) => setStreet(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                                    placeholder="Calle"
                                />
                                {errorStreet ? <span className="text-red-700 text-sm mt-2">Campo obligatorio.</span> : null}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                Número Exterior
                            </label>
                            <div className="flex flex-col">
                                <input
                                    type="text"
                                    id="number"
                                    name="number"
                                    value={number}
                                    onBlur={()=>{validateInput(number, setErrorNumber)}}
                                    onChange={(e) => setNumber(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                                    placeholder="Número exterior"
                                />
                                {errorNumber ? <span className="text-red-700 text-sm mt-2">Campo obligatorio.</span> : null}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                                Archivo
                            </label>
                            {!image ?  
                                <div className="flex flex-col">
                                    <input
                                        type="file"
                                        id="file"
                                        name="file"
                                        onBlur={()=>{validateInput(image, setErrorFile)}}
                                        onChange={uploadImage}
                                        className="w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 file:mr-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-white file:text-green-700 hover:file:bg-white"
                                    />
                                    {errorFile ? <span className="text-red-700 text-sm mt-2">Campo obligatorio.</span> : null}
                                </div>
                                :  
                                <div className="flex flex-row w-full justify-between">
                                    <button
                                        onClick={()=>{setImage("")}}
                                        className="bg-green-800 w-1/6 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 flex justify-center items-center"
                                    >
                                        <Trash className="h-4 w-4 text-white" />
                                    </button> 
                                    <div className="bg-green-800 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 flex justify-center">
                                        <span className="text-white w-full text-center">Imagen agregada.</span>
                                    </div>
                                </div>
                            }
                        </div>
                        <div className="relative">
                            <label htmlFor="municipio" className="block text-sm font-medium text-gray-700 mb-2">
                                Distinguido
                            </label>
                            <div className="flex flex-col">
                                <select
                                    value={distinguido}
                                    onBlur={()=>{validateInput(distinguido, setErrorDistinguido)}}
                                    onChange={(e) => setDistinguido(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm  focus:ring-2 focus:ring-green-600 focus:border-green-600"
                                >
                                    <option value={0}>Seleccione una opción</option>
                                    <option value={1}>Sí</option>
                                    <option value={2}>No</option>
                                </select>
                                {errorDistinguido ? <span className="text-red-700 text-sm mt-2">Campo obligatorio.</span> : null}
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            Descripción
                        </label>
                        <div className="flex flex-col">
                            <textarea
                                id="description"
                                name="description"
                                value={description}
                                onBlur={()=>{validateInput(description, setErrorDescription)}}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm resize-vertical focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                                placeholder="Ingrese una descripción..."
                            />
                            {errorDescription ? <span className="text-red-700 text-sm mt-2">Campo obligatorio.</span> : null}
                        </div>
                    </div>
                    <div>
                        <button
                            //onClick={handleSubmit}
                            type="submit"
                            className="w-full cursor-pointer bg-green-800 text-white py-2 px-4 rounded-md hover:bg-green-900 transition duration-200 font-medium"
                        >
                            Guardar cliente
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default EditClient;