<?php

namespace App\Http\Controllers;

use App\Http\Services\ImageUploaderService;
use App\Models\Organization;
use App\Models\Token;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;
use Inertia\Inertia;

class OrganizationController extends Controller
{
    public function __construct(private readonly ImageUploaderService $imageUploaderService)
    {

    }

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
    public function update(Request $request, Organization $organization): RedirectResponse
    {
        // Prevent updating certain restricted organizations
        if ($this->validateOrganization($organization->id)) {
            return Redirect::back()->with('error', 'Sorry, you cannot edit this organization.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'address1' => 'nullable|string|max:255',
            'address2' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'zip' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:255',
            'phone1' => 'nullable|string|max:255',
            'fax' => 'nullable|string|max:255',
            'website' => 'nullable|url|max:255',
        ]);

        $validated['slug'] = Str::slug($request->get('name'));

        // Handle file uploads
        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('logos', 'public');
        }

        if ($request->hasFile('logo_v1')) {
            $validated['logo_v1'] = $request->file('logo_v1')->store('logos', 'public');
        }

        if ($request->hasFile('logo_v2')) {
            $validated['logo_v2'] = $request->file('logo_v2')->store('logos', 'public');
        }

        // Update the organization
        $organization->update($validated);

        return redirect()->back()->with('success', 'Organization updated successfully.');
    }

}
