<script>
    import { nodes } from "$lib/stores/nodes.js";
    import { alerts } from "$lib/stores/alerts.js";

    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    $: recentAlerts = $alerts.filter(
        (alert) => new Date(alert.timestamp) >= sevenDaysAgo,
    );
    $: alertsByNode = recentAlerts.reduce((acc, alert) => {
        if (alert.nodeId) {
            acc[alert.nodeId] = (acc[alert.nodeId] || 0) + 1;
        }
        return acc;
    }, {});

    $: affectedNodes = $nodes
        .map((node) => ({
            ...node,
            alertCount: alertsByNode[node._id] || 0,
        }))
        .filter((node) => node.alertCount > 0)
        .sort((a, b) => b.alertCount - a.alertCount)
        .slice(0, 4);

    function getTintClass(count) {
        if (count > 10) return "severity-high";
        if (count > 5) return "severity-medium";
        return "severity-low";
    }
</script>

<h3>Most Affected Nodes</h3>
{#if affectedNodes.length > 0}
    <ul class="affected-nodes-list">
        {#each affectedNodes as node}
            <li class={getTintClass(node.alertCount)}>
                <span class="node-name">{node.name}</span>
                <span class="alert-count"
                    >{node.alertCount} alert{node.alertCount === 1
                        ? ""
                        : "s"}</span
                >
            </li>
        {/each}
    </ul>
{:else}
    <p class="no-data">No nodes affected in the last 7 days.</p>
{/if}

<style>
    h3 {
        font-size: 1rem;
        font-weight: 500;
        margin: 0 0 0.75rem 0;
        color: #d0d0d0;
    }

    .affected-nodes-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .affected-nodes-list li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0.75rem;
        border: 2px solid #2a2a2a;
        border-radius: 4px;
        transition: all 0.2s ease;
        position: relative;
        overflow: hidden;
        background-color: rgba(26, 26, 26, 0.8);
    }

    .affected-nodes-list li:hover {
        background-color: rgb(31, 31, 31);
    }

    .node-name {
        font-size: 0.9rem;
        color: #e0e0e0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 70%;
    }

    .alert-count {
        font-size: 0.8rem;
        padding: 0.2rem 0.5rem;
        border-radius: 3px;
        font-weight: 500;
    }

    .severity-low .alert-count {
        background-color: rgba(33, 150, 243, 0.15);
        color: #2196f3;
    }

    .severity-medium .alert-count {
        background-color: rgba(255, 152, 0, 0.15);
        color: #ff9800;
    }

    .severity-high .alert-count {
        background-color: rgba(244, 67, 54, 0.15);
        color: #f44336;
    }

    .no-data {
        color: #909090;
        font-size: 0.85rem;
        margin: 0.5rem 0;
        text-align: center;
        font-style: italic;
    }
</style>