import { defineStore } from "pinia";
import { ref } from "vue";

export const useSettingData = defineStore( "SettingData", () => {
    // 设置项
    const otherSettings = ref(
      {
        defaultTheme: "light",
        backgroundTypeList: ["iframe", "img", "video"],
        backgroundType: 0,
        backgroundImg: {
          src: "https://loremflickr.com/1280/720",
          mask: 0.5,
          maskBlur: 2,
        },
        backgroundVideo: {
          src: "https://loremflickr.com/1280/720",
          mask: 0.2,
          maskBlur: 0.1,
        },
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
