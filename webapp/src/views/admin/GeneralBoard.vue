<template>
  <div id="admin-general-board" class="admin-content-view">
    <header>
      <div>
        <h1>Leadership</h1>
        <div class="search">
          <fa-icon icon="search"></fa-icon>
          <input
            type="text"
            name="name-filter"
            placeholder="search by name or title"
            v-model="searchInput"
          />
        </div>
      </div>
      <h2>General Board</h2>
    </header>
    <div v-if="!loading" class="table-container"></div>
  </div>
</template>
<script lang="ts" src="./GeneralBoard.ts"></script>
<style lang="scss" src="./GeneralBoard.scss"></style>
