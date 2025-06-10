import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import MainNavigation from './presentation/routes/MainNavigation.jsx';
import { ApolloProvider } from '@apollo/client';
import client from './ApolloClient.jsx';
import 'flowbite';
import { AuthProvider } from './context/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
    <ApolloProvider client={client}>
        <AuthProvider>
            <BrowserRouter>
                <MainNavigation />
            </BrowserRouter>
        </AuthProvider>
    </ApolloProvider>
);
