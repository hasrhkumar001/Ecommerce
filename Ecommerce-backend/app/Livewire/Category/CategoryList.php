<?php

namespace App\Livewire\Category;

use App\Models\Category;
use Livewire\Component;

class CategoryList extends Component
{
    public $categories;

    public function render()
    {
        $this->categories = Category::all();
        return view('livewire.category.category-list');
    }
    public function toggleStatus($categoryId)
    {
        $category = Category::findOrFail($categoryId);

        // Toggle the status between 'Active' and 'Inactive'
        $category->status = $category->status === 'Active' ? 'Inactive' : 'Active';
        $category->save();

        // Flash a message
        session()->flash('message', 'Category status updated successfully.');
    }

    public function delete($id)
    {
        Category::find($id)->delete();
        Category::where('parent_id',$id)->delete();
        session()->flash('message', 'Category Deleted Successfully.');
    }
    
}
