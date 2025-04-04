import { BrowserRouter,Routes,Route } from "react-router-dom"
import Dashboard from "./components/Dashboard"
import Peliculas from "./components/Peliculas"
import Admin from "./components/Admin"
import Usuarios from "./components/Usuarios"
import Login from "./components/Login"
import Sidebar from "./components/Sidebar"
import DashboardA from "./components/Dashboard(admin)"
import Registro from "./components/Registro"
import Navbar from "./components/Navbar"
import Perfil from "./components/Perfil"

function Router(){
    return(
        <BrowserRouter>
            <Routes>
                {/*<Route path="/" element={<App/>} index/>*/} 
                <Route path="/Login" element={<Login/>}></Route>
                <Route path="/" element={<Dashboard/>}/>
                <Route path="/dashboard(admin)" element={<DashboardA/>}></Route>
                <Route path="/peliculas" element={<Peliculas/>}/>
                <Route path="/Admin" element={<Admin/>}></Route>
                <Route path="/Usuarios" element={<Usuarios/>}></Route>
                <Route path="/Sidebar" element={<Sidebar/>}></Route>
                <Route path="/Registro" element={<Registro/>}></Route>
                <Route path="/Navbar" element={<Navbar/>}></Route>
                <Route path="/Perfil" element={<Perfil/>}></Route>
            </Routes>
        </BrowserRouter>
    ) 
}
export default Router;