<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrderDetail extends Model
{
    use HasFactory;
    protected $fillable = ['order_id', 'product_id', 'quantity', 'size'];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function ordersByCategory()
    {
        $ordersByCategory = OrderDetail::with('product.category')
            ->get()
            ->groupBy(function ($detail) {
                return $detail->product->category->name ?? 'Uncategorized';
            })
            ->map(function ($group) {
                return $group->sum('quantity');
            });

        return view('dashboard', compact('ordersByCategory'));
    }

    public function product()
    {
        return $this->belongsTo(Product::class)->with('images','brand');
    }
}
