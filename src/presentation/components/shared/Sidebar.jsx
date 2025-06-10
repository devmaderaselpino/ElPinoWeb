import { useState } from "react";
import { Home, Users, Warehouse, DollarSignIcon, Menu, X, CreditCard, MapPinCheck, HandCoins, Banknote, MapIcon} from "lucide-react";
import logo from '../../../assets/logo.png'; 
const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Venta", href: "#", icon: Banknote },
    { name: "Tarjetas", href: "#", icon: CreditCard },
    { name: "Empleados", href: "#", icon: Users },
    { name: "Inventario", href: "#", icon: Warehouse },
    { name: "Clientes", href: "/ListaClientes", icon: Users },
    { name: "Historial Abonos", href: "#", icon: HandCoins },
    { name: "Historial Ventas", href: "#", icon: DollarSignIcon },
    { name: "Ubicaciones", href: "/Ubicaciones", icon: MapPinCheck },
    { name: "Enrutado", href: "/Enrutado", icon: MapIcon },
];

export default function Sidebar() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <>
        
            <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="fixed top-2 left-3 z-50 p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none lg:hidden">
                <span className="sr-only">Open sidebar</span> {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            
            {isMobileOpen && (
                <div className="fixed inset-0 z-30 bg-opacity-50 sm:hidden" onClick={() => setIsMobileOpen(false)}></div>
            )}

            <aside className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0  bg-green-900`}>
                <div className="w-full flex justify-center items-center rounded-br-4 rounded-bl-4 bg-green-900">
                    <img src={logo} className="size-50 self-center" alt="" />
                </div>
                <div className="h-full px-3 py-4 overflow-y-auto">
                    <ul className="space-y-2 font-medium">
                        {navigation.map((item, index) => (
                            <li key={index}>
                                <a href={item.href} onClick={() => setIsMobileOpen(false)} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-500 group">
                                    <item.icon className="w-5 h-5 text-white dark:text-white group-hover:text-gray-900 dark:group-hover:text-white" />
                                    <span className="ms-3">{item.name}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>
        </>
    );
}