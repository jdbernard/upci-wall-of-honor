<template>
  <div id="power-tools" class="admin-content-view">
    <header>
      <h1>Power Tools</h1>
      <h2>USE WITH CAUTION</h2>
    </header>
    <div>
      <hr />
      <div class="buttons">
        <button class="primary" @click="m11LoadMinisters">
          1.1 Migration: Load Ministers
        </button>
        <button
          class="primary"
          @click="m11BatchPersistMinisters(allMinisters)"
          :disabled="runningBatchPersist"
        >
          1.1 Migration: Persist Ministers
        </button>
      </div>
      <div class="output" v-html="output"></div>
      <button @click="output = ''">Clear Output</button>
    </div>
  </div>
</template>
<script lang="ts" src="./PowerTools.ts"></script>
<style lang="scss" src="./PowerTools.scss"></style>
