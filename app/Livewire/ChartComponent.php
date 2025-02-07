<?php

namespace App\Livewire;

use Livewire\Component;

class ChartComponent extends Component
{
    public $salesData;

    public function mount()
    {
        // Example data
        $this->salesData = [20, 40, 50, 80, 120];
    }

    public function render()
    {
        return view('livewire.chart-component', [
            'salesData' => $this->salesData,
        ]);
    }
}
