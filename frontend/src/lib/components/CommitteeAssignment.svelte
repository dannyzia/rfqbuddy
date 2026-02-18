<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import type { Tender, CommitteeAssignment, User } from '$lib/types';
  
  export let tenderId: string;
  
  let tender: Tender | null = null;
  let availableEvaluators: User[] = [];
  let currentAssignments: CommitteeAssignment[] = [];
  let selectedEvaluators: string[] = [];
  let selectedTier: 'pre_qualification' | 'technical' | 'commercial' = 'pre_qualification';
  let loading = false;
  let error: string | null = null;
  
  const tiers = [
    { value: 'pre_qualification', label: 'Pre-Qualification', description: 'Initial vendor screening' },
    { value: 'technical', label: 'Technical', description: 'Technical proposal evaluation' },
    { value: 'commercial', label: 'Commercial', description: 'Commercial/financial evaluation' }
  ] as const;
  
  onMount(async () => {
    await loadData();
  });
  
  async function loadData() {
    loading = true;
    error = null;
    
    try {
      // Load tender details
      const tenderResponse = await fetch(`/api/tenders/${tenderId}`);
      if (!tenderResponse.ok) throw new Error('Failed to load tender');
      tender = await tenderResponse.json();
      
      // Load current assignments
      const assignmentsResponse = await fetch(`/api/committee/tenders/${tenderId}`);
      if (!assignmentsResponse.ok) throw new Error('Failed to load assignments');
      const assignmentsData = await assignmentsResponse.json();
      currentAssignments = assignmentsData.data;
      
      // Load available evaluators
      const evaluatorsResponse = await fetch('/api/committee/evaluators');
      if (!evaluatorsResponse.ok) throw new Error('Failed to load evaluators');
      const evaluatorsData = await evaluatorsResponse.json();
      availableEvaluators = evaluatorsData.data;
      
    } catch (err) {
      error = err instanceof Error ? err.message : 'An error occurred';
    } finally {
      loading = false;
    }
  }
  
  async function assignEvaluators() {
    if (selectedEvaluators.length === 0) {
      error = 'Please select at least one evaluator';
      return;
    }
    
    loading = true;
    error = null;
    
    try {
      const response = await fetch(`/api/committee/tenders/${tenderId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          userIds: selectedEvaluators,
          tier: selectedTier
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to assign evaluators');
      }
      
      // Reset form and reload data
      selectedEvaluators = [];
      await loadData();
      
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to assign evaluators';
    } finally {
      loading = false;
    }
  }
  
  async function removeEvaluator(assignmentId: string) {
    if (!confirm('Are you sure you want to remove this evaluator?')) return;
    
    loading = true;
    error = null;
    
    try {
      const assignment = currentAssignments.find(a => a.id === assignmentId);
      if (!assignment) throw new Error('Assignment not found');
      
      const response = await fetch(`/api/committee/tenders/${tenderId}/remove`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          userId: assignment.user_id,
          tier: assignment.tier
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to remove evaluator');
      }
      
      await loadData();
      
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to remove evaluator';
    } finally {
      loading = false;
    }
  }
  
  function getEvaluatorsForTier(tier: string) {
    return currentAssignments.filter(a => a.tier === tier);
  }
  
  function getAvailableEvaluatorsForTier(tier: string) {
    const assignedIds = getEvaluatorsForTier(tier).map(a => a.user_id);
    return availableEvaluators.filter(e => !assignedIds.includes(e.id));
  }
</script>

<div class="committee-assignment">
  <div class="mb-6">
    <h2 class="text-2xl font-bold text-gray-900 mb-2">Committee Assignment</h2>
    {#if tender}
      <p class="text-gray-600">Tender: {tender.title} ({tender.tender_number})</p>
    {:else}
      <p class="text-gray-600">Loading tender details...</p>
    {/if}
  </div>
  
  {#if error}
    <div class="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error</h3>
          <div class="mt-2 text-sm text-red-700">{error}</div>
        </div>
      </div>
    </div>
  {/if}
  
  {#if loading}
    <div class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  {:else}
    <!-- Current Assignments -->
    <div class="mb-8">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Current Committee Assignments</h3>
      
      {#each tiers as tier}
        <div class="mb-6">
          <h4 class="font-medium text-gray-700 mb-2">{tier.label}</h4>
          <p class="text-sm text-gray-500 mb-3">{tier.description}</p>
          
          {#if getEvaluatorsForTier(tier.value).length > 0}
            <div class="bg-gray-50 rounded-lg p-4">
              {#each getEvaluatorsForTier(tier.value) as assignment}
                <div class="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {assignment.name?.charAt(0).toUpperCase()}
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900">{assignment.name}</div>
                      <div class="text-sm text-gray-500">{assignment.email}</div>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span class="px-2 py-1 text-xs font-medium rounded-full {
                      assignment.status === 'approved' ? 'bg-green-100 text-green-800' :
                      assignment.status === 'forwarded' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }">
                      {assignment.status}
                    </span>
                    <button
                      on:click={() => removeEvaluator(assignment.id)}
                      class="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              {/each}
            </div>
          {:else}
            <div class="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
              No evaluators assigned to {tier.label} tier
            </div>
          {/if}
        </div>
      {/each}
    </div>
    
    <!-- Assign New Evaluators -->
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Assign New Evaluators</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Tier Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Evaluation Tier</label>
          <select bind:value={selectedTier} class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            {#each tiers as tier}
              <option value={tier.value}>{tier.label}</option>
            {/each}
          </select>
        </div>
        
        <!-- Evaluator Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Available Evaluators</label>
          <div class="border border-gray-300 rounded-md p-3 max-h-40 overflow-y-auto">
            {#each getAvailableEvaluatorsForTier(selectedTier) as evaluator}
              <label class="flex items-center py-1">
                <input
                  type="checkbox"
                  bind:group={selectedEvaluators}
                  value={evaluator.id}
                  class="mr-2"
                />
                <div>
                  <div class="text-sm font-medium text-gray-900">{evaluator.name}</div>
                  <div class="text-xs text-gray-500">{evaluator.email}</div>
                </div>
              </label>
            {/each}
            {#if getAvailableEvaluatorsForTier(selectedTier).length === 0}
              <div class="text-sm text-gray-500 text-center py-2">
                No available evaluators for {selectedTier} tier
              </div>
            {/if}
          </div>
        </div>
      </div>
      
      <div class="mt-6">
        <button
          on:click={assignEvaluators}
          disabled={selectedEvaluators.length === 0 || loading}
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Assign Selected Evaluators ({selectedEvaluators.length})
        </button>
      </div>
    </div>
  {/if}
</div>
