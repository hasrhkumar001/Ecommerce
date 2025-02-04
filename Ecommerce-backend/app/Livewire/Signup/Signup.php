<?php

namespace App\Livewire\Signup;

use App\Models\Admin;
use Livewire\Component;

class Signup extends Component
{
    public $name="";
    public $email="";
    public $password="";
    
    

    public function register(){
        $this->validate([
            'name'=>'required|string|max:50',
            'email'=>'required|email|unique:users',
            'password'=>'required|min:6'
            
        ]);
        
        // Users::create(
        //     $this->only(['name', 'email' ,'password'])
        // );
        $new_user =new Admin;
        $new_user->name =$this->name;
        $new_user->email =$this->email;
        $new_user->password =bcrypt($this->password);
        $new_user->save();
        return $this->redirect('/login',navigate:true);
    }
    public function render()
    {
        return view('livewire.signup.signup')->layout('components.layouts.app-default');
    }
}
