import { Route, Routes, useLocation } from "react-router-dom"
import LoginForm from "../screens/auth/Login"
import Home from "../screens/dashboard/Home"
import NewClientForm from "../screens/clients/NewClientForm"
import Sidebar from "../components/shared/Sidebar"
import ClientsList from "../screens/clients/ClientsList"
import ClientDetails from "../screens/clients/ClientDetails"
import Enrutado from "../screens/enrutado/Enrutado"
import EditClient from "../screens/clients/EditClient"
import LocationList from "../screens/locations/LocationsList"
import NewCityForm from "../screens/locations/NewCityForm"
import NewDistrictForm from "../screens/locations/NewDistrictForm"
import EditCity from "../screens/locations/EditCity"
import EditDistrict from "../screens/locations/EditDistrict"
import ProtectedRoutes from "./guards/ProtectedRoutes"
import EmployeesList from "../screens/employees/EmployeesList"
import NewEmployeeForm from "../screens/employees/NewEmployeeForm"
import EditEmployee from "../screens/employees/EditEmployee"
import EmployeeDetails from "../screens/employees/EmployeeDetails"
import SellProcess from "../screens/sales/SellProcess"
import HistorialAbonos  from "../screens/payments/PaymentHistory"
import SalesHistory from "../screens/sales/SalesHistory"
import PaymentTable from "../screens/payments/PaymentTableBySale"
import PaymentForm from "../screens/payments/PaymentForm"
import Inventario from "../screens/inventory/Inventory"

const MainNavigation = () => {
    const location = useLocation();
    const hideSidebarRoutes = ["/Login"];
    const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname);

    return (
        <div className="flex h-screen">
            {!shouldHideSidebar && <Sidebar />}
            <div className={`flex-1 ${!shouldHideSidebar ? "lg:ml-0" : ""} overflow-auto`}>
                <Routes>
                    <Route path="/Login" element={<LoginForm />} />
                    <Route element={<ProtectedRoutes />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/ListaClientes" element={<ClientsList />} />
                        <Route path="/AgregarCliente" element={<NewClientForm />} />
                        <Route path="/DetalleClientes/:idCliente" element={<ClientDetails />} />
                        <Route path="/Enrutado" element={<Enrutado />} />
                        <Route path="/EditarCliente/:idCliente" element={<EditClient />} />
                        <Route path="/AgregarMunicipio" element={<NewCityForm />} />
                        <Route path="/AgregarColonia" element={<NewDistrictForm />} />
                        <Route path="/Ubicaciones" element={<LocationList />} />
                        <Route path="/EditarCiudad/:idCiudad" element={<EditCity />} />
                        <Route path="/EditarColonia/:idColonia" element={<EditDistrict />} />
                        <Route path="/ListaEmpleados" element={<EmployeesList />} />
                        <Route path="/AgregarEmpleado" element={<NewEmployeeForm />} />
                        <Route path="/EditarEmpleado/:idUsuario" element={<EditEmployee />} />
                        <Route path="/DetalleEmpleado/:idUsuario" element={<EmployeeDetails />} />
                        <Route path="/Venta" element={<SellProcess />} />
                        <Route path="/Abonos" element={<HistorialAbonos />} />
                        <Route path="/Inventario" element={<Inventario/>} />
                        <Route path="/Ventas" element={<SalesHistory />} />
                        <Route path="/TablaPagos/:idVenta" element={<PaymentTable />} />
                        <Route path="/AplicarAbono/:idVenta" element={<PaymentForm />} />
                    </Route>
                </Routes>
            </div>
        </div>
    )
}

export default MainNavigation;
