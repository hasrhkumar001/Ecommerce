<div class="container mt-5">
    @if (session()->has('message'))
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            {{ session('message') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    @endif
    <div class="card shadow">
        <div class="card-header bg-primary text-white">
            <h3 class="mb-0">Edit Product</h3>
        </div>
        <div class="card-body">

            <form wire:submit.prevent="updateProduct">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="name" class="form-label fw-bold">Product Name</label>
                        <input type="text" wire:model="name" id="name" class="form-control" placeholder="Enter product name">
                        @error('name') <span class="text-danger small">{{ $message }}</span> @enderror
                    </div>

                    <div class="col-md-3 mb-3">
                        <label for="price" class="form-label fw-bold">Price</label>
                        <input type="text" wire:model="price" id="price" class="form-control" placeholder="Enter price">
                        @error('price') <span class="text-danger small">{{ $message }}</span> @enderror
                    </div>

                    <div class="col-md-3 mb-3">
                        <label for="discounted_price" class="form-label fw-bold">Discounted Price</label>
                        <input type="text" wire:model="discounted_price" id="discounted_price" class="form-control" placeholder="Enter discounted price">
                        @error('discounted_price') <span class="text-danger small">{{ $message }}</span> @enderror
                    </div>

                    <div class="col-md-12 mb-3">
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

                    <div class="col-md-6 mb-3">
                        <label for="brand" class="form-label fw-bold">Brand</label>
                        <select wire:model="brand_id" id="brand" class="form-select">
                            <option value="">Select Brand</option>
                            @foreach($brands as $brand)
                                <option value="{{ $brand->id }}">{{ $brand->name }}</option>
                            @endforeach
                        </select>
                        @error('brand_id') <span class="text-danger small">{{ $message }}</span> @enderror
                    </div>

                    <div class="col-md-6 mb-3">
                        <label for="status" class="form-label fw-bold">Status</label>
                        <select wire:model="status" id="status" class="form-select">
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>

                    <div class="col-12 mb-3">
                        <label for="description" class="form-label fw-bold">Description</label>
                        <textarea wire:model="description" id="description" class="form-control" rows="4" placeholder="Enter product description"></textarea>
                        @error('description') <span class="text-danger small">{{ $message }}</span> @enderror
                    </div>
                </div>

                <div class="text-end">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save me-2"></i>Update Product
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
