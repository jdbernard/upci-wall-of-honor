<template>
  <div class="search by-name" v-if="searchState.type === 'by-name'">
    <span>Search by name:</span>
    <input
      @keydown="handleNameUpdate"
      placeholder="e.g. John Smith"
      type="text"
      :value="searchState.value"
    />
  </div>
  <div class="search by-year" v-else-if="searchState.type === 'by-year'">
    <fa-icon @click="leftMore()" icon="angle-double-left"></fa-icon>
    <fa-icon @click="left()" icon="angle-left"></fa-icon>
    <ul ref="year-list">
      <li
        v-for="year in years.slice().reverse()"
        @click="handleYearClick(year)"
        :data-year="year"
        :key="year"
      >
        {{ year }}
      </li>
    </ul>
    <fa-icon @click="right()" icon="angle-right"></fa-icon>
    <fa-icon @click="rightMore()" icon="angle-double-right"></fa-icon>
  </div>
  <div class="search main" v-else>
    <span>Search by:</span>
    <button @click="search({ type: 'by-name' })">name</button>
    <button @click="search({ type: 'by-year' })">year</button>
  </div>
</template>
<script lang="ts" src="./SearchBar.ts"></script>
<style scoped lang="scss" src="./SearchBar.scss"></style>
