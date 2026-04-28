import React from 'react'

export default function ProfileTemp({
  user,
  showName = true,
  className = '',
  avatarClassName = '',
  nameClassName = '',
}) {

  if (!user) return null

  // Kinukuha ang initials (halimbawa: "JD" para sa John Doe)
  const initials =
    user.initials ||
    `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase()

  // Pangalan na ipapakita sa tabi ng avatar
  const displayName =
    user.first_name ||
    user.name ||
    user.username ||
    'User'

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* AVATAR CONTAINER */}
      <div
        className={`h-10 w-10 rounded-full overflow-hidden flex items-center justify-center text-white font-bold bg-blue-400 ${avatarClassName}`}
      >
        {/* ITO ANG DINAGDAG: I-check kung may profile_picture */}
        {user.profile_picture ? (
          <img 
            src={`/storage/${user.profile_picture}`} 
            alt={displayName} 
            className="w-full h-full object-cover"
          />
        ) : (
          // Fallback sa initials kung walang picture
          <span>{initials}</span>
        )}
      </div>

      {showName && (
        <span className={nameClassName}>
          {displayName}
        </span>
      )}
    </div>
  )
}