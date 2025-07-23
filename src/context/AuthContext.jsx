import React, {useReducer, createContext, useEffect, useState} from "react"; // <--- Importa useEffect y useState
import { jwtDecode } from "jwt-decode";

const initialState = {
    user : null,
};

const AuthContext = createContext({
    user: null,
    login: (userData) => {},
    logout: () => {},
    loading: true,
});

function authReducer(state, action) {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                user: action.payload
            }
        case 'LOGOUT':
            return {
                ...state,
                user: null,
            }
        default:
            return state;
    }
}

function AuthProvider(props) {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const [loading, setLoading] = useState(true);

   
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = jwtDecode(token);

                if (decodedToken.exp * 1000 < Date.now()) {
                   
                    localStorage.removeItem("token");
                    dispatch({ type: 'LOGOUT' });
                } else {
                    
                    dispatch({ type: 'LOGIN', payload: decodedToken }); 
                }
            } catch (error) {
               
                console.error("Error al decodificar el token de localStorage:", error);
                localStorage.removeItem("token");
                dispatch({ type: 'LOGOUT' });
            }
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        if (userData && userData.token) {
            console.log(userData.token);
            localStorage.setItem("token", userData.token);
            const decodedToken = jwtDecode(userData.token);
            dispatch({
                type: 'LOGIN',
                payload: decodedToken
            });
        }
    }

    function logout() {
        localStorage.removeItem("token");
        dispatch({ type: 'LOGOUT' })
    }

    return(
        <AuthContext.Provider
            value={{
                user: state.user,
                login,
                logout,
                loading
            }}
            {...props}
        />
    )
}

export { AuthContext, AuthProvider}