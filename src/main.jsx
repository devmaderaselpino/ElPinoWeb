import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import MainNavigation from './presentation/routes/MainNavigation.jsx';
import { ApolloProvider } from '@apollo/client';
import client from './ApolloClient.jsx';
import 'flowbite';
import { AuthProvider } from './context/AuthContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <ApolloProvider client={client}>
                <BrowserRouter>
                    <MainNavigation />
                </BrowserRouter>
        </ApolloProvider>
    </AuthProvider>
);
