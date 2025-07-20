<?php

namespace App\Http\Middleware;

use App\Models\Token;
use App\Models\Visitor;
use Closure;
use hisorange\BrowserDetect\Parser as Browser;
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
            ->where('expires_at', '>', now())
            ->first();

        if (!$token) {
            return response()->json(['message' => 'Invalid or expired token.'], 401);
        }

        // Add organizationId to the request headers for downstream usage
        $request->headers->set('organization_id', $token->organization_id);

        return $next($request);
    }

    public function terminate(Request $request, Response $response)
    {
        $ip = $request->ip();
        $geo = geoip($ip);

        Visitor::create([
            'ip_address' => $ip,
            'country' => $geo->country,
            'city' => $geo->city,
            'browser' =>  Browser::browserFamily(),
            'device' => Browser::deviceFamily(),
            'page_visited' => $request->getPathInfo(),
            'referrer' => $request->server('HTTP_REFERER'),
        ]);
    }
}
