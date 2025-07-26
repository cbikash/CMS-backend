<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Message extends Model
{
    protected $guarded = [];

    public function replies(): HasMany
    {
        return $this->hasMany(MessageReply::class, 'message_id', 'id');
    }
}
