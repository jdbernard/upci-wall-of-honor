<template>
  <label class="checkbox" :class="{ checked, disabled }">
    <input
      type="checkbox"
      :checked="checked"
      :disabled="disabled"
      @change="$emit('change', $event.target.checked)"
    />
    <span><slot></slot></span>
  </label>
</template>
<script lang="ts" src="./Checkbox.ts"></script>
<style scoped lang="scss" src="./Checkbox.scss"></style>
