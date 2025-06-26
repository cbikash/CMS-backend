<?php

namespace App\Http\Controllers;

use App\Http\Services\ImageUploaderService;
use App\Models\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $uploadedFile = $request->file('image');

        $path = $this->imageUploader->uploadAndConvertToWebp($uploadedFile);

        return response()->json([
            'message' => 'Image converted and saved successfully.',
            'file' => 'uploads/' . $path
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
