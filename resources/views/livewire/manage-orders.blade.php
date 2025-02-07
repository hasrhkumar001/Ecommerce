<div class="p-6 bg-gray-100">
    <h2 class="text-xl font-semibold mb-4">Manage Orders</h2>

    <!-- Create Order Form -->
    <form wire:submit.prevent="createOrder" class="mb-6">
        <div class="mb-4">
            <label for="shipping_address_id" class="block text-gray-700">Shipping Address</label>
            <select wire:model="shipping_address_id" id="shipping_address_id" class="w-full p-2 border border-gray-300 rounded">
                <option value="">Select Shipping Address</option>
                @foreach($shippingDetails as $detail)
                    <option value="{{ $detail->id }}">{{ $detail->address }} - {{ $detail->city }}</option>
                @endforeach
            </select>
            @error('shipping_address_id') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
        </div>

        <div class="mb-4">
            <label for="user_id" class="block text-gray-700">User</label>
            <select wire:model="user_id" id="user_id" class="w-full p-2 border border-gray-300 rounded">
                <option value="">Select User</option>
                @foreach($users as $user)
                    <option value="{{ $user->id }}">{{ $user->name }} ({{ $user->email }})</option>
                @endforeach
            </select>
            @error('user_id') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
        </div>

        <div class="mb-4">
            <label for="payment_method" class="block text-gray-700">Payment Method</label>
            <input wire:model="payment_method" id="payment_method" type="text" class="w-full p-2 border border-gray-300 rounded">
            @error('payment_method') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
        </div>

        <div class="mb-4">
            <label for="status" class="block text-gray-700">Status</label>
            <select wire:model="status" id="status" class="w-full p-2 border border-gray-300 rounded">
                <option value="Processing">Processing</option>
                <option value="Delivered">Delivered</option>
                <option value="Shipping">Shipping</option>
                <option value="Shipped">Shipped</option>
                <option value="Canceled">Canceled</option>
            </select>
            @error('status') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
        </div>

        <button type="submit" class="bg-green-500 text-white py-2 px-4 rounded">Create Order</button>
    </form>

    <!-- Orders Table -->
    <table class="w-full border-collapse border border-gray-300">
        <thead>
            <tr class="bg-gray-200">
                <th class="border border-gray-300 p-2">ID</th>
                <th class="border border-gray-300 p-2">User</th>
                <th class="border border-gray-300 p-2">Shipping Address</th>
                <th class="border border-gray-300 p-2">Payment Method</th>
                <th class="border border-gray-300 p-2">Status</th>
                <th class="border border-gray-300 p-2">Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach($orders as $order)
                <tr>
                    <td class="border border-gray-300 p-2">{{ $order->id }}</td>
                    <td class="border border-gray-300 p-2">{{ $order->user->name }}</td>
                    <td class="border border-gray-300 p-2">
                        {{ $order->shippingDetail->address }} - {{ $order->shippingDetail->city }}
                    </td>
                    <td class="border border-gray-300 p-2">{{ $order->payment_method }}</td>
                    <td class="border border-gray-300 p-2">{{ $order->status }}</td>
                    <td class="border border-gray-300 p-2">
                        <!-- Actions Placeholder -->
                        <button class="text-red-500">Delete</button>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
</div>
