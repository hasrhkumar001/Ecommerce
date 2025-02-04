<?php

namespace App\Livewire\ProductVariant;

use App\Models\ProductVariant;
use Livewire\Component;

class ProductVariantList extends Component
{
    public $variants;
    public $product_id;
    public function mount($product_id = null)
    {
        $this->product_id = $product_id;
        if ($product_id) {
            $this->variants = ProductVariant::where('product_id', $product_id)->get();
        }
    }

    

    public function deleteVariant($id)
    {
        ProductVariant::findOrFail($id)->delete();
        session()->flash('message', 'Product variant deleted successfully.');
        $this->variants = ProductVariant::where('product_id', $this->product_id)->get();
    }
    
}
