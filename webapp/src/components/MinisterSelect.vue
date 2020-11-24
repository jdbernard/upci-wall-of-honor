<template>
  <div class="minister-select">
    <input
      @keyup="inputChanged"
      type="text"
      v-model="ministerName"
      placeholder="type a minister's name"
    />
    <ul class="minister-list" :class="{ hidden: value }">
      <li
        v-for="m in matchingMinisters"
        :key="m.id"
        @click="select(m)"
        @keyup.enter="select(m)"
        tabindex="0"
      >
        {{ m | nameDisplay }}
      </li>
      <li v-if="matchingMinisters.size === 0" class="no-matches">
        There are no matching ministers living with a biography.
      </li>
    </ul>
  </div>
</template>
<script lang="ts" src="./MinisterSelect.ts"></script>
<style lang="scss" src="./MinisterSelect.scss"></style>
