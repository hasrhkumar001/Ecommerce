<?php

namespace App\Livewire\Product;

use Livewire\Component;
use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;

class EditProduct extends Component
{
    public $productId;
    public $name;
    public $description;
    public $price;
    public $discounted_price;
    public $category_id;
    public $expandedSections = [];
    public $brand_id;
    public $status;

    protected $rules = [
        'name' => 'required|string|max:255',
        'description' => 'nullable|string',
        'price' => 'required|numeric|min:0',
        'discounted_price' => 'required|numeric|min:0',
        'category_id' => 'required|exists:categories,id',
        'brand_id' => 'required|exists:brands,id',
        'status' => 'in:Active,Inactive',
    ];

    public function mount($productId)
    {
        $product = Product::findOrFail($productId);
        $this->productId = $product->id;
        $this->name = $product->name;
        $this->description = $product->description;
        $this->price = $product->price;
        $this->discounted_price = $product->discounted_price;
        $this->category_id = $product->category_id;
        $this->brand_id = $product->brand_id;
        $this->status = $product->status;
    }

    public function updateProduct()
    {
        $this->validate();

        $product = Product::findOrFail($this->productId);
        $product->update([
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'discounted_price' => $this->discounted_price,
            'category_id' => $this->category_id,
            'brand_id' => $this->brand_id,
            'status' => $this->status,
        ]);

        session()->flash('message', 'Product updated successfully.');
    }
    public function toggleSection($id)
    {
        // Toggle expanded/collapsed state for a category
        if (isset($this->expandedSections[$id])) {
            unset($this->expandedSections[$id]);
        } else {
            $this->expandedSections[$id] = true;
            
        }
    }

    public function render()
    {
        return view('livewire.product.edit-product', [
            'categories' => Category::all(),
            'brands' => Brand::all(),
        ]);
    }
}