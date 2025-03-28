<script>
    import { alerts } from "$lib/stores/alerts.js";
    import { respondToAlert } from "$lib/db";
    $: recentAlerts = $alerts.slice(0, 4);

    async function respondAlert(alert) {
        try {
            await respondToAlert(alert._id);
        } catch (error) {
            console.error("Failed to respond to alert:", error);
        }
    }
</script>

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
                {#if alert.status.toLowerCase() === "active"}
                    <button
                        class="action-button"
                        on:click={() => respondAlert(alert)}>Respond</button
                    >
                {/if}
            </div>
        </div>
    {/each}
</div>
<div class="alerts-footer">
    <a href="/alerts">View All Alerts →</a>
</div>

<style>
    .alerts-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.9rem;
    }

    .table-header,
    .table-row {
        display: grid;
        grid-template-columns: 0.8fr 1fr 1.2fr 1.5fr 1fr 1.2fr;
        padding: 0.75rem 0;
        border-bottom: 1px solid #2a2a2a;
        align-items: center;
    }

    .table-header {
        color: #909090;
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .column-actions a:hover {
        color: #fff;
    }
</style>
