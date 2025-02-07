<?php

namespace App\Livewire\Category;

use App\Models\Category;
use Livewire\Component;
use Illuminate\Support\Str;

class EditCategory extends Component
{
    public $category_id, $name, $status, $parent_id;
    public $expandedSections = [];

    public function mount($id)
    {
        $category = Category::find($id);
        $this->category_id = $id;
        $this->name = $category->name;
        $this->status = $category->status;
        $this->parent_id =$category->parent_id;
    }

    public function render()
    {
        return view('livewire.category.edit-category',[
            'categories' => Category::all(),
        ]);
    }
    public function toggleSection($id)
    {
        // Toggle expanded/collapsed state for a category
        if (isset($this->expandedSections[$id])) {
            unset($this->expandedSections[$id]);
        } else {
            $this->expandedSections[$id] = true;
            
        }
    }

    public function update()
    {
        $this->validate([
            'name' => 'required',
            'status' => 'required',
            
        ]);
        // dd($this->parent_id);

        $category = Category::find($this->category_id);
        $category->update([
            'name' => $this->name,
            'status' => $this->status,
            'parent_id' => $this->parent_id,

        ]);

        session()->flash('message', 'Category Updated Successfully.');
        return redirect()->route('category.list');
    }
}
