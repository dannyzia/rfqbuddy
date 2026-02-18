<script lang="ts">
  import { onMount } from 'svelte';
  import type { SubscriptionPackage, OrganizationSubscription } from '$lib/types/subscription.types';
  
  let packages: SubscriptionPackage[] = [];
  let currentSubscription: OrganizationSubscription | null = null;
  let storageUsage: any = null;
  let loading = false;
  let error: string | null = null;
  let showUpgradeModal = false;
  let selectedPackage: SubscriptionPackage | null = null;
  let customStorage: string = '';
  
  onMount(async () => {
    await loadData();
  });
  
  async function loadData() {
    loading = true;
    error = null;
    
    try {
      // Load available packages
      const packagesResponse = await fetch('/api/subscription/packages');
      if (!packagesResponse.ok) throw new Error('Failed to load packages');
      const packagesData = await packagesResponse.json();
      packages = packagesData.data;
      
      // Load current subscription
      const subscriptionResponse = await fetch('/api/subscription/current');
      if (subscriptionResponse.ok) {
        const subscriptionData = await subscriptionResponse.json();
        currentSubscription = subscriptionData.data;
      }
      
      // Load storage usage
      const storageResponse = await fetch('/api/subscription/storage');
      if (storageResponse.ok) {
        const storageData = await storageResponse.json();
        storageUsage = storageData.data;
      }
      
    } catch (err) {
      error = err instanceof Error ? err.message : 'An error occurred';
    } finally {
      loading = false;
    }
  }
  
  async function upgradeSubscription() {
    if (!selectedPackage) {
      error = 'Please select a package';
      return;
    }
    
    loading = true;
    error = null;
    
    try {
      const body: any = {
        packageId: selectedPackage.id
      };
      
      if (selectedPackage.code === 'custom' && customStorage) {
        body.customStorageBytes = parseInt(customStorage) * 1024 * 1024 * 1024; // Convert GB to bytes
      }
      
      const response = await fetch('/api/subscription/current', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(body)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to upgrade subscription');
      }
      
      await loadData();
      showUpgradeModal = false;
      selectedPackage = null;
      customStorage = '';
      
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to upgrade subscription';
    } finally {
      loading = false;
    }
  }
  
  async function cancelSubscription() {
    if (!confirm('Are you sure you want to cancel your subscription? This will take effect at the end of your current billing period.')) {
      return;
    }
    
    loading = true;
    error = null;
    
    try {
      const response = await fetch('/api/subscription/current', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to cancel subscription');
      }
      
      await loadData();
      
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to cancel subscription';
    } finally {
      loading = false;
    }
  }
  
  function getStoragePercentage(): number {
    if (!storageUsage || !currentSubscription) return 0;
    
    const limit = currentSubscription.custom_storage_bytes || currentSubscription.storage_limit_bytes || 0;
    if (limit === 0) return 0;
    
    return (storageUsage.used_bytes / limit) * 100;
  }
  
  function getStorageColor(): string {
    const percentage = getStoragePercentage();
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  }
  
  function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  function getPackageFeatures(package_: SubscriptionPackage): string[] {
    const features: string[] = [];
    
    if (package_.simple_rfq_quota > 0) {
      features.push(`${package_.simple_rfq_quota} Simple RFQ per week`);
    }
    
    if (package_.detailed_tender_quota > 0) {
      features.push(`${package_.detailed_tender_quota} Detailed Tenders per week`);
    }
    
    if (package_.storage_limit_bytes > 0) {
      features.push(`${formatBytes(package_.storage_limit_bytes)} Storage`);
    }
    
    if (package_.live_tendering_enabled) {
      features.push('Live Tendering');
    }
    
    if (package_.custom_storage_enabled) {
      features.push('Custom Storage');
    }
    
    return features;
  }
  
  function openUpgradeModal(package_: SubscriptionPackage) {
    selectedPackage = package_;
    customStorage = '';
    showUpgradeModal = true;
  }
</script>

