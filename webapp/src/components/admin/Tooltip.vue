<template>
  <div
    class="tooltip"
    :class="[type, { alwaysVisible }]"
    tabindex="0"
    @click="focusMe"
  >
    <fa-icon v-if="type === 'info'" icon="info-circle"></fa-icon>
    <fa-icon v-if="type === 'error'" icon="exclamation-triangle"></fa-icon>
    <div class="tooltip-container"><slot></slot></div>
  </div>
</template>
<script lang="ts" src="./Tooltip.ts"></script>
<style lang="scss" src="./Tooltip.scss"></style>
