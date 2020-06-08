<template>
  <div class="photo-frame">
    <div class="photo-holder">
      <img
        aria-hidden="true"
        :src="minister.details.photo.uri"
        :style="imgStyle"
      />
    </div>
  </div>
</template>
<script lang="ts" src="./MinisterPhoto.ts"></script>
<style lang="scss" src="./MinisterPhoto.scss"></style>