<div class="subscription-management">
  <div class="mb-6">
    <h1 class="text-2xl font-bold text-gray-900">Subscription Management</h1>
    <p class="text-gray-600">Manage your subscription plan and usage</p>
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
    <!-- Current Subscription -->
    <div class="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Current Subscription</h2>
      
      {#if currentSubscription}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-xl font-bold text-gray-900">{currentSubscription.name}</h3>
            <p class="text-gray-600 mb-4">{currentSubscription.description}</p>
            
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-gray-500">Status:</span>
                <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                  {currentSubscription.status}
                </span>
              </div>
              
              <div class="flex justify-between">
                <span class="text-sm text-gray-500">Started:</span>
                <span class="text-sm text-gray-900">{new Date(currentSubscription.started_at).toLocaleDateString()}</span>
              </div>
              
              {#if currentSubscription.expires_at}
                <div class="flex justify-between">
                  <span class="text-sm text-gray-500">Expires:</span>
                  <span class="text-sm text-gray-900">{new Date(currentSubscription.expires_at).toLocaleDateString()}</span>
                </div>
              {/if}
            </div>
          </div>
          
          <div>
            <h4 class="font-medium text-gray-900 mb-3">Usage Statistics</h4>
            
            <div class="space-y-3">
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-gray-500">Storage Usage</span>
                  <span class="text-gray-900">
                    {formatBytes(storageUsage?.used_bytes || 0)} / {formatBytes(currentSubscription.custom_storage_bytes || currentSubscription.storage_limit_bytes || 0)}
                  </span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    class="{getStorageColor()} h-2 rounded-full transition-all duration-300"
                    style="width: {getStoragePercentage()}%"
                  ></div>
                </div>
              </div>
              
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-gray-500">Simple RFQ:</span>
                  <span class="text-gray-900 ml-2">{currentSubscription.simple_rfq_quota_used} / {currentSubscription.simple_rfq_quota}</span>
                </div>
                <div>
                  <span class="text-gray-500">Detailed Tenders:</span>
                  <span class="text-gray-900 ml-2">{currentSubscription.detailed_tender_quota_used} / {currentSubscription.detailed_tender_quota}</span>
                </div>
              </div>
              
              {#if currentSubscription.live_tendering_enabled}
                <div class="flex items-center text-sm">
                  <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-gray-900">Live Tendering Enabled</span>
                </div>
              {/if}
            </div>
          </div>
        </div>
        
        <div class="mt-6 pt-6 border-t border-gray-200 flex justify-end">
          <button
            on:click={cancelSubscription}
            class="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50"
          >
            Cancel Subscription
          </button>
        </div>
      {:else}
        <div class="text-center py-8 text-gray-500">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No Active Subscription</h3>
          <p class="mt-1 text-sm text-gray-500">Choose a plan to get started</p>
        </div>
      {/if}
    </div>
    
    <!-- Available Packages -->
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Available Packages</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each packages as package_}
          <div class="border border-gray-200 rounded-lg p-6 {
            currentSubscription?.package_id === package_.id ? 'border-blue-500 bg-blue-50' : ''
          }">
            <h3 class="text-lg font-bold text-gray-900">{package_.name}</h3>
            <p class="text-gray-600 mb-4">{package_.description}</p>
            
            <div class="text-2xl font-bold text-gray-900 mb-4">
              ${package_.price}
              {#if package_.billing_cycle}
                <span class="text-sm font-normal text-gray-500">/{package_.billing_cycle}</span>
              {/if}
            </div>
            
            <ul class="space-y-2 mb-6">
              {#each getPackageFeatures(package_) as feature}
                <li class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  {feature}
                </li>
              {/each}
            </ul>
            
            <button
              on:click={() => openUpgradeModal(package_)}
              disabled={currentSubscription?.package_id === package_.id}
              class="w-full px-4 py-2 text-sm font-medium rounded-md {
                currentSubscription?.package_id === package_.id
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }"
            >
              {currentSubscription?.package_id === package_.id ? 'Current Plan' : 'Upgrade'}
            </button>
          </div>
        {/each}
      </div>
    </div>
  {/if}
  
  <!-- Upgrade Modal -->
  {#if showUpgradeModal && selectedPackage}
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" on:click={() => showUpgradeModal = false}>
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6" on:click|stopPropagation>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Upgrade to {selectedPackage.name}</h3>
            <button
              on:click={() => showUpgradeModal = false}
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="mb-4">
            <p class="text-gray-600">{selectedPackage.description}</p>
            <div class="text-2xl font-bold text-gray-900 mt-2">
              ${selectedPackage.price}
              {#if selectedPackage.billing_cycle}
                <span class="text-sm font-normal text-gray-500">/{selectedPackage.billing_cycle}</span>
              {/if}
            </div>
          </div>
          
          {#if selectedPackage.code === 'custom'}
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Custom Storage (GB)</label>
              <input
                type="number"
                bind:value={customStorage}
                min="1"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter storage in GB"
              />
            </div>
          {/if}
          
          <div class="flex justify-end space-x-3">
            <button
              on:click={() => showUpgradeModal = false}
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            
            <button
              on:click={upgradeSubscription}
              disabled={loading}
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Upgrade'}
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
