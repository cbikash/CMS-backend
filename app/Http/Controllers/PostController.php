<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class PostController extends Controller
{
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
        return Inertia::render('posts/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        if($this->validateOrganization($post->id)) {
            return Redirect::back()->with('error', 'Sorry, you cannot edit yourself.');
        }
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {
        if($this->validateOrganization($post->id)) {
            return Redirect::back()->with('error', 'Sorry, you cannot edit yourself.');
        }
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
