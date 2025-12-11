import React from 'react'
import logo from '../../assets/logotracer.png'

export default function Wup ({...props}) {
  return (
    <div className='justify-center items-center flex flex-col'{...props}>
        <img src={logo} className='w-48 h-auto'/>
        <h2 className='mt-2 text-2xl'>Alumni Connect</h2>
    </div>
  )
}
