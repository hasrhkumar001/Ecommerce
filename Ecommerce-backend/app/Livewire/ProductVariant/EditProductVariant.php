<?php

namespace App\Livewire\ProductVariant;

use Livewire\Component;
use App\Models\Product;
use App\Models\ProductVariant;

class EditProductVariant extends Component
{
    public $variantId;
    public $product_id;
    public $size;
    public $stock;

    public function mount($variantId)
    {
        $variant = ProductVariant::findOrFail($variantId);
        $this->variantId = $variant->id;
        $this->product_id = $variant->product_id;
        $this->size = $variant->size;
        $this->stock = $variant->stock;
    }

    public function render()
    {
        $products = Product::all();
        return view('livewire.product-variant.edit-product-variant', compact('products'));
    }

    public function updateVariant()
    {
        $this->validate([
            'product_id' => 'required',
            'size' => 'required',
            'stock' => 'required|integer',
        ]);

        $variant = ProductVariant::find($this->variantId);
        $variant->update([
            'product_id' => $this->product_id,
            'size' => $this->size,
            'stock' => $this->stock,
        ]);

        session()->flash('message', 'Product variant updated successfully.');
    }
}