<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use Symfony\Component\HttpFoundation\Request;

class MenuController extends Controller
{

    public function index(Request $request)
    {
        $organization_id = $request->header('organization_id');
        $type = $request->get('type', 'main');
        $isVisible = $request->get('isVisible', true);

        $menus = Menu::where('type', $type)
            ->where('is_visible', $isVisible)
            ->where('organization_id', $organization_id)
            ->first();

        return $this->successResponse([
            'menus' => $menus
        ]);
    }

    public function menuCategories(Request $request, Menu $menu)
    {
       $menu->load(['categories']);

        return $this->successResponse([
            'menu' => $menu
        ]);
    }


    public function menuPosts(Request $request, Menu $menu)
    {
        $menu->load(['posts', 'categories']);

        return $this->successResponse([
            'menu' => $menu
        ]);
    }
}
