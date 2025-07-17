<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Post;
use Illuminate\Support\Facades\Request;

class CommentController extends Controller
{
    public function index(Request $request, $post)
    {
        $orgId = $request->header('organization_id');

        $comments = Comment::where('organization_id', $orgId)
            ->where('post_id', $post)
            ->with('children')
            ->get();

        return $this->successResponse(['comments' => $comments], 'Comments retrieved successfully.');
    }

    public function store(Request $request, Post $post)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'nullable|email',
            'body' => 'required|string',
            'parent_id' => 'nullable|exists:comments,id',
        ]);

        $comment = $post->comments()->create([
            'body' => $request->get('body'),
            'name' => $request->get('name'),
            'email' => $request->get('email'),
            'parent_id' => $request->get('parent_id') ?? 0,
            'organization_id' => $request->header('organization_id'),
        ]);

        return $this->successResponse(['comment' => $comment], 'Comment created successfully.');
    }

}
