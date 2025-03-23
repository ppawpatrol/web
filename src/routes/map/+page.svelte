<script>
    import { onMount } from "svelte";
    import { nodes } from "$lib/stores/nodes.js";
    import NodeCard from "$lib/components/NodeCard.svelte";
    import ActiveAlerts from "$lib/components/ActiveAlerts.svelte";

    let mapElement;
    let selectedStatus = "all";
    let selectedNode = null;

    const statuses = ["all", "active", "online", "offline", "maintenance"];

    $: filterednodes =
        selectedStatus === "all"
            ? $nodes
            : selectedStatus === "active"
              ? $nodes.filter((node) => node.alerts > 0)
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
        const xPercent = (coords.x / gridSize.width) * 80 + 5;
        const yPercent = (coords.y / gridSize.height) * 80 + 10;
        return { x: xPercent, y: yPercent };
    }

    function getStatusClass(node) {
        if (node.status === "offline") return "offline";
        if (node.alerts > 0) return "active";
        if (node.batteryLevel < 30 && node.batteryLevel > 0) return "warning";
        if (node.status === "maintenance") return "warning";
        return "normal";
    }

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            mapElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    let isDragging = false;
    let startX, startY;
    let startTranslateX = 0,
        startTranslateY = 0;

    function zoomIn() {
        scale = Math.min(scale + 0.1, 3);
    }

    function zoomOut() {
        scale = Math.max(scale - 0.1, 1);
    }

    function resetTransform() {
        scale = 1;
        translateX = 0;
        translateY = 0;
    }

    function handleWheel(event) {
        event.preventDefault();

        const rect = mapElement.getBoundingClientRect();
        const cursorX = event.clientX - rect.left;
        const cursorY = event.clientY - rect.top;
        const dx = cursorX - rect.width / 2;
        const dy = cursorY - rect.height / 2;

        const oldScale = scale;
        let newScale = scale;
        if (event.deltaY < 0) {
            newScale = Math.min(scale + 0.1, 3);
        } else {
            newScale = Math.max(scale - 0.1, 1);
        }

        if (newScale !== oldScale) {
            translateX = translateX + (oldScale - newScale) * dx;
            translateY = translateY + (oldScale - newScale) * dy;
            scale = newScale;

            const maxTranslateX = ((scale - 1) * mapElement.offsetWidth) / 2;
            const maxTranslateY = ((scale - 1) * mapElement.offsetHeight) / 2;
            translateX = Math.max(Math.min(translateX, maxTranslateX), -maxTranslateX);
            translateY = Math.max(Math.min(translateY, maxTranslateY), -maxTranslateY);
        }
    }

    function handleMouseDown(event) {
        isDragging = true;
        startX = event.clientX;
        startY = event.clientY;
        startTranslateX = translateX;
        startTranslateY = translateY;
    }

    function handleMouseMove(event) {
        if (!isDragging) return;
        const dx = event.clientX - startX;
        const dy = event.clientY - startY;

        const maxTranslateX = ((scale - 1) * mapElement.offsetWidth) / 2;
        const maxTranslateY = ((scale - 1) * mapElement.offsetHeight) / 2;

        translateX = Math.max(
            Math.min(startTranslateX + dx, maxTranslateX),
            -maxTranslateX,
        );
        translateY = Math.max(
            Math.min(startTranslateY + dy, maxTranslateY),
            -maxTranslateY,
        );
    }

    function handleMouseUp() {
        isDragging = false;
    }

    function handleMouseLeave() {
        isDragging = false;
    }

    function handleNodeClick(e, node) {
        e.stopPropagation();
        if (selectedNode && selectedNode.name === node.name) {
            selectedNode = null;
        } else {
            selectedNode = node;
        }
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

    <div class="content-container">
        <div class="map-container">
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                class="map-placeholder"
                bind:this={mapElement}
                on:wheel={handleWheel}
                on:mousedown={handleMouseDown}
                on:mousemove={handleMouseMove}
                on:mouseup={handleMouseUp}
                on:mouseleave={handleMouseLeave}
                on:dblclick={resetTransform}
            >
                <div
                    class="map-overlay"
                    style="transform: translate({translateX}px, {translateY}px) scale({scale}); transform-origin: center center;"
                >
                    {#each filterednodes as node}
                        {@const coords = getSectorCoordinates(node.name)}
                        {@const position = getPercentPosition(coords)}
                        {@const statusClass = getStatusClass(node)}
                        <!-- svelte-ignore a11y_click_events_have_key_events -->
                        <div
                            class="sector {statusClass}"
                            style="left: {position.x}%; top: {position.y}%;"
                            on:click={(e) => handleNodeClick(e, node)}
                        >
                            <span class="sector-tooltip">
                                {node.name}
                            </span>
                        </div>
                    {/each}
                </div>

                <div class="map-actions">
                    <!-- svelte-ignore a11y_consider_explicit_label -->
                    <button class="map-button" on:click={toggleFullScreen}
                        ><svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="feather feather-maximize"
                            ><path
                                d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"
                            ></path></svg
                        ></button
                    >
                    <!-- svelte-ignore a11y_consider_explicit_label -->
                    <button class="map-button" on:click={zoomIn}
                        ><svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="feather feather-plus"
                            ><line x1="12" y1="5" x2="12" y2="19"></line><line
                                x1="5"
                                y1="12"
                                x2="19"
                                y2="12"
                            ></line></svg
                        ></button
                    >
                    <!-- svelte-ignore a11y_consider_explicit_label -->
                    <button class="map-button" on:click={zoomOut}
                        ><svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="feather feather-minus"
                            ><line x1="5" y1="12" x2="19" y2="12"></line></svg
                        ></button
                    >
                    <!-- svelte-ignore a11y_consider_explicit_label -->
                    <button class="map-button" on:click={resetTransform}
                        ><svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="feather feather-refresh-cw"
                            ><polyline points="23 4 23 10 17 10"
                            ></polyline><polyline points="1 20 1 14 7 14"
                            ></polyline><path
                                d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"
                            ></path></svg
                        ></button
                    >
                </div>
            </div>
        </div>

        <div class="sidebar">
            {#if selectedNode}
                <div class="node-card-container">
                    <NodeCard node={selectedNode} />
                </div>
            {/if}
            <ActiveAlerts selectedId={selectedNode ? selectedNode._id : null} />
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
    .content-container {
        display: flex;
        gap: 1rem;
    }
    .map-container {
        flex: 3;
    }
    .map-placeholder {
        background: #1a1a1a;
        border-radius: 8px;
        height: 580px;
        width: 100%;
        position: relative;
        overflow: hidden;
        cursor: grab;
    }
    .map-placeholder:active {
        cursor: grabbing;
    }
    .map-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transition: transform 0.1s ease-out;
        background-image: url("$lib/media/map.png");
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
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
    .sector-tooltip {
        display: none;
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.7);
        color: #fff;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
        white-space: nowrap;
        pointer-events: none;
        margin-bottom: 8px;
    }
    .sector:hover .sector-tooltip {
        display: block;
    }
    .sector.active {
        background-color: #f44336;
        box-shadow: 0 0 10px rgba(244, 67, 54, 0.8);
        animation: pulse-red-map 2s infinite;
    }
    @keyframes pulse-red-map {
        0% {
            box-shadow: 0 0 0 0 rgba(255, 82, 82, 0.5);
        }
        70% {
            box-shadow: 0 0 0 12px rgba(255, 82, 82, 0);
        }
        100% {
            box-shadow: 0 0 0 0 rgba(255, 82, 82, 0);
        }
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
        background-color: rgba(0, 0, 0, 0.675);
        border: 1px solid #2a2a2a;
        color: white;
        width: 36px;
        height: 36px;
        border-radius: 4px;
        font-size: 0.8rem;
        cursor: pointer;
        transition: background-color 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
    }
    .map-button:hover {
        background-color: rgba(0, 0, 0, 0.8);
        border-color: #3a3a3a;
    }
    .map-button svg {
        width: 16px;
        height: 16px;
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

    .sidebar {
        flex: 1;
        height: 580px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .node-card-container {
        margin-bottom: 1rem;
        flex-shrink: 0;
    }

    .node-alerts-container {
        flex: 1;
        overflow-y: auto;
        min-height: 0;
        scrollbar-width: none;
    }

    .node-alerts-container::-webkit-scrollbar {
        display: none;
    }

    .sidebar-content {
        width: 300px;
        background-color: #1a1a1a;
        border: 1px solid #2a2a2a;
        border-radius: 4px;
        padding: 1rem;
        align-self: flex-start;
    }
    .close-button {
        background: none;
        border: none;
        color: #f0f0f0;
        font-size: 1.5rem;
        cursor: pointer;
    }
</style>
