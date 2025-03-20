<script>
    import { systemStatus } from "$lib/stores/systemStatus.js";
    import { alerts } from "$lib/stores/alerts.js";
    import AlertsTrend from "$lib/components/AlertsTrend.svelte";

    $: recentAlerts = $alerts.slice(0, 3);
</script>

<div class="dashboard-grid">
    <div class="status-panel">
        <h2>System Status</h2>
        <div class="status-metrics">
            <div class="metric">
                <div class="metric-value">
                    {$systemStatus.nodes.online}/{$systemStatus.nodes
                        .online +
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
    </div>

    <div class="trends-panel">
        <AlertsTrend />
    </div>

    <div class="alerts-panel">
        <h2>Recent Alerts</h2>
        <div class="alerts-table">
            <div class="table-header">
                <div class="column-severity">Severity</div>
                <div class="column-location">Location</div>
                <div class="column-timestamp">Time</div>
                <div class="column-type">Type</div>
                <div class="column-status">Status</div>
                <div class="column-actions">Actions</div>
            </div>
            {#each recentAlerts as alert}
                <div class="table-row">
                    <div class="column-severity">
                        <span class="severity-indicator {alert.severity}"
                            >{alert.severity}</span
                        >
                    </div>
                    <div class="column-location">{alert.location}</div>
                    <div class="column-timestamp">
                        {new Date(alert.timestamp).toLocaleString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </div>
                    <div class="column-type">{alert.type}</div>
                    <div class="column-status">
                        <span class="status-badge {alert.status.toLowerCase()}">
                            <span class="status-icon"></span>
                            {alert.status}
                        </span>
                    </div>
                    <div class="column-actions">
                        <a href="/alerts" class="action-button">View</a>
                        <button class="action-button">Respond</button>
                    </div>
                </div>
            {/each}
        </div>
        <div class="alerts-footer">
            <a href="/alerts">View All Alerts →</a>
        </div>
    </div>
</div>

<style>
    .column-actions a:hover {
        color: #fff;
    }
</style>