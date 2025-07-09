<?php

namespace App\Http\Controllers;

use App\Http\Services\TokenService;
use App\Models\Token;
use Illuminate\Http\Request;

class TokenController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $token = Token::query()
            ->where('organization_id', auth()->user()->organization_id)
            ->first();

        return $this->successResponse($token, 'Token Fetch successfully');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TokenService $tokenService)
    {
         $plainToken = $tokenService->generateToken();

        return $this->successResponse([
            'plainToken' => $plainToken,
        ], 'Token created successfully.');
    }
}
