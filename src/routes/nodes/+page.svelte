<script>
  import { nodes } from "$lib/stores/nodes.js";
  import NodeCard from "$lib/components/NodeCard.svelte";
  import NodeList from "$lib/components/NodeList.svelte";

  let selectedStatus = "all";
  let viewMode = "card"; // "card" or "list"
  const statuses = ["all", "active", "online", "offline", "maintenance"];

  $: filterednodes =
    selectedStatus === "all"
      ? $nodes
      : selectedStatus === "active"
        ? $nodes.filter((node) => node.alerts > 0)
        : $nodes.filter((node) => node.status === selectedStatus);
</script>

<div class="page-container">
  <div class="header">
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
    <div class="toggle-group">
      <button
        class={viewMode === "card" ? "active" : ""}
        on:click={() => (viewMode = "card")}>Card View</button
      >
      <button
        class={viewMode === "list" ? "active" : ""}
        on:click={() => (viewMode = "list")}>List View</button
      >
    </div>
  </div>

  {#if viewMode === "card"}
    <div class="nodes-grid">
      {#each filterednodes as node, i (i)}
        <NodeCard {node} />
      {/each}
    </div>
  {:else}
    <NodeList nodes={filterednodes} />
  {/if}
</div>

<style>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  .filter-group,
  .toggle-group {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .filter-group span {
    color: #909090;
    font-size: 0.9rem;
  }
  .filter-group button,
  .toggle-group button {
    background-color: #232323;
    border: 1px solid #373737;
    color: #d0d0d0;
    padding: 0.3rem 0.8rem;
    font-size: 0.85rem;
    border-radius: 4px;
    transition: all 0.2s;
  }
  .filter-group button:hover,
  .toggle-group button:hover {
    background-color: #2c2c2c;
    border-color: #444;
  }
  .filter-group button.active,
  .toggle-group button.active {
    background-color: rgba(100, 108, 255, 0.15);
    color: #646cff;
    border-color: #646cff;
  }
  .nodes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.25rem;
    margin-top: 1rem;
  }
</style>
