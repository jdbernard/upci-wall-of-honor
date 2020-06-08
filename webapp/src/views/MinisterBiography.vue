<template>
  <div id="minister-biography">
    <div v-if="minister && minister.ootfYearInducted" class="header">
      <div class="logo-and-title">
        <OotFLogo v-if="$route.params.year" />
        <div>
          <h1>Order of the Faith</h1>
          <h2>United Pentecostal Church International</h2>
        </div>
      </div>
    </div>

    <div v-else class="header">
      <h1>Wall of Honor</h1>
      <h2>Deceased Ministers of the UPCI</h2>
    </div>

    <div class="divider">
      <img src="../assets/img/decorative-line.svg" />
    </div>

    <article v-if="minister" class="bio-content">
      <MinisterPhoto :minister="minister"></MinisterPhoto>
      <h3>{{ minister | nameDisplay }}</h3>
      <div class="vital-date"><label>Born:</label> {{ birthFormatted }}</div>
      <div v-if="minister.dateOfDeath" class="vital-date">
        <label>Passed:</label> {{ deathFormatted }}
      </div>
      <div v-if="minister.ootfYearInducted" class="vital-date">
        <label>Inducted:</label> {{ minister.ootfYearInducted }}
      </div>
      <hr />

      <span v-html="minister.details.biography"></span>

      <div class="button-bar">
        <a class="action button" href="#" @click.prevent="$router.back">Back</a>
      </div>
    </article>
  </div>
</template>
<script lang="ts" src="./MinisterBiography.ts"></script>
<style lang="scss" src="./MinisterBiography.scss"></style>
