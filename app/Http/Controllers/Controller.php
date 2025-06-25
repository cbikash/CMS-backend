<?php

namespace App\Http\Controllers;

use App\Models\Organization;

abstract class Controller
{
    public function validateOrganization($orgId): bool
    {
        return $orgId != auth()->user()->organization_id;
    }
}
