<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
    public function index()
    {
        $wishlists = Wishlist::where('user_id', Auth::id())
            ->with('product') // Include product details
            ->get();

        return response()->json($wishlists);
    }

    // Add a product to the wishlist
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            
        ]);

        $wishlist = Wishlist::updateOrCreate([
            'user_id' => Auth::id(),
            'product_id' => $request->product_id,
            
        ]);

        return response()->json(['message' => 'Product added to wishlist', 'wishlist' => $wishlist], 201);
    }

    public function check($productId)
    {
        $exists = Wishlist::where('user_id', Auth::id())
            ->where('product_id', $productId)
            ->exists();

        return response()->json(['exists' => $exists]);
    }

    // Remove a product from the wishlist
    public function destroy($id)
    {
        $wishlist = Wishlist::where('product_id', $id)->where('user_id', Auth::id())->first();

        if (!$wishlist) {
            return response()->json(['message' => 'Wishlist item not found'], 404);
        }

        $wishlist->delete();

        return response()->json(['message' => 'Product removed from wishlist']);
    }
}
