<template>
  <div id="upci-woh-app">
    <ul id="upci-woh-version" hidden>
      <li class="version">{{ version }}</li>
      <li class="hash">{{ gitVersion.hash }}</li>
      <li class="raw">{{ gitVersion.raw }}</li>
    </ul>
    <router-view />
  </div>
</template>

<script lang="ts" src="./App.ts"></script>
<style lang="scss" src="./App.scss"></style>
