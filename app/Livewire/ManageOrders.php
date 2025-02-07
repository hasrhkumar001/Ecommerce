<?php

namespace App\Livewire;

use App\Models\Order;
use App\Models\ShippingDetail;
use App\Models\User;
use Livewire\Component;

class ManageOrders extends Component
{
    public $orders;
    public $shipping_address_id;
    public $user_id;
    public $payment_method;
    public $status = 'Processing';

    protected $rules = [
        'shipping_address_id' => 'required|exists:shipping_details,id',
        'user_id' => 'required|exists:users,id',
        'payment_method' => 'required|string',
        'status' => 'required|in:Processing,Delivered,Shipping,Shipped,Canceled',
    ];

    public function mount()
    {
        $this->orders = Order::with(['shippingDetail', 'user'])->get();
    }

    public function createOrder()
    {
        $this->validate();

        Order::create([
            'shipping_address_id' => $this->shipping_address_id,
            'user_id' => $this->user_id,
            'payment_method' => $this->payment_method,
            'status' => $this->status,
        ]);

        $this->orders = Order::with(['shippingDetail', 'user'])->get();
        session()->flash('message', 'Order created successfully.');
    }

    public function render()
    {
        return view('livewire.manage-orders', [
            'shippingDetails' => ShippingDetail::all(),
            'users' => User::all(),
        ]);
    }
}
