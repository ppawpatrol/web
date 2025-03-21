<script>
    import { alerts } from "$lib/stores/alerts.js";
    import { resolveAlert } from "$lib/db";
    let filterSeverity = "all";
    let filterStatus = "all";

    $: filteredAlerts = $alerts
        .filter(
            (alert) =>
                filterSeverity === "all" || alert.severity === filterSeverity,
        )
        .filter(
            (alert) =>
                filterStatus === "all" ||
                alert.status.toLowerCase() === filterStatus.toLowerCase(),
        );

    async function markResolved(alert) {
        try {
            await resolveAlert(alert._id);
        } catch (error) {
            console.error("Failed to resolve alert:", error);
        }
    }
</script>

<div class="page-container">
    <div class="filter-bar">
        <div class="filter-group">
            <span>Severity:</span>
            <button
                class={filterSeverity === "all" ? "active" : ""}
                on:click={() => (filterSeverity = "all")}>All</button
            >
            <button
                class={filterSeverity === "high" ? "active" : ""}
                on:click={() => (filterSeverity = "high")}>High</button
            >
            <button
                class={filterSeverity === "medium" ? "active" : ""}
                on:click={() => (filterSeverity = "medium")}>Medium</button
            >
            <button
                class={filterSeverity === "low" ? "active" : ""}
                on:click={() => (filterSeverity = "low")}>Low</button
            >
        </div>
        <div class="filter-group">
            <span>Status:</span>
            <button
                class={filterStatus === "all" ? "active" : ""}
                on:click={() => (filterStatus = "all")}>All</button
            >
            <button
                class={filterStatus === "active" ? "active" : ""}
                on:click={() => (filterStatus = "active")}>Active</button
            >
            <button
                class={filterStatus === "investigating" ? "active" : ""}
                on:click={() => (filterStatus = "investigating")}
                >Investigating</button
            >
            <button
                class={filterStatus === "resolved" ? "active" : ""}
                on:click={() => (filterStatus = "resolved")}>Resolved</button
            >
        </div>
    </div>
    <div class="alerts-list">
        {#each filteredAlerts as alert (alert._id)}
            <div class="alert-card">
                <div class="alert-header">
                    <div class="alert-id">#{alert._id}</div>
                    <div
                        class="alert-severity severity-indicator {alert.severity}"
                    >
                        {alert.severity}
                    </div>
                </div>
                <div class="alert-body">
                    <h3>{alert.type} at {alert.location}</h3>
                    <p class="alert-details">{alert.details}</p>
                    <div class="alert-meta">
                        <div class="alert-timestamp">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                ><circle cx="12" cy="12" r="10"
                                ></circle><polyline points="12 6 12 12 16 14"
                                ></polyline></svg
                            >
                            {alert.timestamp}
                        </div>
                        <div
                            class="alert-status status-badge {alert.status.toLowerCase()}"
                        >
                            <span class="status-icon"></span>
                            {alert.status}
                        </div>
                    </div>
                </div>
                <div class="alert-actions">
                    <button class="action-button">View Details</button>
                    <button class="action-button">Respond</button>
                    {#if alert.status.toLowerCase() !== "resolved"}
                        <button
                            class="action-button"
                            on:click={() => markResolved(alert)}
                            >Mark as Resolved</button
                        >
                    {/if}
                </div>
            </div>
        {/each}
    </div>
    {#if filteredAlerts.length === 0}
        <div class="no-alerts">
            <p>No alerts matching your filter criteria.</p>
        </div>
    {/if}
</div>

<style>
    .alerts-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .alert-card {
        background-color: #1a1a1a;
        border: 1px solid #2a2a2a;
        border-radius: 4px;
        overflow: hidden;
    }

    .alert-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 1rem;
        background-color: #222;
        font-size: 0.9rem;
    }

    .alert-body {
        padding: 1rem;
    }

    .alert-body h3 {
        margin: 0 0 0.5rem;
        font-size: 1.1rem;
        font-weight: 500;
    }

    .alert-details {
        margin: 0 0 1rem;
        color: #a0a0a0;
    }

    .alert-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.85rem;
        color: #909090;
    }

    .alert-timestamp {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .alert-actions {
        display: flex;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        border-top: 1px solid #2a2a2a;
        background-color: #1c1c1c;
    }

    .no-alerts {
        text-align: center;
        padding: 3rem;
        background-color: #1a1a1a;
        border: 1px solid #2a2a2a;
        border-radius: 4px;
        color: #909090;
    }
</style>
