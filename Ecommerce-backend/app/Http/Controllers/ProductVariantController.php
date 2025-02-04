<?php

namespace App\Http\Controllers;

use App\Models\ProductVariant;
use Illuminate\Http\Request;

class ProductVariantController extends Controller
{
    /**
     * Get product variants by productId.
     *
     * @param int $productId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getVariants($productId)
    {
        // Fetch variants where stock > 0
        $variants = ProductVariant::where('product_id', $productId)
            ->where('stock', '>', 0)
            ->get(['id', 'size', 'stock']);

        if ($variants->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No variants available for the specified product.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'product_id' => $productId,
                'variants' => $variants,
            ],
        ], 200);
    }
}
