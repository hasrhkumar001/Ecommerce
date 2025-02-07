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
        $this->validate([
            'name' => 'required',
            'status' => 'required',
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
