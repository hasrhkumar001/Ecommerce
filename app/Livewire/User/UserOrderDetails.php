<?php

namespace App\Livewire\User;

use App\Models\Order;
use App\Models\User;
use Livewire\Component;

class UserOrderDetails extends Component
{
    public $userOrders;
    public $user;

    public function mount($userId)
    {
       
        $this->userOrders = Order::where('user_id', $userId)->get();
        $this->user=  User::find($userId);
        
    }
    public function render()
    {
        return view('livewire.user.user-order-details');
    }
}
