import React from 'react'
import { AppContext } from "../kidneycontext/appContext";
import Enhanced from '../components/Enhanced';
function EhncaedPage() {
  const { result } = React.useContext(AppContext);

  return (
    <div>
         {result && result.enhanced && result.enhanced_image && (
        <div className="w-full mt-8 pb-8">
          <Enhanced />
        </div>
      )}

    </div>
  )
}

export default EhncaedPage