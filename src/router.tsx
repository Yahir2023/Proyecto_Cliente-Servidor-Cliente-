import { BrowserRouter,Routes,Route } from "react-router-dom"
import App from "./App"
import Dashboard from "./components/Dashboard"
import Peliculas from "./components/Peliculas"
import Admin from "./components/Admin"
import Usuarios from "./components/Usuarios"
import Login from "./components/Login"

function Router(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App/>} index/>
                <Route path="/Login" element={<Login/>}></Route>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/peliculas" element={<Peliculas/>}/>
                <Route path="/Admin" element={<Admin/>}></Route>
                <Route path="/Usuarios" element={<Usuarios/>}></Route>
            </Routes>
        </BrowserRouter>
    ) 
}
export default Router;