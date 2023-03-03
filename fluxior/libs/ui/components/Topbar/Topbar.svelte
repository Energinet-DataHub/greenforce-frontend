<script type="ts">
  import LanguageSelector from './LanguageSelector.svelte';
  import Login from './Login.svelte';
</script>

<header class="topbar">
  <LanguageSelector />
  <Login />
</header>

<style lang="scss">
  .topbar {
    grid-area: topbar;
    background-color: var(--watt-color-neutral-white);
    border-bottom: 1px solid var(--watt-color-neutral-grey-300);
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.08);
    height: var(--watt-space-xl);
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: end;
    padding: 0 var(--watt-space-m) 0 var(--watt-space-m);
  }
</style>
