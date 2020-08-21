<template>
  <div class="minister-nameplate" :id="minister.id">
    <div class="name">{{ minister | nameDisplay }}</div>
    <div class="vitals" v-if="birthFormatted">
      {{ birthFormatted }} &mdash; {{ deathFormatted }}
    </div>
  </div>
</template>
<script lang="ts" src="./MinisterNameplate.ts"></script>
<style scoped lang="scss" src="./MinisterNameplate.scss"></style>
