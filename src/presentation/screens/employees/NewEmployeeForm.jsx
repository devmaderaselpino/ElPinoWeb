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

export default function NewEmployeeForm() {

    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        nombres: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        telefono: "",
        municipio: 0,
        colonia: "",
        calle: "",
        numeroExterior: "",
        usuario: "",
        contrasena: "",
        puesto: "",
    });

    const [errors, setErrors] = useState({});

    const { loading: loadingColonias, error: errorColonias, data: dataColonias } = useQuery(COLONIAS_LIST, {
        variables: {
            filter: parseInt(formData.municipio)
        }, fetchPolicy: " no-cache"
    });
    
    const { loading: loadingMunicipios, error: errorMunicipios, data: dataMunicipios } = useQuery(MUNICIPIOS_LIST, {fetchPolicy: " no-cache"});

    const [insertEmployee, { loading: loadingInsert}] = useMutation(INSERT_EMPLOYEE);

     const handleChange = (e) => {
        const { name, value } = e.target
        
        if(name === "telefono"){
            const onlyNums = e.target.value.replace(/\D/g, "");
            setFormData({ ...formData, [name]: onlyNums })

        }else if(name === "municipio"){
            
            setFormData({ ...formData, [name]: value })
            
            setFormData(prev => ({
                ...prev,
                colonia: 0
            }));

        }else {
           setFormData({ ...formData, [name]: value })
        }

        if (errors[name]) {
            setErrors({ ...errors, [name]: "" })
        }
    }

    const validate = () => {
        const newErrors = {}
        if (!formData.nombres) newErrors.nombres = "El nombre es obligatorio."
        if (!formData.apellidoPaterno) newErrors.apellidoPaterno = "El apellido paterno es obligatorio."
        if (!formData.apellidoMaterno) newErrors.apellidoMaterno = "El apellido materno es obligatorio."
        if (!formData.telefono) newErrors.telefono = "El teléfono es obligatorio."
        if (formData.telefono.length < 10) newErrors.telefono = "El teléfono es inválido."
        if (!formData.municipio) newErrors.municipio = "El municipio es obligatorio."
        if (!formData.colonia) newErrors.colonia = "La colonia es obligatoria."
        if (!formData.calle) newErrors.calle = "La calle es obligatoria."
        if (!formData.numeroExterior) newErrors.numeroExterior = "El número exterior es obligatorio."
        if (!formData.usuario) newErrors.usuario = "El usuario es obligatorio."
        if (!formData.contrasena) newErrors.contrasena = "La contraseña es obligatoria."
        if (!formData.puesto) newErrors.puesto = "El puesto es obligatorio."
        return newErrors
    }

    const handleSubmit = async (e) => {
        
        e.preventDefault();

        const validationErrors = validate();
        
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
        } else {
            
            try {
                const resp = await insertEmployee({
                    variables: {
                        input: {
                            aMaterno: formData.apellidoMaterno,
                            aPaterno: formData.apellidoPaterno,
                            calle: formData.calle,
                            celular: formData.telefono,
                            colonia: parseInt(formData.colonia),
                            municipio: parseInt(formData.municipio),
                            nombre: formData.nombres,
                            numero_ext: formData.numeroExterior,
                            usuario: formData.usuario,
                            password: formData.contrasena,
                            tipo: parseInt(formData.puesto)  
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
    }

    if(loadingColonias || loadingMunicipios || loadingInsert){
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

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
                <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Registro de Empleado</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="nombres" className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre(s)
                            </label>
                            <input
                                type="text"
                                id="nombres"
                                name="nombres"
                                placeholder="Nombre(s)"
                                value={formData.nombres}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border ${errors.nombres ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                            />
                            {errors.nombres && <p className="text-red-500 text-sm mt-1">{errors.nombres}</p>}
                        </div>
                        <div>
                            <label htmlFor="apellidoPaterno" className="block text-sm font-medium text-gray-700 mb-1">
                                Apellido Paterno
                            </label>
                            <input
                                type="text"
                                id="apellidoPaterno"
                                name="apellidoPaterno"
                                placeholder="Apellido Paterno"
                                value={formData.apellidoPaterno}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border ${errors.apellidoPaterno ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                            />
                            {errors.apellidoPaterno && <p className="text-red-500 text-sm mt-1">{errors.apellidoPaterno}</p>}
                        </div>
                        <div>
                            <label htmlFor="apellidoMaterno" className="block text-sm font-medium text-gray-700 mb-1">
                                Apellido Materno
                            </label>
                            <input
                                type="text"
                                id="apellidoMaterno"
                                name="apellidoMaterno"
                                placeholder="Apellido Materno"
                                value={formData.apellidoMaterno}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border ${errors.apellidoMaterno ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                            />
                            {errors.apellidoMaterno && <p className="text-red-500 text-sm mt-1">{errors.apellidoMaterno}</p>}
                        </div>
                        <div>
                            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                                Teléfono
                            </label>
                            <input
                                type="tel"
                                id="telefono"
                                name="telefono"
                                maxLength={10}
                                placeholder="Teléfono"
                                value={formData.telefono}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border ${errors.telefono ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                            />
                            {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>}
                        </div>
                        <div>
                            <label htmlFor="municipio" className="block text-sm font-medium text-gray-700 mb-1">
                                Municipio
                            </label>
                            <div className="relative">
                                <select
                                    id="municipio"
                                    name="municipio"
                                    value={formData.municipio}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border ${errors.municipio ? "border-red-500" : "border-gray-300"} rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 pr-8`}
                                >
                                    {dataMunicipios.getMunicipios.map((municipio) => (
                                        <option key={municipio.idMunicipio} value={municipio.idMunicipio}>
                                            {municipio.nombre === "Todos los municipios" ? "Seleccione un municipio" : municipio.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {errors.municipio && <p className="text-red-500 text-sm mt-1">{errors.municipio}</p>}
                        </div>
                        <div>
                            <label htmlFor="colonia" className="block text-sm font-medium text-gray-700 mb-1">
                                Colonia
                            </label>
                            <div className="relative">
                                <select
                                    id="colonia"
                                    name="colonia"
                                    value={formData.colonia}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border ${errors.colonia ? "border-red-500" : "border-gray-300"} rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 pr-8`}
                                >
                                    {dataColonias.getColonias.map((colonia) => (
                                        <option key={colonia.idColonia} value={colonia.idColonia}>
                                            {colonia.nombre === "Todas las colonias" ? "Seleccione una colonia" : colonia.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {errors.colonia && <p className="text-red-500 text-sm mt-1">{errors.colonia}</p>}
                        </div>
                        <div>
                            <label htmlFor="calle" className="block text-sm font-medium text-gray-700 mb-1">
                                Calle
                            </label>
                            <input
                                type="text"
                                id="calle"
                                name="calle"
                                placeholder="Calle"
                                value={formData.calle}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border ${errors.calle ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                            />
                            {errors.calle && <p className="text-red-500 text-sm mt-1">{errors.calle}</p>}
                        </div>
                        <div>
                            <label htmlFor="numeroExterior" className="block text-sm font-medium text-gray-700 mb-1">
                                Número Exterior
                            </label>
                            <input
                                type="text"
                                id="numeroExterior"
                                name="numeroExterior"
                                placeholder="Número exterior"
                                value={formData.numeroExterior}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border ${errors.numeroExterior ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                            />
                            {errors.numeroExterior && <p className="text-red-500 text-sm mt-1">{errors.numeroExterior}</p>}
                        </div>
                        <div>
                            <label htmlFor="usuario" className="block text-sm font-medium text-gray-700 mb-1">
                                Usuario
                            </label>
                            <input
                                type="text"
                                id="usuario"
                                name="usuario"
                                placeholder="Usuario"
                                value={formData.usuario}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border ${errors.usuario ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                            />
                            {errors.usuario && <p className="text-red-500 text-sm mt-1">{errors.usuario}</p>}
                        </div>
                        <div>
                            <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700 mb-1">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                id="contrasena"
                                name="contrasena"
                                placeholder="Contraseña"
                                value={formData.contrasena}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border ${errors.contrasena ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                            />
                            {errors.contrasena && <p className="text-red-500 text-sm mt-1">{errors.contrasena}</p>}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="puesto" className="block text-sm font-medium text-gray-700 mb-1">
                            Puesto
                        </label>
                        <div className="relative">
                            <select
                                id="puesto"
                                name="puesto"
                                value={formData.puesto}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border ${errors.puesto ? "border-red-500" : "border-gray-300"} rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 pr-8`}
                            >
                                <option value={0}>Seleccione una opción</option>
                                <option value={1}>Administrador</option>
                                <option value={2}>Oficina</option>
                                <option value={3}>Cobrador</option>
                            </select>
                        </div>
                        {errors.puesto && <p className="text-red-500 text-sm mt-1">{errors.puesto}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-800 text-white py-3 rounded-md font-semibold hover:bg-green-900 transition-colors duration-200"
                    >
                        Guardar empleado
                    </button>
                </form>
            </div>
        </div>
    )
}
