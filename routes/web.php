<?php


use App\Http\Controllers\CartController;
use App\Livewire\Admin\AdminDashboard;
use App\Livewire\Login\Login;
use App\Livewire\Order\OrderDetails;
use App\Livewire\Order\ShippingDetails;
use App\Livewire\ProductImages\AddProductImages;
use App\Livewire\ProductImages\EditProductImages;
use App\Livewire\Brand\AddBrand;
use App\Livewire\Brand\BrandList;
use App\Livewire\Brand\EditBrand;
use App\Livewire\Navbar\Navbar;
use App\Livewire\Product\AddProduct;
use App\Livewire\Product\EditProduct;
use App\Livewire\Product\ProductList;
use App\Livewire\ProductImages\ProductImagesList;
use App\Livewire\ProductVariant\AddProductVariant;
use App\Livewire\ProductVariant\EditProductVariant;
use App\Livewire\ProductVariant\ProductVariantList;
use App\Livewire\Sidebar\Sidebar;
use App\Livewire\Signup\Signup;
use App\Livewire\User\UserList;
use App\Livewire\User\UserOrderDetails;
use Illuminate\Support\Facades\Route;
use App\Livewire\Category\CategoryList;
use App\Livewire\Category\AddCategory;
use App\Livewire\Category\EditCategory;


Route::get('/signup',Signup::class)->name('register');
Route::get('/login',Login::class)->name('login');

Route::middleware('auth:admin')->group(function(){
Route::get('/', AdminDashboard::class)->name('admin.dashboard');
Route::get('users', UserList::class)->name('user.list');
Route::get('categories', CategoryList::class)->name('category.list');
Route::get('categories/add', AddCategory::class)->name('category.add');
Route::get('categories/edit/{id}', EditCategory::class)->name('category.edit');
Route::get('brands', BrandList::class)->name('brand.list');
Route::get('brands/add', AddBrand::class)->name('brand.add');
Route::get('brands/edit/{id}', EditBrand::class)->name('brand.edit');
Route::get('/products', ProductList::class)->name('product.list');
Route::get('/product/add', AddProduct::class)->name('product.create');
Route::get('/products/{productId}/edit', EditProduct::class)->name('product.edit');
Route::get('/product-variants/{product_id?}', ProductVariantList::class)->name('list.variants');
Route::get('/add-product-variant/{product_id?}', AddProductVariant::class)->name('add.variant');
Route::get('/edit-product-variant/{variantId}', EditProductVariant::class)->name('edit.variant');
Route::get('/product-images', ProductImagesList::class)->name('product-images.list');
Route::get('/product-images/add', AddProductImages::class)->name('add.product-images');
Route::get('/product-images/edit/{id}', EditProductImages::class)->name('product-images.edit');
Route::get('/product/{product_id}/images', AddProductImages::class)->name('product-images.add');
// Route::get('/shipping-details', ShippingDetails::class)->name('shopping-list');
Route::get('/cart', [CartController::class, 'showCart'])->name('cart.show');
Route::get('/orders', OrderDetails::class)->name('order.details');
Route::get('/user/{userId}/orders', UserOrderDetails::class)->name('user-orders.details');
});