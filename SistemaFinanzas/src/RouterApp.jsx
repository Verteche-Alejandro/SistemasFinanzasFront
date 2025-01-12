import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

// Pages
import Login from "./Pages/Login";
import Principal from "./Pages/Principal";

const RouterApp = () => {
  const [user, setUser] = useState(null);

  const publicRoutes = [
    { path: "/login", page: <Login /> },
  ];

  const protectedRoutes = [
    { path: "/", page: <Principal /> },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodetoken = jwtDecode(token);
        setUser(JSON.parse(decodetoken)); 
      } catch (error) {
        console.error("Token inválido");
        localStorage.removeItem("token");
      }
    } else {
      setUser(null);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        {publicRoutes.map(route => (
          <Route key={route.path} path={route.path} element={route.page} />
        ))}

        {/* Rutas protegidas */}
        {protectedRoutes.map(route => (
          <Route 
            key={route.path} 
            path={route.path} 
            element={user ? route.page : <Navigate to="/login" />} 
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default RouterApp;
