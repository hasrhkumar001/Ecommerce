<?php

namespace App\Livewire\Category;

use App\Models\Category;
use Illuminate\Support\Str;
use Livewire\Component;

class AddCategory extends Component
{
    public $name, $status, $parent_id;
    public $categories = [];
    public $expandedSections = [];
    public $selectedCategories = [];

    public function mount()
    {
        // Fetch all categories
        $this->categories = Category::all();
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

    public function render()
    {
        return view('livewire.category.add-category',[
            'categories' => Category::all(),
        ]);
    }
    private function generateUniqueSlug($name)
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $count = 1;

        // Check if the slug already exists
        while (Category::where('slug', $slug)->exists()) {
            // Append a numeric suffix to make the slug unique
            $slug = $originalSlug . '-' . $count;
            $count++;
        }

        return $slug;
    }

    public function store()
    {
        $this->validate([
            'name' => 'required',
            'status' => 'required',
            
        ]);
        // dd($this->parent_id);

        Category::create([
            'name' => $this->name,
            'status' => $this->status,
            'slug' => $this->generateUniqueSlug($this->name),
            'parent_id' => $this->parent_id ?? 0,
        ]);

        session()->flash('message', 'Category Created Successfully.');
        return redirect()->route('category.list');
    }
}
