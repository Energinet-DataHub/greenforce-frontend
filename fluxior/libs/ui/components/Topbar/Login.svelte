<script lang="ts">
  import { signIn, signOut } from '@auth/sveltekit/client';
  import { page } from '$app/stores';
</script>

{#if $page.data.session}
  <button on:click={() => signOut()}><span class="material-icons" />Log ud</button>
{:else}
  <button on:click={() => signIn('azure-ad-b2c')}><span class="material-icons" />Log ind</button>
{/if}

<style lang="scss">
  button {
    border: 0;
    font-weight: 600;
    font-size: 1rem;
    text-indent: 0;
    background-color: white;
    color: var(--watt-color-primary);
    &:hover {
      color: var(--watt-color-primary-dark);
    }
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--watt-space-s);
    padding: 0 var(--watt-space-m) 0 var(--watt-space-m);
  }
  span {
    font-size: 24px;
    line-height: 24px;
    height: 24px;
    width: 24px;
    &:hover {
      color: var(--watt-color-primary-dark);
    }
  }
</style>
