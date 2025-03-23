<script>
    import { alerts } from "$lib/stores/alerts.js";
    import { respondToAlert } from "$lib/db";

    export let selectedId = null;

    $: activeAlerts = selectedId
        ? $alerts.filter(
              (alert) =>
                  alert.status.toLowerCase() === "active" &&
                  alert.nodeId === selectedId,
          )
        : $alerts.filter((alert) => alert.status.toLowerCase() === "active");


</script>

<div class="active-alerts-container">
    <h3>Active Alerts</h3>

    {#if activeAlerts.length > 0}
        <div class="alerts-list">
            {#each activeAlerts as alert}
                <div class="alert-item">
                    <div class="alert-header">
                        <span class="severity-indicator {alert.severity}"
                            >{alert.severity}</span
                        >
                        <div class="alert-location">{alert.location}</div>
                    </div>
                    <div class="alert-content">
                        <span class="alert-title">{alert.type}</span>
                        <a href="/alerts" class="action-button">View</a>
                    </div>
                </div>
            {/each}
        </div>
    {:else}
        <div class="no-alerts">No active alerts</div>
    {/if}
</div>

<style>
    .active-alerts-container {
        background-color: #1a1a1a;
        border: 2px solid #2a2a2a;
        border-radius: 4px;
        padding: 1rem;
        display: flex;
        height: 100%;
        flex-direction: column;
        box-sizing: border-box;
    }

    .active-alerts-container:hover {
        border-color: #303030;
    }

    h3 {
        font-size: 1.125rem;
        font-weight: 500;
        margin: 0 0 1rem 0;
        color: #d0d0d0;
    }

    .alerts-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        overflow-y: auto;
        min-height: 0;
        flex: 1;
        scrollbar-width: none;
    }

    .alerts-list::-webkit-scrollbar {
        display: none;
    }

    .alert-item {
        background-color: #1c1c1c;
        border: 1px solid #2a2a2a;
        border-radius: 4px;
        overflow: hidden;
        transition: background-color 0.2s;
        min-height: 6rem;
    }

    .alert-item:hover {
        background-color: #212121;
    }

    .alert-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 1rem;
        border-bottom: 1px solid #2a2a2a;
    }

    .severity-indicator {
        display: inline-block;
        padding: 0.2rem 0.5rem;
        border-radius: 3px;
        text-transform: uppercase;
        font-size: 0.7rem;
        font-weight: 600;
        letter-spacing: 0.5px;
    }

    .severity-indicator.high {
        background-color: rgba(244, 67, 54, 0.15);
        color: #f44336;
    }

    .severity-indicator.medium {
        background-color: rgba(255, 152, 0, 0.15);
        color: #ff9800;
    }

    .severity-indicator.low {
        background-color: rgba(33, 150, 243, 0.15);
        color: #2196f3;
    }

    .alert-title {
        font-size: 0.9rem;
        font-weight: 400;
        color: #e0e0e0;
    }

    .alert-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 1rem;
    }

    .alert-location {
        font-size: 0.85rem;
        color: #a0a0a0;
        margin-right: 1em;
    }

    .action-button {
        background-color: transparent;
        border: 1px solid #444;
        color: #d0d0d0;
        padding: 0.3rem 0.6rem;
        font-size: 0.8rem;
        border-radius: 3px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .action-button:hover {
        background-color: #303030;
    }

    .no-alerts {
        text-align: center;
        padding: 1.5rem 0;
        color: #909090;
        font-size: 0.85rem;
        margin-top: 0.5rem;
    }
</style>
