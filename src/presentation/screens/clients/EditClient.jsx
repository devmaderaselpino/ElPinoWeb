import { useState, useEffect } from "react";
import { useQuery, gql, useMutation } from '@apollo/client';
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/shared/Loading";
import ErrorPage from "../../components/shared/ErrorPage";
import { Trash } from "lucide-react";

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
            url
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

const SAVE_ARCHIVO_CLIENTE = gql`
    mutation UpdateArchivo($idCliente: Int!, $archivo: String!) {
        updateArchivoCliente(idCliente: $idCliente, archivo: $archivo) {
            id
            archivo
        }
    }
`;

export default function EditClient() {

    const navigate = useNavigate();

    const {idCliente} = useParams();

    const [formData, setFormData] = useState({
        nombres: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        telefono: "",
        municipio: 0,
        colonia: "",
        calle: "",
        numeroExterior: "",
        archivo: null,
        distinguido: "",
        descripcion: ""
    })

    const [pdfFile, setPdfFile] = useState(null);
    const [namePDF, setNamePDF] = useState("");
    const [pdfUploading, setPdfUploading] = useState(false);

    const [errors, setErrors] = useState({});
    const [fileName, setFileName] = useState("");

    const { loading: loadingClient, error: errorClient, data: dataClient } = useQuery(CLIENT_INFO, {
        variables: {
            idCliente: parseInt(idCliente)
        }, fetchPolicy:"no-cache"
    });

    const { loading: loadingColonias, error: errorColonias, data: dataColonias } = useQuery(COLONIAS_LIST, {
        variables: {
            filter: parseInt(formData.municipio)
        }, fetchPolicy: "no-cache"
    });
    
    const { loading: loadingMunicipios, error: errorMunicipios, data: dataMunicipios } = useQuery(MUNICIPIOS_LIST, {fetchPolicy: "no-cache"});

    const [updateCliente, { loading: loadingUpdate}] = useMutation(UPDATE_CLIENT);

    const [saveArchivoCliente] = useMutation(SAVE_ARCHIVO_CLIENTE);

    useEffect( () =>{
        if(dataClient){
            const datosActualizados = {
                nombres: dataClient.getClient.nombre,
                apellidoPaterno: dataClient.getClient.aPaterno,
                apellidoMaterno: dataClient.getClient.aMaterno,
                telefono: dataClient.getClient.celular,
                municipio: dataClient.getClient.municipio,
                colonia: dataClient.getClient.colonia,
                calle: dataClient.getClient.calle,
                numeroExterior: dataClient.getClient.numero_ext,
                distinguido: dataClient.getClient.distinguido === 0 ? 2 : 1,
                descripcion: dataClient.getClient.descripcion,
                archivo: dataClient.getClient.img_domicilio || null
            };

            setNamePDF(dataClient.getClient.url)

            setFormData(datosActualizados)
        }
    },[dataClient])

    const onPdfChange = (e) => {
        const f = e.target.files?.[0];
        if (!f) return;

        if (f.type !== "application/pdf") {
            Swal.fire("Archivo inválido", "Solo PDFs, porfa.", "warning");
            return;
        }

        const MAX = 15 * 1024 * 1024;
        if (f.size > MAX) {
           
            Swal.fire("Archivo muy grande", "Máximo 15 MB.", "warning");
            return;
        }

        setPdfFile(f);
        setNamePDF(f.name);
        
    };

    const uploadPdfToR2AndSave = async (idCli) => {
        if (!pdfFile) return;

        setPdfUploading(true);
        
        try {
            const fd = new FormData();
                fd.append("file", pdfFile);
                const r = await fetch("https://backendelpino-production-713d.up.railway.app/upload/pdf", {
                method: "POST",
                body: fd,
            });

            if (!r.ok) {
                const t = await r.text();
                throw new Error(`Backend upload failed: ${t}`);
            }

            const { key } = await r.json();

            await saveArchivoCliente({
                variables: { idCliente: parseInt(idCli), archivo: key },
            });
        } finally {
            setPdfUploading(false);
        }
    };

    const handleChange = async (e) => {
        const { name, value, files } = e.target

        if (name === "archivo" && files) {
            setFormData({ ...formData, [name]: files[0] })
            setFileName(files[0] ? files[0].name : "")        

        }else if(name === "telefono"){
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
        if (!formData.distinguido) newErrors.distinguido = "Debe seleccionar una opción."
        return newErrors
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
        } else {
            try {
                
                let archivoN = dataClient.getClient.img_domicilio;

                if(pdfFile){
                    await uploadPdfToR2AndSave(parseInt(idCliente));
                }

                if(fileName){
                    const data = new FormData()             
                    
                    data.append('file', formData.archivo)           
                    data.append('upload_preset',"elpino")  
                    
                    const response = await fetch(`https://api.cloudinary.com/v1_1/dv1kiff9a/image/upload`, {
                        method: 'POST',
                        body: data
                    });

                    const file = await response.json();

                    archivoN = file.secure_url;
                }

                const resp = await updateCliente({
                    variables: {
                        input: {                
                            idCliente: parseInt(idCliente),
                            aMaterno: formData.apellidoMaterno,
                            aPaterno: formData.apellidoPaterno,
                            calle: formData.calle,
                            celular: formData.telefono,
                            colonia: parseInt(formData.colonia),
                            descripcion: formData.descripcion,
                            distinguido: parseInt(formData.distinguido) === 2 ? 0 : 1,
                            img_domicilio: archivoN,
                            municipio: parseInt(formData.municipio),
                            nombre: formData.nombres,
                            numero_ext: formData.numeroExterior     
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
                console.log(error);
                
                Swal.fire({
                    title: "¡Ha ocurrido un error agregando al cliente!",
                    text: "Inténtelo más tarde.",
                    icon: "error",
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#922b21",
                }); 
            }
        }
    }

    if(loadingColonias || loadingMunicipios || loadingClient || loadingUpdate){
        return (
            <div className="min-h-screen flex items-center justify-center flex-col">
                <h1 className="text-3xl font-bold text-gray-800 mb-5">Cargando</h1>
                <Loading variant="wave" size="lg" color="green" />
            </div>
        );
    }

    if( errorColonias || errorMunicipios || errorClient ) {
        return  <ErrorPage message={"Inténtelo más tarde."}/>
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
                <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Editar Cliente</h2>
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
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="filePdf" className="block text-sm font-medium text-gray-700 mb-2">
                                Img domicilio
                            </label>
                            {!formData.archivo ? (
                                <div className="flex flex-col">
                                    <input
                                        type="file"
                                        id="archivo"
                                        name="archivo"
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 file:mr-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-white file:text-green-700 hover:file:bg-white"
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormData(prev => ({
                                                ...prev,
                                                archivo: ""
                                            }));
                                        }}
                                        className="bg-green-800 px-3 py-2 rounded-md text-white w-full"
                                    >
                                        <Trash className="h-4 w-4 text-white inline mr-1" />
                                        Eliminar imagen
                                    </button>
                                </div>
                            )}
                        </div>
                        <div>
                            <label htmlFor="filePdf" className="block text-sm font-medium text-gray-700 mb-2">
                                Documento
                            </label>
                            {!namePDF ? (
                                <div className="flex flex-col">
                                    <input
                                        type="file"
                                        id="filePdf"
                                        name="filePdf"
                                        accept="application/pdf"
                                        onChange={onPdfChange}
                                        className="w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 file:mr-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-white file:text-green-700 hover:file:bg-white"
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setNamePDF("")}
                                        className="bg-green-800 px-3 py-2 rounded-md text-white w-full"
                                    >
                                        <Trash className="h-4 w-4 text-white inline mr-1" />
                                        Eliminar PDF
                                    </button>
                                    {pdfUploading && <span className="text-xs text-gray-500">Subiendo…</span>}
                                </div>
                            )}
                        </div>
                        <div>
                            <label htmlFor="distinguido" className="block text-sm font-medium text-gray-700 mb-1">
                                Distinguido
                            </label>
                            <div className="relative">
                                <select
                                    id="distinguido"
                                    name="distinguido"
                                    value={formData.distinguido}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border ${errors.distinguido ? "border-red-500" : "border-gray-300"} rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 pr-8`}
                                >
                                    <option value="">Seleccione una opción</option>
                                    <option value={1}>Sí</option>
                                    <option value={2}>No</option>
                                </select>
                            </div>
                            {errors.distinguido && <p className="text-red-500 text-sm mt-1">{errors.distinguido}</p>}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                            Descripción
                        </label>
                            <textarea
                            id="descripcion"
                            name="descripcion"
                            placeholder="Ingrese una descripción..."
                            value={formData.descripcion}
                            onChange={handleChange}
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-y"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-800 text-white py-3 rounded-md font-semibold hover:bg-green-900 transition-colors duration-200"
                    >
                        Guardar cliente
                    </button>
                </form>
            </div>
        </div>
    )
}
