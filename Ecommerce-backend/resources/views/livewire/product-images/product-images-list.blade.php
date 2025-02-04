<div>
    <h2>Product Images List</h2>
    <table>
        <thead>
            <tr>
                <th>Image</th>
                <th>Product ID</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($productImages as $image)
            <tr>
                <td><img src="{{ asset('storage/' . $image->image_path) }}" alt="Image" width="100"></td>
                <td>{{ $image->product_id }}</td>
                <td>
                    <button wire:click="delete({{ $image->id }})">Delete</button>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>
