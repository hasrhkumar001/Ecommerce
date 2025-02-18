<?php

namespace App\Livewire\User;

use App\Models\Order;
use App\Models\User;
use Livewire\Component;

class UserOrderDetails extends Component
{
    public $userOrders;
    public $user;
    public $orderDetailsId;
    public $selectedOrder;

    public function mount($userId)
    {
       
        $this->userOrders = Order::where('user_id', $userId)->with('orderDetails')->get();
        $this->user=  User::find($userId);
        
    }

    public function viewDetails($orderId)
    {
        $this->orderDetailsId = $orderId;
        $this->selectedOrder = Order::where('id', $orderId)
                                 ->with(['shippingDetail', 'user', 'orderDetails.product.images'])
                                 ->first();
    }
    public function render()
    {
        return view('livewire.user.user-order-details');
    }
}
