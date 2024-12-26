<template>
  <a-config-provider :theme="isDarkMode ? { algorithm: theme.darkAlgorithm } : {}" :locale="zhCN">
    <div class="ice_main" :class="{ mobile: isMobile }">

      <IceSide v-model:isNavCollapsed="isNavCollapsed" :tabRefs="tabRefs" :isMobile="isMobile" />

      <div class="ice_content" id="ice_content">
        <IceSearch />
        <div class="ice_main_content">
          <IceLike :is-mobile="isMobile" v-model:is-nav-collapsed="isNavCollapsed" />
          <div class="ice_menu_content" v-for="(menu, index) in menuList" :key="index" :id="menu.name"
            :ref="(el) => setTabRef(el, index)">
            <a-tabs v-model:activeKey="menu.activeKey" class="ice_menu_content_tabs">
              <a-tab-pane :tab="child.name" v-for="(child, childIndex) in menu.child" :key="`${index}-${childIndex}`"
                :title="child.name">

                <div class="ice_card_content">
                  <div class="ice_card" 
                  v-for="(item, itemIndex) in child.item" 
                  :key="itemIndex" :style="cardStyle">
                    <span class="like_icon" @click.stop="LikeItem(item)">
                      <IconRating />
                    </span>
                    <a :href="item.link" class="ice_card_meta" target="_blank">
                      <div class="ice_card_avatar" :class="item.avatar ? '' : 'error'">
                        <img v-if="item.avatar" :src="item.avatar" @error="item.avatar = null" loading="lazy" :alt="item.title"/>
                        <div class="error_avatar" v-else style="background-color: #007FFF;">{{
                          item.title.split('')[0][0] }}
                        </div>
                      </div>
                      <div class="ice_card_detail">
                        <div class="ice_card_title">{{ item.title }}</div>
                        <a-tooltip placement="bottom" :title="item.desc">
                          <div class="ice_card_desc">{{ item.desc }}</div>
                        </a-tooltip>
                      </div>
                    </a>
                  </div>
                </div>
              </a-tab-pane>
            </a-tabs>
          </div>
        </div>
        <a-back-top :target="iceContentDom" />
        <Footer />
      </div>
    </div>
  </a-config-provider>

</template>
<script setup>
import { ref, onMounted, onUnmounted, onBeforeUpdate, watchEffect, computed } from 'vue';
import IceSearch from './views/IceSearch.vue'
import { useLinkData } from './store/LinkStore';
import { useSettingData } from './store/SettingStore';

import { theme, message } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN';


import { IconRating } from './components/icons';
import IceLike from './views/IceLike.vue'
import IceSide from './views/IceSide.vue'
import Footer from './views/Footer.vue';
import ThemeSwitch from './views/ThemeSwitch.vue'
import { debounce } from 'lodash';


const menuList = useLinkData().menuList;
const LikeList = useLinkData().LikeList;
const isMobile = ref(false);

//检测版本
const checkVersion = () => {
  const version = useSettingData().otherSettings.iceVersion;
  if (version != '0.0.1') {
    message.warning('当前版本为' + version + ', 请更新到最新版本');
  }
}

// 当前选中的菜单索引
const isNavCollapsed = ref(false);

// 导航的tabRefs
const tabRefs = ref([]);
onBeforeUpdate(() => {
  tabRefs.value = [];
});

// 添加设置 ref 的方法
const setTabRef = (el, index) => {
  if (el) {
    tabRefs.value[index] = el;
  }
};

// 监听窗口大小变化
const checkWindowSize = () => {
  const window_width = window.innerWidth;
  // 根据不同宽度设置不同状态
  if (window_width <= 767) {
    isMobile.value = true;
    isNavCollapsed.value = true;
  } else if (window_width < 1100) {
    isMobile.value = false;
    isNavCollapsed.value = true;
  } else {
    isMobile.value = false;
    isNavCollapsed.value = false;
  }
};

// 使用防抖优化 resize 事件
const debouncedCheckSize = debounce(checkWindowSize, 200);

