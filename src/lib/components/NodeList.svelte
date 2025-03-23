<script>
    export let nodes = [];

    function formatDate(dateString) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }).format(date);
    }

    function getAlertSeverityClass(count) {
        if (count >= 5) return "severity-high";
        if (count >= 2) return "severity-medium";
        if (count >= 1) return "severity-low";
        return "no-alerts";
    }
</script>

<div class="node-list">
    {#each nodes as node (node._id)}
        <div class="node-card">
            <div class="node-header">
                <div class="node-title">
                    <h3 class="node-name">{node.name}</h3>
                    <div class="node-status">
                        <span class={`status-dot ${node.status}`}></span>
                        <span class="status-text">{node.status}</span>
                    </div>
                </div>
                <div class="node-alert">
                    <span
                        class={`alert-badge ${getAlertSeverityClass(node.alerts)}`}
                    >
                        {node.alerts}
                        {node.alerts === 1 ? "alert" : "alerts"}
                    </span>
                </div>
            </div>

            <div class="node-details">
                <div class="detail-group">
                    <span class="detail-label">Model</span>
                    <span class="detail-value">{node.model}</span>
                </div>
                <div class="detail-group">
                    <span class="detail-label">Last Activity</span>
                    <span class="detail-value"
                        >{formatDate(node.lastActivity)}</span
                    >
                </div>
                <div class="detail-group">
                    <span class="detail-label">Battery</span>
                    <span
                        class="detail-value"
                        class:battery-low={node.batteryLevel < 20}
                    >
                        {node.batteryLevel}%
                    </span>
                </div>
            </div>
        </div>
    {/each}
</div>

<style>
    .node-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .node-card {
        background-color: #1a1a1a;
        border: 2px solid #2a2a2a;
        border-radius: 4px;
        overflow: hidden;
        transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
    }

    .node-card:hover {
        border-color: #303030;
    }

    .node-header {
        background-color: #222;
        padding: 0.75rem 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.9rem;
    }

    .node-title h3 {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 500;
        color: #e6e6e6;
    }

    .node-status {
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
    }

    .status-dot.online {
        background-color: #4caf50;
        box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
    }

    .status-dot.offline {
        background-color: #f44336;
        box-shadow: 0 0 5px rgba(244, 67, 54, 0.5);
    }

    .status-dot.maintenance {
        background-color: #ffc107;
        box-shadow: 0 0 5px rgba(255, 193, 7, 0.5);
    }

    .status-text {
        font-size: 0.75rem;
        color: #909090;
    }

    .node-alert {
        padding: 0.75rem 1rem;
        background-color: #222;
        font-size: 0.9rem;
    }

    .alert-badge {
        font-size: 0.75rem;
        padding: 0.25rem 0.65rem;
        border-radius: 12px;
        font-weight: 500;
    }

    .alert-badge.severity-high {
        background-color: rgba(244, 67, 54, 0.15);
        color: #ff5252;
    }

    .alert-badge.severity-medium {
        background-color: rgba(255, 152, 0, 0.15);
        color: #ffaa00;
    }

    .alert-badge.severity-low {
        background-color: rgba(255, 193, 7, 0.15);
        color: #ffcb2d;
    }

    .alert-badge.no-alerts {
        background-color: rgba(76, 175, 80, 0.1);
        color: #66bb6a;
    }

    .node-details {
        padding: 1rem;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
    }

    .detail-group {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .detail-label {
        font-size: 0.7rem;
        color: #7a7a7a;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .detail-value {
        font-size: 0.9rem;
        color: #d0d0d0;
        font-weight: 400;
    }

    .battery-low {
        color: #ff5252;
    }

    @media (max-width: 768px) {
        .node-details {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 480px) {
        .node-details {
            grid-template-columns: 1fr;
            gap: 0.75rem;
        }
    }
</style>