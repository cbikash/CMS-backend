<?php

namespace App\Http\Controllers;

use App\Mail\ReplyMessage;
use App\Models\Message;
use App\Models\MessageReply;
use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
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
            'message' => $message->load('replies')
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Message $message): \Illuminate\Http\JsonResponse
    {
        $message->update([
            'status' => 'read'
        ]);

        return response()->json([
            'message' => 'successfully updated message'
        ]);
    }

    public function reply(Request $request, Message $message)
    {
        $request->validate([
            'reply' => 'required|string|max:5000',
        ]);

        MessageReply::create([
            'body' => $request->get('reply'),
            'sender_id' => auth()->id(),
            'message_id' => $message->id
        ]);

        // Organization info (could be from DB or config)
        $organization = Organization::find(auth()->user()->organization_id)->first();

        // Send reply email to original sender
        Mail::to($message->email)->send(new ReplyMessage(
            $message->name,
            $request->input('reply'),
            $organization
        ));

        return back()->with('success', 'Reply sent successfully to the user.');
    }
}
