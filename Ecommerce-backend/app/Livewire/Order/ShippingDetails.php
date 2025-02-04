<?php

namespace App\Livewire\Order;

use Livewire\Component;
use App\Models\ShippingDetail;
use Illuminate\Support\Facades\Auth;

class ShippingDetails extends Component
{
    public $shippingDetails = [];
    public $shipping_id, $firstName, $lastName, $countryName, $companyName, $address, $houseNo, $city, $state, $postal_code, $phone;

    public function mount()
    {
        $this->shippingDetails = ShippingDetail::where('user_id', Auth::id())->get();
    }

    public function resetFields()
    {
        $this->shipping_id = null;
        $this->firstName = '';
        $this->lastName = '';
        $this->countryName = '';
        $this->companyName = '';
        $this->address = '';
        $this->houseNo = '';
        $this->city = '';
        $this->state = '';
        $this->postal_code = '';
        $this->phone = '';
    }

    public function store()
    {
        $this->validate([
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'countryName' => 'required|string|max:255',
            'companyName' => 'nullable|string|max:255',
            'address' => 'required|string|max:255',
            'houseNo' => 'nullable|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'postal_code' => 'required|string|max:10',
            'phone' => 'required|string|max:15',
        ]);

        ShippingDetail::create([
            'user_id' => Auth::id(),
            'firstName' => $this->firstName,
            'lastName' => $this->lastName,
            'countryName' => $this->countryName,
            'companyName' => $this->companyName,
            'address' => $this->address,
            'houseNo' => $this->houseNo,
            'city' => $this->city,
            'state' => $this->state,
            'postal_code' => $this->postal_code,
            'phone' => $this->phone,
        ]);

        $this->resetFields();
        $this->shippingDetails = ShippingDetail::where('user_id', Auth::id())->get();
        session()->flash('message', 'Shipping detail added successfully.');
    }

    public function edit($id)
    {
        $shipping = ShippingDetail::findOrFail($id);
        $this->shipping_id = $shipping->id;
        $this->firstName = $shipping->firstName;
        $this->lastName = $shipping->lastName;
        $this->countryName = $shipping->countryName;
        $this->companyName = $shipping->companyName;
        $this->address = $shipping->address;
        $this->houseNo = $shipping->houseNo;
        $this->city = $shipping->city;
        $this->state = $shipping->state;
        $this->postal_code = $shipping->postal_code;
        $this->phone = $shipping->phone;
    }

    public function update()
    {
        $this->validate([
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'countryName' => 'required|string|max:255',
            'companyName' => 'nullable|string|max:255',
            'address' => 'required|string|max:255',
            'houseNo' => 'nullable|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'postal_code' => 'required|string|max:10',
            'phone' => 'required|string|max:15',
        ]);

        $shipping = ShippingDetail::findOrFail($this->shipping_id);
        $shipping->update([
            'firstName' => $this->firstName,
            'lastName' => $this->lastName,
            'countryName' => $this->countryName,
            'companyName' => $this->companyName,
            'address' => $this->address,
            'houseNo' => $this->houseNo,
            'city' => $this->city,
            'state' => $this->state,
            'postal_code' => $this->postal_code,
            'phone' => $this->phone,
        ]);

        $this->resetFields();
        $this->shippingDetails = ShippingDetail::where('user_id', Auth::id())->get();
        session()->flash('message', 'Shipping detail updated successfully.');
    }

    public function delete($id)
    {
        ShippingDetail::findOrFail($id)->delete();
        $this->shippingDetails = ShippingDetail::where('user_id', Auth::id())->get();
        session()->flash('message', 'Shipping detail deleted successfully.');
    }

    public function render()
    {
        return view('livewire.order.shipping-details');
    }
}
