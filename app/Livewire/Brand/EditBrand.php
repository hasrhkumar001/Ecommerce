<?php

namespace App\Livewire\Brand;

use App\Models\Brand;
use Illuminate\Support\Str;
use Livewire\Component;
use Illuminate\Validation\Rule;


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
        $this->name = trim($this->name);
        $category = Brand::findOrFail($this->brand_id);
        $this->validate([
            'name' => [
                'required',
                'max:255',
                'regex:/^[a-zA-Z0-9\s]+$/',
                Rule::unique('brands', 'name')->ignore($category->id),
            ],
            'status' => ['required'],
        ]);

        
        if ($category->name !== $this->name || $category->status !== $this->status) {
            $category->update([
                'name' => $this->name,
                'status' => $this->status,
                'slug' => Str::slug($this->name),
            ]);
    
            session()->flash('message', 'Brand Updated Successfully.');
        } else {
            session()->flash('message', 'No changes made.');
        }
        return redirect()->route('brand.list');
    }
    public function render()
    {
        return view('livewire.brand.edit-brand');
    }
}
