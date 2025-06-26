<?php

use App\Http\Controllers\FaqController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\SubscriberController;
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


});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
