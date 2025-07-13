<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Post extends Model
{
    protected $guarded = [];

    public function images(): MorphToMany
    {
        return $this->morphToMany(Image::class, 'imageable', 'imageables');
    }

}
