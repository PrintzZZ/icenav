
import { defineStore } from "pinia";
import { ref } from "vue";
import { defaultData } from "../utils/defaultData";

export const useSettingData = defineStore( "SettingData", () => {
    // 设置项
    const otherSettings = ref(defaultData.otherSettings);


    // 更新设置项
    const updateOtherSettings = (dataValue) => {
      Object.assign(otherSettings.value, dataValue);
    };

    // 重置数据
    const resetSettings = () => {
      Object.assign(otherSettings.value, defaultData.otherSettings);
    };

    return {
      otherSettings,
      updateOtherSettings,
      resetSettings,
    };
  },
  {
    persist: true,
  }
);
