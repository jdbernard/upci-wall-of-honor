<template>
  <div id="edit-minister" class="admin-content-view" v-if="minister">
    <div class="header">
      <h1>{{ minister | nameDisplay }}</h1>
      <div class="record-options">
        <Checkbox :checked="ootfChecked" @change="setOotF"
          >Order of the Faith</Checkbox
        >
        <Checkbox
          :checked="bioChecked"
          :disabled="ootfChecked"
          @change="setHasBio"
          >Include a biography</Checkbox
        >
      </div>
    </div>
    <div class="minister-details">
      <MinisterPhotoComponent
        v-model="minister.details.photo"
        :allowEdit="true"
      ></MinisterPhotoComponent>

      <div class="basic-details">
        <label class="name">
          <span>Name:</span>
          <input
            name="prefix"
            type="text"
            v-model="minister.name.prefix"
            placeholder="prefix"
          />
          <input
            name="given"
            type="text"
            v-model="minister.name.given"
            placeholder="given name"
          />
          <input
            v-for="idx in minister.name.additional.length + 1"
            :key="idx"
            :name="'middle' + idx"
            class="middle"
            :value="minister.name.additional[idx - 1]"
            placeholder="middle"
            type="text"
            @blur="cleanupAdditionalNames"
            @input="additionalNameChanged($event, idx - 1)"
          />
          <input
            name="surname"
            type="text"
            v-model="minister.name.surname"
            placeholder="surname"
          />
          <input
            name="suffix"
            type="text"
            v-model="minister.name.suffix"
            placeholder="suffix"
          />
        </label>
        <label class="dateOfBirth">
          <span>Date of birth:</span>
          <input
            name="dateOfBirth"
            type="date"
            :value="formattedDateOfBirth"
            @input="setDateOfBirth"
          />
        </label>
        <label class="dateOfDeath">
          <span>Date of death:</span>
          <input
            name="dateOfDeath"
            type="date"
            :disabled="!minister.isDeceased"
            :value="formattedDateOfDeath"
            @input="setDateOfDeath"
          />
          <Checkbox :checked="!minister.isDeceased" @change="setLiving">
            still living
          </Checkbox>
        </label>
        <label class="recordState">
          <span>Record state:</span>
          <select v-model="minister.state">
            <option>draft</option>
            <option>published</option>
            <option>archived</option>
          </select>
        </label>
        <label class="slug">
          <span>Short URL:</span>
          <input type="text" v-model="minister.slug" />
        </label>
        <label class="ootfYearInducted" v-if="ootfChecked">
          <span>Year Inducted:</span>
          <input type="number" v-model="minister.ootfYearInducted" />
        </label>
        <label class="biography" v-if="bioChecked">
          <span>Biography:</span>
          <div
            class="editor"
            contenteditable
            v-html="minister.details.biography"
            @blur="this.minister.details = $event.target.innerHTML"
          ></div>
        </label>
      </div>
    </div>
    <div class="actions">
      <button>Back</button>
      <button :disabled="!isModified" class="cancel">Cancel</button>
      <button :disabled="!isModified" class="save action">Save</button>
    </div>
  </div>
  <div v-else class="admin-content-view"></div>
</template>
<script lang="ts" src="./EditMinister.ts"></script>
<style lang="scss" src="./EditMinister.scss"></style>
