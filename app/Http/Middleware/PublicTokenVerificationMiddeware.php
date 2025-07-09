<?php

namespace App\Http\Middleware;

use App\Models\Token;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PublicTokenVerificationMiddeware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {

        $tokenString = $request->headers->get('CMS-Token');

        if (!$tokenString) {
            return response()->json(['message' => 'Missing token.'], 401);
        }

        $token = Token::where('secret', $tokenString)
            ->where('expire_at', '>', now())
            ->first();

        if (!$token) {
            return response()->json(['message' => 'Invalid or expired token.'], 401);
        }

        // Add organizationId to the request headers for downstream usage
        $request->headers->set('organizationId', $token->organizationId); // fixed typo

        return $next($request);
    }
}
