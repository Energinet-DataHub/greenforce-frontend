<script lang="ts">
  export let data;

  $: ({ Organiations } = data);
</script>

<div>
  {$Organiations}
</div>
