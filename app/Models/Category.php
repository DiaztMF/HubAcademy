<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = ['name', 'slug', 'is_protected', 'description'];

    protected function casts(): array
    {
        return ['is_protected' => 'boolean'];
    }

    public function posts(): HasMany
    {
        return $this->hasMany(ForumPost::class);
    }
}
