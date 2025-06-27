<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;
use Inertia\Inertia;

class MenuController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $menus = Menu::query()
            ->where('organization_id', auth()->user()->organization_id)
            ->orderByDesc('id')
            ->get();

        return Inertia::render('menus/menus', [
            'menus' => $menus
        ]);
    }

    public function menuNames()
    {
        $menus = Menu::select('id, name')
            ->where('organization_id', auth()->user()->organization_id)
            ->orderByDesc('id')
            ->get();

        return $this->successResponse([
            'menus' => $menus
        ], 'Successfully fetch menus');
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
        ]);

        Menu::create([
            'name' => $request->get('name'),
            'url' => Str::slug($request->get('name')),
            'organization_id' => auth()->user()->organization_id,
        ]);

        return Redirect::route('menus.index')->with('success', 'Menu created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Menu $menu)
    {
        if($this->validateOrganization($menu->organization_id)) {
            return Redirect::route('menus.index')->with('error', 'Sorry, you cannot edit yourself.');
        }

        $request->validate([
            'name' => 'required',
        ]);

        $menu->update([
            'name' => $request->get('name'),
            'url' => Str::slug($request->get('name'))
        ]);

        return Redirect::route('menus.index')->with('success', 'Menu updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Menu $menu)
    {
        if($this->validateOrganization($menu->organization_id)) {
            return Redirect::route('menus.index')->with('error', 'Sorry, you cannot edit yourself.');
        }

        $menu->delete();

        return Redirect::route('menus.index')->with('success', 'Menu deleted successfully.');
    }

    public function getPosts(Request $request): \Inertia\Response
    {
        $menus = Menu::query()
            ->where('organization_id', auth()->user()->organization_id)
            ->with('posts')
            ->orderByDesc('id')
            ->get();

        return Inertia::render('menus/posts', [
            'menus' => $menus,
        ]);
    }

    public function getPages(Request $request, Menu $menu): \Inertia\Response
    {
        $menus = $menu->page()->get();

        return Inertia::render('menus/posts', [
            'menu' => $menus,
        ]);
    }
}
