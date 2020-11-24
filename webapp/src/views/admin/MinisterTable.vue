<template>
  <div id="ministers-table" class="admin-content-view" :class="filter">
    <header>
      <div>
        <h1 v-if="filter == 'all'">All Ministers</h1>
        <h1 v-else-if="filter == 'ootf'">Order of the Faith Ministers</h1>
        <div class="search">
          <fa-icon icon="search"></fa-icon>
          <input
            type="text"
            name="name-filter"
            placeholder="search by name"
            v-model="tableFilters.name.value"
          />
        </div>
        <router-link class="button action" :to="{ name: 'AdminAddMinister' }">
          <fa-icon icon="user-plus"></fa-icon> Add
        </router-link>
      </div>
    </header>
    <div v-if="!loading" class="table-container" pageSize="50">
      <v-table
        :data="ministerRowData"
        :filters="tableFilters"
        :currentPage.sync="currentPage"
        :pageSize="pageSize"
        @totalPagesChanged="totalPages = $event"
      >
        <thead slot="head">
          <tr>
            <v-th sortKey="displayName" defaultSort="asc"
              ><span class="title">Name</span></v-th
            >
            <v-th sortKey="dob"><span class="title">Date of Birth</span></v-th>
            <v-th sortKey="dod"><span class="title">Date of Death</span></v-th>
            <v-th sortKey="isOotF"><span class="title">OotF</span></v-th>
            <v-th sortKey="hasBio"><span class="title">Bio</span></v-th>
            <v-th sortKey="state"><span class="title">State</span></v-th>
          </tr>
        </thead>
        <tbody slot="body" slot-scope="{ displayData }">
          <tr
            v-for="row in displayData"
            :key="row.id"
            @click="
              $router.push({
                name: 'AdminEditMinister',
                params: { slug: row.slug }
              })
            "
          >
            <td>
              <router-link
                :to="{ name: 'AdminEditMinister', params: { slug: row.slug } }"
                >{{ row.displayName }}</router-link
              >
            </td>
            <td>{{ row.displayDOB }}</td>
            <td>{{ row.displayDOD }}</td>
            <td><fa-icon v-if="row.isOotF" icon="check"></fa-icon></td>
            <td><fa-icon v-if="row.hasBio" icon="check"></fa-icon></td>
            <td>{{ row.state }}</td>
          </tr>
        </tbody>
      </v-table>
    </div>
    <div v-if="!loading" class="pagination-container">
      <div class="page-size">
        Page size:
        <select v-model.number="pageSize">
          <option v-for="n in [25, 50, 100, 200, 1000]" :key="n">{{
            n
          }}</option>
        </select>
      </div>
      <div class="page-select" v-if="totalPages > 1">
        Page:
        <select v-model.number="currentPage">
          <option v-for="n in totalPages" :key="n">{{ n }}</option>
        </select>
      </div>
      <smart-pagination
        :currentPage.sync="currentPage"
        :maxPageLinks="6"
        :totalPages="totalPages"
      ></smart-pagination>
    </div>
    <div v-if="loading" class="loading-placeholder">
      <div>Loading ministers...</div>
      <div class="loading-animation">
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" src="./MinisterTable.ts"></script>
<style lang="scss" src="./MinisterTable.scss"></style>