onMounted(() => {
  checkWindowSize(); // 初始检查
  // checkVersion();
  window.addEventListener('resize', debouncedCheckSize);
});

onUnmounted(() => {
  window.removeEventListener('resize', debouncedCheckSize);
});

// 获取ice_content的dom
const iceContentDom = () => {
  return document.getElementById('ice_content');
};

// 点击收藏
const LikeItem = (item) => {
  var likeListTemp = [];
  likeListTemp = [...LikeList]
  if (likeListTemp.findIndex(i => i.link === item.link) === -1) {
    likeListTemp.push(item);
    useLinkData().updateLikeList(likeListTemp)
    message.success('收藏成功')
  } else {
    message.warning('已收藏过了')
  }

};
const isDarkMode = ref(false);
// 监听主题变化
const observer = new MutationObserver(() => {
  isDarkMode.value = document.documentElement.getAttribute('data-theme') === 'dark'
})

onMounted(() => {
  // 初始化主题状态
  let otherSettings = useSettingData().otherSettings
  otherSettings.defaultTheme === 'light' ? isDarkMode.value = false : isDarkMode.value = true
  document.documentElement.setAttribute('data-theme', isDarkMode.value ? 'dark' : 'light')

  // 设置观察器
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  })
})

// 计算卡片样式
const cardStyle = computed(() => {
  if(isMobile.value){return {}}
    const num = useSettingData().otherSettings.cardNum || 5;
    const gap = 10; // 卡片间距
    const width = `calc((100% - ${gap * (num - 1)}px) / ${num})`;
    return {
        flex: `0 0 ${width}`,
        maxWidth: width,
        minWidth: '150px', // 设置最小宽度
    };
});

</script>
<style lang="less">


.ice_main {
  display: flex;
  flex-direction: row;
  height: 100vh;
  margin: 0;
  padding: 0;
}


.ice_content {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: auto;
  flex-direction: column;
  align-content: center;
  justify-content: flex-start;
  align-items: center;
  flex: 1;
  // min-width: 900px;

  .ice_main_content {
    width: 100%;
    padding: 0 20px;
    background-color: var(--semi-color-bg-main);

    .ice_menu_like {
      .ice_menu_like_tabs {
        width: 100%;

        .ice_menu_like_more:hover {
          background-color: var(--semi-color-bg-1);
          opacity: 1;
        }

        .ice_menu_like_more {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 3px;
          font-size: 20px;
          cursor: pointer;
          transition: .3s;
          opacity: 0.5;
        }
      }
    }

    .ice_menu_content {
      width: 100%;
      min-height: 210px;
      display: flex;
      border-radius: var(--semi-border-radius-small);
      border: 1px solid var(--semi-color-border);
      background: var(--semi-color-bg-1);
      margin: 24px 0;
      padding: 20px;
      // transition: background-color .2s cubic-bezier(0.645, 0.045, 0.355, 1);

      .ice_menu_content_tabs {
        width: 100%;

        .ant-card-bordered {
          margin: 0 10px 10px 0;
          cursor: pointer;
          transition: box-shadow .1s ease-in-out;
        }

        .ant-card-bordered:hover {
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);

        }


      }
    }

    .ice_card_content {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;

      .ice_card:hover {
        border: 1px solid #425aef50;
      }

      .ice_card:hover .like_icon {
        opacity: 1;
      }

      .ice_card {
        user-select: none;
        cursor: pointer;
        transition: box-shadow 0.1s ease-in-out;
        padding: 24px;
        border-radius: 0 0 8px 8px;
        border: 1px solid var(--semi-color-border);
        padding: 0;

        font-size: 14px;
        line-height: 1.5714285714285714;
        list-style: none;
        position: relative;
        background-color: var(--semi-color-bg-0);
        border-radius: 8px;
        padding: 24px;
        flex: 0 0 calc(20% - 10px);
        max-width: calc(20% - 10px);

        .like_icon:hover {
          transform: scale(1.3);
        }

        .like_icon {
          position: absolute;
          top: 10px;
          right: 10px;
          font-size: 20px;
          opacity: 0;
          transition: .3s;

        }

        .ice_card_meta {
          margin: -4px 0;
          display: flex;

          .ice_card_avatar>img {
            display: block;
            width: 76%;
            object-fit: cover;
            border-style: none;

          }

          .ice_card_avatar {
            margin: 0 16px 0 0;
            padding: 0;
            font-size: 14px;
            line-height: 30px;
            list-style: none;
            position: relative;
            display: inline-block;
            overflow: hidden;
            white-space: nowrap;
            text-align: center;
            background: #00000000;
            border: 1px solid transparent;
            width: 40px;
            height: 40px;
            // border-radius: 50%;
            display: flex;
            align-items: center;
            flex-direction: column;
            flex-wrap: nowrap;
            justify-content: center;

          }

          .error_avatar {
            font-weight: bolder;
            padding: 0;
            font-size: 14px;
            line-height: 30px;
            list-style: none;
            position: relative;
            display: inline-block;
            overflow: hidden;
            white-space: nowrap;
            text-align: center;
            background: #00000000;
            border: 1px solid transparent;
            width: 38px;
            height: 38px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            flex-direction: column;
            flex-wrap: nowrap;
            justify-content: center;
            color: #fff;
          }

          .error_avatar::before {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-60%, -60%);
            font-size: 12px;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #bdbdbd47;
            border-radius: 50%;
          }

          .ice_card_avatar.error {
            // background: #00000040;
          }

          .ice_card_detail {
            overflow: hidden;
            flex: 1;

            .ice_card_title {
              margin-bottom: 8px;
              color: var(--semi-color-text-0);
              font-weight: 600;
              font-size: 16px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }

            .ice_card_desc {
              color: var(--semi-color-text-2);
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
      }
    }
  }
}

.LikeMore_modal_content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 20px;

  .LikeMore_modal_footer {
    width: 300px;
    display: flex;
    gap: 10px;
    flex-direction: column;
    align-items: flex-start;

  }
}

