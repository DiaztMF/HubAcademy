<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Topic extends Model
{
    protected $fillable = ['section_id', 'title', 'content_markdown', 'embed_link', 'order'];

    protected function casts(): array
    {
        return [
            'content_markdown' => 'string',
        ];
    }

    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class);
    }
}
