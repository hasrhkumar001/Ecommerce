<div class="container my-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="fw-bold">Brand List</h2>
        <a href="{{ route('brand.add') }}" class="btn btn-primary shadow-sm">
            <i class="fas fa-plus-circle me-2"></i>Add New Brand
        </a>
    </div>

    <!-- Success and Error Messages -->
    @if (session()->has('message'))
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            {{ session('message') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    @endif

    <!-- Brands Table -->
    <div class="table-responsive">
        <table class="table table-striped align-middle shadow-sm">
            <thead class="table-primary">
                <tr>
                    <th>Serial No.</th>
                    <th>Name</th>
                    <th class="text-center">Status</th>
                    <th class="text-center">Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach($brands as $brand)
                    <tr>
                        <td>{{$loop->iteration}}</td>
                        <td >{{ $brand->name }}</td>
                        <td class="text-center">
                            <!-- Toggle button for status -->
                            <button 
                                class="btn btn-sm {{ $brand->status === 'Active' ? 'btn-success' : 'btn-danger' }}" 
                                wire:click="toggleStatus({{ $brand->id }})">
                                {{ $brand->status }}
                            </button>
                        </td>
                        <td class="text-center">
                            <a href="{{ route('brand.edit', $brand->id) }}" class="btn btn-warning btn-sm shadow-sm me-2">
                                <i class="fas fa-edit"></i> Edit
                            </a>
                            <button wire:click="delete({{ $brand->id }})" class="btn btn-danger btn-sm shadow-sm">
                                <i class="fas fa-trash-alt"></i> Delete
                            </button>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>
