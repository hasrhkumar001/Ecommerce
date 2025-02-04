<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'shipping_address_id',
        'user_id',
        'payment_method',
        'status',
        'price',
    ];

    public function shippingDetail()
    {
        return $this->belongsTo(ShippingDetail::class, 'shipping_address_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class)->with('product');
    }
}
