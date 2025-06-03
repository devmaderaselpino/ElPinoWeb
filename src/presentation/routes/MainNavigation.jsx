import React from 'react'
import { Route, Routes } from "react-router-dom";
import Home from "../screens/dashboard/Home";
import NewClientForm from '../screens/clients/NewClientForm';
import Sidebar from '../components/shared/Sidebar';
import ClientsList from '../screens/clients/ClientsList';
import ClientDetails from '../screens/clients/ClientDetails';
import Enrutado from '../screens/enrutado/Enrutado';

const MainNavigation = () => {
    return(
        <>
            <Sidebar />
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/ListaClientes" element={<ClientsList/>} />
                <Route path="/AgregarCliente" element={<NewClientForm/>} />
                <Route path="/DetalleClientes/:idCliente" element={<ClientDetails/>} />
                <Route path="/Enrutado" element={<Enrutado/>} />
            </Routes>
        </>
    );
}

export default MainNavigation;