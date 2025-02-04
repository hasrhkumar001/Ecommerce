<div class="container ">
@if (session()->has('message'))
    <div class="alert alert-success alert-dismissible fade show" role="alert">
        {{ session('message') }}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
@endif
<form wire:submit.prevent="addVariant" class="py-5 px-3 shadow  bg-light">
        <h2 class=" mb-4 ">Add Product Variant</h2>
        <div class="mb-3">
            <label for="product" class="form-label fw-bold"><i class="fas fa-box"></i> Product</label>
            <select wire:model="product_id" class="form-select" id="product" @if($product_id) disabled @endif>
                <option value="" disabled>Select Product</option>
                @foreach($products as $product)
                    <option value="{{ $product->id }}">{{ $product->name }}</option>
                @endforeach
            </select>
            @error('product_id') <small class="text-danger">{{ $message }}</small> @enderror
        </div>

        <div class="mb-3">
            <label for="size" class="form-label fw-bold"><i class="fas fa-ruler"></i> Size</label>
            <select wire:model="size" class="form-select" id="size">
                <option value="" selected >Select Size</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
            </select>
            @error('size') <small class="text-danger">{{ $message }}</small> @enderror
        </div>

        <div class="mb-3">
            <label for="stock" class="form-label fw-bold"><i class="fas fa-cubes"></i> Stock</label>
            <input type="number" wire:model="stock" min="1" class="form-control" id="stock" placeholder="Enter stock quantity">
            @error('stock') <small class="text-danger">{{ $message }}</small> @enderror
        </div>

        <div class="text-end">
            <button type="submit" class="btn btn-primary btn-lg">
                <i class="fas fa-plus-circle"></i> Add Variant
            </button>
        </div>
    </form>
</div>
