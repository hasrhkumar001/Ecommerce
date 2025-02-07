<div class="container mt-4">
    @if (session()->has('message'))
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            {{ session('message') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    @endif
    <h4 class=" mb-4">Add Product Images</h4>
    <div class="card p-4 shadow-sm">
        <form wire:submit.prevent="save">
            <!-- Product ID -->
            <div class="form-group mb-3">
                <label for="product_id" class="form-label">Product ID:</label>
                <input 
                    type="text" 
                    id="product_id" 
                    class="form-control @if($product_id) bg-light text-muted @endif"
                    wire:model="product_id" 
                    @if($product_id) disabled @endif 
                >
                @error('product_id') 
                    <span class="text-danger small">{{ $message }}</span> 
                @enderror
            </div>
            
            <!-- Images -->
            <div class="form-group mb-3 position-relative">
    <label for="images" class="form-label">Upload Images:</label>
    <input 
        type="file" 
        id="images" 
        class="form-control" 
        wire:model="images" 
        multiple
    >
    
    @error('images.*') 
        <span class="text-danger small">{{ $message }}</span> 
    @enderror
</div>


            <!-- Submit Button -->
            <div class="text-end">
                <button type="submit" class="btn btn-primary btn-lg">
                <div wire:loading wire:target="images" class=" ">
                    <div class="spinner-border text-white " style="width: 20px; height: 20px; font-weight:300;" role="status">
                        
                    </div>
                </div>
                    Upload <i class="bi bi-upload"></i>
                </button>
            </div>
        </form>
    </div>
    <div class="d-flex justify-content-between align-items-center my-4">
        <h2 class="h4">Product Images List</h2>
        
    </div>
    <div class="container  shadow-sm rounded bg-light">
    

    <!-- Product Images Table -->
    <div class="table-responsive">
    @if ($productImages->isEmpty())
        <div class="text-center p-4">
            <h5 class="text-muted">No product images found.</h5>
        </div>
    @else
        <table class="table table-striped table-bordered align-middle shadow-sm">
            <thead class="table-primary">
                <tr>
                    <th class="text-center">Image</th>
                    <th class="text-center">Product ID</th>
                    <th class="text-center">Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($productImages as $image)
                <tr>
                    <td class="text-center">
                        <img src="{{ asset('storage/' . $image->image_path) }}" alt="Product Image" class="img-fluid rounded" width="50">
                    </td>
                    <td class="text-center">{{ $image->product_id }}</td>
                    <td class="text-center">
                        <button 
                            wire:click="delete({{ $image->id }})"
                            class="btn btn-danger btn-sm shadow-sm"
                            title="Delete Image">
                            <i class="fas fa-trash-alt"></i> Delete
                        </button>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
        @endif
    </div>
</div>

</div>