.HotMore_modal_content {
  padding-top: 20px;

  .ice_menu_like_hot_list {
    display: flex;
    flex-direction: row;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;
    align-content: center;
    align-items: center;

    .hot_item:hover {
      // background-color: #2e32380d;
      border: 1px solid #0066ff;
    }

    .hot_item {
      width: 150px;
      height: 50px;
      border: 1px solid #0066ff50;
      cursor: pointer;
      border-radius: 6px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      flex-wrap: wrap;
      align-content: center;
      align-items: center;
      padding: 8px;

      .item_img {
        width: 35px;
        height: 35px;
        border-radius: 6px;
        flex: 0 0 35px;
        margin-right: 8px;
      }

      .item_title {
        font-size: 14px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        word-wrap: break-word;
        word-break: break-word;
        flex: 1;
      }
    }

    .hot_item.noshow:hover {
      filter: brightness(1);
      opacity: 0.8;
    }

    .hot_item.noshow {
      filter: brightness(0.5);
      opacity: 0.2;
      border: 1px solid #f0f0f050;
    }
  }

}


@media screen and (min-width: 767px) and (max-width: 1200px) {
  #IceoohNavigate {
    .ice_card {
      max-width: calc(33% - 10px);
      flex: 0 0 calc(33% - 10px);
    }
  }

}

@media screen and (max-width: 768px) {
  #IceoohNavigate .mobile {
    position: relative;

    .ice_main_content {
      padding: 0;

      .ice_menu_content {
        border: none;
        padding: 0 10px;
      }
    }

    .ice_card_content {
      justify-content: flex-start;

    }

    .ice_card {
      max-width: calc(50% - 10px);
      flex: 0 0 calc(50% - 10px);
      padding: 10px 5px;
      border-radius: 6px;

      .ice_card_meta {
        display: flex;
        flex-direction: row;
        align-content: center;
        justify-content: center;
        align-items: center;

        .ice_card_title {
          font-size: 14px;
        }

        .ice_card_desc {
          font-size: 12px;
        }
      }
    }

  }
}

.ice_card {
    margin-bottom: 10px;
    transition: all 0.3s ease; // 添加过渡效果，使宽度变化更平滑
}
</style>