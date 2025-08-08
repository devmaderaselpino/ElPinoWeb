import { useState,useEffect } from "react";
import { Bell, Package, ArrowUpRight, ArrowDownLeft, Clock ,ArrowDownUp} from "lucide-react";



export function NotificationButton({ movimientos }) {
  const [isOpen, setIsOpen] = useState(false);

  // Función para determinar si es entrada o salida, comparando stock y nuevoStock
  const getMovementType = (stockAnterior, cantidad) => {
    return cantidad > stockAnterior ? "entrada" : "salida";  // Si el nuevo stock es mayor, es entrada; si es menor, es salida
  };

  // Función para determinar el ícono basado en el tipo de movimiento
  const getMovementIcon = (type) => {
    return type === "entrada" ? (
      <ArrowDownLeft className="h-4 w-4 text-green-500" /> // Ícono para "entrada"
    ) : (
      <ArrowUpRight className="h-4 w-4 text-red-500" /> // Ícono para "salida"
    );
  };

  // Función para obtener el texto del tipo de movimiento
  const getMovementTypeText = (type) => {
    return type === "entrada" ? "Entrada" : "Salida";  // Texto "Entrada" o "Salida"
  };
    const [unreadCount, setUnreadCount] = useState(0);
     
 useEffect(() => {
  setUnreadCount(movimientos.length);  // Actualiza el contador de notificaciones con el número de movimientos
  console.log("Movimientos actualizados:", movimientos); // Verificar que se esté actualizando correctamente
}, [movimientos]);


  return (
    <div className="relative">
      {/* Botón de notificación */}
      <button
        onClick={() => setIsOpen(!isOpen)} // Controla la apertura y cierre del popover
        className="relative p-2 rounded-full bg-white hover:bg-gray-200 transition-all duration-200 focus:outline-none "
      >
        <Bell className="h-6 w-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 inline-block w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Popover de Notificaciones */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white border shadow-lg rounded-lg z-50">
          <div className="border-b p-4 flex items-center gap-2">
            <ArrowDownUp className="h-6 w-6 text-green-800" />
            <span className="text-lg font-semibold">Movimientos de Inventario</span>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {movimientos.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No hay movimientos recientes</p>
              </div>
            ) : (
              movimientos.map((movement) => {
                const type = getMovementType(movement.stockAnterior, movement.cantidad); // Determinar tipo de movimiento comparando stock y nuevoStock

                return (
                  <div
                    key={movement.id}
                    className="flex items-start gap-3 p-3 hover:bg-gray-100 cursor-pointer"
                  >
                    <div className="mt-1">
                      {getMovementIcon(type)} {/* Mostrar el ícono según el tipo de movimiento */}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-800">
                          {getMovementTypeText(type)} {/* Mostrar "Entrada" o "Salida" */}
                        </span>
                        <span className="text-xs text-gray-500">
                           {Math.abs(movement.cantidad - movement.stockAnterior)} unidades {/* Mostrar la cantidad ajustada */}
                        </span>
                      </div>

                      <p className="text-sm font-medium text-gray-800 truncate">
                        {movement.producto} {/* Nombre del producto */}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        <span className="font-medium text-gray-700">Nota:</span> {movement.nota}
                      </p>
                      <p className="text-xs text-gray-700 truncate">
                        <span className="font-medium">Ubicación:</span> {movement.ubicacion}
                      </p>
                     
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{movement.fecha}</span> {/* Fecha del movimiento */}
                        <span>•</span>
                        <span>{movement.usuario}</span> {/* Usuario que realizó el movimiento */}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationButton;
