import React from "react";
import Navbar from "./components/Navbar";
import UploadArea from "./components/UploadArea";


function App() {
  return (
    <div>
      <Navbar />

      <div className="flex-col w-full">
        <div className="w-1/2"><UploadArea/></div>
        <div className="w-1/2"></div>
      </div>
    
    </div>
  );
}

export default App;
