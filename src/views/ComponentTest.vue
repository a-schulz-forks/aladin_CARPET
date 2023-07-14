<script setup lang="ts">
import { ref } from "vue";
import { GridLayout } from "grid-layout-plus";

let count = ref(0);
          let info = ref("");
          let gridFloat = ref(false);
          let color = ref("black");
          let gridInfo = ref("");
          let grid = null; // DO NOT use ref(null) as proxies GS will break all logic when comparing structures... see https://github.com/gridstack/gridstack.js/issues/2115
          let items = ref([]);

          onMounted(() => {
            grid = GridStack.init({ // DO NOT user grid.value = GridStack.init(), see above
              float: false,
              cellHeight: "70px",
              minRow: 1,
            });

            grid.on("dragstop", function (event, element) {
              const node = element.gridstackNode;
              info.value = `you just dragged node #${node.id} to ${node.x},${node.y} – good job!`;
            });

            grid.on('change', onChange);
            // gridFloat.value = grid.float();
          });

          function changeFloat() {
            gridFloat.value = !gridFloat.value;
            grid.float(gridFloat.value);
          }

          function onChange(event, changeItems) {
            updateInfo();
            // update item position
            changeItems.forEach(item => {
              var widget = items.value.find(w => w.id == item.id);
              if (!widget) {
                alert("Widget not found: " + item.id);
                return;
              }
              widget.x = item.x;
              widget.y = item.y;
              widget.w = item.w;
              widget.h = item.h;
            });
          }

          function addNewWidget2() {
            const node = items[count.value] || { x: 0, y: 0, w: 2, h: 2 };
            node.id = 'w_'+ (count.value++);
//          grid.addWidget(node);
            items.value.push(node);
            nextTick(()=>{
              grid.makeWidget(node.id);
              updateInfo();
            });
          }

          function removeLastWidget() {
            if (count.value == 0) return;
            var id = `w_${count.value-1}`;
            var index = items.value.findIndex(w => w.id == id);
            if (index < 0) return;
            var removed = items.value[index];
            remove(removed);
          }

          function remove(widget) {
            var index = items.value.findIndex(w => w.id == widget.id);
            items.value.splice(index, 1);
            const selector = `#${widget.id}`;
            grid.removeWidget(selector, false);
            updateInfo();
          }

          function updateInfo() {
            color.value = grid.engine.nodes.length == items.value.length ? "black" : "red";
            gridInfo.value = `Grid engine: ${grid.engine.nodes.length}, widgets: ${items.value.length}`;
          }

          return {
            info,
            items,
            addNewWidget2,
            removeLastWidget,
            onChange,
            grid,
            gridInfo,
            remove,
            gridFloat,
            changeFloat,
            color
          };
        },

        watch: {
          /**
           * Clear the info text after a two second timeout. Clears previous timeout first.
           */
          info: function (newVal) {
            if (newVal.length === 0) return;
            window.clearTimeout(this.timerId);
            this.timerId = window.setTimeout(() => {
              this.info = "";
            }, 2000);
          },
        },
</script>

<template>
  <button type="button" @click="addNewWidget2()">Add Widget pos [0,0]</button>
  <button type="button" @click="removeLastWidget()">Remove Last Widget</button>
  <br />
  <br />
  <button type="button" @click="changeFloat()">Float: {{ gridFloat }}</button>

  <div>{{ info }}</div>
  <br />
  <div>
    <b :style="{ color: color }">{{ gridInfo }}</b>
  </div>
  <br />

  <div class="grid-stack">
    <div
      v-for="(w, indexs) in items"
      class="grid-stack-item"
      :gs-x="w.x"
      :gs-y="w.y"
      :gs-w="w.w"
      :gs-h="w.h"
      :gs-id="w.id"
      :id="w.id"
      :key="w.id"
    >
      <div class="grid-stack-item-content">
        <button @click="remove(w)">remove</button>
        {{ w }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.vgl-layout {
  background-color: #eee;
}

:deep(.vgl-item:not(.vgl-item--placeholder)) {
  background-color: #ccc;
  border: 1px solid black;
}

:deep(.vgl-item--resizing) {
  opacity: 90%;
}

:deep(.vgl-item--static) {
  background-color: #cce;
}

.text {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: auto;
  font-size: 24px;
  text-align: center;
}
</style>
