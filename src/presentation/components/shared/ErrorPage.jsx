import { useNavigate } from "react-router-dom"

const ErrorPage = ({ statusCode = 500, title, message, showHomeButton = true }) => {

    const navigate = useNavigate();
  
    const getErrorContent = (code) => {
        switch (code) {
            case 404:
                return {
                    title: "Página no encontrada.",
                    message:
                        "La URL a la que quiere acceder no existe..",
                    illustration: (
                        <div className="w-64 h-64 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <div className="text-6xl font-bold text-gray-400">404</div>
                        </div>
                    ),
                }
            case 500:
            return {
                title: "Ha ocurrido un error.",
                illustration: (
                    <div className="w-64 h-64 mx-auto mb-8 bg-red-50 rounded-full flex items-center justify-center">
                        <svg className="w-24 h-24 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                        </svg>
                    </div>
                ),
            }
            case 403:
            
            return {
                title: "Acceso prohibido.",
                message:
                    "No tienes permisos para acceder a este recurso.",
                illustration: (
                    <div className="w-64 h-64 mx-auto mb-8 bg-yellow-50 rounded-full flex items-center justify-center">
                        <svg className="w-24 h-24 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                    </div>
                ),
            }
        }
    }

    const errorContent = getErrorContent(statusCode)
    const displayTitle = title || errorContent.title
    const displayMessage = message || errorContent.message
    
    const handleGoHome = () => {
        navigate("/")
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg w-full text-center">
                
                {errorContent.illustration}

                <h1 className="text-4xl font-bold text-gray-900 mb-4 sm:text-5xl">{displayTitle}</h1>

                
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">{displayMessage}</p>

                
                <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
                    {showHomeButton && (
                        <button
                        onClick={handleGoHome}
                        className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                        </svg>
                        Ir al inicio.
                        </button>
                    )}
                </div> 
            </div>
        </div>
    )
}

export default ErrorPage;
