<div class="container mt-4">
    <div class="card">
        <div class="card-header">
            <h4>Manage Shipping Details</h4>
        </div>
        <div class="card-body">
            @if (session()->has('message'))
                <div class="alert alert-success">
                    {{ session('message') }}
                </div>
            @endif

            <!-- Add or Update Shipping Details Form -->
            <form wire:submit.prevent="{{ $shipping_id ? 'update' : 'store' }}">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="firstName">First Name</label>
                        <input type="text" id="firstName" class="form-control" wire:model="firstName">
                        @error('firstName') <span class="text-danger">{{ $message }}</span> @enderror
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="lastName">Last Name</label>
                        <input type="text" id="lastName" class="form-control" wire:model="lastName">
                        @error('lastName') <span class="text-danger">{{ $message }}</span> @enderror
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="countryName">Country</label>
                        <input type="text" id="countryName" class="form-control" wire:model="countryName">
                        @error('countryName') <span class="text-danger">{{ $message }}</span> @enderror
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="companyName">Company Name</label>
                        <input type="text" id="companyName" class="form-control" wire:model="companyName">
                        @error('companyName') <span class="text-danger">{{ $message }}</span> @enderror
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="address">Address</label>
                        <input type="text" id="address" class="form-control" wire:model="address">
                        @error('address') <span class="text-danger">{{ $message }}</span> @enderror
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="houseNo">House No</label>
                        <input type="text" id="houseNo" class="form-control" wire:model="houseNo">
                        @error('houseNo') <span class="text-danger">{{ $message }}</span> @enderror
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-4 mb-3">
                        <label for="city">City</label>
                        <input type="text" id="city" class="form-control" wire:model="city">
                        @error('city') <span class="text-danger">{{ $message }}</span> @enderror
                    </div>
                    <div class="col-md-4 mb-3">
                        <label for="state">State</label>
                        <input type="text" id="state" class="form-control" wire:model="state">
                        @error('state') <span class="text-danger">{{ $message }}</span> @enderror
                    </div>
                    <div class="col-md-4 mb-3">
                        <label for="postal_code">Postal Code</label>
                        <input type="text" id="postal_code" class="form-control" wire:model="postal_code">
                        @error('postal_code') <span class="text-danger">{{ $message }}</span> @enderror
                    </div>
                </div>

                <div class="mb-3">
                    <label for="phone">Phone</label>
                    <input type="text" id="phone" class="form-control" wire:model="phone">
                    @error('phone') <span class="text-danger">{{ $message }}</span> @enderror
                </div>

                <button type="submit" class="btn btn-primary">{{ $shipping_id ? 'Update' : 'Add' }}</button>
                @if ($shipping_id)
                    <button type="button" class="btn btn-secondary" wire:click="resetFields">Cancel</button>
                @endif
            </form>
        </div>
    </div>

    <!-- List of Shipping Details -->
    <div class="card mt-4">
        <div class="card-header">
            <h5>Shipping Details</h5>
        </div>
        <div class="card-body">
            @if ($shippingDetails->isEmpty())
                <p>No shipping details found.</p>
            @else
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Country</th>
                            <th>Address</th>
                            <th>City</th>
                            <th>State</th>
                            <th>Postal Code</th>
                            <th>Phone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($shippingDetails as $detail)
                            <tr>
                                <td>{{ $loop->iteration }}</td>
                                <td>{{ $detail->firstName }} {{ $detail->lastName }}</td>
                                <td>{{ $detail->countryName }}</td>
                                <td>{{ $detail->address }} ({{ $detail->houseNo }})</td>
                                <td>{{ $detail->city }}</td>
                                <td>{{ $detail->state }}</td>
                                <td>{{ $detail->postal_code }}</td>
                                <td>{{ $detail->phone }}</td>
                                <td>
                                    <button class="btn btn-sm btn-info" wire:click="edit({{ $detail->id }})">Edit</button>
                                    <button class="btn btn-sm btn-danger" wire:click="delete({{ $detail->id }})" onclick="return confirm('Are you sure?')">Delete</button>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            @endif
        </div>
    </div>
</div>
