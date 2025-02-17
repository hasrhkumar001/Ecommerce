<div class="py-5 px-3 ">
    <h1 class="text-2xl font-bold mb-6">Order Details</h1>

    @if (session()->has('message'))
        <div class="bg-green-100 text-green-800 p-2 mb-4 rounded">
            {{ session('message') }}
        </div>
    @endif

    @foreach ($orders as $order)
    <div class="border rounded-lg p-4 my-4  shadow d-flex flex-column gap-4 ">
    <!-- Order Header -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
        <div>
            <p class="h5 mb-1">Order no: <span class="text-primary">00{{ $order->id }}</span></p>
            <p class="text-muted mb-0">
                <small>Order Date: {{ $order->created_at->format('d M Y') }}</small>
            </p>
            <!-- <p class="text-muted mb-0">
                <small>Estimated Delivery Date: {{ $order->delivery_date ?? 'N/A' }}</small>
            </p> -->
        </div>

        <div class="text-end mt-3 mt-md-0">
            <p class="mb-1">
                <span class="badge bg-secondary text-white">{{ $order->status }}</span>
            </p>
            <p class="text-muted mb-0">
                Payment Method: <span class="fw-bold">{{ $order->payment_method }}</span>
            </p>
        </div>
    </div>

    <!-- Shipping Details -->
    <div class="bg-light  rounded">
        <h6 class="mb-3 text-secondary">Shipping Details:</h6>
        <div class="row">
            <div class="col d-flex gap-2">
                <p class="mb-1"><strong>Country:</strong> {{ $order->shippingDetail->countryName }}</p>
                <p class="mb-1"><strong>State:</strong> {{ $order->shippingDetail->state }}</p>
                <p class="mb-1"><strong>City:</strong> {{ $order->shippingDetail->city }}</p>
                <p class="mb-1"><strong>Zip Code:</strong> {{ $order->shippingDetail->postal_code }}</p>
                <p class="mb-1"><strong>Street Address:</strong> {{ $order->shippingDetail->address }}</p>
            </div>
            
        </div>
    </div>

    <!-- Action Buttons -->
    <div class="text-end">
        <button 
            class="btn btn-primary px-4 py-2"
            wire:click="viewDetails({{ $order->id }})"
        >
            View Details 
        </button>
        <button 
            class="btn btn-primary px-4 py-2"
            wire:click="editStatus({{ $order->id }})"
        >
            Edit Status
        </button>
    </div>
</div>

    @endforeach

    @if ($editOrderId)
    <div class="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center" onclick="event.stopPropagation()">
    <div class="bg-white p-4 rounded shadow-lg w-100" style="max-width: 400px;">
        <!-- Modal Header -->
        <h2 class="h5 text-center text-primary mb-4">Edit Order Status</h2>
        
        <!-- Status Dropdown -->
        <div class="mb-4">
            <label for="order-status" class="form-label fw-bold">Select Status:</label>
            <select 
                wire:model="status" 
                id="order-status"
                class="form-select"
            >
                <option value="Processing">Processing</option>
                <option value="Delivered">Delivered</option>
                <option value="Shipping">Shipping</option>
                <option value="Shipped">Shipped</option>
                <option value="Cancelled">Cancelled</option>
            </select>
        </div>
        
        <!-- Modal Footer Buttons -->
        <div class="d-flex justify-content-end gap-2">
            <button 
                wire:click="updateStatus"
                class="btn btn-primary px-4 py-2"
            >
                Save
            </button>
            <button 
                wire:click="$set('editOrderId', null)" 
                class="btn btn-secondary px-4 py-2"
            >
                Cancel
            </button>
        </div>
    </div>
</div>
    @endif
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
