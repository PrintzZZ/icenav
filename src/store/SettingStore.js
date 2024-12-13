import { defineStore } from "pinia";
import { ref } from "vue";

export const useSettingData = defineStore( "SettingData", () => {
    // 设置项
    const otherSettings = ref(
      {
        defaultTheme: "light",
        backgroundTypeList: ["iframe", "img", "video"],
        backgroundType: 0,
        backgroundImgUrl: "",
        backgroundVideoUrl: "",
        mask: 0.5,
        maskBlur: 2,
      },
    );

    // 更新设置项
    const updateOtherSettings = (datavalue) => {
      Object.assign(otherSettings.value, datavalue);
    };

    return {
      otherSettings,
      updateOtherSettings,
    };
  },
  {
    persist: true,
  }
);
