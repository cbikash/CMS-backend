<?php

namespace App\Http\Controllers;

use App\Http\Services\ImageUploaderService;
use App\Models\Image;
use App\Models\Menu;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PostController extends Controller
{
    public function __construct(private readonly ImageUploaderService $imageUploader)
    {

    }


    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posts = Post::query()
            ->where('organization_id', auth()->user()->organization_id)
            ->orderBy('id', 'desc')
            ->get()
        ;

        return Inertia::render('posts/index', [
            'posts' => $posts,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $menus = Menu::select('id', 'name')
            ->where('organization_id', auth()->user()->organization_id)
            ->orderByDesc('id')
            ->get();

        return Inertia::render('posts/create1', [
            'menus' => $menus,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'keywords' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,gif,webp', // 2MB max
        ]);

        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['title']) . '-' . Str::random(4);

        $validated['seo'] = $validated['seo'] ?? Str::limit(strip_tags($validated['body']), 150);


        if ($request->hasFile('image')) {
            $path = $this->imageUploader->uploadAndConvertToWebp($request->file('image'));
            $validated['image'] = $path;
        }

        $post = Post::create([
            'title' => $validated['title'],
            'body' => $validated['body'],
            'keywords' => $validated['keywords'] ?? '',
            'image' => $validated['image'] ?? null,
            'slug' => $validated['slug'],
            'seo' => $validated['seo'],
            'menu_id' => $validated['menu_id'],
            'created_by' => auth()->id(),
            'updated_by' => auth()->id(),
            'published_by' => auth()->id(),
            'organization_id' => auth()->user()->organization_id
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $uploadedImage) {
                $path = $this->imageUploader->uploadAndConvertToWebp($uploadedImage);

                $image = Image::create([
                    'name' => $path,
                ]);

                $post->images()->attach($image->id);
            }
        }

        return redirect()->route('posts.index')->with('success', 'Post created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        $post->load('images');

        if($this->validateOrganization($post->organization_id)) {
            return Redirect::back()->with('error', 'Sorry, you cannot edit yourself.');
        }

        return Inertia::render('posts/details', [
            'post' => $post
        ]);
    }

    public function updateStatus(Post $post, Request $request)
    {
        // Example validation or authorization check
        if ($this->validateOrganization($post->organization_id)) {
            return Redirect::back()->with('error', 'Sorry, you cannot edit yourself.');
        }

        // Toggle status (assuming 'published' and 'unpublished' string values)
        $post->status = $post->status === 'published' ? 'draft' : 'published';

        // Save changes
        $post->save();

        // Return JSON response for AJAX or redirect with flash message for web
        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'status' => $post->status,
                'message' => 'Post status updated successfully.',
            ]);
        }

        return Redirect::back()->with('success', 'Post status updated successfully.');
    }


    /**
     * Update the specified resource in storage.
     */
    public function edit(Request $request, Post $post)
    {
        $post->load('images');

        if ($this->validateOrganization($post->organization_id)) {
            return Redirect::back()->with('error', 'Sorry, you cannot edit yourself.');
        }

        return Inertia::render('posts/edit', [
            'post' => $post
        ]);
    }


    public function update(Request $request, Post $post)
    {

        // Validate incoming request data
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'keywords' => 'nullable|string',
            'menu_id' => 'nullable|integer',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,gif,webp', // 2MB max
        ]);

        if ($request->hasFile('image')) {
            $path = $this->imageUploader->uploadAndConvertToWebp($request->get('image'));

            $validatedData['image'] = $path;
        }

        // Update the post with validated data
        $post->update($validatedData);


        $existingImageIds = $request->input('existing_images');
        $post->images()->sync($existingImageIds);

        if ($request->hasFile('new_images')) {
            foreach ($request->file('new_images') as $file) {
                $path = $this->imageUploader->uploadAndConvertToWebp($file);
                $image = Image::create(['name' => $path]);
                $post->images()->attach($image->id);
            }
        }

        // Redirect back with success message
        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'post' => $post,
                'message' => 'Post updated successfully',
            ]);
        }

        return Redirect::route('posts.show', $post->id)
            ->with('success', 'Post updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        if($this->validateOrganization($post->id)) {
            return Redirect::back()->with('error', 'Sorry, you cannot edit yourself.');
        }
    }
}
