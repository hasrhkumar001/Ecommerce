<?php

namespace App\Livewire\Product;

use Livewire\Component;
use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;

class AddProduct extends Component
{
    public $name;
    public $description;

    public $price,$discounted_price;
    public $category_id;
    public $brand_id;
    public $expandedSections = [];
    public $status = 'Active';

    protected $rules = [
        'name' => 'required|string|max:255',
        'description' => 'nullable|string',
        'price' => 'required|numeric|min:0',
        'discounted_price' => 'required|numeric|min:0',
        'category_id' => 'required|exists:categories,id',
        'brand_id' => 'required|exists:brands,id',
        'status' => 'in:Active,Inactive',
    ];

    public function toggleSection($id)
    {
        // Toggle expanded/collapsed state for a category
        if (isset($this->expandedSections[$id])) {
            unset($this->expandedSections[$id]);
        } else {
            $this->expandedSections[$id] = true;
            
        }
    }

    public function addProduct()
    {
        $this->validate();

        $product = Product::create([
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'discounted_price' => $this->discounted_price,
            'category_id' => $this->category_id,
            'brand_id' => $this->brand_id,
            'status' => $this->status,
        ]);

        session()->flash('message', 'Product added successfully.');

        // Reset input fields
        $this->reset();
        return redirect()->route('product-images.add', ['product_id' => $product->id]);

    }

    public function render()
    {
        return view('livewire.product.add-product', [
            'categories' => Category::all(),
            'brands' => Brand::all(),
        ]);
    }
}
