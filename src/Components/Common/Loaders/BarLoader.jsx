import React from 'react'
import './barloader.css'

function BarLoader() {
    return (
            <div className='p-4 w-screen h-screen fixed top-0 left-0 flex justify-center items-center' style={{'zIndex':1000}}>
                <div className='h-screen w-screen top-0 left-0 opacity-30 absolute flex justify-center items-center'>
                    <div className='w-1/3 h-1/3 '></div>
                </div>
                <div className=''>
                    <span className="loader px-20 py-20 text-center"></span>
                </div>
            </div>
       
    )
}

export default BarLoader