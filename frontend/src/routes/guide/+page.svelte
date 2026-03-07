<script lang="ts">
  import DocPageHeader from '$lib/components/DocPageHeader.svelte';
  import RoleAccordion from '$lib/components/RoleAccordion.svelte';
  import StepList from '$lib/components/StepList.svelte';
  import { buyerGuide, vendorGuide, gettingStarted, whereToGetHelp } from '$lib/content/guide';
</script>

<svelte:head>
  <title>How to Use – RFQ Buddy</title>
</svelte:head>

<div class="chaingpt-body">
  <div class="chaingpt-body-lines">
    <div class="chaingpt-body-line chaingpt-body-line-v chaingpt-body-line-left"></div>
    <div class="chaingpt-body-line chaingpt-body-line-v chaingpt-body-line-left-middle"></div>
    <div class="chaingpt-body-line chaingpt-body-line-v chaingpt-body-line-center"></div>
    <div class="chaingpt-body-line chaingpt-body-line-v chaingpt-body-line-right-middle"></div>
    <div class="chaingpt-body-line chaingpt-body-line-v chaingpt-body-line-right"></div>
    <div class="chaingpt-body-line chaingpt-body-line-h chaingpt-body-line-top"></div>
    <div class="chaingpt-body-line chaingpt-body-line-h chaingpt-body-line-top-middle"></div>
    <div class="chaingpt-body-line chaingpt-body-line-h chaingpt-body-line-middle"></div>
    <div class="chaingpt-body-line chaingpt-body-line-h chaingpt-body-line-bottom-middle"></div>
    <div class="chaingpt-body-line chaingpt-body-line-h chaingpt-body-line-bottom"></div>
  </div>

  <DocPageHeader />

  <main class="chaingpt-container py-12 relative z-10">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold mb-2" style="color: var(--text-primary);">How to Use RFQ Buddy</h1>
      <p class="mb-10" style="color: var(--text-muted);">
        Select your role below to see step-by-step instructions.
      </p>

      <!-- Getting Started (shared, always visible) -->
      <section class="chaingpt-card chaingpt-clip-sm p-6 mb-6" id={gettingStarted.id}>
        <h2 class="text-lg font-semibold mb-4" style="color: var(--text-primary);">{gettingStarted.title}</h2>
        <StepList steps={gettingStarted.steps} />
      </section>

      <!-- Role accordions -->
      <div class="space-y-4 mb-6">
        <RoleAccordion section={buyerGuide} initiallyOpen={true} />
        <RoleAccordion section={vendorGuide} initiallyOpen={false} />
      </div>

      <!-- Where to Get Help (shared, always visible) -->
      <section class="chaingpt-card chaingpt-clip-sm p-6" id={whereToGetHelp.id}>
        <h2 class="text-lg font-semibold mb-4" style="color: var(--text-primary);">{whereToGetHelp.title}</h2>
        <StepList steps={whereToGetHelp.steps} />
      </section>

      <p class="mt-10 text-sm" style="color: var(--text-muted);">
        <a href="/faq" style="color: var(--orange); text-decoration: underline;">FAQ</a> · <a href="/" style="color: var(--orange); text-decoration: underline;">Home</a>
      </p>
    </div>
  </main>

  <footer class="py-6 mt-12 relative z-10" style="background-color: var(--dark);">
    <div class="chaingpt-container text-center">
      <p class="text-sm" style="color: var(--grey);">
        &copy; 2025 RFQ Buddy. All rights reserved. <a href="/faq" style="color: var(--grey);">FAQ</a> · <a href="/guide" style="color: var(--grey);">Guide</a>
      </p>
    </div>
  </footer>
</div>
