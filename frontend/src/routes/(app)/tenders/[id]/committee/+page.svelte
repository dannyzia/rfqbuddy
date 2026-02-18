<script lang="ts">
  import CommitteeAssignment from '$lib/components/CommitteeAssignment.svelte';
  import { page } from '$app/stores';
  
  $: tenderId = $page.params.id;
</script>

<div class="container mx-auto px-4 py-8">
  <CommitteeAssignment tenderId={tenderId} />
</div>
