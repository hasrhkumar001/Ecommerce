<?php

namespace App\Livewire\Brand;

use App\Models\Brand;
use Livewire\Component;

class BrandList extends Component
{
    public $brands;

    public function render()
    {
        $this->brands = Brand::all();
        return view('livewire.brand.brand-list');
    }
    public function toggleStatus($categoryId)
    {
        $brand = Brand::findOrFail($categoryId);

        // Toggle the status between 'Active' and 'Inactive'
        $brand->status = $brand->status === 'Active' ? 'Inactive' : 'Active';
        $brand->save();

        // Flash a message
        session()->flash('message', 'Brand status updated successfully.');
    }

    public function delete($id)
    {
        Brand::find($id)->delete();
        session()->flash('message', 'Brand Deleted Successfully.');
    }
    
}
