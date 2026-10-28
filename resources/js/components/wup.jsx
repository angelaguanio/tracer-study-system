import React from 'react'
import logo from '../assets/logotracer.webp'

export default function Wup ({ label, subtitle, children, className = '', labelClassName = '', ...props }) {
  const displayLabel = label || subtitle || children;

  return (
    <div className={`justify-center items-center flex flex-col ${className}`} {...props}>
        <img src={logo} className='w-48 h-auto' alt="Alumni Connect Logo" />
        <h2 className='mt-2 text-2xl text-black font-bruno text-center'>Alumni Connect</h2>
        {displayLabel && (
          <span
            className={`mt-2.5 inline-flex items-center px-3.5 py-1 rounded-full text-xs sm:text-sm font-semibold tracking-wide bg-blue-50 text-blue-700 border border-blue-200/80 shadow-xs ${labelClassName}`}
          >
            {displayLabel}
          </span>
        )}
    </div>
  )
}
