<script lang="ts">
  import { onMount } from 'svelte';
  import type { CommitteeAssignment } from '$lib/types';
  
  let assignments: CommitteeAssignment[] = [];
  let loading = false;
  let error: string | null = null;
  let selectedTier: string = 'all';
  let selectedStatus: string = 'all';
  
  const tiers = [
    { value: 'all', label: 'All Tiers' },
    { value: 'pre_qualification', label: 'Pre-Qualification' },
    { value: 'technical', label: 'Technical' },
    { value: 'commercial', label: 'Commercial' }
  ] as const;
  
  const statuses = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'forwarded', label: 'Forwarded' }
  ] as const;
  
  onMount(async () => {
    await loadAssignments();
  });
  
  async function loadAssignments() {
    loading = true;
    error = null;
    
    try {
      const response = await fetch('/api/committee/my-assignments', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to load assignments');
      }
      
      const data = await response.json();
      assignments = data.data;
      
    } catch (err) {
      error = err instanceof Error ? err.message : 'An error occurred';
    } finally {
      loading = false;
    }
  }
  
  async function updateAssignmentStatus(assignmentId: string, status: 'pending' | 'approved' | 'forwarded') {
    loading = true;
    error = null;
    
    try {
      const response = await fetch(`/api/committee/assignments/${assignmentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to update status');
      }
      
      await loadAssignments();
      
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to update status';
    } finally {
      loading = false;
    }
  }
  
  function getStatusColor(status: string) {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'forwarded': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
  
  function getTierLabel(tier: string) {
    switch (tier) {
      case 'pre_qualification': return 'Pre-Qualification';
      case 'technical': return 'Technical';
      case 'commercial': return 'Commercial';
      default: return tier;
    }
  }
  
  $: filteredAssignments = assignments.filter(assignment => {
    const tierMatch = selectedTier === 'all' || assignment.tier === selectedTier;
    const statusMatch = selectedStatus === 'all' || assignment.status === selectedStatus;
    return tierMatch && statusMatch;
  });
  
  $: statsByTier = tiers.slice(1).reduce((acc, tier) => {
    const tierAssignments = assignments.filter(a => a.tier === tier.value);
    acc[tier.value] = {
      total: tierAssignments.length,
      pending: tierAssignments.filter(a => a.status === 'pending').length,
      approved: tierAssignments.filter(a => a.status === 'approved').length,
      forwarded: tierAssignments.filter(a => a.status === 'forwarded').length
    };
    return acc;
  }, {} as Record<string, any>);
</script>

<div class="evaluator-dashboard">
  <div class="mb-6">
    <h1 class="text-2xl font-bold text-gray-900">Evaluator Dashboard</h1>
    <p class="text-gray-600">Manage your evaluation assignments and track progress</p>
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
  
  <!-- Statistics Overview -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    {#each tiers.slice(1) as tier}
      <div class="bg-white border border-gray-200 rounded-lg p-4">
        <h3 class="font-semibold text-gray-900 mb-2">{tier.label}</h3>
        <div class="space-y-1">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Total:</span>
            <span class="font-medium">{statsByTier[tier.value]?.total || 0}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Pending:</span>
            <span class="font-medium text-yellow-600">{statsByTier[tier.value]?.pending || 0}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Approved:</span>
            <span class="font-medium text-green-600">{statsByTier[tier.value]?.approved || 0}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Forwarded:</span>
            <span class="font-medium text-blue-600">{statsByTier[tier.value]?.forwarded || 0}</span>
          </div>
        </div>
      </div>
    {/each}
  </div>
  
  <!-- Filters -->
  <div class="bg-white border border-gray-200 rounded-lg p-4 mb-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div class="flex flex-col md:flex-row gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Filter by Tier</label>
          <select bind:value={selectedTier} class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            {#each tiers as tier}
              <option value={tier.value}>{tier.label}</option>
            {/each}
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
          <select bind:value={selectedStatus} class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            {#each statuses as status}
              <option value={status.value}>{status.label}</option>
            {/each}
          </select>
        </div>
      </div>
      
      <button
        on:click={loadAssignments}
        disabled={loading}
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Loading...' : 'Refresh'}
      </button>
    </div>
  </div>
  
  <!-- Assignments List -->
  <div class="bg-white border border-gray-200 rounded-lg">
    <div class="px-4 py-3 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-gray-900">
        Your Assignments ({filteredAssignments.length})
      </h2>
    </div>
    
    {#if loading}
      <div class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    {:else if filteredAssignments.length === 0}
      <div class="text-center py-8 text-gray-500">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No assignments found</h3>
        <p class="mt-1 text-sm text-gray-500">
          {selectedTier !== 'all' || selectedStatus !== 'all' 
            ? 'Try adjusting your filters' 
            : 'You don\'t have any evaluation assignments yet'}
        </p>
      </div>
    {:else}
      <div class="divide-y divide-gray-200">
        {#each filteredAssignments as assignment}
          <div class="p-4 hover:bg-gray-50">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3">
                  <div>
                    <h3 class="text-sm font-medium text-gray-900">{assignment.tender_title}</h3>
                    <p class="text-sm text-gray-500">{assignment.tender_number}</p>
                  </div>
                  <span class="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                    {getTierLabel(assignment.tier)}
                  </span>
                  <span class="px-2 py-1 text-xs font-medium rounded-full {getStatusColor(assignment.status)}">
                    {assignment.status}
                  </span>
                </div>
                
                <div class="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                  <span>Assigned: {new Date(assignment.assigned_at).toLocaleDateString()}</span>
                  {#if assignment.completed_at}
                    <span>Completed: {new Date(assignment.completed_at).toLocaleDateString()}</span>
                  {/if}
                  {#if assignment.forwarded_at}
                    <span>Forwarded: {new Date(assignment.forwarded_at).toLocaleDateString()}</span>
                  {/if}
                </div>
              </div>
              
              <div class="flex items-center space-x-2">
                {#if assignment.status === 'pending'}
                  <button
                    on:click={() => updateAssignmentStatus(assignment.id, 'approved')}
                    class="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    on:click={() => updateAssignmentStatus(assignment.id, 'forwarded')}
                    class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Forward
                  </button>
                {/if}
                
                <button
                  class="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Evaluate
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
