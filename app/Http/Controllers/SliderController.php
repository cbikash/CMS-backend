<?php

namespace App\Http\Controllers;

use App\Http\Services\ImageUploaderService;
use App\Models\Slider;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SliderController extends Controller
{
    public function __construct(private readonly ImageUploaderService $imageUploader)
    {

    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sliders = Slider::query()
            ->where('organization_id', auth()->user()->organization_id)
            ->orderByDesc('order')
            ->get();

        return Inertia::render('sliders/index', [
            'sliders' => $sliders
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $uploadedImage) {
                $path = $this->imageUploader->uploadAndConvertToWebp($uploadedImage);

                Slider::create([
                    'name' => $path,
                    'organization_id' => auth()->user()->organization_id
                ]);
            }
        }

        return $this->successResponse([], 'Successfully created sliders.');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Slider $slider)
    {
        $slider->delete();

        return $this->successResponse([], 'Successfully deleted slider.');
    }
}
