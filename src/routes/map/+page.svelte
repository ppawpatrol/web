<script>
    import { onMount } from "svelte";
    import { nodes } from "$lib/stores/nodes.js";

    let mapElement;
    let selectedStatus = "all";

    const statuses = ["all", "online", "offline", "maintenance"];

    $: filterednodes =
        selectedStatus === "all"
            ? $nodes
            : $nodes.filter((node) => node.status === selectedStatus);

    function getSectorCoordinates(sectorName) {
        let coords = { x: 0, y: 0 };

        try {
            const sectorPart = sectorName.split(" ")[1];
            if (sectorPart) {
                const [sector, number] = sectorPart.split("-");
                const x = sector.charCodeAt(0) - 64;
                const y = parseInt(number);

                coords = { x, y };
            }
        } catch (e) {
            console.error("Error parsing sector name:", sectorName);
        }

        return coords;
    }

    function getPercentPosition(coords, gridSize = { width: 10, height: 10 }) {
        const xPercent = (coords.x / gridSize.width) * 80 + 20;
        const yPercent = (coords.y / gridSize.height) * 80 + 10;
        return { x: xPercent, y: yPercent };
    }

    function getStatusClass(node) {
        if (node.status === "offline") return "offline";
        if (node.alerts > 0) return "active";
        if (node.batteryLevel < 30 && node.batteryLevel > 0)
            return "warning";
        if (node.status === "maintenance") return "warning";
        return "normal";
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

    <div class="map-container">
        <div class="map-placeholder" bind:this={mapElement}>
            <div class="map-overlay">
                {#each filterednodes as node}
                    {@const coords = getSectorCoordinates(node.name)}
                    {@const position = getPercentPosition(coords)}
                    {@const statusClass = getStatusClass(node)}

                    <div
                        class="sector {statusClass}"
                        style="left: {position.x}%; top: {position.y}%;"
                    >
                        <span class="sector-tooltip tooltip-right">
                            <strong>{node.name}</strong>
                            <br />Status: {node.status}
                            <br />Battery: {node.batteryLevel}%
                            <br />Alerts: {node.alerts}
                        </span>
                    </div>
                {/each}
            </div>

            <div class="map-actions">
                <button class="map-button">Refresh</button>
                <button class="map-button">Full Screen</button>
            </div>
        </div>
    </div>

    <div class="map-legend">
        <div class="legend-item">
            <span class="legend-icon active"></span>
            <span>Active Alert</span>
        </div>
        <div class="legend-item">
            <span class="legend-icon warning"></span>
            <span>Warning</span>
        </div>
        <div class="legend-item">
            <span class="legend-icon normal"></span>
            <span>Online</span>
        </div>
        <div class="legend-item">
            <span class="legend-icon offline"></span>
            <span>Offline</span>
        </div>
    </div>
</div>

<style>
    .map-container {
        margin-bottom: 1.5rem;
    }

    .map-placeholder {
        background: #1a1a1a;
        border-radius: 8px;
        height: 550px;
        width: 100%;
        position: relative;
        overflow: hidden;
    }

    .sector-label {
        position: absolute;
        color: rgba(255, 255, 255, 0.4);
        font-size: 0.8rem;
        font-weight: 500;
    }

    .x-label {
        transform: translateX(-50%);
    }

    .y-label {
        transform: translateY(-50%);
    }

    .map-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .sector {
        position: absolute;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        cursor: pointer;
        transition:
            transform 0.2s,
            box-shadow 0.2s;
    }

    .sector:hover {
        transform: translate(-50%, -50%) scale(1.3);
        z-index: 10;
    }

    .sector:hover .sector-tooltip {
        display: block;
    }

    .sector-tooltip {
        display: none;
        position: absolute;
        left: 150%;
        top: 50%;
        transform: translateY(-50%);
        background: #1a1a1a;
        color: #e0e0e0;
        padding: 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
        white-space: nowrap;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        pointer-events: none;
    }

    .sector-tooltip::after {
        content: "";
        position: absolute;
        right: 100%;
        top: 50%;
        transform: translateY(-50%);
        border: 5px solid transparent;
        border-right-color: #1a1a1a;
    }

    .sector.active {
        background-color: #f44336;
        box-shadow: 0 0 10px rgba(244, 67, 54, 0.8);
    }

    .sector.warning {
        background-color: #ffc107;
        box-shadow: 0 0 5px rgba(255, 193, 7, 0.5);
    }

    .sector.normal {
        background-color: #4caf50;
        box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
    }

    .sector.offline {
        background-color: #9e9e9e;
    }

    .map-actions {
        position: absolute;
        bottom: 1rem;
        right: 1rem;
        display: flex;
        gap: 0.5rem;
    }

    .map-button {
        background-color: rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-size: 0.8rem;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .map-button:hover {
        background-color: rgba(0, 0, 0, 0.7);
    }

    .map-legend {
        display: flex;
        gap: 1.5rem;
        margin-top: 1rem;
    }

    .legend-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #d0d0d0;
    }

    .legend-icon {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
    }

    .legend-icon.active {
        background-color: #f44336;
        box-shadow: 0 0 5px rgba(244, 67, 54, 0.5);
    }

    .legend-icon.warning {
        background-color: #ffc107;
        box-shadow: 0 0 5px rgba(255, 193, 7, 0.5);
    }

    .legend-icon.normal {
        background-color: #4caf50;
        box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
    }

    .legend-icon.offline {
        background-color: #9e9e9e;
        opacity: 0.5;
    }
</style>
