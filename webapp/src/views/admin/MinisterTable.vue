<template>
  <div id="ministers-table" :class="filter">
    <div class="header">
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
      </div>
      <router-link class="button active" :to="{}">
        <fa-icon icon="user-plus"></fa-icon> Add
      </router-link>
    </div>
    <div class="table-container" pageSize="50">
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
          </tr>
        </thead>
        <tbody slot="body" slot-scope="{ displayData }">
          <tr v-for="row in displayData" :key="row.id">
            <td>{{ row.displayName }}</td>
            <td>{{ row.displayDOB }}</td>
            <td>{{ row.displayDOD }}</td>
            <td><fa-icon v-if="row.isOotF" icon="check"></fa-icon></td>
            <td><fa-icon v-if="row.hasBio" icon="check"></fa-icon></td>
          </tr>
        </tbody>
      </v-table>
    </div>
    <div class="pagination-container">
      <div class="page-size">
        page size:
        <select v-model.number="pageSize">
          <option v-for="n in [25, 50, 100, 200, 1000]" :key="n">{{
            n
          }}</option>
        </select>
      </div>
      <div class="page-select">
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
  </div>
</template>
<script lang="ts" src="./MinisterTable.ts"></script>
<style lang="scss" src="./MinisterTable.scss"></style>
