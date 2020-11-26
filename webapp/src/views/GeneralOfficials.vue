<template>
  <div id="executive-leadership">
    <header class="curtain">
      <div class="drapes">
        <h1>Executive Leadership</h1>
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
            <div aria-label="title" class="title">{{ l.title }}</div>
          </div>
        </router-link>
      </li>
    </ul>
    <div class="button-bar">
      <router-link class="button" :to="{ name: 'GeneralBoard' }">
        General Board
      </router-link>
      <router-link class="button" :to="{ name: 'MinistryDirectors' }">
        Ministry Directors
      </router-link>
    </div>
  </div>
</template>
<script lang="ts" src="./GeneralOfficials.ts"></script>
<style lang="scss" src="./GeneralOfficials.scss"></style>
