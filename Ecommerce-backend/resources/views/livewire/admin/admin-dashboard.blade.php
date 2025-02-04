<div class="container-fluid">
    <div class="row">
        

        <!-- Main Content -->
        <div class="">
            <div class="container p-4">
                <h3>Dashboard Overview</h3>

                <!-- Key Metrics -->
                <div class="row">
                    <div class="col-md-4">
                        <div class="card bg-info text-white mb-3">
                            <div class="card-header">Total Sales</div>
                            <div class="card-body">
                                <h4>&#8377;{{ number_format($totalSales, 2) }}</h4>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card bg-success text-white mb-3">
                            <div class="card-header">Total Products</div>
                            <div class="card-body">
                                <h4>{{ $totalProducts }}</h4>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card bg-warning text-white mb-3">
                            <div class="card-header">Total Users</div>
                            <div class="card-body">
                                <h4>{{ $userGrowth }}</h4>
                            </div>
                        </div>
                    </div>
                </div>
                

                <!-- Recent Orders Table -->
                <div class="card mt-4">
                    <div class="card-header">
                        Recent Orders
                    </div>
                    <div class="card-body">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Customer</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($recentOrders as $order)
                                    <tr>
                                        <td>{{ $order->id }}</td>
                                        <td>{{ $order->user->name }}</td>
                                        <td>&#8377;{{ number_format($order->price, 2) }}</td>
                                        <td>{{ ucfirst($order->status) }}</td>
                                        <td>{{ $order->created_at->format('d M, Y') }}</td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
