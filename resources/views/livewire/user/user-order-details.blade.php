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
                                    <th>Order Details</th>
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
                                        <td><button 
                                            class="btn btn-primary px-4 py-2"
                                            wire:click="viewDetails({{ $order->id }})"
                                        >
                                            View Details 
                                        </button></td>
                                        <td>{{ $order->created_at->format('d M, Y') }}</td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="6" class="text-center">No Orders found.</td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                        @if ($orderDetailsId)
            <div class="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center" onclick="event.stopPropagation()">
                <div class="bg-white rounded-lg shadow-lg p-4 w-11/12 max-w-3xl position-relative" onclick="event.stopPropagation()">
                    <!-- Modal Header -->
                    <div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                        <h2 class="h4 text-primary fw-bold">Order Details</h2>
                        <button class="btn-close" wire:click="$set('orderDetailsId', null)"></button>
                    </div>

                    <!-- Shipping Details -->
                    <div class="mb-4">
                        <h4 class="fw-semibold text-secondary mb-2">Shipping Details:</h4>
                        <div class="p-3 bg-light rounded">
                            <p class="mb-1"><strong>Name:</strong> {{ $selectedOrder->shippingDetail->firstName }} {{ $selectedOrder->shippingDetail->lastName }}</p>
                            <p class="mb-1"><strong>Address:</strong> {{ $selectedOrder->shippingDetail->address }}</p>
                            <p class="mb-1"><strong>City:</strong> {{ $selectedOrder->shippingDetail->city }}, {{ $selectedOrder->shippingDetail->state }}</p>
                            <p class="mb-1"><strong>Postal Code:</strong> {{ $selectedOrder->shippingDetail->postal_code }}</p>
                            <p class="mb-1"><strong>Country:</strong> {{ $selectedOrder->shippingDetail->countryName }}</p>
                        </div>
                    </div>

                    <!-- Products Section (Scrollable) -->
                    <div>
                        <h4 class="fw-semibold text-secondary mb-2">Products:</h4>
                        @if ($selectedOrder->orderDetails->isNotEmpty())
                            <div class="border rounded p-3 bg-white shadow-sm overflow-auto" style="max-height: 150px;">
                                @foreach ($selectedOrder->orderDetails as $item)
                                    <div class="d-flex align-items-center gap-3 border-bottom pb-3 mb-3">
                                        @if ($item->product->images->isNotEmpty())
                                            <img src="{{ asset('storage/' . $item->product->images->first()->image_path) }}" alt="{{ $item->product->name }}" class="rounded border" style="width: 60px; height: 60px; object-fit: cover;">
                                        @else
                                            <div class="rounded border bg-light d-flex align-items-center justify-content-center" style="width: 60px; height: 60px;">
                                                <i class="bi bi-card-image text-muted fs-4"></i>
                                            </div>
                                        @endif
                                        <div>
                                            <p class="fw-bold mb-1">{{ $item->product->brand->name ?? 'Unknown Brand' }} - {{ $item->product->name }}</p>
                                            <p class="text-muted mb-0">Qty: {{ $item->quantity }}, Size: {{ $item->size }}</p>
                                        </div>
                                    </div>
                                @endforeach
                            </div>
                        @else
                            <p class="text-muted">No product details available.</p>
                        @endif
                    </div>

                    <!-- Close Button -->
                    <div class="text-end mt-4">
                        <button class="btn btn-secondary px-4 py-2" wire:click="$set('orderDetailsId', null)">Close</button>
                    </div>
                </div>
            </div>
            @endif
                    </div>
                </div>