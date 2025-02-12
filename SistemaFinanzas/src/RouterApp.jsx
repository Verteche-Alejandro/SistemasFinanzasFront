import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RoutesPages from "./Layouts/RoutesPages";

// Pages
import Login from "./Pages/Login";
import Principal from "./Pages/Principal";
import Transacciones from "./Pages/Transacciones";
import Cuentas from "./Pages/Cuentas";
import Reportes from "./Pages/Reportes";
import Perfil from "./Pages/Perfil";

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

const RouterApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route
          path="/login"
          element={
            <RoutesPages>
              <Login />
            </RoutesPages>
          }
        />

        {/* Ruta protegida */}
        <Route
          path="/principal"
          element={
            <ProtectedRoute>
              <RoutesPages>
                <Principal />
              </RoutesPages>
            </ProtectedRoute>
          }
        />
        {/* Ruta protegida */}
        <Route
          path="/transacciones"
          element={
            <ProtectedRoute>
              <RoutesPages>
                <Transacciones />
              </RoutesPages>
            </ProtectedRoute>
          }
        />

        {/* Ruta protegida */}
        <Route
          path="/cuentas"
          element={
            <ProtectedRoute>
              <RoutesPages>
                <Cuentas />
              </RoutesPages>
            </ProtectedRoute>
          }
        />


        {/* Ruta protegida */}
        <Route
          path="/reportes"
          element={
            <ProtectedRoute>
              <RoutesPages>
                <Reportes />
              </RoutesPages>
            </ProtectedRoute>
          }
        />

        {/* Ruta protegida */}
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <RoutesPages>
                <Perfil />
              </RoutesPages>
            </ProtectedRoute>
          }
        />

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouterApp;
