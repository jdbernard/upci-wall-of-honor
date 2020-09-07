<template>
  <div id="upci-woh-app" class="theme-primary">
    <ul id="upci-woh-version" hidden>
      <li class="version">{{ version.version }}</li>
      <li class="hash">{{ version.hash }}</li>
      <li class="raw">{{ version.raw }}</li>
    </ul>
    <router-view />
  </div>
</template>

<script lang="ts" src="./App.ts"></script>
<style lang="scss" src="./App.scss"></style>
