<template>
  <div class="search" v-if="byName">
    <span>Search by name:</span>
    <input
      @keydown="handleNameUpdate"
      placeholder="e.g. John Smith"
      type="text"
    />
  </div>
  <div class="search" v-else-if="byYear">
    TBD
  </div>
  <div class="search main" v-else>
    <span>Search by:</span>
    <button @click="searchByName()">name</button>
    <button @click="searchByYear()">year</button>
  </div>
</template>
<script lang="ts" src="./SearchBar.ts"></script>
<style scoped lang="scss" src="./SearchBar.scss"></style>
