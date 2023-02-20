<script lang="ts">
  import logo from '../images/logo-light.svg';
  import { Navigation } from 'ui';
</script>

<div class="grid-container">
  <header class="topbar">Topbar</header>
  <aside class="menu">
    <img class="logo" src={logo} alt="logo" />
    <Navigation />
  </aside>
  <main class="content">Content</main>
</div>

<style lang="scss">
  :global {
    // @import 'ui/scss/colours.scss';
    // @import '../styles/spaces.scss';
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
    display: flex;

    .logo {
      margin: var(--watt-space-m) auto;
      align-self: start;
    }
  }

  .content {
    grid-area: content;
    background-color: lightgreen;
  }
</style>
