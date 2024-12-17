import { defineStore } from 'pinia';
import { ref } from 'vue';
import { defaultData } from '../utils/defaultData';

export const useLinkData = defineStore('LinkData', () => {

  // 使用的数据
  const menuList = ref([...defaultData.menuList]);
  const searchMenu = ref([...defaultData.searchList]);
  const HotList = ref([...defaultData.hotList]);


  // 修改热点列表更新方法
  const updateHotList = (dataValue) => {
    HotList.value.splice(0, HotList.value.length);
    HotList.value.push(...dataValue);
  };

  // 我的收藏
  const LikeList = ref([]);
  
  // 更新收藏列表
  const updateLikeList = (dataValue) => {
    LikeList.value.splice(0, LikeList.value.length);
    LikeList.value.push(...dataValue);
  };

  // 更新searchMenu的值
  const updateSearchMenu = (value) => {
    Object.assign(searchMenu.value, value);
  };

  // 更新menuList的值 
  const updateMenuList = (dataValue) => {
    menuList.value.splice(0, menuList.value.length);
    menuList.value.push(...dataValue);
  };

  // 更新背景
  const backgroundData = ref(defaultData.backgroundList[0]);
  let currentIndex = 0;
  const updateBackground = (updateIndex=null) => {
    if (updateIndex == 'dark') {
      backgroundData.value = defaultData.backgroundList[1];
    }
    else if(updateIndex == 'light'){
      backgroundData.value = defaultData.backgroundList[0];
    }
    else{
      currentIndex = (currentIndex + 1) % defaultData.backgroundList.length;
      backgroundData.value = defaultData.backgroundList[currentIndex];
    }
  };

  return {
    menuList,
    searchMenu,
    backgroundData,
    updateSearchMenu,
    updateMenuList,
    updateBackground,
    updateLikeList,
    LikeList,
    HotList,
    updateHotList,
  };
}, {
  persist: true,
});



