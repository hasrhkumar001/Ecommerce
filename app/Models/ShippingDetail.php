<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShippingDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'firstName',
        'lastName',
        'countryName',
        'companyName',
        'address',
        'houseNo',
        'city',
        'state',
        'postal_code',
        'phone',
    ];
}
