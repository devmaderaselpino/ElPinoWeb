import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, gql, useMutation } from '@apollo/client';
import { Edit, Trash, Phone, User, MapPin } from 'lucide-react';
import Loading from "../../components/shared/Loading";
import ErrorPage from "../../components/shared/ErrorPage";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const EMPLOYEE_INFO = gql`
    query GetEmployee($idUsuario: Int) {
        getEmployee(idUsuario: $idUsuario) {
            idUsuario
            nombre
            aPaterno
            aMaterno
            tipo
            status
            celular
            municipio_n
            colonia_n
            calle
            numero_ext
            usuario
            password
        }
    }
`;

const DELETE_EMPLOYEE = gql`
    mutation DeleteEmployee($idUsuario: Int) {
        deleteEmployee(idUsuario: $idUsuario)
    }
`;

const EmployeeDetails = () => {

    const navigate = useNavigate();
    
    const {idUsuario} = useParams();

    const { loading, error, data } = useQuery(EMPLOYEE_INFO, {
        variables: {
            idUsuario: parseInt(idUsuario)
        }, fetchPolicy:"network-only"
    });

    const [deleteEmployee, { loading: loadingDeleteEmployee}] = useMutation(DELETE_EMPLOYEE);

    const handleDeleteEmployee = async () => {

        try {
            const resp = await deleteEmployee({
                variables: {
                    idUsuario: parseInt(idUsuario)
                }
            });

            if(resp.data.deleteEmployee === "Empleado eliminado"){
                navigate("/ListaEmpleados");
            }
           
        } catch (error) {
            console.log(error);
            
        }
       
    }

    if(loading || loadingDeleteEmployee){
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

    return(
        <div className="md:pl-64 lg:pl-64 flex justify-center items-center h-screen w-full">
            <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-lg w-full mx-auto transition-all duration-300 hover:shadow-lg">
                <div className="bg-gray-600 p-6 flex items-center">
                    <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center flex-shrink-0 border-4 border-white overflow-hidden">
                        <div className="h-full w-full flex items-center justify-center bg-green-100 text-black text-2xl font-bold">
                            {data.getEmployee.nombre.charAt(0)}
                            {data.getEmployee.aPaterno.charAt(0)}
                        </div>
                    </div>
                    <div className="ml-4 text-white">
                        <h2 className="text-xl font-bold">{data.getEmployee.nombre} {data.getEmployee.aPaterno} {data.getEmployee.aMaterno}</h2>
                        <p className="text-blue-100 text-sm flex items-center">
                            Número de Empleado: {data.getEmployee.idUsuario}
                        </p>
                    </div>
                </div>
                <div className="p-6">
                    <div className="mb-6">
                        <h3 className="text-sm uppercase text-gray-800 font-medium mb-3 border-b pb-2">Información de Contacto</h3>     
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <Phone size={18} className="text-green-800 mr-3 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-gray-700">{data.getEmployee.celular}</p>
                                </div>
                            </div>    
                            <div className="flex items-start">
                                <MapPin size={18} className="text-green-800 mr-3 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-gray-700">{data.getEmployee.municipio_n}, {data.getEmployee.colonia_n}, {data.getEmployee.calle} #{data.getEmployee.numero_ext}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center">
                                <User size={18} className="text-green-800 mr-2 flex-shrink-0" />
                                <div>
                                    <p className="text-xs text-gray-500">Estatus</p>
                                    <p className="text-gray-700 font-medium">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                            data.getEmployee.status === 1 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {data.getEmployee.status === 1 ? "Activo" : "Inactivo"}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 px-6 py-3 flex justify-between items-center border-t">
                    <button onClick={() => navigate(`/EditarEmpleado/${idUsuario}`)} className="bg-green-700 inline-flex items-center px-3 py-1 border text-white rounded-md hover:bg-green-800 transition-colors duration-200 text-sm">
                        <Edit size={18} />
                    </button>
                    <button className="inline-flex items-center px-3 py-1 border bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors duration-200 text-sm"
                    onClick={() => {
                        Swal.fire({
                            title: "¿Desea eliminar el empleado?",
                            showCancelButton: true,
                            confirmButtonText: "Aceptar",
                            cancelButtonText: "Cancelar",
                            confirmButtonColor: "#1e8449",
                            cancelButtonColor: "#f39c12"
                            
                            }).then((result) => {

                            if (result.isConfirmed) {
                                handleDeleteEmployee()
                            }
                        }); 
                        
                    }}>
                        <Trash size={18} />
                    </button>   
                </div>
            </div>
        </div>
    );
}

export default EmployeeDetails;
