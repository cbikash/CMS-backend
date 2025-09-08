<?php

use App\Http\Controllers\Api\v1\CommentController;
use App\Http\Controllers\Api\v1\MenuController;
use App\Http\Controllers\Api\v1\MessageController;
use App\Http\Controllers\Api\v1\PostController;
use App\Http\Controllers\Api\v1\SliderController;
use App\Http\Controllers\Api\v1\SubscriptionController;
use App\Http\Controllers\Api\v1\FaqController;
use App\Http\Controllers\Api\v1\TesimonialController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('client.auth')->group(function () {
    Route::post('messages', MessageController::class);
    Route::post('subscribe', SubscriptionController::class);
    Route::get('/faqs', FaqController::class);
    Route::get('/posts', [PostController::class, 'index']);
    Route::get('/posts/{slug}', [PostController::class, 'show']);
    Route::get('/testimonials', TesimonialController::class);
    Route::get('/sliders', SliderController::class);
    Route::get('/menus', [MenuController::class, 'index']);
    Route::get('/menus/{menu}/categories', [MenuController::class, 'menuCategories']);
    Route::get('/menus/{menu:url}/posts', [MenuController::class, 'menuPosts']);
    Route::get('/comments/{post}', [CommentController::class, 'index']);
    Route::post('/comments/{post}', [CommentController::class, 'store']);
});
