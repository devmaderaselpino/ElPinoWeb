import { gql, useMutation } from '@apollo/client';
import Loading from "../../components/shared/Loading";
import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const UPDATE_META = gql`
    mutation UpdateMeta($cantidad: Float) {
        updateMeta(cantidad: $cantidad)
    }
`;

export default function MetaConfig() {

    const navigate = useNavigate();

    const [meta, setMeta] = useState("");
    const [error, setError] = useState("");

    const [updateMeta, { loading: loadingUpdate}] = useMutation(UPDATE_META);

    const validate = () => {
        if (!meta || meta === 0 || meta === "0") {
            setError("El monto es obligatorio.")
            return false
        }
        return true
    }

    const handleSubmit = async (e) => {
        
        e.preventDefault()
        
        if (validate()) {
        
            try {
                const resp = await updateMeta({
                    variables: {
                        cantidad: parseFloat(meta)
                    }
                });

                if(resp.data.updateMeta === "Meta actualizada."){
                    Swal.fire({
                        title: "Meta actualizada con éxito!",
                        text: "Serás redirigido al Home.",
                        icon: "success",
                        confirmButtonText: "Aceptar",
                        confirmButtonColor: "#1e8449",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate(`/`)
                        }
                    });
                }

            } catch (error) {
                Swal.fire({
                    title: "¡Ha ocurrido un error actualizando la meta!",
                    text: "Inténtelo más tarde.",
                    icon: "error",
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#922b21",
                }); 
            }
        
        }
    }

    if(loadingUpdate){
        return (
            <div className="min-h-screen flex items-center justify-center flex-col">
                <h1 className="text-3xl font-bold text-gray-800 mb-5">Cargando</h1>
                <Loading variant="wave" size="lg" color="green" />
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Editar Meta</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="municipioName" className="block text-sm font-medium text-gray-700 mb-1">
                            Cantidad Meta
                        </label>
                        <input
                            type="text"
                            id="meta"
                            name="meta"
                            placeholder="Meta"
                            value={meta}
                            onChange={(e) => {
                                const onlyNums = e.target.value.replace(/\D/g, "");
                                setMeta(onlyNums);
                                if(error){
                                    setError("");
                                }
                            }}
                            className={`w-full px-3 py-2 border ${error ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                        />
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#166534] text-white py-3 rounded-md font-semibold hover:bg-green-800 transition-colors duration-200"
                    >
                        Guardar meta
                    </button>
                </form>
            </div>
        </div>
    )
}
