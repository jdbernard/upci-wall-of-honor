<template>
  <div id="admin-general-board" class="admin-content-view">
    <header>
      <div>
        <h1>Leadership</h1>
        <h2>General Board</h2>
        <div class="search">
          <fa-icon icon="search"></fa-icon>
          <input
            type="text"
            name="name-filter"
            placeholder="search by name or title"
            v-model="searchInput"
          />
        </div>
      </div>
    </header>
    <div v-if="!loading" class="table-container">
      <ul class="board-categories">
        <li
          v-for="c in categories"
          :key="c.id"
          :class="{ 'active-category': curCategoryId === c.id }"
        >
          <h3>
            <button class="low-profile" @click="curCategoryId = c.id">
              {{ c.name }}
            </button>
          </h3>
        </li>
      </ul>
      <div
        v-for="c in categories"
        :key="c.id"
        class="category-contents"
        :class="{ 'active-category': curCategoryId === c.id }"
      >
        <table>
          <thead>
            <tr>
              <th>Minister</th>
              <th v-if="c.includeTitles">Title</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="m in members[c.id]"
              :key="m.id"
              :class="{ 'no-match': !isMatch(m, searchInput) }"
            >
              <td>
                <input
                  v-if="rowEdits[m.id]"
                  type="text"
                  name="name"
                  v-model="rowEdits[m.id].name"
                  @keyup.enter="saveMember(m)"
                />
                <span v-else>{{ m.name }}</span>
              </td>
              <td v-if="c.includeTitles">
                <input
                  v-if="rowEdits[m.id]"
                  type="text"
                  name="title"
                  v-model="rowEdits[m.id].title"
                  @keyup.enter="saveMember(m)"
                />
                <span v-else>{{ m.title }}</span>
              </td>
              <td>
                <div class="row-actions">
                  <button
                    class="low-profile"
                    @click="editMember(m)"
                    v-if="!rowEdits[m.id]"
                  >
                    <fa-icon icon="pencil-alt"></fa-icon>
                  </button>
                  <button
                    class="low-profile"
                    @click="removeMember(m)"
                    v-if="!rowEdits[m.id]"
                  >
                    <fa-icon icon="trash"></fa-icon>
                  </button>
                  <button
                    class="low-profile"
                    @click="cancelEdit(m)"
                    v-if="rowEdits[m.id]"
                  >
                    <fa-icon icon="times"></fa-icon>
                  </button>
                  <button
                    class="action"
                    :disabled="!validateEdits(rowEdits[m.id]).isValid"
                    @click="saveMember(m)"
                    v-if="rowEdits[m.id]"
                  >
                    <span v-if="rowEdits[m.id].saving">
                      <fa-icon icon="spinner" save></fa-icon>
                    </span>
                    <span v-else><fa-icon icon="check"></fa-icon></span>
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <input
                  type="text"
                  name="new-name"
                  placeholder="enter new name"
                  v-model="newData.name"
                  @keydown.enter="addMember(c.id)"
                  :data-catid="c.id"
                  ref="firstInput"
                />
              </td>
              <td v-if="c.includeTitles">
                <input
                  type="text"
                  name="new-title"
                  placeholder="enter new title name"
                  v-model="newData.title"
                  @keydown.enter="addMember(c.id)"
                />
              </td>
              <td>
                <div class="row-actions">
                  <button
                    class="action"
                    :disabled="!validateEdits(newData, c.includeTitles).isValid"
                    @click="addMember(c.id)"
                  >
                    <span v-if="newData.saving">
                      <fa-icon icon="spinner" spin></fa-icon>
                    </span>
                    <span v-else><fa-icon icon="user-plus"></fa-icon> </span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <AdminLoadingPlaceholder
      v-if="loading"
      resourceName="board members"
    ></AdminLoadingPlaceholder>
  </div>
</template>
<script lang="ts" src="./GeneralBoard.ts"></script>
<style lang="scss" src="./GeneralBoard.scss"></style>
