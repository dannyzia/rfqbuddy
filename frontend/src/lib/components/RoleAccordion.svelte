<script lang="ts">
  import { slide } from 'svelte/transition';
  import SubSectionCard from '$lib/components/SubSectionCard.svelte';
  import type { GuideRoleSection } from '$lib/content/guide';

  /** The role section data (buyer or vendor). */
  export let section: GuideRoleSection;

  /**
   * Whether the accordion is expanded on initial render.
   * Pass `true` for the buyer accordion on desktop to have one open by default.
   */
  export let initiallyOpen: boolean = false;

  let open = initiallyOpen;

  function toggle() {
    open = !open;
  }
</script>

<div class="chaingpt-card chaingpt-clip-sm overflow-hidden">
  <!-- Accordion header -->
  <button
    type="button"
    class="w-full text-left px-6 py-5 flex justify-between items-center gap-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
    style="color: var(--text-primary); --tw-ring-color: var(--orange);"
    on:click={toggle}
    aria-expanded={open}
    aria-controls="role-body-{section.role}"
    id="role-btn-{section.role}"
  >
    <div class="flex items-center gap-3">
      <span class="text-2xl" aria-hidden="true">{section.icon}</span>
      <div>
        <span class="text-base font-semibold">{section.label}</span>
        <span class="ml-2 text-xs font-normal" style="color: var(--text-muted);">
          ({section.subsections.length} guide{section.subsections.length !== 1 ? 's' : ''})
        </span>
      </div>
    </div>
    <span
      class="flex-shrink-0 text-xl font-light transition-transform duration-200"
      style="color: var(--orange); transform: rotate({open ? '45deg' : '0deg'});"
      aria-hidden="true"
    >+</span>
  </button>

  <!-- Accordion body -->
  {#if open}
    <div
      id="role-body-{section.role}"
      role="region"
      aria-labelledby="role-btn-{section.role}"
      class="border-t px-6 py-5 space-y-3"
      style="border-color: var(--grey);"
      transition:slide={{ duration: 250 }}
    >
      {#each section.subsections as subsection}
        <SubSectionCard {subsection} />
      {/each}
    </div>
  {/if}
</div>
