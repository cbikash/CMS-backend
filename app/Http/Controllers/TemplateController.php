<?php

namespace App\Http\Controllers;

use App\Models\Template;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TemplateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $templates = Template::query()
            ->where('organization_id', auth()->user()->organization_id)
            ->get()
        ;

        return Inertia::render('Templates/Index', [
            'templates' => $templates
        ]);

    }
}
