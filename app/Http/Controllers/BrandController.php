<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    public function index()
    {
        return response()->json(Brand::all(), 200);
    }

    // Get a single brand by ID
    public function show($id)
    {
        $brand = Brand::find($id);
        return $brand ? response()->json($brand, 200) : response()->json(['error' => 'brand not found'], 404);
    }

    // Create a new brand
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string',
            'slug' => 'required',
            'status' => 'required',
            // Add other fields as needed
        ]);

        $brand = Brand::create($validatedData);
        return response()->json(['message' => 'brand Created Successfully','data' => $brand], 201);
    }

    // Update a brand by ID
    public function update(Request $request, $id)
    {
        $brand = Brand::find($id);
        if (!$brand) return response()->json(['error' => 'Brand not found'], 404);

        $brand->update($request->all());
        return response()->json(['message' => 'Brand Updated Successfully','data' => $brand], 200);
    }

    // Delete a brand by ID
    public function destroy($id)
    {
        $brand = Brand::find($id);
        if (!$brand) return response()->json(['error' => 'brand not found'], 404);

        $brand->delete();
        return response()->json(['message' => 'brand Deleted Successfully'], 200);
    }
}
