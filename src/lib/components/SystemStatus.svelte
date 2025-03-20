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
</div>
