import React from 'react'
import logo from '../assets/logotracer.webp'
import { usePage } from '@inertiajs/react'

export default function Wup ({ label, subtitle, children, className = '', labelClassName = '', ...props }) {
  const displayLabel = label || subtitle || children;
  const { system_settings } = usePage().props || {};
  const appLogo = system_settings?.app_logo || logo;
  const appName = system_settings?.app_name || 'Alumni Connect';

  return (
    <div className={`justify-center items-center flex flex-col ${className}`} {...props}>
        <img src={appLogo} className='w-40 h-auto max-h-28 object-contain' alt={`${appName} Logo`} />
        <h2 className='mt-2 text-2xl text-black font-bruno text-center'>{appName}</h2>
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
