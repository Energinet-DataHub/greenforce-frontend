<script lang="ts">
  import logo from '../images/logo-light.svg';
</script>

<div class="grid-container">
  <header class="topbar">Topbar</header>
  <aside class="menu">
    <img src={logo} alt="logo" />
  </aside>
  <main class="content">Content</main>
</div>

<style lang="scss">
  :global {
    @import '../styles/colours.scss';
    aside {
      padding: 0;
    }
    html,
    body {
      margin: 0;
      padding: 0;
      height: 100%;
    }
  }
  .grid-container {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto 1fr;
    grid-template-areas: 'menu topbar' 'menu content';
    height: 100vh;
  }

  .topbar {
    grid-area: topbar;
    background-color: lightgray;
  }

  .menu {
    grid-area: menu;
    background-color: var(--watt-color-primary-dark);
    width: 245px;
  }

  .content {
    grid-area: content;
    background-color: lightgreen;
  }
</style>
