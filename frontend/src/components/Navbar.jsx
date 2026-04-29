import React from 'react'

const Navbar = () => {
    const navLink = [
        {
            name:"home",
            link:"/"
        },
        {
            name:"about",
            link:"/about"
        },
        {
            name:"contact",
            link:"/contact"
        }
    ]
  return (
    <div>

        <div className="w-full h-20 bg-black/80 text-white flex items-center justify-between px-4">
             {/* logo */}
             <div className='flex gap-4'>
                 <img src="logo.jpg" alt='' className='w-20 h-20'/>

                  {/* Header */}
        <h1 className="text-4xl font-bold text-center text-white mb-8 mt-2">
          Kidney Disease Detection
        </h1>
             </div>
            
             {/* navlinks */}
                <div className='flex space-x-32 text-lg'>    
                    {navLink.map((item,index)=>(
                        <a key={index} href ={item.link} className='hover:text-gray-400 text-lg'>{item.name}</a>
                    ))}
                    </div>
        </div>

    </div>
  )
}

export default Navbar