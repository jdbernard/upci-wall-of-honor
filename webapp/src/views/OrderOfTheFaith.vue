<template>
  <div id="order-of-the-faith">
    <div class="header">
      <div class="logo-and-title">
        <OotFLogo v-if="$route.params.year" />
        <div>
          <h1>Order of the Faith</h1>
          <h2>United Pentecostal Church International</h2>
        </div>
      </div>
      <SearchBarComponent
        :searchState="searchState"
        @search="doSearch"
        :years="years"
      ></SearchBarComponent>
    </div>
    <div v-if="!$route.params.year" class="divider">
      <img src="../assets/img/decorative-line.svg" />
    </div>
    <div v-if="!$route.params.year" class="overview">
      <OotFLogo />

      <p>
        The Order of the Faith, established in 2002, is the United Pentecostal
        Church International's prestigious award honoring outstanding
        achievement and exemplary service to the UPCI. New members are decided
        upon by the Executive Committee, and are inducted at the annual general
        conference of the UPCI, held during the fall.
      </p>

      <p>
        Here are recorded the members of the Order of the Faith with biographies
        highlighting their contributions and achievements in the faith.
      </p>

      <div class="button-bar">
        <router-link
          class="action button"
          :to="{
            name: 'OrderOfTheFaithByYear',
            params: { year: years[0], page: 1 }
          }"
        >
          Start
        </router-link>
      </div>
    </div>
    <div class="ministers-page" v-if="$route.params.year">
      <YearDividerComponent :year="$route.params.year"></YearDividerComponent>
      <h4>Inductees</h4>
      <div
        v-for="minister in page($route.params.year, $route.params.page)"
        :key="minister.id"
      >
        {{ minister | nameDisplay }}
      </div>
    </div>
  </div>
</template>
<script lang="ts" src="./OrderOfTheFaith.ts"></script>
<style lang="scss" src="./OrderOfTheFaith.scss"></style>
