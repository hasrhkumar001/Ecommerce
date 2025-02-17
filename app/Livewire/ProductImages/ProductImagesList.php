<?php

namespace App\Livewire\ProductImages;

use App\Models\ProductImage;
use Livewire\Component;

class ProductImagesList extends Component
{
    public $productImages;

    public function mount()
    {
        $this->productImages = ProductImage::with('product')->get();
    }

    public function delete($id)
    {
        $image = ProductImage::find($id);
        if ($image) {
            \Storage::disk('public')->delete($image->image_path);
            $image->delete();
            $this->productImages = ProductImage::with('product')->get();
        }
    }
    public function render()
    {
        return view('livewire.product-images.product-images-list');
    }
}
