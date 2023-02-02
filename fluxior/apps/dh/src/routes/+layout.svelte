<div class="grid-container">
  <header class="topbar">Topbar</header>
  <aside class="menu">Menu</aside>
  <main class="content">Content</main>
</div>

<style lang="scss">
  :global {
    html,
    body {
      margin: 0;
      padding: 0;
      height: 100%;
    }
  }
  .grid-container {
    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-template-rows: auto 1fr;
    grid-template-areas: 'topbar topbar' 'menu content';
    height: 100vh;
  }

  .topbar {
    grid-area: topbar;
    background-color: lightgray;
    padding: 1rem;
  }

  .menu {
    grid-area: menu;
    background-color: lightblue;
    padding: 1rem;
  }

  .content {
    grid-area: content;
    background-color: lightgreen;
    padding: 1rem;
  }
</style>
