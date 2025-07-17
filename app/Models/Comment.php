<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    public function children()
    {
        $this->hasMany(Comment::class, 'parent_id');
    }
}
