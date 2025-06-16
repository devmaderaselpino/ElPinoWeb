import { useState } from "react"
import { useQuery, gql, useMutation } from '@apollo/client';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/shared/Loading";
import ErrorPage from "../../components/shared/ErrorPage";

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

const INSERT_EMPLOYEE = gql`
    mutation InsertEmployee($input: UserInput) {
        insertEmployee(input: $input)
    }
`;

const NewEmployeeForm = () => {

    const navigate = useNavigate();
    
    const [name, setName] = useState("");
    const [lastNameP, setLastNameP] = useState("");
    const [lastNameM, setLastNameM] = useState("");
    const [phone, setPhone] = useState("");
    const [municipio, setMunicipio] = useState(0);
    const [colonia, setColonia] = useState(0);
    const [street, setStreet] = useState("");
    const [number, setNumber] = useState("");
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [type, setType] = useState(0);

    const [errorName, setErrorName] = useState(false);
    const [errorLastNameP, setErrorLastNameP] = useState(false);
    const [errorLastNameM, setErrorLastNameM] = useState(false);
    const [errorPhone, setErrorPhone] = useState(false);
    const [errorPhoneT, setErrorPhoneT] = useState(false);
    const [errorMunicipio, setErrorMunicipio] = useState(false);
    const [errorColonia, setErrorColonia] = useState(false);
    const [errorStreet, setErrorStreet] = useState(false);
    const [errorNumber, setErrorNumber] = useState(false);
    const [errorType, setErrorType] = useState(false);
    const [errorUser, setErrorUser] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);

    const { loading: loadingColonias, error: errorColonias, data: dataColonias } = useQuery(COLONIAS_LIST, {
        variables: {
            filter: parseInt(municipio)
        }, fetchPolicy: "network-only"
    });
    
    const { loading: loadingMunicipios, error: errorMunicipios, data: dataMunicipios } = useQuery(MUNICIPIOS_LIST, {fetchPolicy: "network-only"});

    const [insertEmployee, { loading: loadingInsert}] = useMutation(INSERT_EMPLOYEE);

    const handleSubmit = async (e) => {

        e.preventDefault();

        if(!name || !lastNameP || !lastNameM || !phone || phone.length < 10 || (municipio === 0 || municipio === "0") || (colonia === 0 || colonia === "0") || !street || !number || (type === 0 || type === "0") || !user || !password ){
            
            validateInput(name, setErrorName);
            validateInput(lastNameP, setErrorLastNameP);
            validateInput(lastNameM, setErrorLastNameM);
            validatePhone(phone, setErrorPhone);
            validateInput(municipio, setErrorMunicipio);
            validateInput(colonia, setErrorColonia);
            validateInput(street, setErrorStreet);
            validateInput(number, setErrorNumber);
            validateInput(password, setErrorPassword);
            validateInput(user, setErrorUser);
            validateInput(type, setErrorType);

            return;
        }

        try {
            const resp = await insertEmployee({
                variables: {
                    input: {
                        aMaterno: lastNameM,
                        aPaterno: lastNameP,
                        calle: street,
                        celular: phone,
                        colonia: parseInt(colonia),
                        municipio: parseInt(municipio),
                        nombre: name,
                        numero_ext: number,
                        usuario: user,
                        password,
                        tipo: parseInt(type)  
                    }
                }
            })
     
            if(resp.data.insertEmployee ===  "Empleado insertado"){

                Swal.fire({
                    title: "Empleado agregado con éxito!",
                    text: "Serás redirigido a la lista de empleados.",
                    icon: "success",
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#1e8449",
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate(`/ListaEmpleados`)
                    }
                }); 

            }

        } catch (error) {

            Swal.fire({
                title: "¡Ha ocurrido un error agregando al empleado!",
                text: "Inténtelo más tarde.",
                icon: "error",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#922b21",
            }); 
        }

    }

    if(loadingColonias || loadingMunicipios || loadingInsert ){
        return (
            <div className="min-h-screen flex items-center justify-center flex-col">
                <h1 className="text-3xl font-bold text-gray-800 mb-5">Cargando</h1>
                <Loading variant="wave" size="lg" color="green" />
            </div>
        );
    }

    if( errorColonias || errorMunicipios) {
        return  <ErrorPage message={"Inténtelo más tarde."}/>
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
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Registro de Empleado</h2>
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
                            <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
                                Usuario
                            </label>
                            <div className="flex flex-col">
                                <input
                                    type="text"
                                    id="user"
                                    name="user"
                                    value={user}
                                    onBlur={()=>{validateInput(user, setErrorUser)}}
                                    onChange={(e) => setUser(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                                    placeholder="Usuario"
                                />
                                {errorUser ? <span className="text-red-700 text-sm mt-2">Campo obligatorio.</span> : null}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                Contraseña
                            </label>
                            <div className="flex flex-col">
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    onBlur={()=>{validateInput(password, setErrorPassword)}}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                                    placeholder="Contraseña"
                                />
                                {errorPassword ? <span className="text-red-700 text-sm mt-2">Campo obligatorio.</span> : null}
                            </div>
                        </div>
                        <div className="relative">
                            <label htmlFor="municipio" className="block text-sm font-medium text-gray-700 mb-2">
                                Puesto
                            </label>
                            <div className="flex flex-col">
                                <select
                                    value={type}
                                    onBlur={()=>{validateInput(type, setErrorType)}}
                                    onChange={(e) => setType(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm  focus:ring-2 focus:ring-green-600 focus:border-green-600"
                                >
                                    <option value={0}>Seleccione una opción</option>
                                    <option value={1}>Administrador</option>
                                    <option value={2}>Oficina</option>
                                    <option value={3}>Cobrador</option>
                                </select>
                                {errorType ? <span className="text-red-700 text-sm mt-2">Campo obligatorio.</span> : null}
                            </div>
                        </div>
                    </div>
                    <div>
                        <button
                            //onClick={handleSubmit}
                            type="submit"
                            className="w-full cursor-pointer bg-green-800 text-white py-2 px-4 rounded-md hover:bg-green-900 transition duration-200 font-medium"
                        >
                            Guardar empleado
                        </button>
                    </div>
                </form>
            </div>  
        </>
    )
}

export default NewEmployeeForm;
