<div class="container shadow py-5 px-3 ">
@if (session()->has('message'))
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            {{ session('message') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    @endif
    <div class="">
        <div class=" justify-content-baseline">
            <div class="row">
           <div class="col"><h2>Users List</h2></div>
           <div class="col d-flex justify-content-end">
            <input type="text" 
            class="form-control me-2" 
            placeholder="Search by name or email" 
            wire:model.live.debounce.300ms="search" 
            style="width: 200px;">
          </div>
</div>
        </div>
        <div class=" ">
        <table class="table table-hover">
  <thead>
    <tr class="text-center">
      <th scope="col">Serial No.</th>
      <th scope="col">User Name</th>
      <th scope="col">Email</th>
      <th scope="col">Orders</th>
      
      
      <th scope="col" >Actions</th>
    </tr>
  </thead>
  <tbody>
      @foreach($all_users as $item)
    <tr class="text-center">
      <th scope="row">{{$loop->iteration}}</th>
      
      <td >{{$item->name}}</td>
      <td >{{$item->email}}</td>
      <td > <a href="{{ route('user-orders.details', $item->id) }}" 
                wire:navigate 
                class="btn btn-warning shadow btn-sm">
                Orders
                </a>
            
        </td>
      
      
      <td ><button class="btn btn-danger btn-sm shadow" wire:click="delete({{$item->id}})" wire:confirm="Are you sure you want to delete this? ">Delete</button></td>
    </tr>
    @endforeach
    
  </tbody>
</table>
        </div>
    </div>

</div>
