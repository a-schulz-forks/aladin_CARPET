<template>
  <div :ref="drop" :role="role" class="dropElement" :data-testid="role" :class="classObject">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { useDrop } from "vue3-dnd";
import type { DropTargetMonitor } from "vue3-dnd";
import { computed, unref } from "vue";
import { toRefs } from "@vueuse/core";

interface Props {
  accept: string[];
  lastDroppedItem?: any;
  onDrop: (item: any) => void;
  role?: string;
}

const props = defineProps<Props>();

const [collect, drop] = useDrop({
  accept: props.accept,
  drop: props.onDrop,
  collect: (monitor: DropTargetMonitor) => ({
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  })
});

const { canDrop, isOver } = toRefs(collect);
const isActive = computed(() => unref(canDrop) && unref(isOver));
const classObject = computed(() => ({ isActive: unref(isActive), canDrop: unref(canDrop) }));
</script>

<style scoped>
.dropElement {
  height: 12rem;
  width: 12rem;
  margin: 1.5rem;
  color: white;
  padding: 1rem;
  text-align: center;
  font-size: 1rem;
  line-height: normal;
  float: left;
  background-color: #543;
  border: 2px solid #000;
}

.isActive {
  border-color: green;
}

.canDrop {
  border-color: green;
}
</style>
