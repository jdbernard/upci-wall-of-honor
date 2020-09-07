<template>
  <div id="minister-biography">
    <div v-if="minister && minister.ootfYearInducted" class="header">
      <div class="logo-and-title">
        <OotFLogo />
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

    <MinisterBiographyComponent
      v-if="minister"
      :minister="minister"
    ></MinisterBiographyComponent>

    <div class="button-bar">
      <a class="action button" href="#" @click.prevent="$router.back">Back</a>
    </div>
  </div>
</template>
<script lang="ts" src="./MinisterBiography.ts"></script>
<style lang="scss" src="./MinisterBiography.scss"></style>
