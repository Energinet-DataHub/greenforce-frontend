<script lang="ts">
  export let data;

  $: ({ Organiations } = data);
</script>

<div>
  {JSON.stringify($Organiations)}
</div>
