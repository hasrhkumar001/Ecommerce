<div class="container  p-4 shadow rounded bg-light">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="">Category List</h2>
        <a href="{{ route('category.add') }}" class="btn btn-primary shadow-sm">
            <i class="fas fa-plus-circle me-2"></i>Add New Category
        </a>
    </div>

    <!-- Success and Error Messages -->
    @if (session()->has('message'))
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            {{ session('message') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    @endif
    @if (session()->has('error'))
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            {{ session('error') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    @endif
    @php
        // Recursive function to get the full category hierarchy
        function getCategoryHierarchyName($category, $categories) {
            if ($category->parent_id != 0) {
                $parentCategory = $categories->firstWhere('id', $category->parent_id);
                if ($parentCategory) {
                    return getCategoryHierarchyName($parentCategory, $categories) . ' > ' . $category->name;
                }
            }
            return $category->name;
        }
    @endphp

    <!-- Categories Table -->
    <div class="table-responsive">
        <table class="table table-striped align-middle shadow-sm">
            <thead class="table-primary">
                <tr>
                    <th>Serial No.</th>
                    <th class="">Name</th>
                    <th class="text-center">Status</th>
                    <th class="text-center">Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach($categories as $category)
                    <tr>
                        <td>{{$loop->iteration}}</td>
                        <td class=""> {{ getCategoryHierarchyName($category, $categories) }}</td>
                        <td class="text-center">
                            <button 
                                class="btn btn-sm px-3 {{ $category->status === 'Active' ? 'btn-success' : 'btn-danger' }}" 
                                wire:click="toggleStatus({{ $category->id }})">
                                {{ $category->status }}
                            </button>
                        </td>
                        <td class="text-center">
                            <a href="{{ route('category.edit', $category->id) }}" class="btn btn-warning btn-sm shadow-sm me-2">
                                <i class="fas fa-edit"></i> Edit
                            </a>
                            <button 
                                wire:click="delete({{ $category->id }})" 
                                class="btn btn-danger btn-sm shadow-sm">
                                <i class="fas fa-trash-alt"></i> Delete
                            </button>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>
