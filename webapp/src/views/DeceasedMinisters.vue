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
      v-if="!loading && (searchState !== 'by-name' || !searchState.value)"
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
          <ul class="ministers-in-year">
            <li
              v-for="minister in deceasedMinisters.get(year)"
              :key="minister.id"
            >
              <MinisterNameplate :minister="minister"></MinisterNameplate>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div
      v-if="!loading && searchState === 'by-name' && searchState.value"
      class="name-filter-results"
    ></div>
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <div class="curtain">
        <YearDividerComponent class="drapes" year="2020"></YearDividerComponent>
        <div class="frigne"></div>
      </div>
      <ul class="ministers-in-year">
        <li v-for="index in 40" :key="index"></li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts" src="./DeceasedMinisters.ts"></script>
<style lang="scss" src="./DeceasedMinisters.scss"></style>
