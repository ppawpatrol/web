<script>
    import AlertsTrend from "$lib/components/AlertsTrend.svelte";
    import MapPreview from "$lib/components/MapPreview.svelte";
    import SystemStatus from "$lib/components/SystemStatus.svelte";
    import MostAffected from "$lib/components/MostAffected.svelte";
    import RecentAlerts from "$lib/components/RecentAlerts.svelte";
</script>

<div class="dashboard-grid">
    <div class="status-panel">
        <SystemStatus />
    </div>

    <div class="trends-panel">
        <AlertsTrend />
    </div>

    <div class="map-preview">
        <MapPreview />
    </div>

    <div class="most-affected">
        <MostAffected />
    </div>

    <div class="alerts-panel">
        <RecentAlerts />
    </div>
</div>