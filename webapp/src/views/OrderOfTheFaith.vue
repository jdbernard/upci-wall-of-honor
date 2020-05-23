<template>
  <div id="order-of-the-faith">
    <div class="header">
      <div class="drapes">
        <h1>Order of the Faith</h1>
        <h2>United Pentecostal Church International</h2>
        <SearchBarComponent
          :searchState="searchState"
          @search="doSearch"
          :years="years"
        ></SearchBarComponent>
      </div>
    </div>
    <div>
      <div class="divider">
        <img src="../assets/img/decorative-line.svg" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" src="./OrderOfTheFaith.ts"></script>
<style lang="scss" src="./OrderOfTheFaith.scss"></style>
