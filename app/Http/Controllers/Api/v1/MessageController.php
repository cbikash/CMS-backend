<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\MessageRequest;
use App\Mail\ContactReplyMail;
use App\Models\Message;
use App\Models\Organization;
use Illuminate\Support\Facades\Mail;

class MessageController extends Controller
{

    public function __invoke(MessageRequest $request): \Illuminate\Http\JsonResponse
    {
        $data = $request->validated();
        $data['organization_id'] = $request->header('organization_id');
        $organization = Organization::find($data['organization_id'])->first();

        Message::create($data);

        Mail::to($request->get('email'))->send(new ContactReplyMail(
            $request->get('name'),
            $request->get('title'),
            $organization
        ));

        return $this->successResponse([], 'Message sent successfully.');
    }

}
