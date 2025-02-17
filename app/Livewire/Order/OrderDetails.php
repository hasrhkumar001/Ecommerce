<?php

namespace App\Livewire\Order;

use Livewire\Component;
use App\Models\Order;

class OrderDetails extends Component
{
    public $orders;
    public $editOrderId;
     public $orderDetailsId;
     public $selectedOrder;
    public $status;

    protected $rules = [
        'status' => 'required|in:Processing,Delivered,Shipping,Shipped,Cancelled',
    ];

    public function mount()
    {
        // Fetch orders and related shipping details
        $this->orders = Order::with(['shippingDetail', 'user','orderDetails'])->get();
    }

    public function editStatus($orderId)
    {
        $this->editOrderId = $orderId;
        $this->status = Order::find($orderId)->status;
    }
    public function viewDetails($orderId)
    {
        $this->orderDetailsId = $orderId;
    $this->selectedOrder = Order::where('id', $orderId)
                                 ->with(['shippingDetail', 'user', 'orderDetails.product.images'])
                                 ->first();
    }

    public function updateStatus()
    {
        $this->validate();

        $order = Order::find($this->editOrderId);
        $order->status = $this->status;
        $order->save();

        // Reload the orders
        $this->orders = Order::with(['shippingDetail', 'user'])->get();

        // Reset fields
        $this->editOrderId = null;
        $this->status = null;

        session()->flash('message', 'Order status updated successfully.');
    }

    public function render()
    {
        return view('livewire.order.order-details');
    }
}