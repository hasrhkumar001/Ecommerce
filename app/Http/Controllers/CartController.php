<?php

namespace App\Http\Controllers;

use App\Models\ProductVariant;
use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function getCart(Request $request)
    {
        $userId = $request->user()->id;

        // Fetch cart items with product details
        $cartItems = Cart::with('product')->where('user_id', $userId)->get();

        return response()->json([
            'success' => true,
            'data' => $cartItems,
        ]);
    }

    public function addToCart(Request $request)
{
    $validated = $request->validate([
        'product_id' => 'required|exists:products,id',
        'size' => 'required|string',
        'quantity' => 'required|integer|min:1',
    ]);

    $variant = ProductVariant::where('product_id', $validated['product_id'])
        ->where('size', $validated['size'])
        ->first();

    if (!$variant) {
        return response()->json([
            'success' => false,
            'message' => 'Variant not found.',
        ], 404);
    }

    if ($variant->stock < $validated['quantity']) {
        return response()->json([
            'success' => false,
            'message' => 'Insufficient stock for the selected variant.',
        ]);
    }

    $cart = Cart::where([
        'user_id' => Auth::id(),
        'size' => $validated['size'],
        'product_id' => $validated['product_id'],
    ])->first();

    if ($cart) {
        // Add to the existing quantity
        $newQuantity = $cart->quantity + $validated['quantity'];

        // if ($variant->stock < $newQuantity) {
        //     return response()->json([
        //         'success' => false,
        //         'message' => 'Insufficient stock for the selected variant.',
        //     ]);
        // }

        $cart->quantity = $newQuantity;
        $cart->save();
    } else {
        // Create a new cart entry
        $cart = Cart::create([
            'user_id' => Auth::id(),
            'size' => $validated['size'],
            'product_id' => $validated['product_id'],
            'quantity' => $validated['quantity'],
        ]);
    }

    return response()->json([
        'success' => true,
        'message' => 'Product added to cart.',
        'data' => $cart,
    ]);
}


    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cartItem = Cart::where('user_id',  Auth::id())->findOrFail($id);
        $cartItem->update(['quantity' => $request->quantity]);

        return response()->json(['message' => 'Cart item updated', 'data' => $cartItem], 200);
    }

    public function removeFromCart(Request $request, $id)
    {
        $cartItem = Cart::find($id);

        if (!$cartItem || $cartItem->user_id !== $request->user()->id) {
            return response()->json(['success' => false, 'message' => 'Item not found.'], 404);
        }

        $cartItem->delete();

        return response()->json(['success' => true, 'message' => 'Item removed from cart.']);
    }
    public function clearCart(Request $request)
    {
        // Ensure the user is authenticated
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access.',
            ], 401);
        }

        $userId = Auth::id();

        // Check if the user has cart items
        $cartItems = Cart::where('user_id', $userId);
        if (!$cartItems->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'No items found in the cart.',
            ]);
        }

        // Delete all cart items for the user
        $cartItems->delete();

        return response()->json([
            'success' => true,
            'message' => 'All cart items have been removed.',
        ]);
    }

}
