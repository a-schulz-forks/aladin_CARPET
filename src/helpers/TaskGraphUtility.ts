import {taskStore} from "@/store/taskGraph";
import {replayStore} from "@/store/replayGraph";
import {configurationStore} from "@/store/configureGraph";
import type {IState} from "@/interfaces/TaskGraphInterface";
import {Store} from "vuex";

enum StoreMapName {
    taskStore = "taskStore",
    replayStore = "replayStore",
    configurationStore = "configurationStore"
}

type StoreMap = {
    [K in StoreMapName]: Store<IState>;
};

const storeMap: StoreMap = {
    [StoreMapName.taskStore]: taskStore,
    [StoreMapName.replayStore]: replayStore,
    [StoreMapName.configurationStore]: configurationStore
};

export interface IStore {
    store: Store<IState>;
    getProperty: Function;
    setProperty: Function;
}

// bundle the different stores with the same utility functions to easily exchange them when injecting into the Canvas component
const storeBundler = (storeMap: StoreMap) => {
    const getFactory = (store: Store<IState>) => (path: string) => store.getters.getPropertyFromPath(path);
    const setFactory = (store: Store<IState>) => (payload: { path: string; value: any }) =>
        store.dispatch("setPropertyFromPath", payload);

    return Object.entries(storeMap).reduce((preparedStores, [name, store]) => {
        const storeMapname = <StoreMapName>name;
        preparedStores[storeMapname] = {
            store,
            getProperty: getFactory(store),
            setProperty: setFactory(store)
        };
        return preparedStores;
    }, {} as StoreMap);
};

export default storeBundler(storeMap);
