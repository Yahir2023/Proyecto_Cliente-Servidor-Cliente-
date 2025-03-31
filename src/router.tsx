import { BrowserRouter,Routes,Route } from "react-router-dom"
import App from "./App"
import Dashboard from "./components/Dashboard"
import Peliculas from "./components/Peliculas"
import Admin from "./components/Admin"
import Usuarios from "./components/Usuarios"
import Login from "./components/Login"
import Sidebar from "./components/Sidebar"
import DashboardA from "./components/Dashboard(admin)"
import Salas from "./components/Salas"
import Asientos from "./components/Asientos"
import SalaUsuario from "./components/SalaUsuario"


function Router(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App/>} index/>
                <Route path="/Login" element={<Login/>}></Route>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/dashboard(admin)" element={<DashboardA/>}></Route>
                <Route path="/peliculas" element={<Peliculas/>}/>
                <Route path="/Admin" element={<Admin/>}></Route>
                <Route path="/Usuarios" element={<Usuarios/>}></Route>
                <Route path="/Sidebar" element={<Sidebar/>}></Route>
                <Route path="/Salas" element={<Salas/>}></Route>
                <Route path="/Asientos" element={<Asientos/>}></Route>
                <Route path="/SalaUsuario" element={<SalaUsuario/>}></Route>
                
            </Routes>
        </BrowserRouter>
    ) 
}
export default Router;