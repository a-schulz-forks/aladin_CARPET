import { createStore } from "vuex";
import { taskStore as taskGraph } from "@/store/taskGraph";
import { store as taskOverview } from "@/store/taskOverview";

export default createStore({
  modules: {
    taskGraph,
    taskOverview
  }
});
