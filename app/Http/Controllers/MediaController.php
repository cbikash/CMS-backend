<?php

namespace App\Http\Controllers;

use App\Http\Services\ImageUploaderService;
use App\Models\Media;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;

use Intervention\Image\Drivers\Gd\Driver as GdDriver;


class MediaController extends Controller
{
    public function __construct(private readonly ImageUploaderService $imageUploader)
    {

    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:contents,slug',
            'body' => 'required|string',
            'images' => 'nullable|array',
            'image' => 'nullable|image|max:20480',
            'images.*' => 'image|max:20480', // each image max 20MB
            'keywords' => 'nullable|string',
            'custom_field1' => 'nullable|string|max:255',
            'custom_field2' => 'nullable|string|max:255',
            'custom_field3' => 'nullable|string|max:255',
            'custom_field4' => 'nullable|string',
        ]);

        // Auto-generate slug if not provided
        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['title']) . '-' . Str::random(4);

        // Auto-generate SEO from body (first 150 chars plain text)
        $validated['seo'] = $validated['seo'] ?? Str::limit(strip_tags($validated['body']), 150);

        // Handle multi-image upload (optional)
        if ($request->hasFile('images')) {
            $imagePaths = [];

            foreach ($request->file('images') as $image) {
                $imagePaths[] = $this->imageUploader->uploadAndConvertToWebp($image);
            }

            // Save as JSON string (or use a separate images table for better structure)
            $validated['image'] = json_encode($imagePaths);
        }

        $validated['created_by'] = auth()->user()->id;
        $validated['updated_by'] = auth()->user()->id;

        // Create content
        $content = Post::create($validated);

        return response()->json([
            'message' => 'Content created successfully',
            'data' => $content,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Media $media)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Media $media)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Media $media)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Media $media)
    {
        //
    }
}
