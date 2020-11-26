<template>
  <div id="general-board">
    <header class="curtain">
      <div class="drapes">
        <h1>General Board</h1>
        <div class="divider">
          <img src="../assets/img/decorative-line.svg" />
        </div>
      </div>
      <div class="fringe"></div>
    </header>
    <ul
      class="member-list"
      @mouseover="pauseScroll()"
      @mouseout="scroll(1000)"
      v-if="!loading"
    >
      <li v-for="c in categories" :key="c.id">
        <div class="curtain">
          <NamedDivider class="drapes" :name="c.name"></NamedDivider>
          <div class="fringe"></div>
        </div>
        <ul class="member-nameplates" :class="{ 'no-title': !c.includeTitles }">
          <li v-for="m in members.get(c.id)" :key="m.id">
            <span class="name">{{ m.name }}</span>
            <hr />
            <span class="title">{{ m.title }}</span>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
<script lang="ts" src="./GeneralBoard.ts"></script>
<style lang="scss" src="./GeneralBoard.scss"></style>
