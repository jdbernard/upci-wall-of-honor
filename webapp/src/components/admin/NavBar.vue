<template>
  <nav :class="{ collapsed: collapsed }">
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
        <router-link :to="{ name: 'Administration' }">
          <div><fa-icon icon="sitemap"></fa-icon></div>
          <span class="link-title">Executive Leadership</span>
        </router-link>
      </li>
    </ul>

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
