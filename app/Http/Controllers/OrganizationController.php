<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class OrganizationController extends Controller
{

    /**
     * Display the specified resource.
     */
    public function show(Organization $organization)
    {
        if($this->validateOrganization($organization->id)) {
            return Redirect::back()->with('error', 'Sorry, you cannot edit yourself.');
        }

        return Inertia::render('organizations/show', [
            'organization' => $organization,
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
