<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Review extends Model
{
    use HasFactory;
    protected $fillable = ['user_id', 'product_id', 'rating', 'review', 'reviewHeading'];

    public function product()
    {
        return $this->belongsTo(Product::class,'product_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
