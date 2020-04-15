<template>
  <div id="deceased-ministers">
    <div class="header">
      <h1>Wall of Honor</h1>
      <h2>Deceased Ministers of the UPCI</h2>
      <SearchBarComponent></SearchBarComponent>
      <YearDividerComponent
        ref="currentYearDivider"
        :year="currentYear"
      ></YearDividerComponent>
      <div class="curtain"></div>
    </div>
    <div
      @mouseover="pauseScroll()"
      @mouseout="scroll(1000)"
      class="ministers-list"
    >
      <ul class="years">
        <li v-for="year in years" :key="year">
          <YearDividerComponent
            :observer="observer"
            :year="year"
          ></YearDividerComponent>
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
  </div>
</template>
<script lang="ts" src="./DeceasedMinisters.ts"></script>
<style lang="scss" src="./DeceasedMinisters.scss"></style>
