import "./App.css";
import LanguageSelector from "./components/LanguageSelector";
import Layout from "./layout/Layout";
import { ToastContainer } from "react-toastify";


function App() {


  return(  
  <div>
    <ToastContainer/>
 <Layout/>
 <div className="fixed left-[20px] bottom-[30px] z-10">
        <LanguageSelector />
      </div>
  </div>
 )
      

}

export default App
