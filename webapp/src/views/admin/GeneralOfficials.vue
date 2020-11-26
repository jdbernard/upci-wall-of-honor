<template>
  <div id="admin-general-officials" class="admin-content-view">
    <header>
      <h1>Leadership</h1>
      <h2>General Officials</h2>
    </header>
    <div v-if="!loading" class="table-container">
      <table>
        <thead>
          <tr>
            <th>Position / Title</th>
            <th>Minister</th>
            <th></th>
          </tr>
        </thead>
        <draggable
          v-model="leaders"
          tag="tbody"
          handle=".handle"
          @end="reorder"
        >
          <tr
            v-for="l in leaders"
            :key="l.id"
            :class="{ editing: rowEdits[l.id] }"
          >
            <td>
              <input
                v-if="rowEdits[l.id]"
                type="text"
                name="title"
                v-model="rowEdits[l.id].title"
              />
              <span v-else>{{ l.title }}</span>
            </td>
            <td>
              <MinisterSelect
                v-if="rowEdits[l.id]"
                v-model="rowEdits[l.id].ministerId"
              ></MinisterSelect>
              <span v-else
                >{{ livingMinisters.get(l.ministerId) | nameDisplay }}
              </span>
            </td>
            <td>
              <div class="row-actions">
                <button
                  class="low-profile"
                  @click="editPosition(l)"
                  v-if="!rowEdits[l.id]"
                >
                  <fa-icon icon="pencil-alt"></fa-icon>
                </button>
                <button
                  class="low-profile"
                  @click="removePosition(l)"
                  v-if="!rowEdits[l.id]"
                >
                  <fa-icon icon="trash"></fa-icon>
                </button>
                <button
                  class="low-profile"
                  @click="cancelEdit(l)"
                  v-if="rowEdits[l.id]"
                >
                  <fa-icon icon="times"></fa-icon>
                </button>
                <button
                  class="action"
                  :disabled="!validateEdits(rowEdits[l.id]).isValid"
                  @click="savePosition(l)"
                  v-if="rowEdits[l.id]"
                >
                  <span v-if="rowEdits[l.id].saving">
                    <fa-icon icon="spinner" save></fa-icon>
                  </span>
                  <span v-else><fa-icon icon="check"></fa-icon></span>
                </button>
                <span class="handle">
                  <fa-icon icon="grip-lines"></fa-icon>
                </span>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <input
                type="text"
                name="new-title"
                placeholder="enter new title"
                v-model="newData.title"
              />
            </td>
            <td>
              <MinisterSelect v-model="newData.ministerId"></MinisterSelect>
            </td>
            <td>
              <div class="row-actions">
                <button
                  class="action"
                  :disabled="!validateEdits(newData).isValid"
                  @click="addLeader"
                >
                  <span v-if="newData.saving">
                    <fa-icon icon="spinner" spin></fa-icon>
                  </span>
                  <span v-else><fa-icon icon="user-plus"></fa-icon> </span>
                </button>
              </div>
            </td>
          </tr>
        </draggable>
      </table>
    </div>
    <AdminLoadingPlaceholder
      v-if="loading"
      resourceName="officials"
    ></AdminLoadingPlaceholder>
  </div>
</template>
<script lang="ts" src="./GeneralOfficials.ts"></script>
<style lang="scss" src="./GeneralOfficials.scss"></style>
