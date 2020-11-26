<template>
  <div id="ministry-directors">
    <header class="curtain">
      <div class="drapes">
        <h1>Ministry Directors</h1>
        <div class="divider">
          <img src="../assets/img/decorative-line.svg" />
        </div>
      </div>
      <div class="fringe"></div>
    </header>
    <ul
      class="leaders-list"
      @mouseover="pauseScroll()"
      @mouseout="scroll(1000)"
      v-if="!loading"
    >
      <li v-for="l in leaders" :key="l.id">
        <router-link
          :to="{
            name: 'MinisterBiography',
            params: { slug: l.minister.slug }
          }"
        >
          <MinisterPhoto :photo="l.minister.details.photo"></MinisterPhoto>
          <div>
            <div aria-label="name" class="name">
              {{ l.minister | nameDisplay }}
            </div>
            <div
              v-if="l.ministryName"
              aria-label="ministry name"
              class="ministry-name"
            >
              {{ l.ministryName }}
            </div>
            <div aria-label="title" class="title">{{ l.title }}</div>
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>
<script lang="ts" src="./MinistryDirectors.ts"></script>
<style lang="scss" src="./MinistryDirectors.scss"></style>
