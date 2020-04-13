<template>
  <div class="minister-nameplate" :id="minister.id">
    <div class="name">{{ minister.firstName }} {{ minister.lastName }}</div>
    <div class="vitals">{{ birthFormatted }} &mdash; {{ deathFormatted }}</div>
  </div>
</template>
<script lang="ts" src="./MinisterNameplate.ts"></script>
<style scoped lang="scss" src="./MinisterNameplate.scss"></style>
