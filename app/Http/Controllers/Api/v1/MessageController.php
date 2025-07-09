<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\MessageRequest;
use App\Models\Message;

class MessageController extends Controller
{

    public function __invoke(MessageRequest $request): \Illuminate\Http\JsonResponse
    {
        $data = $request->validated();
        $data['organization_id'] = $request->header('organization_id');

        $message = Message::create($data);

        // Dispatch the reply email to the queue
//        Mail::to($message->email)->queue(new \App\Mail\MessageReplyMail($message));

        return $this->successResponse([], 'Message sent successfully.');
    }

}
