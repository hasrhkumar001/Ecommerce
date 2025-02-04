<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
      

        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'review' => 'required|string|max:1000',
            'reviewHeading' => 'required|string|max:100',
        ]);

        // Check if the user has already reviewed this car
        $existingReview = Review::where('user_id', Auth::id())
                                ->where('product_id', $validated['product_id'])
                                ->first();

        if ($existingReview) {
            return response()->json(['error' => 'You have already reviewed this product'], 403);
        }

        $review = Review::create([
            'user_id' => Auth::id(),
            'product_id' => $validated['product_id'],
            'rating' => $validated['rating'],
            'review' => $validated['review'],
            'reviewHeading' => $validated['reviewHeading'],
            
        ]);
        Cache::forget('top_products');

        return response()->json(['message' => 'Review submitted successfully.', 'review' => $review]);
    }
    public function index($productId)
    {
        // Fetch only approved reviews
        $reviews = Review::where('product_id', $productId)
                        ->with('user:id,name')
                        ->get();

        return response()->json($reviews);
    }
}
