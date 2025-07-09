<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\SubscriptionRequest;
use App\Models\Subscriber;
use Illuminate\Http\JsonResponse;

class SubscriptionController extends Controller
{
    public function __invoke(SubscriptionRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['organization_id'] = $request->header('organization_id');

        Subscriber::create($data);

        return $this->successResponse([], 'Subscription created successfully.');
    }
}
