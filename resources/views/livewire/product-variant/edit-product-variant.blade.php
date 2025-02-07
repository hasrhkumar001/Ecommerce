<div class="container py-5 px-3 bg-white  shadow">
    <h2 class="mb-3">Edit Product Variant</h2>

    <form wire:submit.prevent="updateVariant">
        <div class="form-group mb-2">
            <label for="product">Product</label>
            <select wire:model="product_id" class="form-control" id="product">
                <option value="">Select Product</option>
                @foreach($products as $product)
                    <option value="{{ $product->id }}">{{ $product->name }}</option>
                @endforeach
            </select>
        </div>

        <div class="form-group mb-2">
            <label for="size">Size</label>
            <select wire:model="size" class="form-control" id="size">
                <option value="">Select Size</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
            </select>
            
        </div>

        <div class="form-group mb-2">
            <label for="stock">Stock</label>
            <input type="number" wire:model="stock" class="form-control" id="stock" placeholder="Enter stock quantity">
        </div>

        <button type="submit" class="btn btn-success ">Update Variant</button>
    </form>
</div>
