<div class="container mt-5">
    @if (session()->has('message'))
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            {{ session('message') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    @endif
    <div class="card shadow-sm border-0 rounded-4">
        <div class="card-header bg-primary text-white rounded-top-4">
            <h3 class="mb-0">Add New Brand</h3>
        </div>
        <div class="card-body p-4">
            <form wire:submit.prevent="store">
                <!-- Name Field -->
                <div class="form-group mb-4">
                    <label for="name" class="form-label fw-semibold">Brand Name</label>
                    <input 
                        type="text" 
                        id="name" 
                        wire:model="name" 
                        class="form-control shadow-sm @error('name') is-invalid @enderror" 
                        placeholder="Enter brand name"
                    >
                    @error('name') 
                        <span class="text-danger small">{{ $message }}</span> 
                    @enderror
                </div>

                <!-- Status Field -->
                <div class="form-group mb-4">
                    <label for="status" class="form-label fw-semibold">Status</label>
                    <select 
                        id="status" 
                        wire:model="status" 
                        class="form-select shadow-sm @error('status') is-invalid @enderror"
                    >
                        <option value="">Select Status</option>
                        <option value="Active" selected>Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                    @error('status') 
                        <span class="text-danger small">{{ $message }}</span> 
                    @enderror
                </div>

                <!-- Submit Button -->
                <div class="text-end">
                    <button type="submit" class="btn btn-success btn-lg px-4">
                        Save Brand <i class="bi bi-check-circle-fill ms-2"></i>
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
