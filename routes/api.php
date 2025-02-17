<?php

use App\Http\Controllers\Auth\ForgetPasswordController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductImagesController;
use App\Http\Controllers\RecentlyViewedController;
use App\Http\Controllers\ResetPasswordController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ShippingDetailController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WishlistController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\AuthController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::post('/signup', [AuthController::class, 'register']);
Route::post('/auth/google', [AuthController::class, 'handleGoogleLogin']);

Route::get('/products/search', [ProductController::class, 'search']);


Route::get('/products', [ProductController::class, 'index'])->name('product.list'); // Get all products
Route::get('/product/{id}', [ProductController::class, 'show'])->name('product.show'); // Get a single product by ID
Route::post('/products', [ProductController::class, 'store'])->name('product.store'); // Create a new product
Route::put('/product/{id}', [ProductController::class, 'update'])->name('product.update'); // Update a product by ID
Route::delete('/product/{id}', [ProductController::class, 'destroy'])->name('product.delete'); // Delete a product by ID
Route::get('/products/recent', [ProductController::class, 'recentProducts'])->name('product.recent'); 
Route::get('/products/top', [ProductController::class, 'topProducts'])->name('product.top'); 

Route::get('/brands', [BrandController::class, 'index'])->name('product.list'); // Get all products
Route::get('/brand/{id}', [BrandController::class, 'show'])->name('product.show'); // Get a single product by ID
Route::post('/brands', [BrandController::class, 'store'])->name('product.store'); // Create a new product
Route::put('/brand/{id}', [BrandController::class, 'update'])->name('product.update'); // Update a product by ID
Route::delete('/brand/{id}', [BrandController::class, 'destroy'])->name('product.delete'); // Delete a product by ID

Route::apiResource('product-images', ProductImagesController::class);
Route::get('product-images/product/{product_id}', [ProductImagesController::class, 'getByProductId']);
Route::get('/product/{productId}/reviews', [ReviewController::class, 'index']);
Route::get('/product/{productId}/variants', [ProductVariantController::class, 'getVariants']);

Route::get('/categories', [CategoryController::class, 'index']);
Route::post('/forgot-password', [ForgetPasswordController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [ResetPasswordController::class, 'reset']);

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('users', UserController::class);
    Route::patch('profile', [UserController::class, 'updateProfile']);

    Route::get('/cart', [CartController::class, 'getCart']);
    Route::post('/cart', [CartController::class, 'addToCart']);
    Route::put('/cart/{id}', [CartController::class, 'update']);
    Route::delete('/cart/{id}', [CartController::class, 'removeFromCart']);
    Route::delete('/clear-cart', [CartController::class, 'clearCart']);

    Route::get('/shipping-details', [ShippingDetailController::class, 'index']); // Fetch all shipping details
    Route::post('/shipping-details', [ShippingDetailController::class, 'store']); // Add a new shipping detail
    Route::get('/shipping-details/{id}', [ShippingDetailController::class, 'show']); // Fetch a single shipping detail
    Route::put('/shipping-details/{id}', [ShippingDetailController::class, 'update']); // Update a shipping detail
    Route::delete('/shipping-details/{id}', [ShippingDetailController::class, 'destroy']); // Delete a shipping detail

    Route::apiResource('orders', OrderController::class);
    Route::post('/orders/cancel/{id}', [OrderController::class, 'cancelOrder']);
    Route::post('/reviews', [ReviewController::class, 'store']);

    Route::get('/wishlists', [WishlistController::class, 'index']); // Get all wishlist items
    Route::post('/wishlists', [WishlistController::class, 'store']); // Add a product to the wishlist
    Route::delete('/wishlists/{id}', [WishlistController::class, 'destroy']); // Remove a product from the wishlist
    Route::get('/wishlists/check/{productId}', [WishlistController::class, 'check']);

    Route::post('/recently-viewed', [RecentlyViewedController::class, 'addRecentlyViewed']);
    Route::get('/recently-viewed', [RecentlyViewedController::class, 'getRecentlyViewed']);
    


});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');