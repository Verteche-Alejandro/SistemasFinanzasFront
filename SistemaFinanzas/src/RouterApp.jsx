import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RoutesPages from "./Layouts/RoutesPages";

// Pages
import Login from "./Pages/Login";
import Principal from "./Pages/Principal";

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

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouterApp;
