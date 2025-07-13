<?php

namespace App\Http\Controllers;

use App\Http\Services\ImageUploaderService;
use App\Models\Image;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ImageController extends Controller
{
    public function __construct(private readonly ImageUploaderService $imageUploader)
    {

    }

    public function removeImage(Post $post, $image_id): JsonResponse
    {
        // Detach the image from the post
        $post->images()->detach($image_id);

        return response()->json(['message' => 'Image detached successfully']);
    }

    public function uploadsImages(Post $post, Request $request)
    {
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $uploadedImage) {
                $path = $this->imageUploader->uploadAndConvertToWebp($uploadedImage);

                $image = Image::create([
                    'name' => $path,
                ]);

                $post->images()->attach($image->id);
            }
        }

        return response()->json(['message' => 'Image Uploads successfully']);
    }

}
