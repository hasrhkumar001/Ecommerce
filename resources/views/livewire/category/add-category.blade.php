<div class="container  p-4 shadow   bg-white">
    <h2 class="mb-4 ">Add New Category</h2>

    <form wire:submit.prevent="store">
        <div class="form-group mb-4">
            <label for="name" class="form-label">Category Name</label>
            <input type="text" id="name" wire:model="name" class="form-control  shadow-sm" placeholder="Enter category name">
            @error('name') <span class="text-danger small">{{ $message }}</span> @enderror
        </div>

        <div class="form-group mb-4">
            
            <label for="parent_id" class="form-label">Parent Category</label>
            <div class="form-control shadow-sm" style="max-height: 200px; overflow-y: auto; background-color: #f9f9f9; padding: 10px;">
                @php
                    // Recursive function within Blade syntax
                    function renderCategories($categories, $parentId, $expandedSections, $selectedParentId) {
                        $children = $categories->where('parent_id', $parentId);

                        if ($children->isEmpty()) return;

                        foreach ($children as $category) {
                            $hasChildren = $categories->where('parent_id', $category->id)->isNotEmpty();
                @endphp

                {{-- Render Category --}}
                <div class="bg-white rounded-lg p-2 mb-2 shadow-sm">
                    <div class="d-flex justify-content-between align-items-center"
                        wire:click="toggleSection({{ $category->id }})"
                        style="cursor: pointer;">
                        <label class="d-flex align-items-center space-x-2">
                            <input type="radio"
                                value="{{ $category->id }}"
                                wire:model="parent_id"
                                class="form-check-input me-2"
                                @if($selectedParentId == $category->id) checked @endif
                            />
                            <span class="text-dark">{{ $category->name }}</span>
                        </label>

                        {{-- Toggle Icon --}}
                        @if($hasChildren)
                            <i class="fa {{ isset($expandedSections[$category->id]) ? 'fa-chevron-up' : 'fa-chevron-down' }} text-muted"></i>
                        @endif
                    </div>

                    {{-- Render Child Categories --}}
                    @if(isset($expandedSections[$category->id]) && $hasChildren)
                        <div class="pt-2 ps-4">
                            @php renderCategories($categories, $category->id, $expandedSections, $selectedParentId); @endphp
                        </div>
                    @endif
                </div>

                @php
                        }
                    }
                @endphp

                {{-- Start rendering from root categories --}}
                @php renderCategories($categories, 0, $expandedSections, $parent_id); @endphp
            </div>


            
            @error('parent_id') <span class="text-danger small">{{ $message }}</span> @enderror
        </div>

        <div class="form-group mb-4">
            <label for="status" class="form-label">Status</label>
            <select id="status" wire:model="status" class="form-select  shadow-sm">
            <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
            </select>
            @error('status') <span class="text-danger small">{{ $message }}</span> @enderror
        </div>

        <div class="d-grid gap-2">
            <button type="submit" class="btn btn-primary shadow">Save Category</button>
        </div>
    </form>
</div>
