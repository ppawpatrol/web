<script>
    import { sensors } from "$lib/stores/sensors.js";

    let selectedLocation = "all";
    let selectedStatus = "all";

    const statuses = ["all", "online", "offline", "maintenance"];

    $: filteredSensors = $sensors.filter((sensor) => {
        const matchesStatus =
            selectedStatus === "all" || sensor.status === selectedStatus;
        return matchesStatus;
    });

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
</script>

<div class="page-container">
    <div class="filter-bar">
        <div class="filter-group">
            <span>Status:</span>
            {#each statuses as status}
                <button
                    class={selectedStatus === status ? "active" : ""}
                    on:click={() => (selectedStatus = status)}
                >
                    {status}
                </button>
            {/each}
        </div>
    </div>

    <div class="sensors-grid">
        {#each filteredSensors as sensor (sensor.id)}
            <div class="sensor-card">
                <div class="sensor-header">
                    <div>
                        <h3 class="sensor-name">{sensor.name}</h3>
                        <p class="sensor-model">{sensor.model}</p>
                    </div>
                    <div class="sensor-status">
                        <span class={`status-dot ${sensor.status}`}></span>
                        <span class="status-text">{sensor.status}</span>
                    </div>
                </div>

                <div class="sensor-details">
                    <div class="sensor-detail">
                        <div class="detail-label">Last Activity:</div>
                        <div class="detail-value">
                            {formatDate(sensor.lastActivity)}
                        </div>
                    </div>
                    <div class="sensor-detail">
                        <div class="detail-label">Battery:</div>
                        <div class="detail-value">{sensor.batteryLevel}%</div>
                    </div>
                    <div class="sensor-detail">
                        <div class="detail-label">Alerts:</div>
                        <div class="detail-value">{sensor.alerts}</div>
                    </div>
                </div>

                <div class="sensor-capabilities">
                    {#if sensor.capabilities.video}
                        <span class="capability-badge">Video</span>
                    {/if}
                    {#if sensor.capabilities.audio}
                        <span class="capability-badge">Audio</span>
                    {/if}
                    {#if sensor.capabilities.motion}
                        <span class="capability-badge">Motion</span>
                    {/if}
                    {#if sensor.capabilities.psychic}
                        <span class="capability-badge">Psychic</span>
                    {/if}
                </div>

                <div class="sensor-actions">
                    <button>Configure</button>
                    <button>View Data</button>
                </div>
            </div>
        {/each}
    </div>
</div>

<style>
    .sensors-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.25rem;
        margin-top: 1rem;
    }

    .sensor-card {
        background-color: #1a1a1a;
        border: 1px solid #2a2a2a;
        border-radius: 4px;
        padding: 1.25rem;
        transition:
            transform 0.2s,
            box-shadow 0.2s;
    }

    .sensor-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .sensor-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
    }

    .sensor-name {
        font-size: 1.1rem;
        font-weight: 500;
        margin: 0;
        color: #e0e0e0;
    }

    .sensor-location {
        font-size: 0.85rem;
        color: #909090;
        margin: 0.25rem 0 0 0;
    }

    .sensor-model {
        font-size: 0.75rem;
        color: #707070;
        margin: 0.25rem 0 0 0;
    }

    .sensor-status {
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .status-dot {
        width: 10px;
        height: 10px;
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
        font-size: 0.8rem;
        color: #909090;
        padding-left: 4px;
    }

    .sensor-details {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin: 1rem 0;
    }

    .sensor-detail {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.25rem 0;
    }

    .detail-value {
        font-size: 0.9rem;
        color: #d0d0d0;
    }

    .detail-label {
        font-size: 0.8rem;
        color: #909090;
    }

    .sensor-capabilities {
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

    .sensor-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
        margin-top: 1rem;
        border-top: 1px solid #2a2a2a;
        padding-top: 1rem;
    }

    .sensor-actions button {
        background-color: transparent;
        border: 1px solid #373737;
        color: #d0d0d0;
        padding: 0.3rem 0.6rem;
        font-size: 0.8rem;
        border-radius: 4px;
        transition: all 0.2s;
    }

    .sensor-actions button:hover {
        background-color: #303030;
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
