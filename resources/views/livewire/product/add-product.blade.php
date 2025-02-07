<div class="container pb-5 pt-3 px-3">
    @if (session()->has('message'))
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            {{ session('message') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    @endif
    <div class="card shadow">
        <div class="card-header ">
            <h2 class=" mb-0">Add Product</h2>
        </div>
        <div class="card-body p-4">

            <form wire:submit.prevent="addProduct">
                <div class="mb-4">
                    <label for="name" class="form-label fw-bold">Name</label>
                    <input type="text" class="form-control" id="name" wire:model="name" placeholder="Enter product name">
                    @error('name') <span class="text-danger small">{{ $message }}</span> @enderror
                </div>

                <div class="mb-4">
                    <label for="description" class="form-label fw-bold">Description</label>
                    <textarea class="form-control" id="description" wire:model="description" rows="4" placeholder="Enter product description"></textarea>
                    @error('description') <span class="text-danger small">{{ $message }}</span> @enderror
                </div>

                <div class="row">
                    <div class="col-md-6 mb-4">
                        <label for="price" class="form-label fw-bold">Price</label>
                        <input type="number" class="form-control" id="price" wire:model="price" min="discounted_price" step="0.01" placeholder="Enter product price">
                        @error('price') <span class="text-danger small">{{ $message }}</span> @enderror
                    </div>
                    <div class="col-md-6 mb-4">
                        <label for="discounted_price" class="form-label fw-bold">Discounted Price</label>
                        <input type="number" class="form-control" id="discounted_price" wire:model="discounted_price" max="price" step="0.01" placeholder="Enter discounted price">
                        @error('discounted_price') <span class="text-danger small">{{ $message }}</span> @enderror
                    </div>
                </div>

                <div class="mb-4">
                    <label for="category" class="form-label fw-bold">Category</label>
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
                                wire:model="category_id"
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
                @php renderCategories($categories, 0, $expandedSections, 0); @endphp
            </div>

                    @error('category_id') <span class="text-danger small">{{ $message }}</span> @enderror
                </div>

                <div class="mb-4">
                    <label for="brand" class="form-label fw-bold">Brand</label>
                    <select class="form-select" id="brand" wire:model="brand_id">
                        <option value="" selected>Select a brand</option>
                        @foreach($brands as $brand)
                            <option value="{{ $brand->id }}">{{ $brand->name }}</option>
                        @endforeach
                    </select>
                    @error('brand_id') <span class="text-danger small">{{ $message }}</span> @enderror
                </div>

                <div class="mb-4">
                    <label for="status" class="form-label fw-bold">Status</label>
                    <select class="form-select" id="status" wire:model="status">
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                    @error('status') <span class="text-danger small">{{ $message }}</span> @enderror
                </div>

                <div class="d-grid">
                    <button type="submit" class="btn btn-primary py-2">Add Product</button>
                </div>
            </form>
        </div>
    </div>
</div>
