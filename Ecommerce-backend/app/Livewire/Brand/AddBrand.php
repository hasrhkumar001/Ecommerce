<?php

namespace App\Livewire\Brand;

use App\Models\Brand;
use Illuminate\Support\Str;
use Livewire\Component;

class AddBrand extends Component
{
    public $name, $status;

  

    public function store()
    {
        $this->name = trim($this->name);
        $this->validate([
            'name' => ['required', 'unique:brands,name', 'regex:/^[a-zA-Z0-9\s]+$/', 'max:255'],
            'status' => 'required',
        ], [
            'name.regex' => 'Brand name should only contain letters, numbers, and spaces.',
            'name.unique' => 'Brand name already exists.',
        ]);
       

           
        Brand::create([
            'name' => $this->name,
            'status' => $this->status,
            'slug' => Str::slug($this->name),
        ]);

        session()->flash('message', 'Brand Created Successfully.');
        return redirect()->route('brand.list');
    }
    public function render()
    {
        return view('livewire.brand.add-brand');
    }
}
