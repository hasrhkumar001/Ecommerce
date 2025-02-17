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
            // Trim all inputs before validation
        $this->name = trim($this->name);
        $this->description = trim($this->description);

        $this->validate([
            'name' => ['required', 'string', 'max:255', 'unique:products,name', 'regex:/^[a-zA-Z0-9\s]+$/'],
            'description' => ['nullable', 'string', 'max:1000'],
            'price' => ['required', 'numeric', 'min:0'],
            'discounted_price' => ['nullable', 'numeric', 'lte:price', 'min:0'],
            'category_id' => ['required', 'exists:categories,id'],
            'brand_id' => ['required', 'exists:brands,id'],
            'status' => ['required'],
        ]);

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
