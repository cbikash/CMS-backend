<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Symfony\Component\HttpFoundation\Request;

class FaqController extends Controller
{
    public function __invoke(Request $request)
    {
        $orgId = $request->header('organization_id');

        $faqs = Faq::query()
            ->where('organization_id', $orgId)
            ->get();

        return $this->successResponse($faqs, 'Faqs retrieved');
    }

}
