<script lang="ts">
  import type { GuideStep } from '$lib/content/guide';

  /** Ordered list of steps to render. */
  export let steps: GuideStep[];
</script>

<ol class="space-y-3 text-sm" style="color: var(--text-secondary);">
  {#each steps as step, i}
    <li class="flex gap-3 leading-relaxed">
      <span
        class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
        style="background-color: var(--orange); color: var(--dark);"
        aria-hidden="true"
      >
        {i + 1}
      </span>
      <div>
        <span class="step-action">{step.action}</span>
        {#if step.detail}
          <p class="mt-1 text-xs" style="color: var(--text-muted);">{step.detail}</p>
        {/if}
      </div>
    </li>
  {/each}
</ol>

<style>
  /* Bold any **…** markers that might appear in action text rendered via
     the HTML parser. The current data uses plain text so this is a safeguard. */
  .step-action {
    line-height: 1.6;
  }
</style>
