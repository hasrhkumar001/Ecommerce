<?php

namespace App\Livewire\User;

use App\Models\User;
use Livewire\Component;

class UserList extends Component
{
    public $search = ''; // Holds the search input value
    public $all_users;  // Filtered list of users

    // Mount function to initialize all users
    public function mount()
    {
        $this->all_users = User::all();
    }

    // Lifecycle method triggered when `search` is updated
    public function updatedSearch()
    {
        $this->filterUsers(); // Call the filtering logic
    }

    // Filtering logic
    public function filterUsers()
    {
        $this->all_users = User::where('name', 'like', '%' . $this->search . '%')->get();
    }

    // Delete a user
    public function delete($id)
    {
        try {
            User::where('id', $id)->delete();
            session()->flash('message', 'User Deleted successfully.');
            $this->filterUsers(); // Refresh the user list after deletion
        } catch (\Exception $e) {
            dd($e);
        }
    }

    public function render()
    {
        return view('livewire.user.user-list', [
            'users' => $this->all_users
        ]);
    }
}
