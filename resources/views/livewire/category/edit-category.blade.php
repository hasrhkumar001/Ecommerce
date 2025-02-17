<div class="container    p-4 shadow rounded bg-light">
    <h2 class=" mb-4">Edit Category</h2>

    <!-- Form Start -->
    <form wire:submit.prevent="update" class="needs-validation">
        <!-- Category Name -->
        <div class="mb-3">
            <label for="name" class="form-label fw-semibold">Category Name</label>
            <input 
                type="text" 
                id="name" 
                wire:model="name" 
                class="form-control shadow-sm {{ $errors->has('name') ? 'is-invalid' : '' }}" 
                placeholder="Enter category name"
            >
            @error('name') 
                <div class="invalid-feedback">{{ $message }}</div> 
            @enderror
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

        <!-- Status -->
        <div class="mb-4">
            <label for="status" class="form-label fw-semibold">Status</label>
            <select 
                id="status" 
                wire:model="status" 
                class="form-select shadow-sm {{ $errors->has('status') ? 'is-invalid' : '' }}"
            >
                <option value="" disabled>Select status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
            </select>
            @error('status') 
                <div class="invalid-feedback">{{ $message }}</div> 
            @enderror
        </div>

        <!-- Submit Button -->
        <div class="text-end">
            <button type="submit" class="btn btn-success px-4 py-2 shadow">
                <i class="fas fa-save me-2"></i>Update Category
            </button>
        </div>
    </form>
</div>
