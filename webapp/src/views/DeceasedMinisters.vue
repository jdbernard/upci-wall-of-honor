<template>
  <div id="deceased-ministers">
    <div class="header curtain">
      <div class="drapes">
        <h1>Wall of Honor</h1>
        <h2>Deceased Ministers of the UPCI</h2>
        <SearchBarComponent
          :searchState="searchState"
          @search="doSearch"
          :years="years"
        ></SearchBarComponent>
      </div>
      <div class="fringe"></div>
    </div>
    <div
      v-if="!loading && !(searchState.type === 'by-name' && searchState.value)"
      @mouseover="pauseScroll()"
      @mouseout="!hasUser() && scroll(1000)"
      class="ministers-list"
      :class="scrollReset && 'reset'"
    >
      <ul class="years">
        <li v-for="year in years" :key="year" :data-year="year">
          <div class="curtain">
            <YearDividerComponent
              class="drapes"
              :year="year"
            ></YearDividerComponent>
            <div class="fringe"></div>
          </div>
          <ul class="minister-nameplates">
            <li
              v-for="minister in ministersByYear.get(year)"
              :key="minister.id"
            >
              <MinisterNameplate :minister="minister"></MinisterNameplate>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div
      class="ministers-list"
      v-if="!loading && searchState.type === 'by-name' && searchState.value"
    >
      <ul>
        <div class="curtain">
          <div class="drapes"></div>
          <div class="fringe"></div>
        </div>
        <li v-for="minister in matchingMinisters" :key="minister.id">
          <MinisterNameplate :minister="minister"></MinisterNameplate>
        </li>
      </ul>
    </div>
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <div class="curtain">
        <YearDividerComponent class="drapes" year="2020"></YearDividerComponent>
        <div class="frigne"></div>
      </div>
      <ul class="minister-nameplates">
        <li v-for="index in 40" :key="index"></li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts" src="./DeceasedMinisters.ts"></script>
<style lang="scss" src="./DeceasedMinisters.scss"></style>
