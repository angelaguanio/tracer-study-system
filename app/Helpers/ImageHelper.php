<?php

namespace App\Helpers;

use Illuminate\Http\UploadedFile;

class ImageHelper
{
    /**
     * Convert an uploaded image (JPG/PNG) to WEBP and save it.
     * If the image is not JPG or PNG, it just moves the file as is.
     *
     * @param UploadedFile $file The uploaded file
     * @param string $destinationFolder The destination folder relative to public path (e.g. 'storage/profile_pictures')
     * @param string $filenameWithoutExtension The desired filename without the extension
     * @param int $quality The WEBP quality (0-100)
     * @return string The final filename (with extension)
     */
    public static function convertAndSaveToWebp(UploadedFile $file, string $destinationFolder, string $filenameWithoutExtension, int $quality = 80): string
    {
        $extension = strtolower($file->getClientOriginalExtension());
        $sourcePath = $file->getRealPath();
        
        $destinationPath = public_path($destinationFolder);
        
        // Ensure destination folder exists
        if (!file_exists($destinationPath)) {
            mkdir($destinationPath, 0755, true);
        }

        if (in_array($extension, ['jpg', 'jpeg', 'png'])) {
            $finalFilename = $filenameWithoutExtension . '.webp';
            $finalPath = $destinationPath . '/' . $finalFilename;

            $info = getimagesize($sourcePath);
            $mime = $info['mime'];

            if ($mime === 'image/jpeg') {
                $image = imagecreatefromjpeg($sourcePath);
            } elseif ($mime === 'image/png') {
                $image = imagecreatefrompng($sourcePath);
                // Preserve transparency for PNGs
                imagepalettetotruecolor($image);
                imagealphablending($image, true);
                imagesavealpha($image, true);
            } else {
                // Fallback for weird mime types despite extension
                $finalFilename = $filenameWithoutExtension . '.' . $extension;
                $file->move($destinationPath, $finalFilename);
                return $finalFilename;
            }

            if ($image) {
                imagewebp($image, $finalPath, $quality);
                imagedestroy($image);
                return $finalFilename;
            }
        }

        // If it's not a convertible image, just move it normally
        $finalFilename = $filenameWithoutExtension . '.' . $extension;
        $file->move($destinationPath, $finalFilename);
        
        return $finalFilename;
    }
}
