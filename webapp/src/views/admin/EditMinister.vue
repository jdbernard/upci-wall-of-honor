<template>
  <form
    id="edit-minister"
    class="admin-content-view"
    :class="{ preview }"
    v-if="minister"
    @submit.prevent=""
  >
    <div class="header">
      <h1>{{ minister | nameDisplay }}</h1>
      <div class="record-options">
        <CheckboxComponent :checked="ootfChecked" @change="setOotF"
          >Order of the Faith</CheckboxComponent
        >
        <CheckboxComponent
          :checked="bioChecked"
          :disabled="ootfChecked"
          @change="setHasBio"
          >Include a biography</CheckboxComponent
        >
      </div>
    </div>
    <div class="minister-details" v-if="minister">
      <MinisterPhotoComponent
        v-if="bioChecked"
        v-model="minister.details.photo"
        :allowEdit="true"
      ></MinisterPhotoComponent>

      <div class="basic-details">
        <label class="name">
          <span>
            Name:
            <TooltipComponent>
              Only the given name is required. Any number of middle names,
              initials, or nicknames may be entered.
            </TooltipComponent>
          </span>
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
            required
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
          <TooltipComponent type="error">
            A minister must have at least a given name.
          </TooltipComponent>
        </label>
        <label class="dateOfBirth">
          <span>Date of birth:</span>
          <input
            name="dateOfBirth"
            type="date"
            :value="formattedDateOfBirth"
            @input="setDateOfBirth"
            required
          />
          <TooltipComponent type="error">
            This field is required.
          </TooltipComponent>
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
          <CheckboxComponent
            :checked="!minister.isDeceased"
            @change="setLiving"
          >
            still living
          </CheckboxComponent>
        </label>
        <label class="recordState">
          <span>
            Record state:
            <TooltipComponent>
              <p>
                The <em>record state</em> controls the visibility of this
                minister record in the public-facing Wall of Honor displays.
              </p>
              <p>
                <strong>Published</strong> records are visible on the
                public-facing displays.
              </p>
              <p>
                <strong>Draft</strong> records are not visible on the
                public-facing displays. This is intended to be used when a
                record is being created but is not yet complete (maybe the bio
                is still being gathered).
              </p>
              <p>
                <strong>Archived</strong> records are not visible on the
                public-facing displays. This is intended for cases where we want
                to remove the record from the public Wall of Honor but retain
                the data.
              </p></TooltipComponent
            ></span
          >

          <select v-model="minister.state" required>
            <option>draft</option>
            <option>published</option>
            <option>archived</option>
          </select>
        </label>
        <label class="slug">
          <span>
            Short URL:
            <TooltipComponent>
              <p>
                The <i>short URL</i> is the URL-friendly version of the
                minister's name that will be used to create the bookmark-able
                links to their bio (and admin edit page).
              </p>
              <p>
                This <strong>must be unique across all ministers</strong> and
                can only contain letters, numbers, and '-'.
              </p>
              <p>
                We will try to generate a short URL for you based on the
                minister's name, but you may need to tweak this when two
                ministers share the same name. For example, you may add '-1',
                '-2', or some other distinguishing text to the end of one.
              </p>
            </TooltipComponent>
          </span>
          <input type="text" :value="minister.slug" @input="setSlug" required />
          <TooltipComponent type="error">
            This field is required and must be unique.
          </TooltipComponent>
        </label>
        <label class="ootfYearInducted" v-if="ootfChecked">
          <span>Year Inducted:</span>
          <TooltipComponent type="error">
            This is a required field for ministers inducted into the Order of
            the Faith and represents the year that they were inducted.
          </TooltipComponent>
          <input type="number" v-model="minister.ootfYearInducted" required />
          <TooltipComponent type="error">
            This field is required because you have "Order of the Faith"
            selected at the top of the page.
          </TooltipComponent>
        </label>
        <label class="biography" v-if="bioChecked">
          <span>
            Biography:
            <TooltipComponent>
              This editor allows rich-text. If you have biography content with
              formatting (from Word, for example), you should be able to copy
              and paste that content here to preserve the formatting.
            </TooltipComponent>
          </span>
          <div
            ref="bio-editor"
            @blur="bioChanged"
            class="editor"
            contenteditable
            required
            v-html="minister.details.biography"
          ></div>
          <TooltipComponent type="error">
            This field is required because you have "Include a biography"
            selected at the top of the page.
          </TooltipComponent>
        </label>
      </div>
    </div>
    <div class="actions">
      <button @click.prevent="$router.go(-1)" class="cancel" :disabled="saving">
        Cancel
      </button>
      <button @click.prevent="preview = true" v-if="minister && bioChecked">
        Preview
      </button>
      <button @click.prevent="save" class="action" :disabled="!isModified">
        <div v-if="saving">saving <fa-icon icon="spinner" spin></fa-icon></div>
        <span v-else>Save</span>
      </button>
    </div>
    <div class="preview-content" v-if="preview">
      <div class="glass-pane" @click="preview = false"></div>
      <MinisterBiographyComponent
        :minister="minister"
        class="theme-primary"
      ></MinisterBiographyComponent>
      <button @click.prevent="preview = false">Close Preview</button>
    </div>
  </form>
  <div v-else class="admin-content-view"></div>
</template>
<script lang="ts" src="./EditMinister.ts"></script>
<style lang="scss" src="./EditMinister.scss"></style>
