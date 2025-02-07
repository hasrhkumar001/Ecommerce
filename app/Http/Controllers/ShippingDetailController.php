<?php

namespace App\Http\Controllers;

use App\Models\ShippingDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ShippingDetailController extends Controller
{
    public function index()
    {
        return response()->json(ShippingDetail::where('user_id', Auth::id())->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'countryName' => 'required|string|max:255',
            'companyName' => 'nullable|string|max:255',
            'address' => 'required|string|max:255',
            'houseNo' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'postal_code' => 'required|string|max:10',
            'phone' => 'required|string|max:15',
        ]);

        $shipping = ShippingDetail::create(array_merge($request->all(), ['user_id' => Auth::id()]));
        return response()->json($shipping, 201);
    }

    public function show($id)
    {
        $shipping = ShippingDetail::where('user_id', Auth::id())->findOrFail($id);
        return response()->json($shipping);
    }

    public function update(Request $request, $id)
    {
        $shipping = ShippingDetail::where('user_id', Auth::id())->findOrFail($id);

        $request->validate([
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'countryName' => 'required|string|max:255',
            'companyName' => 'nullable|string|max:255',
            'address' => 'required|string|max:255',
            'houseNo' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'postal_code' => 'required|string|max:10',
            'phone' => 'required|string|max:15',
        ]);

        $shipping->update($request->all());
        return response()->json($shipping);
    }

    public function destroy($id)
    {
        $shipping = ShippingDetail::where('user_id', Auth::id())->findOrFail($id);
        $shipping->delete();

        return response()->json(['message' => 'Shipping detail deleted successfully.']);
    }
}
