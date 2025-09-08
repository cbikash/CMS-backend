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
        $category = $request->get('category');
        $menu = $request->get('menu');
        $limit = $request->get('limit');

        $posts = Post::where('organization_id', $organization_id)
            ->where('status', 'published')
            ->orderBy('id', 'desc')
            ->when($category, function ($query) use ($category) {
                return $query->where('category_id', $category);
            })
            ->when($limit, function ($query) use ($limit) {
                return $query->limit($limit);
            })
            ->when($menu, function ($query) use ($menu) {
                return $query->where('menu_id', $menu);
            })
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
            ->with('images', 'createdBy')
            ->first();

        return $this->successResponse([
            'post' => $post
        ]);
    }

}
