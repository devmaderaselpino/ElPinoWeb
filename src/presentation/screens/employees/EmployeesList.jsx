import React, { useEffect, useState } from "react";
import { useQuery, gql, useMutation, useLazyQuery } from '@apollo/client';
import { useNavigate } from "react-router-dom";
import { UserRoundPlus, Edit, Trash, Search, Eye, ShieldCheck  } from 'lucide-react';
import Loading from "../../components/shared/Loading";
import ErrorPage from "../../components/shared/ErrorPage";
import Swal from "sweetalert2";

const EMPLOYEES_LIST = gql`
    query GetEmployeesPaginated($input: PaginatedInput) {
        getEmployeesPaginated(input: $input) {
            total
            items {
                idUsuario
                nombre
                aPaterno
                aMaterno
                tipo
                status
            
            }
        }
    }
`;

const DELETE_EMPLOYEE = gql`
    mutation DeleteEmployee($idUsuario: Int) {
        deleteEmployee(idUsuario: $idUsuario)
    }
`;

const ACTIVATE_EMPLOYEE = gql`
    mutation ActivateEmployee($idUsuario: Int) {
        activateEmployee(idUsuario: $idUsuario)
    }
`;

const EmployeesList = () => {

    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");
   
    const itemsPerPage = 2;
    const [currentPage, setCurrentPage] = useState(1);
    const skip = (currentPage - 1) * itemsPerPage;

    const [getEmployees, { loading, data, error }] = useLazyQuery(EMPLOYEES_LIST, {fetchPolicy:"network-only"});

    const [deleteEmployee, { loading: loadingDeleteEmployee}] = useMutation(DELETE_EMPLOYEE);

    const [activateEmployee, { loading: loadingActivateEmployee}] = useMutation(ACTIVATE_EMPLOYEE);

     const handleActivateEmployee = async (idUsuario) => {

        try {
            const resp = await activateEmployee({
                variables: {
                    idUsuario
                }
            });

            if(resp.data.activateEmployee === "Empleado activado"){
                fetchEmployees();
            }
           
        } catch (error) {
            console.log(error);
            
        }
       
    }

    const handleDeleteEmployee = async (idUsuario) => {

        try {
            const resp = await deleteEmployee({
                variables: {
                    idUsuario
                }
            });

            if(resp.data.deleteEmployee === "Empleado eliminado"){
                fetchEmployees();
            }
           
        } catch (error) {
            console.log(error);
            
        }
       
    }
    
    const typeUser = (userId) => {
        switch(userId){
            case 1:
                return "Administrador";
            case 2:
                return "Oficina";
            case 3:
                return "Cobrador";
        }
    }

    useEffect(() => {
        getEmployees({
            variables: {
                input: {
                    limit: itemsPerPage,
                    skip,
                    searchName: searchTerm
                }
            }
        });
    }, [currentPage]);

    const fetchEmployees = async () => {
        getEmployees({
            variables: {
                input: {
                    limit: itemsPerPage,
                    skip,
                    searchName: searchTerm
                }
            }
        });
    };
    
    if(loading || loadingDeleteEmployee || loadingActivateEmployee){
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
        <div className="flex justify-center items-center flex-col mt-10">
            <div className="flex w-9/10 justify-between items-center mb-8">
                <div>
                    <h1 className="lg:text-4xl md:text-4xl text-2xl font-bold text-gray-800 mb-2">Lista de Empleados</h1>
                </div>
                <button
                    onClick={() => navigate(`/AgregarEmpleado`)}
                    className="bg-green-800 hover:bg-green-900 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
                >
                    <UserRoundPlus size={20} />
                    Agregar Empleado
                </button>
            </div>
            <div className="bg-white mb-6 w-9/10">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Buscar empleado..."
                        value={searchTerm}
                         onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                setCurrentPage(1);
                                fetchEmployees();
                            }
                        }}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 mt-3"
                    />
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden w-9/10">
                <div className="hidden md:block overflow-x-auto min-h-150">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-base font-bold text-black tracking-wider">
                                    Nombre
                                </th>
                                <th className="px-6 py-4 text-left text-base font-bold text-black tracking-wider">
                                    Tipo
                                </th>
                                <th className="px-6 py-4 text-left text-base font-bold text-black tracking-wider">
                                    Opciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data?.getEmployeesPaginated?.items?.map((empleado) => (
                                
                                <tr key={empleado.idUsuario}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{empleado.nombre} {empleado.aPaterno} {empleado.aMaterno}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{typeUser(empleado.tipo)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="bg-white w-full">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <button
                                                    onClick={() => navigate(`/DetalleEmpleado/${empleado.idUsuario}`)}
                                                    className={`w-full cursor-pointer shadow-sm shadow-gray-400 ${empleado.status  === 0 ? "text-gray-400" : "text-orange-600"}  justify-center rounded-2xl font-semibold  flex items-center p-2`}
                                                    disabled={empleado.status  === 0}
                                                >
                                                    <Eye size={20} className="mr-2" />
                                                    Ver detalle
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/EditarEmpleado/${empleado.idUsuario}`)}
                                                    className={`w-full cursor-pointer shadow-sm shadow-gray-400 ${empleado.status  === 0 ? "text-gray-400" : "text-orange-600"}  justify-center rounded-2xl font-semibold  flex items-center p-2`}
                                                    disabled={empleado.status  === 0}
                                                >
                                                    <Edit size={20} className="mr-2" />
                                                    Editar
                                                </button>
                                                {empleado.status === 1 ? 
                                                    <button
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
                                                                    handleDeleteEmployee(empleado.idUsuario)
                                                                }
                                                            }); 
                                                            
                                                        }}
                                                        className={`w-full cursor-pointer shadow-sm  shadow-gray-400 text-red-600 justify-center rounded-2xl font-semibold  flex items-center p-2`}
                                                    >
                                                        <Trash size={20} className="mr-2"/>
                                                        Eliminar
                                                    </button>
                                                    : 
                                                    <button
                                                        onClick={() => {

                                                            Swal.fire({
                                                                title: "¿Desea activar el empleado?",
                                                                showCancelButton: true,
                                                                confirmButtonText: "Aceptar",
                                                                cancelButtonText: "Cancelar",
                                                                confirmButtonColor: "#1e8449",
                                                                cancelButtonColor: "#f39c12"
                                                                
                                                                }).then((result) => {

                                                                if (result.isConfirmed) {
                                                                    handleActivateEmployee(empleado.idUsuario);
                                                                }
                                                            }); 
                                                            
                                                        }}
                                                        className={`w-full cursor-pointer shadow-sm  shadow-gray-400 text-green-800 justify-center rounded-2xl font-semibold  flex items-center p-2`}
                                                    >
                                                        <ShieldCheck size={20} className="mr-2"/>
                                                        Activar
                                                    </button>
                                                }
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="md:hidden">
                    {data?.getEmployeesPaginated?.items?.map((empleado) => (
                        <div key={empleado.idUsuario} className="p-6 border-b border-gray-200 last:border-b-0">
                            <div className="space-y-3">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{empleado.nombre} {empleado.aPaterno} {empleado.aMaterno}</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-2 text-sm">
                                    <div>
                                        <span className="font-medium text-gray-600">Tipo:</span>
                                        <span className="ml-2 text-gray-800">{typeUser(empleado.tipo)}</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <button
                                        onClick={() => navigate(`/DetalleEmpleado/${empleado.idUsuario}`)}
                                        className={`w-full cursor-pointer shadow-sm shadow-gray-400 ${empleado.status  === 0 ? "text-gray-400" : "text-orange-600"}  justify-center rounded-2xl font-semibold  flex items-center p-2`}
                                        disabled={empleado.status  === 0}
                                    >
                                        <Eye size={20} className="mr-2" />
                                        Ver detalle
                                    </button>
                                    <button
                                        onClick={() => navigate(`/EditarEmpleado/${empleado.idUsuario}`)}
                                        className={`w-full cursor-pointer shadow-sm shadow-gray-400 ${empleado.status  === 0 ? "text-gray-400" : "text-orange-600"}  justify-center rounded-2xl font-semibold  flex items-center p-2`}
                                        disabled={empleado.status  === 0}
                                    >
                                        <Edit size={20} className="mr-2" />
                                        Editar
                                    </button>
                                    {empleado.status === 1 ? 
                                        <button
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
                                                        handleDeleteEmployee(empleado.idUsuario)
                                                    }
                                                }); 
                                                
                                            }}
                                            className={`w-full cursor-pointer shadow-sm  shadow-gray-400 text-red-600 justify-center rounded-2xl font-semibold  flex items-center p-2`}
                                        >
                                            <Trash size={20} className="mr-2"/>
                                            Eliminar
                                        </button>
                                        : 
                                        <button
                                            onClick={() => {

                                                Swal.fire({
                                                    title: "¿Desea activar el empleado?",
                                                    showCancelButton: true,
                                                    confirmButtonText: "Aceptar",
                                                    cancelButtonText: "Cancelar",
                                                    confirmButtonColor: "#1e8449",
                                                    cancelButtonColor: "#f39c12"
                                                    
                                                    }).then((result) => {

                                                    if (result.isConfirmed) {
                                                        handleActivateEmployee(empleado.idUsuario);
                                                    }
                                                }); 
                                                
                                            }}
                                            className={`w-full cursor-pointer shadow-sm  shadow-gray-400 text-green-800 justify-center rounded-2xl font-semibold  flex items-center p-2`}
                                        >
                                            <ShieldCheck size={20} className="mr-2"/>
                                            Activar
                                        </button>
                                    }
                                </div>
                            </div>
                        </div>
                    ))}
                   
                </div>
            </div>
            {data?.getEmployeesPaginated?.total > 1 ?  
                <div className="hidden sm:flex justify-center items-center mt-16">
                    {Array.from({ length: Math.ceil(data?.getEmployeesPaginated?.total / itemsPerPage) }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`px-4 py-2 shadow-md rounded ${
                            currentPage === index + 1
                                ? 'bg-green-800 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div> 
                : 
                null
            }
            {Math.ceil(data?.getEmployeesPaginated?.total / itemsPerPage) > 1  ? 
                <div className="sm:hidden flex flex-row justify-around items-center w-9/10 mt-10 mb-10">
                    <button className={`${currentPage !== 1 ? "bg-green-800" : "bg-gray-400" } hover:bg-green-900 text-white font-semibold p-3 rounded-lg shadow-lg flex items-center gap-2`}
                    onClick={()=>{
                        if(currentPage !== 1){
                            setCurrentPage(currentPage - 1);
                        }
                    }}>
                        Anterior
                    </button>
                    <button className={`${currentPage < data?.getEmployeesPaginated?.total  ? "bg-green-800" : "bg-gray-400" } hover:bg-green-900 text-white font-semibold p-3 rounded-lg shadow-lg flex items-center gap-2`}
                    onClick={()=>{
                        
                        if(currentPage < data?.getEmployeesPaginated?.total){
                            setCurrentPage(currentPage + 1);
                        }
                    }}>
                        Siguiente
                    </button>
                </div> 
            :
                null
            }
        </div>
    );
}

export default EmployeesList;
