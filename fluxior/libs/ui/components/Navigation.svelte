<script lang="ts">
  import { page } from '$app/stores';
  console.log($page.url.pathname);
</script>

<nav>
  <ul>
    <li class:active={$page.url.pathname === '/'}><a href="/">Velkommen</a></li>
    <li class:active={$page.url.pathname === '/organization'}>
      <a href="/organization/">Organisationer</a>
    </li>
  </ul>
</nav>

<style lang="scss">
  nav ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      height: 40px;
      display: flex;
      align-items: center;
      flex-direction: row;
      border-left: var(--watt-space-xs) solid transparent;
      &.active {
        background-color: var(--watt-color-primary);
        border-left-color: var(--watt-color-secondary);
      }
      a {
        padding: var(--watt-space-s) var(--watt-space-m);
        font-size: 16px;
        width: 100%;
        display: block;
        color: var(--watt-color-primary-contrast);
        text-decoration: none;
        &:link,
        &:visited {
          background-color: transparent;
        }
        &:hover {
          background-color: var(--watt-color-primary);
        }
        &:active {
          background-color: var(--watt-color-primary);
        }
      }
    }
  }
</style>
