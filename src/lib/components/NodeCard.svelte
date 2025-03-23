<script>
  export let node;

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

<div class="node-card">
  <div class="node-header">
    <div class="node-title">
      <h3 class="node-name">
        <!--<span class={`status-dot ${node.status}`}></span>-->
        {node.name}
      </h3>
      <p class="node-model">{node.model}</p>
    </div>
    <div class="node-alert">
      <span class={`alert-badge ${getAlertSeverityClass(node.alerts)}`}>
        {node.alerts}
        {node.alerts === 1 ? "alert" : "alerts"}
      </span>
    </div>
  </div>

  <div class="node-details">
    <div class="node-detail">
      <div class="detail-label">Last Activity:</div>
      <div class="detail-value">{formatDate(node.lastActivity)}</div>
    </div>
    <div class="node-detail">
      <div class="detail-label">Battery:</div>
      <div class="detail-value" class:battery-low={node.batteryLevel < 20}>
        {node.batteryLevel}%
      </div>
    </div>
    <div class="node-detail">
      <div class="detail-label">Status:</div>
      <div class="detail-value status-text">{node.status}</div>
    </div>
  </div>

  <div class="node-capabilities">
    {#if node.capabilities.video}
      <span class="capability-badge">Video</span>
    {/if}
    {#if node.capabilities.audio}
      <span class="capability-badge">Audio</span>
    {/if}
    {#if node.capabilities.motion}
      <span class="capability-badge">Motion</span>
    {/if}
    {#if node.capabilities.psychic}
      <span class="capability-badge">Psychic</span>
    {/if}
  </div>
</div>

<style>
  .node-card {
    background-color: #1a1a1a;
    border: 2px solid #2a2a2a;
    border-radius: 4px;
    padding: 1.25rem;
    transition: all 0.2s ease;
  }

  .node-card:hover {
    border: 2px solid #303030;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .node-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .node-title {
    display: flex;
    flex-direction: column;
  }

  .node-name {
    font-size: 1.1rem;
    font-weight: 500;
    margin: 0;
    color: #e0e0e0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .node-model {
    font-size: 0.75rem;
    color: #707070;
  }

  .status-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
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
    color: #909090;
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
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 1rem 0;
  }

  .node-detail {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.25rem 0;
  }

  .detail-value {
    font-size: 0.9rem;
    color: #d0d0d0;
  }

  .battery-low {
    color: #ff5252;
  }

  .detail-label {
    font-size: 0.8rem;
    color: #909090;
  }

  .node-capabilities {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .capability-badge {
    background-color: rgba(100, 108, 255, 0.15);
    color: #646cff;
    font-size: 0.7rem;
    padding: 0.15rem 0.5rem;
    border-radius: 3px;
  }

  @keyframes pulse-orange {
    0% {
      box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.5);
    }
    70% {
      box-shadow: 0 0 0 6px rgba(255, 193, 7, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(255, 193, 7, 0);
    }
  }
</style>