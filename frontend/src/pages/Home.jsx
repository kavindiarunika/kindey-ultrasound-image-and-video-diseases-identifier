import React from 'react'
import Output from '../components/Output'
import UploadArea from '../components/UploadArea'
import AIAdvice from '../components/AiAdvice'


function Home() {
  return (
    <div className='w-full min-h-screen flex gap-6 px-6 py-6'>
      {/* LEFT HALF - Upload Area */}
      <div className='w-1/2'>
        <UploadArea />
      
      </div>
      
     
      <div className='w-1/2 flex flex-col gap-6  bg-black/30'>
       
          <Output />
       
          <AIAdvice />
       
      </div>
    </div>
  )
}

export default Home