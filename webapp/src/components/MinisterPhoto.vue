<template>
  <div class="minister-photo" :class="{ allowEdit }">
    <div class="photo-frame">
      <div class="photo-holder">
        <img
          v-if="photo.uri"
          :draggable="false"
          aria-hidden="true"
          ref="image"
          :src="photo.uri"
          :style="imgStyle"
          @touchstart="moveStart"
          @mousedown="moveStart"
          @touchmove.prevent="move"
          @mousemove.prevent="move"
          @touchend="moveEnd"
          @mouseup="moveEnd"
        />
        <img v-else src="../assets/img/image-missing.svg" />
      </div>
    </div>
    <div class="edit-controls" v-if="allowEdit">
      <button
        class="icon"
        @click.prevent="changeWidth(-10)"
        aria-label="decrease photo size"
        v-if="photo.uri"
      >
        <fa-icon icon="search-minus"></fa-icon>
      </button>
      <label class="file-input">
        <input type="file" aria-label="Upload minister photo" />
        <div class="button primary">
          Upload Photo <fa-icon icon="upload"></fa-icon>
        </div>
      </label>
      <button
        class="icon"
        @click.prevent="changeWidth(10)"
        aria-label="increase photo size"
        v-if="photo.uri"
      >
        <fa-icon icon="search-plus"></fa-icon>
      </button>
      <button v-if="photo.uri" @click="fitHeight">Fit Height</button>
      <button v-if="photo.uri" @click="fitWidth">Fit Width</button>
    </div>
  </div>
</template>
<script lang="ts" src="./MinisterPhoto.ts"></script>
<style lang="scss" src="./MinisterPhoto.scss"></style>
