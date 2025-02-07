<?php

namespace App\Http\Controllers;

use App\Http\Controllers;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    public function index()
    {
        return response()->json(Order::with(['shippingDetail', 'user','orderDetails'])->get(), 200);
    }

    public function store(Request $request)
    {
       
        $request->validate([
            'shipping_address_id' => 'required|exists:shipping_details,id',
            
            'payment_method' => 'required|string',
            'price' => 'required',
            'status' => 'required|in:Processing,Delivered,Shipping,Shipped,Canceled',
        ]);

        $order = Order::create(array_merge($request->all(), ['user_id' => Auth::id()]));
        $cartItems = Cart::where('user_id', Auth::id())->get();

        // Create order details for each cart item
        foreach ($cartItems as $item) {
            OrderDetail::create([
                'order_id' => $order->id,
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
                'size' => $item->size,
            ]);
        }
         // Decrease product variant stock
        $productVariant = ProductVariant::where('product_id', $item->product_id)
            ->where('size', $item->size)
            ->first();

        if ($productVariant) {
            $productVariant->stock = max(0, $productVariant->stock - $item->quantity); // Ensure stock doesn't go negative
            $productVariant->save();
        }
    
        // Delete all cart items for the user
        Cart::where('user_id', Auth::id())->delete();
        return response()->json($order, 201);
    }

    public function show($id)
    {
        $order = Order::with(['shippingDetail', 'user'])->find($id);

        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }

        return response()->json($order, 200);
    }

    public function update(Request $request, $id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }

        $request->validate([
            'shipping_address_id' => 'required|exists:shipping_details,id',
            
            'payment_method' => 'required|string',
            'price' => 'required',
            'status' => 'required|in:Processing,Delivered,Shipping,Shipped,Canceled',
        ]);

        $order->update(array_merge($request->all(), ['user_id' => Auth::id()]));
        return response()->json($order, 200);
    }

    public function destroy($id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }

        $order->delete();
        return response()->json(['message' => 'Order deleted successfully'], 200);
    }
}
