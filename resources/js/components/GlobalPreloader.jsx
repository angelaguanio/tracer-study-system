import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import logo from '../assets/logotracer.png';

export default function GlobalPreloader({ children }) {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let isMounted = true;
        
        const loadAssets = async () => {
            // 1. Find all standard <img> tags
            const imgElements = Array.from(document.images);
            
            // 2. Find elements with inline background images (e.g. style={{ backgroundImage: ... }})
            const bgElements = Array.from(document.querySelectorAll('[style*="background-image"], [style*="background"]'));
            const bgUrls = [];
            
            bgElements.forEach(el => {
                const style = window.getComputedStyle(el);
                const bgImage = style.backgroundImage;
                if (bgImage && bgImage !== 'none') {
                    const match = bgImage.match(/url\(['"]?(.*?)['"]?\)/i);
                    if (match && match[1]) {
                        bgUrls.push(match[1]);
                    }
                }
            });

            // Total assets to load
            const total = imgElements.length + bgUrls.length;
            let loaded = 0;

            if (total === 0) {
                if (isMounted) {
                    // Slight delay to ensure React has fully rendered
                    setTimeout(() => {
                        if (isMounted) {
                            setIsLoading(false);
                            setProgress(100);
                        }
                    }, 500);
                }
                return;
            }

            const updateProgress = () => {
                loaded++;
                if (isMounted) setProgress(Math.round((loaded / total) * 100));
            };

            // Promises for <img> tags
            const imgPromises = imgElements.map(img => {
                if (img.complete) {
                    updateProgress();
                    return Promise.resolve();
                }
                return new Promise(resolve => {
                    img.addEventListener('load', () => { updateProgress(); resolve(); });
                    img.addEventListener('error', () => { updateProgress(); resolve(); });
                });
            });

            // Promises for background images
            const bgPromises = bgUrls.map(url => {
                return new Promise(resolve => {
                    const img = new Image();
                    img.onload = () => { updateProgress(); resolve(); };
                    img.onerror = () => { updateProgress(); resolve(); };
                    img.src = url;
                });
            });

            const allPromises = [...imgPromises, ...bgPromises];

            // Create a maximum timeout failsafe (e.g., 5 seconds)
            const timeoutPromise = new Promise(resolve => setTimeout(resolve, 5000));

            // Wait for either all images/backgrounds to load or the timeout to hit
            await Promise.race([Promise.all(allPromises), timeoutPromise]);

            // Add a small delay for smoothness after everything is loaded
            setTimeout(() => {
                if (isMounted) setIsLoading(false);
            }, 300);
        };

        // Run on initial load
        loadAssets();

        let trickleInterval;

        // Hook into Inertia navigation to show loader again on page changes
        const removeStart = router.on('start', () => {
            if (isMounted) {
                setIsLoading(true);
                setProgress(10);
                
                // Simulate network progress
                trickleInterval = setInterval(() => {
                    setProgress(prev => {
                        if (prev >= 80) return prev; // Stop at 80% until DOM and images load
                        return prev + Math.random() * 5;
                    });
                }, 400);
            }
        });

        const removeFinish = router.on('finish', () => {
            if (trickleInterval) clearInterval(trickleInterval);
            
            // Inertia's finish means DOM is updated, now wait for new assets to load
            setTimeout(() => {
                if (isMounted) loadAssets();
            }, 100);
        });

        return () => {
            isMounted = false;
            if (trickleInterval) clearInterval(trickleInterval);
            removeStart();
            removeFinish();
        };
    }, []);

    return (
        <>
            {/* The Top Progress Bar */}
            <div 
                className={`fixed top-0 left-0 w-full z-[99999] transition-opacity duration-300 pointer-events-none ${
                    isLoading ? 'opacity-100' : 'opacity-0'
                }`}
            >
                <div 
                    className="h-1 bg-gradient-to-r from-[#003C87] to-[#00B9FF] transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                >
                    {/* Shine effect */}
                    <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-r from-transparent to-white/50" />
                </div>
            </div>

            {/* The Main Application Content - always visible */}
            <div className="w-full h-full">
                {children}
            </div>
        </>
    );
}
