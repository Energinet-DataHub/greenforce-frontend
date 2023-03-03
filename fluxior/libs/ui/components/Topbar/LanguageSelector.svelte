<script lang="ts">
  import { page } from '$app/stores';
  import { writable } from 'svelte/store';
  import { browser } from '$app/environment';

  // export let language = writable('en');

  // if (browser) {
  //   const url = new URL(window.location.href);
  //   const lang = url.searchParams.get('lang');
  //   if (lang) {
  //     language.set(lang);
  //   }
  // }
</script>

<label class="watt-text-s">
  <input type="radio" name="language" checked value="dk" />
  <span>DA</span>
</label>
<label class="watt-text-s">
  <input type="radio" name="language" value="en" />
  <span>EN</span>
</label>

<style lang="scss">
  label {
    background-color: transparent;
    cursor: pointer;
  }

  input[type='radio'] {
    display: none;
  }

  input[type='radio']:checked + span {
    background-color: var(--watt-color-primary);
    color: var(--watt-color-primary-contrast);
  }

  label,
  span {
    position: relative;
    z-index: 1;
    height: var(--watt-space-xl);
    width: var(--watt-space-xl);
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      background-color: #f4f4f4;
    }
  }
</style>
