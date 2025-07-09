<?php

namespace App\Http\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class TokenService
{
    public function generateToken(string $prefix = 'CMS_', bool $disablePrevious = false): string
    {
        $user = auth()->user();
        $organizationId = $user->organizationId;

        // Generate unique token
        $uuid = Str::uuid()->toString();
        $orgIdPart = $organizationId ? "_{$organizationId}" : '';
        $plainToken = $prefix . $uuid . $orgIdPart;
        $hashedToken = Hash::make($plainToken);

        // Optionally expire old tokens for this org
        if ($disablePrevious) {
            DB::table('tokens')
                ->where('organization_id', $organizationId)
                ->update(['expires_at' => now()]);
        }

        // Store new token
        DB::table('tokens')->insert([
            'token' => $hashedToken,
            'secret' => $plainToken, // Optional: consider removing or encrypting
            'organization_id' => $organizationId,
            'expires_at' => now()->addYear(),
            'created_by' => $user->id,
            'updated_by' => $user->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Return the plain token (give to client only once)
        return $plainToken;
    }
}
