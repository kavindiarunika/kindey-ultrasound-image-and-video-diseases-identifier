import { createContext ,useState} from "react";

 export const AppContext = createContext();


 const AppProvider = ({ children }) => {

    const [result , setResult] = useState(null);
    const [enhanceOn, setEnhanceOn] = useState(false);
    const [enhancedImage, setEnhancedImage] = useState(null);
    const [enhancedResolution, setEnhancedResolution] = useState(null);
    
    return (
        <AppContext.Provider value={{
            result, 
            setResult, 
            enhanceOn, 
            setEnhanceOn,
            enhancedImage,
            setEnhancedImage,
            enhancedResolution,
            setEnhancedResolution
        }}>
            {children}
        </AppContext.Provider>
    )
 }
export default AppProvider;