<!-- <canvas id="salesChart"></canvas>


<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
    const ctx = document.getElementById('salesChart').getContext('2d');
    const salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May'],
            datasets: [{
                label: 'Sales Data',
                data: @this.salesData,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
    });
</script> -->

<canvas id="ordersByCategoryChart"></canvas>
<script>
    const ctx = document.getElementById('ordersByCategoryChart').getContext('2d');
    const ordersByCategoryData = @json($ordersByCategory);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(ordersByCategoryData),
            datasets: [{
                label: 'Orders by Categories',
                data: Object.values(ordersByCategoryData),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Orders by Categories' }
            }
        }
    });
</script>
