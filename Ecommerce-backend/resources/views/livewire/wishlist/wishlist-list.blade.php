<div>
    <h2>My Wishlist</h2>
    <div class="wishlist-items">
        @foreach ($wishlists as $item)
            <div class="wishlist-item">
                <img src="{{ $item->product->image }}" alt="{{ $item->product->name }}" class="wishlist-image" />
                <div class="wishlist-details">
                    <h3>{{ $item->product->name }}</h3>
                    <p>Size: {{ $item->size }}</p>
                    <p>${{ number_format($item->product->price, 2) }}</p>
                </div>
                <button class="btn remove" wire:click="removeItem({{ $item->id }})">Remove</button>
                <button class="btn add-to-cart" wire:click="addToCart({{ $item->id }})">Add to Cart</button>
            </div>
        @endforeach
    </div>
</div>
