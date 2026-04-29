import React from "react";
import Navbar from "./components/Navbar";
import {Route , Routes} from 'react-router-dom';
import Home from "./pages/Home";
import EhncaedPage from "./pages/EhncaedPage";
import bg from '../public/background.png';

function App() {
 
  return (
    <div className="h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)),
          url(${bg})
        `,
      }}
>
      <Navbar />
      <Routes>
        <Route path ='/' element={<Home />} />
        <Route path='/enhanced' element={<EhncaedPage />} />
      </Routes>
      
     
      </div>

    

  );
}

export default App;
