<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class FaqController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $faqs = Faq::query()->where('organization_id', auth()->user()->organization_id)->get();

        return Inertia::render('faqs/index', [
            'faqs' => $faqs
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'question' => 'required',
            'answer' => 'required'
        ]);

        Faq::create([
            'question' => $request->question,
            'answer' => $request->answer,
            'organization_id' => auth()->user()->organization_id
        ]);

        return Redirect::route('faqs.index');
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Faq $faq)
    {
        if($this->validateOrganization($faq->organization_id))
        {
            return redirect()->route('faq.index')->withErrors([
                'error' => 'You cannot edit this faq'
            ]);
        }

        $request->validate([
            'question' => 'required',
            'answer' => 'required'
        ]);

       $faq->question = $request->get('question');
       $faq->answer = $request->get('answer');
       $faq->save();


        return Redirect::route('faqs.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Faq $faq)
    {
        if($this->validateOrganization($faq->organization_id))
        {
            return redirect()->route('faq.index')->withErrors([
                'error' => 'You cannot edit this faq'
            ]);
        }

        $faq->delete();

        return Redirect::route('faqs.index');
    }
}
