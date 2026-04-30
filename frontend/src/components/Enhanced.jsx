import React, { useContext } from 'react'
import { AppContext } from '../kidneycontext/appContext';

const Enhanced = () => {
  const { result, enhanceOn } = useContext(AppContext);

  if (!result || !result.enhanced_image) {
    return (
      <div className="w-full max-w-3xl mx-auto bg-green-300/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8 text-center">
      <p>No enhancement.Turn on enhance button</p>
        
      </div>
    );
  }

  const handleDownload = () => {
    try {
      const byteCharacters = atob(result.enhanced_image);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `enhanced_kidney_image_${new Date().getTime()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className=" ">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
        
        {/* Header */}
        <div className="ml-4 mt-2 ">
          <h2 className="text-xl  text-white">Enhanced Image</h2>
         
        </div>

        
          {/* Resolution Info */}
          {result.resolution && (
            <div className="grid grid-cols-2 gap-4 mb-6 bg-black/30 border border-emerald-400/30 p-4 rounded-lg">
              <div className="text-center">
                <p className="text-gray-300 text-sm font-medium">Original Resolution</p>
                <p className="text-lg font-bold text-emerald-300 mt-2">
                  {result.resolution.original}
                </p>
              </div>
              <div className="text-center border-l border-white/10">
                <p className="text-gray-300 text-sm font-medium">Enhanced Resolution</p>
                <p className="text-lg font-bold text-cyan-300 mt-2">
                  {result.resolution.enhanced || '4x Upscaled'}
                </p>
              </div>
            </div>
          )}

        {/* Content */}
        <div className="p-8">
          
          {/* Image Display */}
          <div className="mb-8 rounded-2xl overflow-hidden flex items-center justify-center border border-white/10 shadow-lg">
            <img
              src={`data:image/jpeg;base64,${result.enhanced_image}`}
              alt="Enhanced kidney ultrasound"
              className="w-full h-auto max-h-[500px] object-contain p-4"
            />
          </div>


        

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-900"
            aria-label="Download enhanced image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
              <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
            </svg>
            Download Enhanced Image
          </button>

          {/* Additional Info */}
          <p className="text-center text-gray-400 text-xs mt-4">
            Enhanced image will be saved as JPEG format with high quality (95%)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Enhanced;