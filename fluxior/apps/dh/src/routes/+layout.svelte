<script lang="ts">
  import '../scss/globals.scss';
  import logo from '../images/logo-light.svg';
  import { Navigation, Topbar } from 'ui';
</script>

<div class="grid-container">
  <Topbar />
  <aside class="menu">
    <img class="logo" src={logo} alt="logo" />
    <Navigation />
  </aside>
  <main class="content"><slot /></main>
</div>

<style lang="scss">
  aside {
    padding: 0;
  }
  .grid-container {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto 1fr;
    grid-template-areas: 'menu topbar' 'menu content';
    height: 100vh;
  }

  .menu {
    grid-area: menu;
    background-color: var(--watt-color-primary-dark);
    width: 245px;
    display: flex;
    flex-direction: column;

    .logo {
      margin: var(--watt-space-m) auto;
      align-self: start;
    }
  }

  .content {
    grid-area: content;
    background-color: #fafafa;
  }
</style>
