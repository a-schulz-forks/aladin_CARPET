<script lang="ts" setup>
import { defineProps, ref, onMounted, watch } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: "Modal title"
  },
  visibility: {
    type: Boolean,
    default: false
  },
  leftButtonLabel: {
    type: String,
    default: "Close"
  },
  rightButtonLabel: {
    type: String,
    default: "Understood"
  },
  leftButtonCallback: {
    type: Function,
    default: () => {
      new bootstrap.Modal(document.getElementById("staticBackdrop")!).hide();
    }
  },
  rightButtonCallback: {
    type: Function,
    default: () => {}
  }
});

const modalRef = ref<bootstrap.Modal | null>(null);

// Function to handle modal visibility
const setModalVisibility = (visible: boolean) => {
  if (modalRef.value) {
    if (visible) {
      modalRef.value.show();
    } else {
      modalRef.value.hide();
    }
  }
};

// Watch for changes in props.visibility
watch(
    () => props.visibility,
    (newVal) => {
      setModalVisibility(newVal);
    }
);

onMounted(() => {
  // Initialize the Bootstrap modal on mount
  modalRef.value = new bootstrap.Modal(document.getElementById("staticBackdrop")!);
  setModalVisibility(props.visibility);
});
</script>

<template>
  <div id="staticBackdrop" aria-hidden="false" aria-labelledby="staticBackdropLabel" class="modal fade show"
       data-bs-backdrop="static"
       data-bs-keyboard="false" tabindex="-1" v-bind="$attrs">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 id="staticBackdropLabel" class="modal-title fs-5">{{ title }}</h1>
          <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" type="button"></button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" type="button" @click="leftButtonCallback">
            {{ leftButtonLabel }}
          </button>
          <button class="btn btn-primary" type="button" @click="rightButtonCallback">{{
              props.rightButtonLabel
            }}
          </button>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>