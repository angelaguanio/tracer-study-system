import React from 'react'

export default function ProfileTemp({
  user,
  showName = true,
  className = '',
  avatarClassName = '',
  nameClassName = 'lg:text-md text-sm',
}) {

  if (!user) return null

  const initials =
    user.initials ||
    `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase()

  const displayName = `${user.first_name} ${user.last_name}`;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* AVATAR CONTAINER */}
      <div
        className={`lg:h-10 lg:w-10 h-9 w-9 rounded-full overflow-hidden flex items-center justify-center text-white font-bold bg-blue-400 ${avatarClassName}`}
      >
        {user.profile_picture ? (
          <img 
            src={user.profile_picture} 
            alt={displayName} 
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {showName && (
        <span className={`hidden sm:inline ${nameClassName}`}>
          {displayName}
        </span>
      )}
    </div>
  )
}