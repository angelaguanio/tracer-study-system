import React from 'react'

export default function ProfileTemp({
  user,
  showName = true,
  className = '',
  avatarClassName = '',
  nameClassName = '',
}) {
  if (!user) return null

  const initials =
    user.initials ||
    `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase()

  const displayName =
    user.first_name ||
    user.name ||
    user.username ||
    'User'

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`h-10 w-10 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold ${avatarClassName}`}
      >
        {initials}
      </div>

      {showName && (
        <span className={nameClassName}>
          {displayName}
        </span>
      )}
    </div>
  )
}