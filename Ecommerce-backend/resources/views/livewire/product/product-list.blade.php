<div class="container p-4 shadow rounded bg-light">
@if (session()->has('message'))
    <div class="alert alert-success alert-dismissible fade show" role="alert">
        {{ session('message') }}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
@endif
<div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="">Product List</h2>
        <a href="{{ route('product.create') }}" class="btn btn-primary shadow-sm">
            <i class="fas fa-plus-circle me-2"></i>Add New Product
        </a>
    </div>

    
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

    <table class="table table-striped table-hover align-middle">
        <thead class="table-primary">
            <tr>
                <th>Serial No.</th>
                <th>Name</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Price</th>
                <th class="text-center">Status</th>
                <th class="text-center">Variants</th>
                <th class="text-center">Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach($products as $product)
                <tr>
                    <td>{{ $loop->iteration }}</td>
                    <td>{{ $product->name }}</td>
                    <td>  {{ getCategoryHierarchyName($product->category, $categories) }}</td>
                    <td>{{ $product->brand->name }}</td>
                    <td>₹{{ number_format($product->discounted_price, 2) }}</td>
                    <td class="text-center">
                        <button 
                            class="btn btn-sm {{ $product->status === 'Active' ? 'btn-success' : 'btn-danger' }}" 
                            wire:click="toggleStatus({{ $product->id }})">
                            {{ $product->status }}
                        </button>
                    </td>
                    <td class="text-center">
                        <div class="btn-group" role="group">
                            <a href="{{ route('list.variants', $product->id) }}" 
                               wire:navigate 
                               class="btn btn-primary btn-sm">
                                Stock
                            </a>
                            <a href="{{ route('product-images.add', $product->id) }}" 
                               wire:navigate 
                               class="btn btn-warning btn-sm">
                                Images
                            </a>
                        </div>
                    </td>
                    <td class="text-center">
                        <div class="btn-group" role="group">
                            <a href="{{ route('product.edit', $product->id) }}" 
                               wire:navigate 
                               class="btn btn-outline-warning btn-sm">
                                <i class="bx bx-edit"></i>
                            </a>
                            <button wire:click="delete({{ $product->id }})" 
                                    class="btn btn-outline-danger btn-sm">
                                <i class="bx bx-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
</div>
