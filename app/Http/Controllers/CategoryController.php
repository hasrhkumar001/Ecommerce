<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $activeCategories = Category::where('status', 'active')->get();
    return response()->json($activeCategories, 200);
    }
}
