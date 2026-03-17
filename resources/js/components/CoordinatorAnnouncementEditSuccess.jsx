// Filename: CoordinatorAnnouncementEditSuccess.jsx
import React from "react";

export default function CoordinatorAnnouncementEditSuccess({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        // Overlay with semi-transparent custom color
        <div className="fixed inset-0 z-50 flex items-center justify-center"
             style={{ backgroundColor: "rgba(74, 90, 101, 0.5)" }}>
                
            {/* Modal box */}
            <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
                
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                >
                    &#x2715;
                </button>

                {/* Success Icon */}
                <div className="flex flex-col items-center justify-center space-y-4 mt-4">
                    <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <p className="text-gray-700 font-medium text-center">
                        Updated successfully
                    </p>
                </div>
            </div>
        </div>
    );
}