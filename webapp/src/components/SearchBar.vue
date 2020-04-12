<template>
  <div class=search v-if=byName>
    <span>Search by name:</span>
    <input (change)="nameFilterChanged" placeholder="e.g. John Smith">
  </div>
  <div class=search v-else-if=byYear>
    TBD
  </div>
  <div class=search v-else>
    <span>Search by:</span>
    <button>name</button>
    <button>year</button>
  </div>
</template>
<script lang="ts" src="./SearchBar.ts"></script>
<style lang="scss" src="./SearchBar.scss"></style>
