
import { defineStore } from "pinia";
import { ref } from "vue";
import { defaultData } from "../utils/defaultData";

export const useSettingData = defineStore( "SettingData", () => {
    // 设置项
    const otherSettings = ref(defaultData.otherSettings);
    const dockList = ref(defaultData.dockList);

    // 更新设置项
    const updateOtherSettings = (dataValue) => {
      Object.assign(otherSettings.value, dataValue);
    };

    const updateDockList = (dataValue) => {
      Object.assign(dockList.value, dataValue);
    };

    // 重置数据
    const resetSettings = () => {
      Object.assign(otherSettings.value, defaultData.otherSettings);
      Object.assign(dockList.value, defaultData.dockList);
    };

    return {
      otherSettings,
      updateOtherSettings,
      resetSettings,
      dockList,
      updateDockList,
    };
  },
  {
    persist: true,
  }
);
