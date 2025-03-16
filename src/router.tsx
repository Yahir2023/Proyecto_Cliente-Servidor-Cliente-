import { BrowserRouter,Routes,Route } from "react-router-dom"
import App from "./App"
import Dashboard from "./components/Dashboard"
import Peliculas from "./components/Peliculas"

function Router(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App/>} index/>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/peliculas" element={<Peliculas/>}/>
            </Routes>
        </BrowserRouter>
    ) 
}
export default Router;