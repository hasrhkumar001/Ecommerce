<?php

namespace App\Http\Controllers;

use App\Models\RecentlyViewed;
use Illuminate\Http\Request;

class RecentlyViewedController extends Controller
{
    public function addRecentlyViewed(Request $request)
    {
        $validatedData = $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);
    
        $userId = auth()->id();
    
        // Prevent duplicate entries
        $existing = RecentlyViewed::where('user_id', $userId)
            ->where('product_id', $validatedData['product_id'])
            ->first();
    
        if (!$existing) {
            RecentlyViewed::create([
                'user_id' => $userId,
                'product_id' => $validatedData['product_id'],
            ]);
        }
    
        return response()->json(['message' => 'Product added to recently viewed.'], 201);
    }
    public function getRecentlyViewed()
{
    // Get the authenticated user's ID
    $userId = auth()->id();

    // Check if the user is authenticated
    if (!$userId) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    // Fetch the recently viewed products for the user
    $recentlyViewed = RecentlyViewed::where('user_id', $userId)
        ->orderBy('updated_at', 'desc')
        ->take(5) // Limit to the last 5 items
        ->with('product')
        ->get();

    // If no recently viewed items found, return an empty response
    if ($recentlyViewed->isEmpty()) {
        return response()->json([]);
    }

    // Extract products from the recently viewed records
    $products = $recentlyViewed->pluck('product');

    // Attach wishlist status to each product
    $products->each(function ($product) use ($userId) {
        $product->is_wishlisted = $product->wishlists()->where('user_id', $userId)->exists();
    });

    // Add average rating and sizes to each product
    $products->each(function ($product) {
        $product->average_rating = $product->reviews->avg('rating') ?? 0;
        $product->sizes = $product->variants->mapWithKeys(function ($variant) {
            return [$variant->size => $variant->stock];
        });
        unset($product->variants); // Remove variants if not needed in the response
    });

    // Return the recently viewed products with additional data
    return response()->json($products);
}
        
    }
