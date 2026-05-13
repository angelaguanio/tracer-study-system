export default function PresenceIndicator({ isOnline }) {
    return (
        <span
            className={`inline-block w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}
            aria-label={isOnline ? 'Online' : 'Offline'}
        />
    );
}
