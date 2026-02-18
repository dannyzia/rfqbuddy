<script lang="ts">
  import { onMount } from 'svelte';
  import type { TenderRoleAssignment, ProcurementRole } from '$lib/types/workflow.types';
  
  export let tenderId: string;
  
  let assignments: TenderRoleAssignment[] = [];
  let availableRoles: ProcurementRole[] = [];
  let availableUsers: Record<string, any[]> = {};
  let loading = false;
  let error: string | null = null;
  let selectedRole: ProcurementRole | null = null;
  let selectedUser: string = '';
  let showAssignModal = false;
  let formData: any = { notes: '' };
  
  const roleDescriptions: Record<ProcurementRole, string> = {
    procurer: 'Creates and manages the tender',
    prequal_evaluator: 'Evaluates vendor pre-qualification',
    tech_evaluator: 'Evaluates technical proposals',
    commercial_evaluator: 'Evaluates commercial proposals',
    auditor: 'Audits and reviews the process',
    procurement_head: 'Makes final award decisions'
  };
  
  onMount(async () => {
    await loadData();
  });
  
  async function loadData() {
    loading = true;
    error = null;
    
    try {
      // Load current assignments
      const assignmentsResponse = await fetch(`/api/workflow/roles/tender/${tenderId}`);
      if (!assignmentsResponse.ok) throw new Error('Failed to load assignments');
      const assignmentsData = await assignmentsResponse.json();
      assignments = assignmentsData.data;
      
      // Load available roles and users
      const rolesResponse = await fetch('/api/enhanced-tenders/roles/available');
      if (!rolesResponse.ok) throw new Error('Failed to load available roles');
      const rolesData = await rolesResponse.json();
      availableRoles = Object.keys(rolesData.data) as ProcurementRole[];
      availableUsers = rolesData.data;
      
    } catch (err) {
      error = err instanceof Error ? err.message : 'An error occurred';
    } finally {
      loading = false;
    }
  }
  
  async function assignRole() {
    if (!selectedRole || !selectedUser) {
      error = 'Please select a role and user';
      return;
    }
    
    loading = true;
    error = null;
    
    try {
      const response = await fetch('/api/workflow/roles/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          tenderId,
          roleType: selectedRole,
          assignedUserId: selectedUser,
          notes: `Assigned via role assignment interface`
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to assign role');
      }
      
      await loadData();
      showAssignModal = false;
      selectedRole = null;
      selectedUser = '';
      
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to assign role';
    } finally {
      loading = false;
    }
  }
  
  async function removeAssignment(assignmentId: string) {
    if (!confirm('Are you sure you want to remove this assignment?')) return;
    
    loading = true;
    error = null;
    
    try {
      const assignment = assignments.find(a => a.id === assignmentId);
      if (!assignment) throw new Error('Assignment not found');
      
      const response = await fetch(`/api/workflow/roles/${assignmentId}/skip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          notes: 'Removed via role assignment interface'
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to remove assignment');
      }
      
      await loadData();
      
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to remove assignment';
    } finally {
      loading = false;
    }
  }
  
  function getUsersForRole(role: ProcurementRole): any[] {
    const roleMap: Record<ProcurementRole, string> = {
      'prequal_evaluator': 'prequal_evaluator',
      'tech_evaluator': 'tech_evaluator',
      'commercial_evaluator': 'commercial_evaluator',
      'auditor': 'auditor',
      'procurement_head': 'procurement_head'
    };
    
    const mappedRole = roleMap[role];
    return mappedRole ? availableUsers[mappedRole] || [] : [];
  }
  
  function getAssignmentStatusColor(status: string): string {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'forwarded': return 'bg-purple-100 text-purple-800';
      case 'skipped': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  }
  
  function getRoleIcon(role: ProcurementRole): string {
    const iconMap: Record<ProcurementRole, string> = {
      'procurer': '👤',
      'prequal_evaluator': '🔍',
      'tech_evaluator': '⚙️',
      'commercial_evaluator': '💰',
      'auditor': '📋',
      'procurement_head': '👔'
    };
    return iconMap[role] || '👤';
  }
  
  function openAssignModal(role: ProcurementRole) {
    selectedRole = role;
    selectedUser = '';
    showAssignModal = true;
  }
</script>

<div class="role-assignment">
  <div class="mb-6">
    <h1 class="text-2xl font-bold text-gray-900">Role Assignment</h1>
    <p class="text-gray-600">Assign and manage procurement roles for this tender</p>
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
    <!-- Role Assignment Overview -->
    <div class="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Current Assignments</h2>
      
      {#if assignments.length === 0}
        <div class="text-center py-8 text-gray-500">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0h6" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No roles assigned yet</h3>
          <p class="mt-1 text-sm text-gray-500">Start by assigning roles to team members</p>
        </div>
      {:else}
        <div class="space-y-4">
          {#each availableRoles as role}
            <div class="border border-gray-200 rounded-lg p-4">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center space-x-3">
                  <span class="text-2xl">{getRoleIcon(role)}</span>
                  <div>
                    <h3 class="font-medium text-gray-900">{role.replace('_', ' ').replace(/\b\w/g, (char: string) => char.toUpperCase())}</h3>
                    <p class="text-sm text-gray-500">{roleDescriptions[role]}</p>
                  </div>
                </div>
                
                <button
                  on:click={() => openAssignModal(role)}
                  class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Assign User
                </button>
              </div>
              
              <!-- Assigned Users for this Role -->
              {#each assignments.filter(a => a.role_type === role) as assignment}
                <div class="ml-8 pl-4 border-l-2 border-gray-200">
                  <div class="flex items-center justify-between py-2">
                    <div class="flex items-center space-x-3">
                      <div class="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {assignment.assigned_user_name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div class="text-sm font-medium text-gray-900">{assignment.assigned_user_name}</div>
                        <div class="text-sm text-gray-500">{assignment.assigned_user_email}</div>
                      </div>
                    </div>
                    
                    <div class="flex items-center space-x-2">
                      <span class="px-2 py-1 text-xs font-medium rounded-full {getAssignmentStatusColor(assignment.status)}">
                        {assignment.status}
                      </span>
                      
                      {#if assignment.status === 'pending'}
                        <button
                          on:click={() => removeAssignment(assignment.id)}
                          class="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      {/if}
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          {/each}
        </div>
      {/if}
    </div>
    
    <!-- Assignment Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-white border border-gray-200 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-medium text-gray-900">Total Assignments</h3>
          <span class="text-2xl font-bold text-blue-600">{assignments.length}</span>
        </div>
      </div>
      
      <div class="bg-white border border-gray-200 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-medium text-gray-900">Active Roles</h3>
          <span class="text-2xl font-bold text-green-600">{assignments.filter(a => a.status === 'active').length}</span>
        </div>
      </div>
      
      <div class="bg-white border border-gray-200 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-medium text-gray-900">Completed</h3>
          <span class="text-2xl font-bold text-blue-600">{assignments.filter(a => a.status === 'completed').length}</span>
        </div>
      </div>
    </div>
    
    <!-- Workflow Progress -->
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Workflow Progress</h2>
      
      <div class="space-y-3">
        {#each availableRoles as role, index}
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium {
                assignments.some(a => a.role_type === role && a.status === 'active')
                  ? 'bg-green-500'
                  : assignments.some(a => a.role_type === role && a.status === 'completed')
                  ? 'bg-blue-500'
                  : assignments.some(a => a.role_type === role)
                    ? 'bg-yellow-500'
                    : 'bg-gray-400'
              }">
                {getRoleIcon(role)}
              </div>
            </div>
            
            <div class="flex-1">
              <div class="text-sm font-medium text-gray-900">{role.replace('_', ' ').replace(/\b\w/g, (char: string) => char.toUpperCase())}</div>
              <div class="text-xs text-gray-500">
                {assignments.find(a => a.role_type === role)?.status || 'Not Assigned'}
              </div>
            </div>
            
            <div class="flex-shrink-0">
              {#if assignments.find(a => a.role_type === role)}
                <div class="text-xs text-gray-500">
                  {assignments.find(a => a.role_type === role)?.assigned_user_name}
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
  
  <!-- Assignment Modal -->
  {#if showAssignModal}
    <button
      type="button"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      on:click={() => showAssignModal = false}
      aria-label="Close assignment modal"
    >
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6" on:click|stopPropagation role="dialog" aria-modal="true">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              Assign {selectedRole?.replace('_', ' ').replace(/\b\w/g, (char: string) => char.toUpperCase())}
            </h3>
            <div
              class="text-gray-400 hover:text-gray-600 cursor-pointer"
              on:click={() => showAssignModal = false}
              role="button"
              tabindex="0"
              on:keydown={(e) => { if (e.key === 'Enter') showAssignModal = false; }}
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Select User</label>
              <select
                bind:value={selectedUser}
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a user</option>
                {#each getUsersForRole(selectedRole) as user}
                  <option value={user.id}>{user.name} ({user.email})</option>
                {/each}
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
              <textarea
                bind:value={formData.notes}
                rows={3}
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add any notes for this assignment"
              ></textarea>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 mt-6">
            <div
              role="button"
              tabindex="0"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 cursor-pointer"
              on:click={() => showAssignModal = false}
              on:keydown={(e) => { if (e.key === 'Enter') showAssignModal = false; }}
            >
              Cancel
            </div>
            
            <button
              on:click={assignRole}
              disabled={loading || !selectedUser}
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Assigning...' : 'Assign Role'}
            </button>
          </div>
        </div>
      </div>
    </button>
  {/if}
</div>
