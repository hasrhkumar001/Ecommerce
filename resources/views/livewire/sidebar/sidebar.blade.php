      
<div>
    <div class="sidebar ">
        <div class="logo-details d-flex bg-white">
            <a href="/" wire:navigate >
                <img src="{{asset('storage/logo.png') }}" width="50" style="margin-left:10px">
            </a>
        
            <span class="logo_name text-black py-2">UrbanAura</span>
        </div>
        <ul class="nav-links">
            <li>
                <a href="/" wire:navigate class=" {{ Request::is('/') ? 'active' : '' }}">
                    <i class="bx bx-home"></i>
                    <span class="link_name">Home</span>
                </a>
            </li>
            <li>
                <a href="/categories" wire:navigate class=" {{ Request::is('categories') ? 'active' : '' }}">
                    <i class="bx bx-tachometer"></i>
                    <span class="link_name">Categories</span>
                </a>
            </li>
            <li>
                <a href="/brands" wire:navigate class="{{ Request::is('brands') ? 'active' : '' }}">
                    <i class="bx bx-file"></i>
                    <span class="link_name">Brands</span>
                </a>
            </li>
            <li>
                <a href="/products" wire:navigate class="{{ Request::is('products') ? 'active' : '' }}">
                    <i class="bx bx-user-check"></i>
                    <span class="link_name">Products</span>
                </a>
            </li>
            <li>
                <a href="/orders" wire:navigate class="{{ Request::is('orders') ? 'active' : '' }}">
                    <i class="bx bx-package"></i>
                    <span class="link_name">Orders</span>
                </a>
            </li>
            <li>
                <a href="/users" wire:navigate class="{{ Request::is('users') ? 'active' : '' }}">
                    <i class="bx bx-user"></i>
                    <span class="link_name">Users</span>
                </a>
            </li>
            

            
            <!-- <li>
                <ul class="sub-menu blank">
                    <li><a class="link_name" >User Management</a></li>
                </ul>
            </li>
           <li>
                <ul class="sub-menu blank">
                    <li><a class="link_name" >User Management</a></li>
                </ul>
            </li>
            <li>
                <div class="iocn-link">
                    <a >
                        <i class="bx bx-user"></i>
                        <span class="link_name">User Management</span>
                    </a>
                    <i class="bx bxs-chevron-down arrow"></i>
                </div>
                
                <ul class=" sub-menu" id="userManagement">
                    <li><a class="link_name" >User Management</a></li>
                    <li>
                        <a href="/users" wire:navigate class="{{ Request::is('users') ? 'active' : '' }}">
                            <i class="bx bx-user-circle"></i>
                            <span >User List</span>
                        </a>
                    </li>
                    <li>
                        <a href="/add-users" wire:navigate class="{{ Request::is('add-users') ? 'active' : '' }}">
                            <i class="bx bx-user-plus"></i>
                            <span >Add User</span>
                        </a>
                    </li>
                </ul>
            </li> -->

            
            <li>
                <a href="#" wire:click.prevent="logout">
                    <i class="bx bx-log-out"></i>
                    <span class="link_name">Logout</span>
                </a>
            </li>
        </ul>
    </div>
    <section class="home-section">
        <div class="home-content">
            <nav class="  " style="width:100%;padding:5px;">
                <div class="container-fluid d-flex align-items-center justify-content-between">             
                    <i class="bx bx-menu" id="sidebar-toggle"></i>
                </div>
            </nav>
        </div>
    </section>
    
   
</div>



    <script>
      var arrow = document.querySelectorAll(".arrow");
      for (var i = 0; i < arrow.length; i++) {
        arrow[i].addEventListener("click", (e) => {
          let arrowParent = e.target.parentElement.parentElement; //selecting main parent of arrow
          arrowParent.classList.toggle("showMenu");
        });
      }
      var sidebar = document.querySelector(".sidebar");
      var maincontainer = document.querySelector(".main-container");
      var sidebarBtn = document.querySelector(".bx-menu");
     
      sidebarBtn.addEventListener("click", () => {
        sidebar.classList.toggle("close");
        maincontainer.classList.toggle("close");
      });

      

</script>






