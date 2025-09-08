<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Slider;
use App\Models\Testimonial;
use Symfony\Component\HttpFoundation\Request;

class TesimonialController extends Controller
{
    public function __invoke(Request $request)
    {
        $organization_id = $request->header('organization_id');

        $testimonials = Testimonial::where('organization_id', $organization_id)
            ->get();

        return $this->successResponse([
            'testimonials' => $testimonials
        ]);
    }

}
