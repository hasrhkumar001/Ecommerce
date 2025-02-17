<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RecentlyViewed extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'product_id',
        'viewed_at',
    ];

    // Define relationships (if needed)
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function product()
    {
        return $this->belongsTo(Product::class)
            ->with(['brand', 'images', 'reviews', 'variants','category']);
    }
}
