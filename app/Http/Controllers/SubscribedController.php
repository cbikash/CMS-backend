<?php

namespace App\Http\Controllers;

use App\Models\Subscribed;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubscribedController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $subscribers = Subscribed::query()
            ->where('organization_id', auth()->user()->organization_id)
            ->get();

        return Inertia::render('subscribed/index', [
            'subscribers' => $subscribers
        ]);
    }
}
