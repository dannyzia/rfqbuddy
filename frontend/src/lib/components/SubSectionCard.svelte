<script lang="ts">
  import { slide } from 'svelte/transition';
  import StepList from '$lib/components/StepList.svelte';
  import type { GuideSubSection } from '$lib/content/guide';

  /** The subsection data to render. */
  export let subsection: GuideSubSection;

  let open = false;

  function toggle() {
    open = !open;
  }
</script>

<div class="chaingpt-card chaingpt-clip-sm overflow-hidden" id={subsection.id}>
  <button
    type="button"
    class="w-full text-left px-5 py-4 flex justify-between items-start gap-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
    style="color: var(--text-primary); --tw-ring-color: var(--orange);"
    on:click={toggle}
    aria-expanded={open}
    aria-controls="subsection-body-{subsection.id}"
    id="subsection-btn-{subsection.id}"
  >
    <div class="flex-1 min-w-0">
      <span class="font-semibold text-sm">{subsection.title}</span>
      <p class="text-xs mt-0.5 leading-snug" style="color: var(--text-muted);">{subsection.summary}</p>
    </div>
    <span
      class="flex-shrink-0 text-lg mt-0.5 transition-transform duration-200"
      style="color: var(--grey); transform: rotate({open ? '45deg' : '0deg'});"
      aria-hidden="true"
    >+</span>
  </button>

  {#if open}
    <div
      id="subsection-body-{subsection.id}"
      role="region"
      aria-labelledby="subsection-btn-{subsection.id}"
      class="border-t px-5 pb-5 pt-4"
      style="border-color: var(--grey);"
      transition:slide={{ duration: 200 }}
    >
      <StepList steps={subsection.steps} />
    </div>
  {/if}
</div>
