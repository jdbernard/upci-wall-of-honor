<template>
  <article v-if="minister" class="bio-content">
    <MinisterPhotoComponent
      v-if="minister.details && minister.details.photo.uri"
      :photo="minister.details.photo"
    ></MinisterPhotoComponent>
    <h3>{{ minister | nameDisplay }}</h3>
    <div v-if="leadershipPosition" class="leadership-title">
      <div
        v-if="
          leadershipPosition.ministryName &&
            leadershipPosition.ministryName !== IGNORED_MINISTRY_NAME
        "
      >
        {{ leadershipPosition.ministryName }}
      </div>
      <div>{{ leadershipPosition.title }}</div>
    </div>
    <div v-if="!leadershipPosition && minister.dateOfBirth" class="vital-date">
      <label>Born:</label> {{ birthFormatted }}
    </div>
    <div v-if="minister.dateOfDeath" class="vital-date">
      <label>Passed:</label> {{ deathFormatted }}
    </div>
    <div v-if="minister.ootfYearInducted" class="vital-date">
      <label>Inducted:</label> {{ minister.ootfYearInducted }}
    </div>

    <span v-html="minister.details.biography"></span>
  </article>
</template>
<script lang="ts" src="./MinisterBiography.ts"></script>
<style lang="scss" src="./MinisterBiography.scss"></style>
