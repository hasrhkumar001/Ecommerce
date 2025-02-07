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
            wire:click="editStatus({{ $order->id }})"
        >
            Edit Status
        </button>
    </div>
</div>

    @endforeach

    @if ($editOrderId)
    <div class="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center">
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
</div>
