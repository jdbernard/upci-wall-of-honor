<template>
  <nav id="admin-nav" :class="{ collapsed: collapsed }">
    <UPCILogo></UPCILogo>
    <UPCIIcon></UPCIIcon>
    <h1>Wall Of Honor</h1>
    <ul>
      <li>
        <router-link :to="{ name: 'AdminAllMinistersTable' }">
          <div><fa-icon icon="user"></fa-icon></div>
          <span class="link-title">All Ministers</span>
        </router-link>
      </li>
      <li>
        <router-link :to="{ name: 'AdminOrderOfTheFaithTable' }">
          <div><OotFIcon></OotFIcon></div>
          <span class="link-title">Order of the Faith</span>
        </router-link>
      </li>
      <li>
        <router-link :to="{ name: 'AdminLeadership' }">
          <div><fa-icon icon="sitemap"></fa-icon></div>
          <span class="link-title">Leadership</span>
        </router-link>
        <ul>
          <li>
            <router-link :to="{ name: 'AdminGeneralOfficials' }">
              <div><fa-icon icon="user-tie"></fa-icon></div>
              <span class="link-title">General Officials</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'AdminMinistryDirectors' }">
              <div><fa-icon icon="building"></fa-icon></div>
              <span class="link-title">Ministry Directors</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'AdminGeneralBoard' }">
              <div><fa-icon icon="users"></fa-icon></div>
              <span class="link-title">General Board</span>
            </router-link>
          </li>
        </ul>
      </li>
    </ul>

    <div class="debug-info">
      <div class="responsive-size">
        <span class="mobile">mobile</span>
        <span class="tablet">tablet</span>
        <span class="desktop">desktop</span>
        <span class="ultrawide">ultrawide</span>
      </div>
      <ul class="version-info">
        <li class="hash">
          <label>Commit: </label><span>{{ version.hash }}</span>
        </li>
        <li class="version">
          <label>Version: </label><span> {{ version.version }}</span>
        </li>
      </ul>
      <div class="version-abbr">{{ version.version }}</div>
    </div>

    <div v-if="user" class="user-info">
      <span class="full">{{ user.given_name }} {{ user.family_name }}</span>
      <span class="short"
        >{{ user.given_name[0] }}{{ user.family_name[0] }}</span
      >
    </div>

    <button @click="$emit('collapse', false)" class="expand">
      <fa-icon icon="angle-right"></fa-icon>
    </button>

    <button @click="$emit('collapse', true)" class="collapse">
      Collapse <fa-icon icon="angle-left"></fa-icon>
    </button>
  </nav>
</template>
<script lang="ts" src="./NavBar.ts"></script>
<style lang="scss" src="./NavBar.scss"></style>
