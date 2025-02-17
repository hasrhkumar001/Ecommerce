<?php

namespace App\Livewire\ProductImages;

use Livewire\Component;
use Livewire\WithFileUploads;
use App\Models\ProductImage;

class EditProductImages extends Component
{
    use WithFileUploads;

    public $productImageId;
    public $product_id;
    public $new_image;

    public function mount($id)
    {
        $image = ProductImage::findOrFail($id);
        $this->productImageId = $image->id;
        $this->product_id = $image->product_id;
    }

    public function update()
    {
        $this->validate([
            'product_id' => 'required|exists:products,id',
            'new_image' => 'nullable|image|max:1024',
        ]);

        $image = ProductImage::findOrFail($this->productImageId);
        if ($this->new_image) {
            \Storage::disk('public')->delete($image->image_path);
            $filename = $this->new_image->getClientOriginalName();
            $path = $this->new_image->storeAs('Product_images', $filename, 'public');
            $image->image_path = $path;
        }
        $image->product_id = $this->product_id;
        $image->save();

        session()->flash('success', 'Image updated successfully!');
    }

    public function render()
    {
        return view('livewire.product-images.edit-product-images');
    }
}
