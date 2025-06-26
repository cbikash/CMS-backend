<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class PageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pages = Page::query()
            ->where('organization_id', auth()->user()->organization_id)
            ->orderByDesc('id')
            ->get();

        return Inertia::render('pages/index', [
            'pages' => $pages
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

    }

    /**
     * Display the specified resource.
     */
    public function show(Page $page)
    {
        if($this->validateOrganization($page->organization_id)) {
            return Redirect::back()->with('error', 'Sorry, you cannot edit yourself.');
        }

        return Inertia::render('pages/show', [
            'page' => $page
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Page $page)
    {
        if($this->validateOrganization($page->organization_id)) {
            return Redirect::back()->with('error', 'Sorry, you cannot edit yourself.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Page $page)
    {
        if($this->validateOrganization($page->organization_id)) {
            return Redirect::back()->with('error', 'Sorry, you cannot edit yourself.');
        }
    }
}
