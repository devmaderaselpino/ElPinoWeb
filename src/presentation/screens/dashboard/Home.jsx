import React, {useState} from "react";
import { useQuery, gql } from '@apollo/client';

const PENDING_INVENTORYR = gql`
    query Query {
        getPendingInventoryR
    }
`;

const PENDING_INVENTORYE = gql`
    query Query {
        getPendingInventoryE
    }
`;


const Home = () => {
    
    const { loading: loadingIR, error: errorIR, data: dataIR } = useQuery(PENDING_INVENTORYR);
    const { loading: loadingIE, error: errorIE, data: dataIE } = useQuery(PENDING_INVENTORYE);
    
    if(loadingIR || loadingIE){
        return <p className="text-6xl text-black">Cargando...</p>
    }

    if(errorIE || errorIR) {
        return <p className="text-6xl text-black">Error: {errorIE.message ? errorIE.message : errorIR.message }</p>
    }

    return(
        <div className="bg-white md:pl-64 lg:pl-64">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8 w-full p-10">
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-2xl font-bold text-green-900 mb-3">Sucursal Rosario</p>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Pendientes de abastecer: {dataIR.getPendingInventoryR}</h3>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Pagos vencidos: 3</h3>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-2xl font-bold text-green-900 mb-3">Sucursal Escuinapa</p>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Pendientes de abastecer: {dataIE.getPendingInventoryE}</h3>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Pagos vencidos: 3</h3>
                </div>
            </div>
        </div>
    );
}

export default Home;