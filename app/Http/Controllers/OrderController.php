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
  
    $userId = Auth::id(); // Get the authenticated user's ID

    $orders = Order::with(['shippingDetail', 'user','orderDetails'])
        ->where('user_id', $userId)
        ->orderBy('created_at', 'desc') // Sorting by latest created date
        ->get();

    if ($orders->isEmpty()) {
        return response()->json(['error' => 'No orders found'], 404);
    }

    return response()->json($orders, 200);

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

    public function show()
{
    $userId = Auth::id(); // Get the authenticated user's ID

    $orders = Order::with(['shippingDetail', 'user'])
        ->where('user_id', $userId)
        ->orderBy('created_at', 'desc') // Sorting by latest created date
        ->get();

    if ($orders->isEmpty()) {
        return response()->json(['error' => 'No orders found'], 404);
    }

    return response()->json($orders, 200);
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
    public function cancelOrder($id)
    {
        // Get the authenticated user
        $user = Auth::user();

        // Find the order
        $order = Order::where('id', $id)->where('user_id', $user->id)->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found or you do not have permission to cancel this order.',
            ], 404);
        }

        // Check if the order is already canceled
        if ($order->status === 'Cancelled') {
            return response()->json([
                'success' => false,
                'message' => 'This order has already been cancelled.',
            ], 400);
        }

        // Update order status to "Cancelled"
        $order->status = 'Cancelled';
        $order->save();

        return response()->json([
            'success' => true,
            'message' => 'Order cancelled successfully.',
            'order' => $order
        ], 200);
    }
}
