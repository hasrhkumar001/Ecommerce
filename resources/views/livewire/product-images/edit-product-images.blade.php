<div>
    <h2>Edit Product Image</h2>
    <form wire:submit.prevent="update">
        <div>
            <label>Product ID:</label>
            <input type="text" wire:model="product_id">
            @error('product_id') <span>{{ $message }}</span> @enderror
        </div>
        <div>
            <label>New Image (optional):</label>
            <input type="file" wire:model="new_image">
            @error('new_image') <span>{{ $message }}</span> @enderror
        </div>
        <button type="submit">Update</button>
    </form>
</div>
