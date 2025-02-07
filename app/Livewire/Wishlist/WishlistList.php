<?php

namespace App\Livewire\Wishlist;

use App\Models\Wishlist;
use Livewire\Component;


class WishlistList extends Component
{
    public $wishlists;

    public function mount()
    {
        $this->wishlists = Wishlist::where('user_id', auth()->id())
            ->with('product') // Load product details
            ->get();
    }

    public function removeItem($id)
    {
        Wishlist::find($id)->delete();
        $this->wishlists = Wishlist::where('user_id', auth()->id())
            ->with('product')
            ->get();
    }

    public function addToCart($id)
    {
        // Logic to add product to cart goes here
        session()->flash('message', 'Item added to cart!');
    }

    public function render()
    {
        return view('livewire.wishlist.wishlist-list', [
            'wishlists' => $this->wishlists,
        ]);
    }
}

