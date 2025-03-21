<script>
    import { nodes } from "$lib/stores/nodes.js";

    function getStatusClass(node) {
        if (node.status === "offline") return "offline";
        if (node.alerts > 0) return "active";
        if (node.batteryLevel < 30 && node.batteryLevel > 0) return "warning";
        if (node.status === "maintenance") return "warning";
        return "normal";
    }

    function getNodePosition(node, index) {
        const gridSize = 5;
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;

        return {
            x: 10 + col * 20,
            y: 10 + row * 20,
        };
    }
</script>

<div class="map-preview-container">
    <div class="preview-header">
        <h3>Network Map</h3>
        <a href="/map" class="view-full">View Full Map →</a>
    </div>

    <div class="preview-map">
        {#each $nodes.slice(0, 20) as node, i}
            {@const position = getNodePosition(node, i)}
            {@const statusClass = getStatusClass(node)}

            <div
                class="node-dot {statusClass}"
                style="left: {position.x}%; top: {position.y}%;"
                title="{node.name}"
            ></div>
        {/each}
    </div>

    <div class="preview-legend">
        <div class="legend-item">
            <span class="legend-dot active"></span>
            <span>Alert</span>
        </div>
        <div class="legend-item">
            <span class="legend-dot warning"></span>
            <span>Warning</span>
        </div>
        <div class="legend-item">
            <span class="legend-dot normal"></span>
            <span>Normal</span>
        </div>
        <div class="legend-item">
            <span class="legend-dot offline"></span>
            <span>Offline</span>
        </div>
    </div>
</div>

<style>
    .map-preview-container {
        height: 100%;
        width: 100%;
        background-color: #1a1a1a;
        border: 1px solid #2a2a2a;
        border-radius: 4px;
        padding: 1rem;
        box-sizing: border-box;
    }

    .preview-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
    }

    h3 {
        font-size: 1rem;
        font-weight: 500;
        margin: 0;
        color: #d0d0d0;
    }

    .view-full {
        font-size: 0.8rem;
    }

    .preview-map {
        flex: 1;
        background-color: #232323;
        border-radius: 4px;
        position: relative;
        height: 75%;
        overflow: hidden;
        margin-bottom: 0.75rem;
    }

    .node-dot {
        position: absolute;
        width: 11px;
        height: 11px;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition: transform 0.2s;
        margin-top: 0.75em;
    }

    .node-dot:hover {
        transform: translate(-50%, -50%) scale(1.3);
        z-index: 10;
    }

    .node-dot.active {
        background-color: #f44336;
        box-shadow: 0 0 5px rgba(244, 67, 54, 0.5);
        /* animation: pulse-red 2s infinite; */
    }

    .node-dot.warning {
        background-color: #ffc107;
        box-shadow: 0 0 5px rgba(255, 193, 7, 0.5);
    }

    .node-dot.normal {
        background-color: #4caf50;
        box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
    }

    .node-dot.offline {
        background-color: #9e9e9e;
    }

    .sector-label {
        font-size: 0.7rem;
        opacity: 0.8;
    }

    .preview-legend {
        display: flex;
        gap: 1rem;
        margin-top: auto;
    }

    .legend-item {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 0.7rem;
        color: #a0a0a0;
    }

    .legend-dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
    }

    .legend-dot.active {
        background-color: #f44336;
    }

    .legend-dot.warning {
        background-color: #ffc107;
    }

    .legend-dot.normal {
        background-color: #4caf50;
    }

    .legend-dot.offline {
        background-color: #9e9e9e;
    }
</style>
