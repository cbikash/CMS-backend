<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class MessageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $messages = Message::query()
            ->where('organization_id', auth()->user()->organization_id)
            ->orderByDesc('id')
            ->get();

        return Inertia::render('messages/index', [
            'messages' => $messages
        ]);
    }


    /**
     * Display the specified resource.
     */
    public function show(Message $message)
    {
        return Inertia::render('messages/show', [
            'message' => $message
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Message $message)
    {
        $message->update([
            'status' => 'read'
        ]);

        return Redirect::route('messages.index');
    }
}
