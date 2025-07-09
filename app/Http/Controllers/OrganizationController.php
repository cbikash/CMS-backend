<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Models\Token;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class OrganizationController extends Controller
{

    /**
     * Display the specified resource.
     */
    public function show()
    {
        $organization = Organization::find(auth()->user()->organization_id);

        return Inertia::render('organization/profile/index', [
            'organization' => $organization,
        ]);
    }

    public function token()
    {
        $token = Token::where('organization_id', auth()->user()->organization_id)->orderBy('id', 'desc')->first();

        return Inertia::render('organization/profile/token', [
            'token' => $token,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Organization $organization)
    {
        if($this->validateOrganization($organization->id)) {
            return Redirect::back()->with('error', 'Sorry, you cannot edit yourself.');
        }


    }

}
