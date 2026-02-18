<script lang="ts">
  import WorkflowPanel from '$lib/components/WorkflowPanel.svelte';
  import { page } from '$app/stores';
  
  $: tenderId = $page.params.id || '';
  $: currentRole = $page.url.searchParams.get('role') || null;
</script>

<svelte:head>
  <title>Workflow Panel - RFQ Buddy</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <WorkflowPanel 
    tenderId={tenderId} 
    currentRole={currentRole} 
  />
</div>
