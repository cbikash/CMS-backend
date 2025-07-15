<?php

namespace App\Http\Controllers;

use App\Http\Services\ImageUploaderService;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TestimonialController extends Controller
{
    public function __construct(private readonly ImageUploaderService $imageUploader)
    {

    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $testimonials = Testimonial::orderBy('id', 'desc')
            ->where('organization_id', auth()->user()->organization_id)
            ->get();

        return Inertia::render('testimonials/index', [
            'testimonials' => $testimonials
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Testimonials/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'designation' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'source' => 'nullable|string|max:255',
        ]);

        if ($request->hasFile('image')) {
            $path = $this->imageUploader->uploadAndConvertToWebp($request->file('image'));
            $validated['image'] = $path;
        }

        $validated['organization_id'] = auth()->user()->organization_id;

        Testimonial::create($validated);

        return redirect()->route('testimonials.index')
            ->with('success', 'Testimonial created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Testimonial $testimonial)
    {
        return Inertia::render('Testimonials/Show', [
            'testimonial' => $testimonial
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Testimonial $testimonial)
    {
        return Inertia::render('Testimonials/Edit', [
            'testimonial' => $testimonial
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Testimonial $testimonial)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'designation' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'source' => 'nullable|string|max:255',
        ]);

        if ($request->hasFile('image')) {
            $path = $this->imageUploader->uploadAndConvertToWebp($request->file('image'));
            $validated['image'] = $path;
        }

        $testimonial->update($validated);

        return redirect()->route('testimonials.index')
            ->with('success', 'Testimonial updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Testimonial $testimonial)
    {
        $testimonial->delete();

        return redirect()->route('testimonials.index')
            ->with('success', 'Testimonial deleted successfully.');
    }
}
