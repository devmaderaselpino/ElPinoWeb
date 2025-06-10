import React from 'react'
import { Route, Routes, useLocation } from "react-router-dom";
import LoginForm from '../screens/auth/Login';
import Home from "../screens/dashboard/Home";
import NewClientForm from '../screens/clients/NewClientForm';
import Sidebar from '../components/shared/Sidebar';
import ClientsList from '../screens/clients/ClientsList';
import ClientDetails from '../screens/clients/ClientDetails';
import Enrutado from '../screens/enrutado/Enrutado';
import EditClient from '../screens/clients/EditClient';
import LocationList from '../screens/locations/LocationsList';
import NewCityForm from '../screens/locations/NewCityForm';
import NewDistrictForm from '../screens/locations/NewDistrictForm';
import EditCity from '../screens/locations/EditCity';
import EditDistrict from '../screens/locations/EditDistrict';
// import ProtectedRoutes from './guards/ProtectedRoutes';

const MainNavigation = () => {

    const location = useLocation();
    const hideSidebarRoutes = ['/Login'];
    const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname);

    return(
        <>
            {!shouldHideSidebar && <Sidebar />}
            <Routes>
                <Route path="/Login" element={<LoginForm/>} />
                <Route path="/" element={<Home/>} />
                <Route path="/ListaClientes" element={<ClientsList/>} />
                <Route path="/AgregarCliente" element={<NewClientForm/>} />
                <Route path="/DetalleClientes/:idCliente" element={<ClientDetails/>} />
                <Route path="/Enrutado" element={<Enrutado/>} />
                <Route path="/EditarCliente/:idCliente" element={<EditClient/>} />
                <Route path="/AgregarMunicipio" element={<NewCityForm/>} />
                <Route path="/AgregarColonia" element={<NewDistrictForm/>} />
                <Route path="/Ubicaciones" element={<LocationList/>} />
                <Route path="/EditarCiudad/:idCiudad" element={<EditCity/>} />
                <Route path="/EditarColonia/:idColonia" element={<EditDistrict/>} />
            </Routes>
        </>
    );
}

export default MainNavigation;