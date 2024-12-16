import { version } from "less";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useSettingData = defineStore( "SettingData", () => {
    // 设置项
    const otherSettings = ref(
      {
        iceVersion: '0.0.1',
        defaultTheme: "light",
        backgroundTypeList: ["iframe", "img", "video"],
        backgroundType: 0,
        backgroundImgUrl: "",
        backgroundVideoUrl: "",
        mask: 0.5,
        maskBlur: 2,
        searchTitle: "学术搜索引擎",
        showTitle: true,
        fontColor: "#ffffff",
        searchInputColor: true,
        searchInputOpacity: 0.6,
        cardNum: 5,
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
