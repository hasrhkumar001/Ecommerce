<?php
namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class ProductController extends Controller
{

    private function getAllDescendantCategoryIds($categoryId)
    {
        $descendants = collect([$categoryId]);

        // Find immediate children of the current category
        $childCategories = Category::where('parent_id', $categoryId)->pluck('id');

        foreach ($childCategories as $childId) {
            // Recursively fetch descendants of each child
            $descendants = $descendants->merge($this->getAllDescendantCategoryIds($childId));
        }

        return $descendants;
    }

    // Get all products
    public function index(Request $request)
    {
        $query = Product::query();

        // Filter by category
        if ($request->filled('category')) {
            $category = $request->input('category');
            $category = is_array($category) ? $category : [$category];

            // Get category IDs by their names
            $categoryIds = Category::where('slug', $category)->where('status', 'active')->pluck('id');

            // Get all descendant category IDs recursively
            $allCategoryIds = collect();
            foreach ($categoryIds as $id) {
                $allCategoryIds = $allCategoryIds->merge($this->getAllDescendantCategoryIds($id));
            }

            // Apply the query condition
            $query->whereIn('category_id', $allCategoryIds->unique());
        }



        // Filter by price range
        if ($request->filled('price_range')) {
            $priceRange = explode(',', $request->price_range);
            $minPrice = $priceRange[0];
            $maxPrice = $priceRange[1];
            $query->whereBetween('discounted_price', [$minPrice, $maxPrice]);
        }

        // Filter by sizes
        if ($request->filled('sizes')) {
            $sizes = explode(',', $request->input('sizes'));
            $query->whereHas('variants', function ($variantQuery) use ($sizes) {
                $variantQuery->whereIn('size', $sizes)->where('stock', '>', 0);
            });
        }

        // Filter by rating
        if ($request->filled('rating')) {
            $ratings = explode(',', $request->input('rating'));
            $minRating = min($ratings);

            $query->whereHas('reviews', function ($reviewQuery) use ($minRating) {
                $reviewQuery->selectRaw('AVG(rating) as avg_rating')
                    ->groupBy('product_id')
                    ->having('avg_rating', '>=', $minRating);
            });
        }

        // Exclude products with all variants having 0 quantity
        $query->whereHas('variants', function ($variantQuery) {
            $variantQuery->where('stock', '>', 0);
        });

        $sortOrder = $request->input('sort_order', 'asc'); // Default to 'asc' if no sort_order is provided
        $query->orderBy('created_at', $sortOrder);
        // Retrieve products with relationships
        $products = $query->with([
            'brand',
            'category',
            'images',
            'variants' => function ($variantQuery) {
                $variantQuery->where('stock', '>', 0);
            },
        ])->where('status', 'active')->get();

        
        // Add average rating to each product
      
        $products->map(function ($product)  {
            $product->average_rating = $product->reviews->avg('rating') ?? 0;
            $product->sizes = $product->variants->mapWithKeys(function ($variant) {
                return [$variant->size => $variant->stock];
            });
            
            unset($product->variants); // Remove variants if not needed in the response
            return $product;
        });

        // Prepare response data
        $responseData = [
            'products' => $products,
        ];

        return response()->json([
            'message' => 'Products Retrieved Successfully',
            'data' => $responseData,
        ], 200);
    }


    // Get a single product by ID
    public function show($id)
    {
        $product = Product::with('variants', 'brand', 'category', 'images', 'reviews')->find($id);

        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        // Add sizes to the product
        $product->sizes = $product->variants->mapWithKeys(function ($variant) {
            return [$variant->size => $variant->stock];
        });

        // Optionally remove the variants relationship if not needed
        unset($product->variants);
        // $isWishlisted = false;
        // if (Auth::check()) {
        //     $isWishlisted = $product->wishlists()
        //         ->where('user_id', Auth::id())
        //         ->exists();
        // }

        // // Append the wishlist status to the product data
        // $product->is_wishlisted = $isWishlisted;

        return response()->json($product, 200);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric',
            'description' => 'string|nullable',
            'category_id' => 'required',
            'brand_id' => 'required',
            'status' => 'required',
            // Add other fields as needed
        ]);

        $product = Product::create($validatedData);
        Cache::forget('recent_products');
        return response()->json(['message' => 'Product Created Successfully', 'data' => $product], 201);
    }

    // Update a product by ID
    public function update(Request $request, $id)
    {
        $product = Product::find($id);
        if (!$product)
            return response()->json(['error' => 'Product not found'], 404);

        $product->update($request->all());
        return response()->json(['message' => 'Product Updated Successfully', 'data' => $product], 200);
    }

    // Delete a product by ID
    public function destroy($id)
    {
        $product = Product::find($id);
        if (!$product)
            return response()->json(['error' => 'Product not found'], 404);

        $product->delete();
        return response()->json(['message' => 'Product Deleted Successfully'], 200);
    }
    public function search(Request $request)
    {
        $query = $request->input('query');
        $priceLimit = null;
        $brandName = null;
        $categoryName = null;
        $keywords = [];

        // Step 1: Extract price from the query
        preg_match('/under (\d+)/i', $query, $priceMatch);
        if (!empty($priceMatch)) {
            $priceLimit = $priceMatch[1];
            $query = str_replace($priceMatch[0], '', $query); // Remove "under 500" part
        }

        // Step 2: Extract brand from the query
        $brands = Brand::pluck('name')->toArray(); // Fetch all brand names
        foreach ($brands as $brand) {
            if (stripos($query, $brand) !== false) {
                $brandName = $brand;
                $query = str_ireplace($brand, '', $query); // Remove brand name
                break;
            }
        }

        // Step 3: Extract category from the query
        $categories = Category::pluck('name')->toArray(); // Fetch all category names
        foreach ($categories as $category) {
            if (stripos($query, $category) !== false) {
                $categoryName = $category;
                $query = str_ireplace($category, '', $query); // Remove category name
                break;
            }
        }

        // Step 4: Remaining keywords
        $keywords = array_filter(explode(' ', trim($query))); // Remaining keywords after removing brand and category

        // Step 5: Build the query
        $products = Product::query()
            ->when($brandName, function ($q) use ($brandName) {
                $q->whereHas('brand', function ($q) use ($brandName) {
                    $q->where('name', 'LIKE', "%{$brandName}%");
                });
            })
            ->when($categoryName, function ($q) use ($categoryName) {
                $q->whereHas('category', function ($q) use ($categoryName) {
                    $q->where('name', 'LIKE', "%{$categoryName}%");
                });
            })
            ->when($priceLimit, function ($q) use ($priceLimit) {
                $q->where('discounted_price', '<=', $priceLimit);
            })
            ->when(!empty($keywords), function ($q) use ($keywords) {
                foreach ($keywords as $keyword) {
                    $q->where('name', 'LIKE', "%{$keyword}%");
                }
            })->whereHas('variants', function ($variantQuery) {
            $variantQuery->where('stock', '>', 0);
            })->with(['brand'])
            ->get();

        // Step 6: Return JSON response
        return response()->json($products);
    }



    public function recentProducts()
    {
        // Cache the recent products for 10 minutes
        $products = Cache::remember('recent_products', now()->addMinutes(10), function () {
            return Product::latest()->take(5)->with([
                'brand',
                'category',
                'images',
                'variants' => function ($variantQuery) {
                    $variantQuery->where('stock', '>', 0);
                },
            ])->withAvg('reviews as average_rating', 'rating') // Calculate average rating
            ->withCount('reviews') // Count number of reviews
            ->where('status', 'active')->get();
        });
       
    
        return response()->json([
            'status' => true,
            'message' => 'Recent 5 products retrieved successfully.',
            'products' => $products,
        ], 200);
    }
    
    public function topProducts()
    {
           // Cache the result for 10 minutes (adjust as needed)
        $products = Cache::remember('top_products', now()->addMinutes(10), function () {
            return Product::query()
                ->withAvg('reviews as average_rating', 'rating') // Calculate average rating
                ->withCount('reviews') // Count number of reviews
                ->orderByDesc('average_rating') // Sort by average rating
                ->limit(5) // Limit to top 5
                ->with([
                    'brand',
                    'category',
                    'images',
                    'variants' => function ($variantQuery) {
                        $variantQuery->where('stock', '>', 0);
                    },
                    ])
                ->where('status', 'active')
                ->get();
        });
        
    
        return response()->json([
            'status' => true,
            'message' => 'Top 5 products retrieved successfully.',
            'products' => $products,
        ], 200);
    }
       

}