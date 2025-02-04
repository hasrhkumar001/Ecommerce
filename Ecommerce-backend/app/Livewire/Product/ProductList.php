<?php

namespace App\Livewire\Product;

use App\Models\Category;
use App\Models\Product;
use Livewire\Component;

class ProductList extends Component
{
    public $categories;
    public function toggleStatus($productId)
    {
        $product = Product::findOrFail($productId);

        // Toggle the status between 'Active' and 'Inactive'
        $product->status = $product->status === 'Active' ? 'Inactive' : 'Active';
        $product->save();

        // Flash a message
        session()->flash('message', 'Product status updated successfully.');
    }
    public function viewProductVariants($product_id)
    {
        return redirect()->route('list.variants', ['product_id' => $product_id]);
    }
    public function delete($id)
    {
        Product::find($id)->delete();
        session()->flash('message', 'Product Deleted Successfully.');
    }

    public function render()
    {
        $this->categories = Category::all();
        return view('livewire.product.product-list', [
            'products' => Product::with('category', 'brand')->get()
        ],);
    }
    
}
