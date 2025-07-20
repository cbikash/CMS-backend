<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Menu;
use App\Models\Post;
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

    public function show(Menu $menu)
    {


    }

    public function categories(Menu $menu)
    {
        $categories = Category::query()
            ->where('menu_id', $menu->id)
            ->get();

        return Inertia::render('menus/categories/index', [
            'menu' => $menu,
            'categories' => $categories
        ]);
    }

    public function createCategory(Menu $menu)
    {
        $validate = request()->validate([
            'name' => 'required',
        ]);

        Category::query()->create([
            'name' =>   $validate['name'],
            'menu_id' => $menu->id,
            'organization_id' => auth()->user()->organization_id,
        ]);

        return \redirect()->back()->with('success', 'Category created');
    }

    public function updateCategory(Menu $menu, Category $category)
    {
        $validate = request()->validate([
            'name' => 'required',
        ]);

        $category->update([
            'name' =>   $validate['name']
        ]);

        return \redirect()->back()->with('success', 'Category created');
    }

    public function deleteCategory(Menu $menu, Category $category)
    {
        $category->delete();
        return \redirect()->back()->with('success', 'Category deleted');
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
            'is_visible' => $request->get('is_visible'),
            'type' => $request->get('type'),
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
            'is_visible' => $request->get('is_visible'),
            'type' => $request->get('type'),
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

    public function getPosts(Menu $menu, Request $request): \Inertia\Response
    {
        $posts = Post::query()
            ->where('menu_id', $menu->id)
            ->with('category')
            ->get();

        return Inertia::render('menus/posts/index', [
            'menu' => $menu,
            'posts' => $posts
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
