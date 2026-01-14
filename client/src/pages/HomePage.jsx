import React from 'react'
import { Link } from 'react-router-dom'

const HomePage = () => {
    return (
        <div className='w-full h-full bg-gradient-to-br from-gray-900 to-black text-white overflow-auto'>

            <header className='flex justify-center py-4 px-3 md:px-4 sticky top-0 z-50'>
                <div

                    className='space-x-5 sm:space-x-10 text-sm sm:text-lg bg-white/10 backdrop-blur-lg px-4 sm:px-8 py-2 rounded-full shadow-lg flex items-center'
                >
                    <Link to='/' className='text-gray-300 hover:text-blue-400 transition'>Home</Link>
                    <Link to='/u/chatting' className='text-gray-300 hover:text-blue-400 transition'>Messages</Link>
                    <Link to='/' className='text-gray-300 hover:text-blue-400 transition'>Live Users</Link>
                    <Link to='/login' className='text-gray-300 hover:text-blue-400 transition'>Login</Link>
                    
                </div>
            </header>
        </div>
    )
}

export default HomePage
