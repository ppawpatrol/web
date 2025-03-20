<script>
    import { onMount, onDestroy } from "svelte";
    import { alerts } from "$lib/stores/alerts.js";
    import Chart from "chart.js/auto";

    let chartCanvas;
    let chart;
    let unsubscribe;

    function processAlertData(alertsData) {
        const dates = [];
        const counts = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            const dateStr = date.toISOString().split("T")[0];
            dates.push(dateStr);
            counts.push(0);
        }

        alertsData.forEach((alert) => {
            const alertDate = new Date(alert.timestamp)
                .toISOString()
                .split("T")[0];
            const index = dates.indexOf(alertDate);
            if (index !== -1) {
                counts[index]++;
            }
        });

        const formattedDates = dates.map((date) => {
            const [year, month, day] = date.split("-");
            return `${day}`;
        });

        return { dates: formattedDates, counts };
    }

    function createChart(alertsData) {
        const { dates, counts } = processAlertData(alertsData);

        if (chart) {
            chart.destroy();
        }

        chart = new Chart(chartCanvas, {
            type: "line",
            data: {
                labels: dates,
                datasets: [
                    {
                        label: "Alerts",
                        data: counts,
                        fill: false,
                        borderColor: "#646cff",
                        backgroundColor: "#646cff",
                        tension: 0.2,
                        pointRadius: 4,
                        pointBackgroundColor: "#646cff",
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        // position: 'bottom',
                        text: "Alerts (Last 7 Days)",
                    },
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        enabled: false,
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0,
                        },
                        grid: {
                            color: "rgba(255, 255, 255, 0.1)",
                        },
                    },
                    x: {
                        grid: {
                            color: "rgba(255, 255, 255, 0.1)",
                        },
                    },
                },
            },
        });
    }

    onMount(() => {
        unsubscribe = alerts.subscribe((alertsData) => {
            if (chartCanvas && alertsData) {
                createChart(alertsData);
            }
        });
    });

    onDestroy(() => {
        if (unsubscribe) unsubscribe();
        if (chart) chart.destroy();
    });
</script>

<div class="chart-container">
    <canvas bind:this={chartCanvas}></canvas>
</div>

<style>
    .chart-container {
        height: 225px;
        width: 100%;
        background-color: #1a1a1a;
        border: 1px solid #2a2a2a;
        border-radius: 4px;
        padding: 1rem;
        box-sizing: border-box;
    }
</style>