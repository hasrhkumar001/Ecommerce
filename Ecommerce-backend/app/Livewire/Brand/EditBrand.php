<?php

namespace App\Livewire\Brand;

use App\Models\Brand;
use Illuminate\Support\Str;
use Livewire\Component;

class EditBrand extends Component
{
    public $brand_id, $name, $status;

    public function mount($id)
    {
        $brand = Brand::find($id);
        $this->brand_id = $id;
        $this->name = $brand->name;
        $this->status = $brand->status;
    }

    

    public function update()
    {
        $this->validate([
            'name' => 'required',
            'status' => 'required',
        ]);

        $category = Brand::find($this->brand_id);
        $category->update([
            'name' => $this->name,
            'status' => $this->status,
            'slug' => Str::slug($this->name),
        ]);

        session()->flash('message', 'Brand Updated Successfully.');
        return redirect()->route('brand.list');
    }
    public function render()
    {
        return view('livewire.brand.edit-brand');
    }
}
