import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

export default function MessageInput({ onSend }) {
    const [value, setValue] = useState('');
    const textareaRef = useRef(null);

    // Auto-resize textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        
        // Reset height to auto to get the correct scrollHeight
        textarea.style.height = 'auto';
        
        // Set height based on scrollHeight, with max of 150px
        const newHeight = Math.min(textarea.scrollHeight, 150);
        textarea.style.height = `${newHeight}px`;
    }, [value]);

    const handleSend = () => {
        const trimmed = value.trim();
        if (!trimmed) return;
        onSend(trimmed);
        setValue('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
        // Shift+Enter allows new line (default textarea behavior)
    };

    return (
        <div className="flex items-end gap-2 p-2 border-t border-gray-200 dark:border-gray-700">
            <textarea
                ref={textareaRef}
                id="chat-message-input"
                name="message"
                rows={1}
                className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-y-auto"
                style={{ maxHeight: '150px' }}
                placeholder="Type a message…"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
            />
            <button
                onClick={handleSend}
                disabled={value.trim() === ''}
                className="p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0 cursor-pointer"
                aria-label="Send message"
            >
                <Send size={16} />
            </button>
        </div>
    );
}
