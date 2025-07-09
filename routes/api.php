<?php

use App\Http\Controllers\Api\v1\MessageController;
use App\Http\Controllers\Api\v1\SubscriptionController;
use App\Http\Controllers\Api\v1\FaqController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('client.auth')->group(function () {
    Route::post('messages', MessageController::class);
    Route::post('subscribe', SubscriptionController::class);
    Route::get('/faqs', FaqController::class);
});
