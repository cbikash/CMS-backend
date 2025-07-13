<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $organization_id = $request->header('organization_id');

        $posts = Post::where('organization_id', $organization_id)
            ->where('status', 'published')
            ->get();

        return $this->successResponse([
            'posts' => $posts
        ]);
    }

    public function show($slug, Request $request)
    {
        $organization_id = $request->header('organization_id');

        $post = Post::where('slug', $slug)
            ->where('organization_id', $organization_id)
            ->with('images')
            ->first();

        return $this->successResponse([
            'post' => $post
        ]);
    }

}
