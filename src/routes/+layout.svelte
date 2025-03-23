<script>
    import { page } from "$app/stores";
    import "$lib/styles.css";
</script>

<header>
    <nav>
        <div class="logo">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="logo-icon"
            >
                <path
                    d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
                />
                <circle cx="12" cy="12" r="3" />
            </svg>
            <span>IIoTP</span>
            <span class="portal-label">web</span>
        </div>
        <div class="nav-links">
            <a href="/" class:active={$page.url.pathname === "/"}>Dashboard</a>
            <a href="/map" class:active={$page.url.pathname === "/map"}>Map</a>
            <a href="/nodes" class:active={$page.url.pathname === "/nodes"}
                >Nodes</a
            >
            <a href="/alerts" class:active={$page.url.pathname === "/alerts"}
                >Alerts</a
            >
            <a
                href="/analytics"
                class:active={$page.url.pathname === "/analytics"}>Analytics</a
            >
            <a
                href="/settings"
                class:active={$page.url.pathname === "/settings"}>Settings</a
            >
        </div>
        <div class="right"></div>
    </nav>
</header>

<main>
    <slot />
</main>

<footer>
    <div class="footer-content">
        <div class="footer-info">
            <p>IIoTP AAPS v4.20.69</p>
            <p>Authorized Access Only</p>
        </div>
        <div class="footer-links">
            <a href="https://nuxsh.is-a.dev/">Documentation</a>
            <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                >Emergency Protocol</a
            >
        </div>
    </div>
</footer>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        background-color: #121212;
        color: #e0e0e0;
        font-family:
            "Inter",
            system-ui,
            -apple-system,
            sans-serif;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }

    :global(#app) {
        width: 100%;
        max-width: none;
        margin: 0;
        padding: 0;
        text-align: left;
        display: flex;
        flex-direction: column;
        flex: 1;
    }
</style>