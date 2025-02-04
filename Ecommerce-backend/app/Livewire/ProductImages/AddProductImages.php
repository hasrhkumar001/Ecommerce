<?php

namespace App\Livewire\ProductImages;

use Livewire\Component;
use Livewire\WithFileUploads;
use App\Models\ProductImage;

class AddProductImages extends Component
{
    use WithFileUploads;

    public $product_id,$productImages;
    public $images = [];

    public function mount($product_id = null)
    {
        $this->product_id = $product_id;
        $this->productImages = ProductImage::where('product_id',$product_id)->get();
    }

    public function delete($id)
    {
        $image = ProductImage::find($id);
        if ($image) {
            \Storage::disk('public')->delete($image->image_path);
            $image->delete();
            session()->flash('success', 'Image deleted successfully!');
            $this->productImages = ProductImage::where('product_id',$this->product_id)->get();
        }
    }

    public function save()
    {
        $this->validate([
            'product_id' => 'required|exists:products,id',
            'images.*' => 'required|image|max:1024',
        ]);

        foreach ($this->images as $image) {
            $filename = $image->getClientOriginalName();
            $path = $image->storeAs('Product_images', $filename, 'public');

            ProductImage::create([
                'product_id' => $this->product_id,
                'image_path' => $path,
            ]);
        }

        $this->reset(['images']);
        session()->flash('success', 'Images added successfully!');
        
        $this->productImages = ProductImage::where('product_id',$this->product_id)->get();
        return redirect()->route('add.variant', ['product_id' => $this->product_id]);
    }

    public function render()
    {
        return view('livewire.product-images.add-product-images');
    }
}
