import { useState, useEffect, useContext } from "react"
import { gql, useMutation } from '@apollo/client';
import { EyeIcon, EyeOffIcon } from "lucide-react"
import Loading from "../../components/shared/Loading";
import logo from '../../../assets/logo3.png';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import Swal from "sweetalert2";

const INICIO_SESION = gql`
    mutation LoginUser($input: userLoginInput) {
        loginUser(input: $input) {
            token
        }
    }
`;

const LoginForm = () => {

    const { user, login } = useContext(AuthContext);
 
    const navigate = useNavigate();
    
    const [usuario, setUsuario] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [vContraseña, setVContraseña] = useState(false);

    useEffect( () => {
        if (user) {
            navigate("/")
        }
    },[])

    const [iniciarSesion, { loading }] = useMutation(INICIO_SESION);

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const resp = await iniciarSesion({
                variables: {
                    input: {
                        usuario,
                        password: contraseña
                    }
                }
            });

            if(resp.data.loginUser.token){
                login(resp.data.loginUser);
                navigate("/");    
            }else{
                Swal.fire({
                    title: "Credenciales inválidas!",
                    text: "Revise su usuario o contraseña.",
                    icon: "error",
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#1e8449",
                }) 
            }
            
        } catch (error) {
            Swal.fire({
                title: "Ha ocurrido un error",
                text: "Inténtelo más tarde.",
                icon: "error",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#1e8449",
            })     
        }
        
    }

    if(loading){
        return (
            <div className="min-h-screen flex items-center justify-center flex-col">
                <h1 className="text-3xl font-bold text-gray-800 mb-5">Cargando</h1>
                <Loading variant="wave" size="lg" color="green" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-md w-full space-y-8 bg-white p-6 sm:p-10 rounded-xl shadow-md">
                <div className="flex flex-col justify-center items-center">
                    <h2 className="mt-5 text-center text-3xl font-bold text-gray-900">Inicio de sesión</h2>
                    <img src={logo} className="size-50 self-center" alt="" />
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md -space-y-px">
                        <div className="mb-4">
                            <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                                Usuario
                            </label>
                            <input
                                id="usuario"
                                name="usuario"
                                type="usuario"
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 sm:text-sm"
                                placeholder="Usuario"
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                            />
                        </div>
                        <div className="mb-2 relative">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    id="contraseña"
                                    name="contraseña"
                                    type={vContraseña ? "text" : "password"}
                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 sm:text-sm"
                                    placeholder="Contraseña"
                                    value={contraseña}
                                    onChange={(e) => setContraseña(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setVContraseña(!vContraseña)}
                                    >
                                    {vContraseña ? (
                                        <EyeOffIcon className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-800 hover:bg-green-700"
                            >
                           Iniciar sesión
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginForm;
