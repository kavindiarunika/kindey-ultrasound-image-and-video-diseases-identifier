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

        <div className="w-full h-16 bg-gray-400/50 text-black flex items-center justify-between px-4">
             {/* logo */}
             <img src="logo.jpg" alt='' className='w-16 h-16'/>

             {/* navlinks */}
                <div className='flex space-x-8'>    
                    {navLink.map((item,index)=>(
                        <a key={index} href ={item.link} className='hover:text-gray-400'>{item.name}</a>
                    ))}
                    </div>
        </div>

    </div>
  )
}

export default Navbar