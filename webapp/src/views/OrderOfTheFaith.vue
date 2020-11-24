<template>
  <div id="order-of-the-faith">
    <header>
      <div class="logo-and-title">
        <router-link :to="{ name: 'OrderOfTheFaith' }">
          <OotFLogo v-if="!onOverview" />
        </router-link>
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
    </header>

    <div v-if="onOverview" :class="{ updating }" class="divider">
      <img src="../assets/img/decorative-line.svg" />
    </div>
    <div v-if="onOverview" :class="{ updating }" class="overview">
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
          @click.native="allowUserInteraction()"
          :to="{
            name: 'OrderOfTheFaith',
            params: nextPage
          }"
        >
          Start
        </router-link>
      </div>
    </div>

    <div
      class="ministers-page"
      :class="{ updating }"
      v-if="!onOverview && !hasNameResults"
    >
      <YearDividerComponent :year="$route.params.year"></YearDividerComponent>
      <h4>Inductees</h4>
      <div class="entries">
        <OotFEntry
          v-for="minister in page($route.params.year, $route.params.page)"
          :key="minister.id"
          :minister="minister"
        ></OotFEntry>
      </div>

      <div class="button-bar">
        <router-link
          class="button"
          @click.native="allowUserInteraction()"
          v-if="prevPage"
          :to="{
            name: 'OrderOfTheFaith',
            params: { year: years[0], page: 1 }
          }"
        >
          First ({{ years[0] }})
        </router-link>
        <router-link
          class="button"
          @click.native="allowUserInteraction()"
          v-if="prevPage"
          :to="{
            name: 'OrderOfTheFaith',
            params: prevPage
          }"
        >
          Prev ({{ prevPage.year }})
        </router-link>
        <router-link
          class="button"
          @click.native="allowUserInteraction()"
          v-if="!prevPage"
          :to="{ name: 'OrderOfTheFaith' }"
        >
          Back
        </router-link>
        <router-link
          v-if="nextPage"
          class="action button"
          @click.native="allowUserInteraction()"
          :to="{
            name: 'OrderOfTheFaith',
            params: nextPage
          }"
        >
          Next ({{ nextPage.year
          }}{{ nextPage.year == $route.params.year ? ' cont.' : '' }})
        </router-link>
        <router-link
          class="action button"
          @click.native="allowUserInteraction()"
          v-if="!nextPage"
          :to="{ name: 'OrderOfTheFaith' }"
        >
          Overview
        </router-link>
      </div>
    </div>

    <div class="ministers-search-results" v-if="hasNameResults">
      <div class="divider">
        <img src="../assets/img/decorative-line.svg" />
      </div>

      <div class="entries">
        <OotFEntry
          v-for="minister in matchingMinisters"
          :key="minister.id"
          :minister="minister"
        ></OotFEntry>
      </div>
    </div>
  </div>
</template>
<script lang="ts" src="./OrderOfTheFaith.ts"></script>
<style lang="scss" src="./OrderOfTheFaith.scss"></style>
