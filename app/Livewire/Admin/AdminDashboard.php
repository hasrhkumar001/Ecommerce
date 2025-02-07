<?php

namespace App\Livewire\Admin;

use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Product;
use App\Models\User;
use Livewire\Component;

class AdminDashboard extends Component
{

    public $totalSales;
    public $totalProducts;
    public $recentOrders;
    public $userGrowth;
    public $ordersByCategory;

    public function mount()
    {
        $this->totalSales = Order::sum('price');
        $this->totalProducts = Product::count();
        $this->recentOrders = Order::latest()->take(5)->get();
        $this->userGrowth = User::count();
    }

    public function ordersByCategory()
    {
        $this->ordersByCategory = OrderDetail::with('product')
            ->get()
            ->groupBy(function ($detail) {
                return $detail->product->category->name ?? 'Uncategorized';
            })->map(function ($group) {
                return $group->sum('quantity');
            });

        
    }
    public function render()
    {
        return view('livewire.admin.admin-dashboard');
    }
}
