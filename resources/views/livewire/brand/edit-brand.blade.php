<div class="container my-5">
@if (session()->has('message'))
    <div class="alert alert-success alert-dismissible fade show" role="alert">
        {{ session('message') }}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
@endif
    <div class="card shadow-sm">
        <div class="card-header bg-primary text-white">
            <h4 class="mb-0">Edit Brand</h4>
        </div>
        <div class="card-body">
            <form wire:submit.prevent="update">
                <div class="mb-3">
                    <label for="name" class="form-label">Brand Name</label>
                    <input 
                        type="text" 
                        id="name" 
                        wire:model="name" 
                        class="form-control @error('name') is-invalid @enderror" 
                        placeholder="Enter brand name">
                    @error('name') 
                        <div class="invalid-feedback">{{ $message }}</div> 
                    @enderror
                </div>

                <div class="mb-3">
                    <label for="status" class="form-label">Status</label>
                    <select 
                        id="status" 
                        wire:model="status" 
                        class="form-select @error('status') is-invalid @enderror">
                        <option value="" disabled>Select status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                    @error('status') 
                        <div class="invalid-feedback">{{ $message }}</div> 
                    @enderror
                </div>

                <div class="d-grid gap-2">
                    <button type="submit" class="btn btn-success">
                        <i class="fas fa-save me-1"></i> Update Brand
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
