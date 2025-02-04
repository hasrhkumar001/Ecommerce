<div class="container shadow py-5 px-3 mt-4">
<h2 class="">Recent Orders of {{$user->name}}</h2>
                        
                   
                    <div class="mt-3">
                        <table class="table table-striped">
                            <thead>
                                <tr class="table-primary">
                                    <th>Serial No.</th>
                                    <th>Order Id</th>
                                    <th>Customer</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse ($userOrders as $order)
                                    <tr>
                                        <td>{{$loop->iteration}}</td>
                                        <td>{{ $order->id }}</td>
                                        <td>{{ $order->user->name }} ({{$order->user->email}})</td>
                                        <td>&#8377;{{ number_format($order->price   , 2) }}</td>
                                        <td>{{ ucfirst($order->status) }}</td>
                                        <td>{{ $order->created_at->format('d M, Y') }}</td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="6" class="text-center">No Orders found.</td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>