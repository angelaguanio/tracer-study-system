import React from 'react'
import logo from '../assets/logotracer.webp'
import { usePage } from '@inertiajs/react'

export default function Wup ({ 
  label, 
  subtitle, 
  children, 
  className = '', 
  labelClassName = '', 
  compact = false,
  imgClassName = '',
  titleClassName = '',
  ...props 
}) {
  const displayLabel = label || subtitle || children;
  const { system_settings } = usePage().props || {};
  const appLogo = system_settings?.app_logo || logo;
  const appName = system_settings?.app_name || 'Alumni Connect';

  return (
    <div className={`justify-center items-center flex flex-col ${className}`} {...props}>
        <img 
          src={appLogo} 
          className={`object-contain transition-all ${
            compact 
              ? 'w-14 h-14 sm:w-16 sm:h-16' 
              : 'w-24 sm:w-28 max-h-20'
          } ${imgClassName}`} 
          alt={`${appName} Logo`} 
        />
        <h2 className={`mt-0.5 font-bruno text-center text-gray-900 ${
          compact 
            ? 'text-sm sm:text-base tracking-wide' 
            : 'text-lg sm:text-xl'
        } ${titleClassName}`}>
          {appName}
        </h2>
        {displayLabel && (
          <span
            className={`inline-flex items-center rounded-full font-semibold tracking-wide bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-xs ${
              compact 
                ? 'mt-1 px-2.5 py-0.5 text-[10.5px]' 
                : 'mt-1.5 px-3 py-0.5 text-xs'
            } ${labelClassName}`}
          >
            {displayLabel}
          </span>
        )}
    </div>
  )
}
