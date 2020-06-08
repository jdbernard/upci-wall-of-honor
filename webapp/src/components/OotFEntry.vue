<template>
  <router-link
    :to="{
      name: 'MinisterBiography',
      params: { slug: minister.slug }
    }"
    class="ootf-entry"
  >
    <MinisterPhoto :minister="minister"></MinisterPhoto>
    <MinisterNameplate :minister="minister"></MinisterNameplate>
  </router-link>
</template>
<script lang="ts" src="./OotFEntry.ts"></script>
<style lang="scss" src="./OotFEntry.scss"></style>
