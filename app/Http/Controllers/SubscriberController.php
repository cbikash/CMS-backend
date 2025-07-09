<?php

namespace App\Http\Controllers;

use App\Models\Subscriber;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubscriberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $subscribers = Subscriber::query()
            ->where('organization_id', auth()->user()->organization_id)
            ->get();

        return Inertia::render('orgSettings/index', [
            'subscribers' => $subscribers
        ]);
    }
}
