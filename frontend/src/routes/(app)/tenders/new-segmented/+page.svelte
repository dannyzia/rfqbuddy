<script lang="ts">
  import { page } from '$app/stores';
  import SegmentedTenderCreation from '$lib/components/SegmentedTenderCreation.svelte';
</script>

<svelte:head>
  <title>Create Tender - RFQ Buddy</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="mb-6">
    <a href="/tenders" class="inline-flex items-center text-gray-600 hover:text-gray-900">
      <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back to Tenders
    </a>
    <h1 class="text-3xl font-bold text-gray-900 mt-4">Create New Tender</h1>
    <p class="text-gray-600 mt-2">Use our enhanced segmented form to create a comprehensive tender</p>
  </div>
  
  <SegmentedTenderCreation tenderType={$page.url.searchParams.get('type') || ''} />
</div>
