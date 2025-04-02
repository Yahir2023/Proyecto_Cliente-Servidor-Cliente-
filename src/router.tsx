import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Peliculas from "./components/Peliculas";
import Admin from "./components/Admin";
import Usuarios from "./components/Usuarios";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import DashboardA from "./components/Dashboard(admin)";
import Registro from "./components/Registro";
import Navbar from "./components/Navbar";
import Perfil from "./components/Perfil";
import Salas from "./components/Salas";
import Asientos from "./components/Asientos";
import AdminPromociones from "./components/Promociones";
import AdminReservas from "./components/Reservas";
import Pagos from "./components/Pagos";
import Compras from "./components/Compras";
import Boletos from "./components/Boletos";
import ProtectedRoute from "./components/ProtectedRoute";

function Router() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/Login" element={<Login />} />
              
                <Route path="/" element={<Dashboard/>} />

                <Route path="/dashboard(admin)" element={
                    <ProtectedRoute>
                        <DashboardA />
                    </ProtectedRoute>
                } />
                <Route path="/peliculas" element={
                    <ProtectedRoute>
                        <Peliculas />
                    </ProtectedRoute>
                } />
                <Route path="/Admin" element={
                    <ProtectedRoute>
                        <Admin />
                    </ProtectedRoute>
                } />
                <Route path="/Usuarios" element={
                    <ProtectedRoute>
                        <Usuarios />
                    </ProtectedRoute>
                } />
                <Route path="/Sidebar" element={
                    <ProtectedRoute>
                        <Sidebar />
                    </ProtectedRoute>
                } />
                <Route path="/Registro" element={<Registro />} />
                <Route path="/Navbar" element={
                    <ProtectedRoute>
                        <Navbar />
                    </ProtectedRoute>
                } />
                <Route path="/Perfil" element={
                    <ProtectedRoute>
                        <Perfil />
                    </ProtectedRoute>
                } />
                <Route path="/Salas" element={
                    <ProtectedRoute>
                        <Salas />
                    </ProtectedRoute>
                } />
                <Route path="/Asientos" element={
                    <ProtectedRoute>
                        <Asientos />
                    </ProtectedRoute>
                } />
                <Route path="/Promociones" element={
                    <ProtectedRoute>
                        <AdminPromociones />
                    </ProtectedRoute>
                } />
                <Route path="/Reservas" element={
                    <ProtectedRoute>
                        <AdminReservas />
                    </ProtectedRoute>
                } />
                <Route path="/Pagos" element={
                    <ProtectedRoute>
                        <Pagos />
                    </ProtectedRoute>
                } />
                <Route path="/Compras" element={
                    <ProtectedRoute>
                        <Compras />
                    </ProtectedRoute>
                } />
                <Route path="/Boletos" element={
                    <ProtectedRoute>
                        <Boletos />
                    </ProtectedRoute>
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;
