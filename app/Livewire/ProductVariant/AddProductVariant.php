<?php

namespace App\Livewire\ProductVariant;

use Livewire\Component;
use App\Models\Product;
use App\Models\ProductVariant;

class AddProductVariant extends Component
{
    public $product_id;
    public $size;
    public $stock;

    public $products;

    public function mount($product_id = null)
    {
        $this->product_id = $product_id;
        if ($product_id) {
            $this->products = Product::where('id', $product_id)->get();
        }else{
        $this->products = Product::all();
        }
    }

    public function addVariant()
    {
        $this->validate([
            'product_id' => 'required',
            'size' => 'required',
            'stock' => 'required|integer',
        ]);
        // dd($this->size);

        ProductVariant::updateOrCreate(
            [
                'product_id' => $this->product_id,
                'size' => $this->size,
            ],
            [
                'stock' => \DB::raw('stock + ' . $this->stock),
            ]
        );

        session()->flash('message', 'Product variant added successfully.');
        $this->resetFields();
    }

    public function resetFields()
    {
    
        $this->size = '';
        $this->stock = '';
    }
}
