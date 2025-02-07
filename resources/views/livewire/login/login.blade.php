
<div class="container w-50 mt-5 ">
<div class="card shadow ">
  <div class="card-header text-center fs-3 fw-bold" style="background-color: #2d4575; color: white">
    Login Now
  </div>
  <div class="card-body">
    <!-- <h5 class="card-title">Special title treatment</h5> -->
    <form wire:submit="login" >
        @csrf
        <div class="mb-3">
            <label for="email" class="form-label">Email address</label>
            <input type="email" class="form-control" id="email" wire:model="email" aria-describedby="emailHelp">
            @error('email') <span class="text-danger">{{ $message }}</span> @enderror
        </div>
        <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" id="password" wire:model="password">
            @error('password') <span class="text-danger">{{ $message }}</span> @enderror
        </div>
        <!-- <p class="text-end">Don't have an account? Create New <a href="/register" wire:navigate class="text-decoration-none">Register</a></p> -->
        <button type="submit" class="btn btn-primary mt-2 fw-bold p-3 w-100" >Login</button>
        
    </form>
  
</div>
</div>
