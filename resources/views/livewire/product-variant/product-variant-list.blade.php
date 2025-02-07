<div class="container shadow py-5 px-3 bg-white">
    @if (session()->has('message'))
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            {{ session('message') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    @endif
    <div class="d-flex justify-content-between">
        <h1 class="mb-5">Product Variants</h1>
        <div><a href=" {{route('add.variant',  $product_id)}}" wire:navigate class="btn btn-primary ">Add Stock</a></div>

    </div>

    <table class="table table-hover table-bordered  ">
        <thead>
            <tr class="text-center">
                <th>Sr. No</th>
                <th>Product</th>
                <th >Size</th>
                <th>Stock</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach($variants as $variant)
                <tr class="text-center">
                    <td>{{$loop->iteration}}</td>
                    <td>{{ $variant->product->name }}</td>
                    <td>{{ $variant->size }}</td>
                    <td>{{ $variant->stock }}</td>
                    <td>
                        <button wire:click="deleteVariant({{ $variant->id }})" class="btn btn-danger">Delete</button>
                        <a href="{{ route('edit.variant', $variant->id) }}" class="btn btn-primary">Edit</a>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
</div>
