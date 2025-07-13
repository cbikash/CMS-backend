<?php

use App\Http\Controllers\FaqController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\SubscriberController;
use App\Http\Controllers\TokenController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('posts', PostController::class);
    Route::resource('menus', MenuController::class);
    Route::resource('faqs', FaqController::class);
    Route::get('subscribers', [SubscriberController::class, 'index'])->name('subscribers.index');
    Route::get('messages', [MessageController::class, 'index'])->name('messages.index');
    Route::get('messages/{message}', [MessageController::class, 'show'])->name('messages.details');
    Route::put('messages/{message}/status', [MessageController::class, 'update'])->name('messages.status');
    Route::get('organization/profile', [OrganizationController::class, 'show']);
    Route::get('organization/token', [OrganizationController::class, 'token']);
});

Route::middleware(['auth', 'verified'])->prefix('ajax')->group(function () {
    Route::delete('/posts/{post}/{image}/remove', [ImageController::class, 'removeImage'])->name('images.remove');
    Route::post('/posts/{post}/images/uploads', [ImageController::class, 'uploadsImages'])->name('images.uploads');
    Route::put('/posts/{post}/status', [PostController::class, 'updateStatus'])->name('post.update.status');
});

Route::middleware(['auth', 'verified'])->prefix('ajax')->group(function () {
    Route::get('/menuNames', [MenuController::class, 'menuNames'])->name('menus');
    Route::post('/generate/organizations/token', [TokenController::class, 'store'])->name('organizations.token.generate');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
