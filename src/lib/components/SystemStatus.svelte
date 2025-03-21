<script>
    import { systemStatus } from "$lib/stores/systemStatus.js";
</script>

<h2>System Status</h2>
<div class="status-metrics">
    <div class="metric">
        <div class="metric-value">
            {$systemStatus.nodes.online}/{$systemStatus.nodes.online +
                $systemStatus.nodes.offline +
                $systemStatus.nodes.maintenance}
        </div>
        <div class="metric-label">nodes Online</div>
    </div>
    <div class="metric">
        <div class="metric-value">{$systemStatus.coverage}%</div>
        <div class="metric-label">Area Coverage</div>
    </div>
    <div class="metric">
        <div class="metric-value">{$systemStatus.battery}%</div>
        <div class="metric-label">Average Battery</div>
    </div>
    <div class="metric">
        <div class="metric-value">{$systemStatus.activeAlerts}</div>
        <div class="metric-label">Active Alerts</div>
    </div>
</div>

<style>
    .status-metrics {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 1rem;
    }

    .metric {
        text-align: center;
        padding: 0.75rem 0.5rem;
        background-color: #232323;
        border-radius: 4px;
    }

    .metric-value {
        font-size: 1.5rem;
        font-weight: 500;
        margin-bottom: 0.25rem;
    }

    .metric-label {
        font-size: 0.8rem;
        color: #909090;
    }
</style>
