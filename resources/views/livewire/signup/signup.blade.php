

<div class="container w-50 mt-5">
    <div class="card shadow ">
        <div class="card-header text-center fs-3 fw-bold"  style="background-color: #2d4575; color: white">
            Register Now
        </div>
        <div class="card-body">
            
            <form wire:submit="register" >
                @csrf
                <div class="mb-3">
                    <label for="name" class="form-label">Name</label>
                    <input type="text" class="form-control" id="name" wire:model="name" autocomplete="off" autofill="off">
                    @error('name')
                                <span class="text-danger">{{$message}}</span>
                    @enderror
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label">Email address</label>
                    <input type="email" class="form-control" id="email" wire:model="email" aria-describedby="emailHelp" autofill="off" autocomplete="off">
                    <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
                    @error('email')
                                <span class="text-danger">{{$message}}</span>
                    @enderror
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" class="form-control" id="password" wire:model="password" autocomplete="off" autofill="off">
                    @error('password')
                                <span class="text-danger">{{$message}}</span>
                    @enderror
                </div>
                <p class="text-end">Already have an account? <a href="/login" class="text-decoration-none"  wire:navigate>Login</a></p>
                <button type="submit" class="btn btn-primary mt-2 fw-bold p-3 w-100">Register</button>
            </form>
        </div>
    
    </div>
</div>
