<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProductImage;
use Illuminate\Support\Facades\Storage;

class ProductImagesController extends Controller
{
    
    // List all product images
    public function index()
    {
        $productImages = ProductImage::with('product')->get();
        return response()->json($productImages, 200);
    }

    // Store new product images
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'images.*' => 'required|image|max:1024',
        ]);
        
        $storedImages = [];
        foreach ($request->file('images') as $image) {
            $filename = $image->getClientOriginalName();
            $path = $image->storeAs('Product_images', $filename, 'public');
            
            $storedImages[] = ProductImage::create([
                'product_id' => $request->product_id,
                'image_path' => $path,
            ]);
        }
        
        return response()->json(['message' => 'Images uploaded successfully', 'data' => $storedImages], 201);
    }

    // Show a single product image
    public function show($id)
    {
        // Find the specific product image by ID
        $productImage = ProductImage::find($id);
    
        if (!$productImage) {
            return response()->json(['message' => 'Image not found'], 404);
        }
    
        // Fetch all images with the same product_id
        $images = ProductImage::where('product_id', $productImage->product_id)->get();
    
        return response()->json([
            'product_id' => $productImage->product_id,
            'images' => $images,
        ], 200);
    }
    public function getByProductId($product_id)
    {
        // Query the car model based on the car_id
        $product = ProductImage::where('product_id', $product_id)->get();
    
        // Check if car models are found
        if ($product->isEmpty()) {
            return response()->json(['message' => 'No product image found for this product ID'], 404);
        }
    
        return response()->json($product);
    }
    
    // Update a product image
    public function update(Request $request, $id)
    {
        $productImage = ProductImage::find($id);
        
        if (!$productImage) {
            return response()->json(['message' => 'Image not found'], 404);
        }
        
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'new_image' => 'nullable|image|max:1024',
        ]);
        
        if ($request->hasFile('new_image')) {
            Storage::disk('public')->delete($productImage->image_path);
            $filename = $request->file('new_image')->getClientOriginalName();
            $path = $request->file('new_image')->storeAs('Product_images', $filename, 'public');
            $productImage->image_path = $path;
        }
        
        $productImage->product_id = $request->product_id;
        $productImage->save();
        
        return response()->json(['message' => 'Image updated successfully', 'data' => $productImage], 200);
    }

    // Delete a product image
    public function destroy($id)
    {
        $productImage = ProductImage::find($id);
        
        if (!$productImage) {
            return response()->json(['message' => 'Image not found'], 404);
        }
        
        Storage::disk('public')->delete($productImage->image_path);
        $productImage->delete();
        
        return response()->json(['message' => 'Image deleted successfully'], 200);
    }


}