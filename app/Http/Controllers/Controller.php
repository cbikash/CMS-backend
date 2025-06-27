<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Traits\ApiResponseTrait;

abstract class Controller
{
    use ApiResponseTrait;


    public function validateOrganization($orgId): bool
    {
        return $orgId != auth()->user()->organization_id;
    }
}
