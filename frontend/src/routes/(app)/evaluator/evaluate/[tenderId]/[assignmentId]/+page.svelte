<script lang="ts">
  import EvaluationInterface from '$lib/components/EvaluationInterface.svelte';
  import { page } from '$app/stores';
  
  $: tenderId = $page.params.tenderId;
  $: assignmentId = $page.params.assignmentId;
</script>

<div class="container mx-auto px-4 py-8">
  <EvaluationInterface tenderId={tenderId} assignmentId={assignmentId} />
</div>
