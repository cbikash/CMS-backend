<?php

namespace App\Http\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
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
     * @param bool $quality
     * @param int|null $width
     * @param int|null $height
     * @return string Saved file path relative to disk root, e.g. 'uploads/filename.webp'
     */
    public function uploadAndConvertToWebp(
        UploadedFile $file,
        string $directory = 'uploads',
        string $disk = 'public',
        bool $quality = true,
        ?int $width = null,
        ?int $height = null
    ): string
    {
        $originalSize = $file->getSize();

        $imgQuality = $this->determineQuality($originalSize);

        $image = $this->imageManager->read($file);

        if ($width !== null || $height !== null) {
            $image->resize($width, $height);
        }

        $webpImage = $image->toWebp( $quality ? $imgQuality : 100);

        $fileName = 'cms_' .
            Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) . '_' .
            now()->format('Ymd_His') . '_' .
            Str::random(6) . '.webp';

        $path = $directory . '/' . $fileName;

        Storage::disk($disk)->put($path, (string) $webpImage);

        return $fileName;
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
