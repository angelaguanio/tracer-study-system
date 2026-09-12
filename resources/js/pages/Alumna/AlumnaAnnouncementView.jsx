import React, { useState } from 'react';
import AlumnaLayout from "@/layouts/alumna-layout";
import { Link } from "@inertiajs/react";
import { ArrowLeft, Calendar, X, Download } from "lucide-react";

export default function AlumnaAnnouncementView({ announcement }) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  let parsedImage = announcement?.image;
  if (typeof parsedImage === 'string') {
    try {
      parsedImage = JSON.parse(parsedImage);
    } catch (e) {
      // It's a normal string, keep it as is
    }
  }

  const imageUrl = parsedImage 
    ? (Array.isArray(parsedImage) && parsedImage.length > 0 
        ? parsedImage[0] 
        : (typeof parsedImage === 'string' && parsedImage.trim() !== '' ? parsedImage : null))
    : null;

  const handleDownload = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!imageUrl) return;

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        // Fill white background in case of transparency
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `announcement-${announcement?.id || 'image'}.jpg`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 'image/jpeg', 0.95);
      };
      img.src = imageUrl;
    } catch (err) {
      console.error("Failed to convert/download image", err);
      window.open(imageUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen w-full py-10 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* BACK BUTTON */}
        <Link
          href="/alumna/announcements"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors px-3 py-2 rounded-lg mb-6 -ml-3"
        >
          <ArrowLeft size={16} /> Back to Announcements
        </Link>

        {/* CARD CONTAINER */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-12">
          
          {/* TITLE */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B2545] mb-4 leading-tight tracking-tight">
            {announcement?.title}
          </h1>

          {/* DATE */}
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-10">
            <Calendar size={16} className="text-slate-400" />
            <p>
              {announcement?.created_at
                ? `${new Date(announcement.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })} • ${new Date(
                    announcement.created_at
                  ).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`
                : ""}
            </p>
          </div>

          {/* IMAGE (ONLY IF AVAILABLE) */}
          {imageUrl && !imageError && (
              <div className="w-full flex justify-center mb-10">
                <img
                  src={imageUrl}
                  alt={announcement.title}
                  onClick={() => setIsLightboxOpen(true)}
                  onError={() => setImageError(true)}
                  className="w-full max-w-2xl max-h-[500px] object-contain rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                  title="Click to view full image"
                />
              </div>
          )}

          {/* CONTENT */}
          <div className="text-slate-700 text-base sm:text-lg leading-relaxed whitespace-pre-line">
            {announcement?.details}
          </div>

        </div>
      </div>

      {/* LIGHTBOX OVERLAY */}
      {isLightboxOpen && imageUrl && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close Button */}
          <button 
            onClick={(e) => { e.stopPropagation(); setIsLightboxOpen(false); }}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors z-50"
            title="Close"
          >
            <X size={24} />
          </button>
          
          {/* Download Button */}
          <button 
            onClick={handleDownload}
            className="absolute top-4 right-20 sm:top-6 sm:right-24 flex items-center gap-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-full transition-colors text-sm font-medium z-50"
            title="Download image as JPG"
          >
            <Download size={18} />
            <span className="hidden sm:inline">Download</span>
          </button>

          {/* Large Image */}
          <img
            src={imageUrl}
            alt={announcement.title}
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-[90vh] object-contain rounded-md shadow-2xl cursor-default"
          />
        </div>
      )}
    </div>
  );
}

AlumnaAnnouncementView.layout = (page) => (
  <AlumnaLayout>{page}</AlumnaLayout>
);
