<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SliderController;
use App\Http\Controllers\SubscriberController;
use App\Http\Controllers\TestimonialController;
use App\Http\Controllers\TokenController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [AuthenticatedSessionController::class, 'create'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('posts', PostController::class);
    Route::resource('faqs', FaqController::class);
    Route::get('subscribers', [SubscriberController::class, 'index'])->name('subscribers.index');
    Route::get('messages', [MessageController::class, 'index'])->name('messages.index');
    Route::get('messages/{message}', [MessageController::class, 'show'])->name('messages.details');
    Route::get('messages/{message}/reply', [MessageController::class, 'reply'])->name('messages.reply');
    Route::put('messages/{message}/status', [MessageController::class, 'update'])->name('messages.status');
    Route::get('organization/profile', [OrganizationController::class, 'show']);
    Route::get('organization/token', [OrganizationController::class, 'token']);
    Route::post('organizations/{organization}', [OrganizationController::class, 'update']);
    Route::get('users', [UserController::class, 'index'])->name('users.index');
    Route::post('users', [UserController::class, 'store'])->name('users.store');
    Route::resource('roles', RoleController::class);
    Route::post('/users/{user}/assign-role', [UserController::class, 'assign']);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('menus', MenuController::class)->except('show');
    Route::get('menus/{menu}/categories', [MenuController::class, 'categories']);
    Route::post('menus/{menu}/categories', [MenuController::class, 'createCategory']);
    Route::put('menus/{menu}/categories/{category}', [MenuController::class, 'updateCategory']);
    Route::delete('menus/{menu}/categories/{category}', [MenuController::class, 'deleteCategory']);
    Route::get('menus/{menu}/posts', [MenuController::class, 'getPosts']);
    Route::get('/sliders', [SliderController::class, 'index'])->name('sliders.index');
    Route::resource('testimonials', TestimonialController::class);
    Route::resource('contacts', ContactController::class);
});

Route::middleware(['auth', 'verified'])->prefix('ajax')->group(function () {
    Route::delete('/posts/{post}/{image}/remove', [ImageController::class, 'removeImage'])->name('images.remove');
    Route::post('/posts/{post}/images/uploads', [ImageController::class, 'uploadsImages'])->name('images.uploads');
    Route::put('/posts/{post}/status', [PostController::class, 'updateStatus'])->name('post.update.status');

    Route::post('/sliders', [SliderController::class, 'store'])->name('sliders.store');
    Route::delete('/sliders/{slider}', [SliderController::class, 'destroy'])->name('sliders.delete');
    Route::post('/messages/{message}/reply', [MessageController::class, 'reply'])->name('messages.reply');
});

Route::middleware(['auth', 'verified'])->prefix('ajax')->group(function () {
    Route::get('/menuNames', [MenuController::class, 'menuNames'])->name('menus');
    Route::post('/generate/organizations/token', [TokenController::class, 'store'])->name('organizations.token.generate');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/hotel.php';
