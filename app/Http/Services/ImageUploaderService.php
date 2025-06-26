<?php

namespace App\Http\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver as GdDriver;

class ImageUploaderService
{
    protected ImageManager $imageManager;

    public function __construct()
    {
        $this->imageManager = new ImageManager(new GdDriver());
    }

    /**
     * Upload and convert image to WebP with dynamic quality based on size.
     *
     * @param UploadedFile $file
     * @param string $directory Relative directory inside the disk, e.g. 'uploads'
     * @param string $disk Storage disk name (default 'public')
     * @return string Saved file path relative to disk root, e.g. 'uploads/filename.webp'
     */
    public function uploadAndConvertToWebp(UploadedFile $file, string $directory = 'uploads', string $disk = 'public'): string
    {
        $originalSize = $file->getSize();

        $quality = $this->determineQuality($originalSize);

        $image = $this->imageManager->read($file);

        $webpImage = $image->toWebp($quality);

        $fileName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME) . '.webp';

        $path = $directory . '/' . $fileName;

        Storage::disk($disk)->put($path, (string) $webpImage);

        return $path;
    }

    protected function determineQuality(int $sizeBytes): int
    {
        if ($sizeBytes >= 10 * 1024 * 1024) {
            return 40;
        } elseif ($sizeBytes >= 5 * 1024 * 1024) {
            return 60;
        } elseif ($sizeBytes >= 2 * 1024 * 1024) {
            return 75;
        } else {
            return 90;
        }
    }
}
