<template>

  <div class="ice_main" :class="{ mobile: isMobile }">
    <IconMenu class="ice_silder_btn" @click="toggleNavCollapse()" v-if="isMobile" />
    <div class="ice_silder_mask" :class="{ show: !isNavCollapsed }" @click="toggleNavCollapse()">
      <div class="ice_silder" :style="{ width: isNavCollapsed ? '60px' : '200px', }">
        <div class="ice_nav_header">
          <div class="ice_logo" :class="{ collapsed: isNavCollapsed }">
            <a href="https://nav.iceooh.com" target="">
              <img src="/images/favicon.png" alt="ICEOOH冰屋学术导航logo" class="ice_logo_icon">
            </a>
            <span class="ice_logo_text" v-if="!isNavCollapsed">
              <span class="ice_logo_main">冰屋学术导航</span>
              <span class="ice_logo_sub">ICEOOH.COM</span>
            </span>
          </div>
        </div>

        <div class="ice_nav">
          <ul class="ice_menu">
            <li v-for="(menu, index) in menuList" :key="index" class="ice_menu_item" ref="menuLiRef">
              <!-- 顶级菜单 -->
              <a-tooltip placement="right" :title="isNavCollapsed ? menu.name : null">
                <div class="ice_menu_item_title" @click.stop="toggleMenu(index)">
                  <i class="ice_menu_item_icon">
                    <component :is="menu.icon" />
                  </i>
                  <span class="ice_menu_item_text">{{ menu.name }}</span>
                  <i class="ice_menu_item_arrow" :class="{ rotated: menu.isOpen }">
                    <component v-if="!isNavCollapsed" :is="'IconArrow'" />
                  </i>
                </div>
              </a-tooltip>
              <!-- 子菜单 -->
              <div class="ice_menu_item_collapse" :style="getCollapseStyle(menu)">
                <ul class="ice_menu_item_child">
                  <li v-for="(child, childIndex) in menu.child" :key="childIndex"
                    :class="['ice_menu_item_child_item', { ice_menu_item_selected: isSelected(index, childIndex) }]"
                    @click.stop="selectItem(index, childIndex)">
                    <i class="ice_menu_item_icon"></i>
                    <span class="ice_menu_item_text">{{ child.name }}</span>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
        <div class="ice_nav_fotter">
          <div class="nav-collapse-btn">
            <button class="nav-button" @click.stop="toggleNavCollapse()">
              <component :is="isNavCollapsed ? 'IconKanban' : 'IconSidebar'" />
              <span class="btn-right" :class="{ 'btn_collapsed': isNavCollapsed }">
                {{ isNavCollapsed ? '' : '收起侧边栏' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="ice_content" id="ice_content">
      <a-config-provider :locale="zhCN">
        <IceSearch />
      </a-config-provider>
      <div class="ice_mian_content">
        <IceLike :is-mobile="isMobile" v-model:is-nav-collapsed="isNavCollapsed" />
        <div class="ice_menu_content" v-for="(menu, index) in menuList" :key="index" :id="menu.name" ref="tabRefs">
          <a-tabs v-model:activeKey="menu.activeKey" class="ice_menu_content_tabs">
            <a-tab-pane :tab="child.name" v-for="(child, childIndex) in menu.child" :key="`${index}-${childIndex}`"
              :title="child.name">

              <div class="ice_card_content">
                <div class="ice_card" v-for="(item, itemindex) in child.item" :key="itemindex">
                  <span class="like_icon" @click.stop="Likeitem(item)">
                    <IconRating />
                  </span>
                  <a :href="item.link" class="ice_card_meta" target="_blank">
                    <div class="ice_card_avatar" :class="item.avatar ? '' : 'error'">
                      <img v-if="item.avatar" :src="item.avatar" @error="item.avatar = null" loading="lazy" />
                      <div class="error_avatar" v-else style="background-color: #007FFF;">{{ item.title.split(' ')[0][0]
                        }}
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
    </div>
  </div>




</template>
<script>
import { ref, onMounted, onUnmounted } from 'vue';
import IceHot from './views/IceHot.vue'
import IceSearch from './views/IceSearch.vue'
import { useLinkData } from './store/LinkStore';

import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { message } from 'ant-design-vue';
import Sortable from "sortablejs";

import * as Icons from './components/icons';
import { IconWarning, IconClose, IconRating, IconMenu, } from './components/icons';
import IceLike from './views/IceLike.vue'

export default {
  components: { ...Icons, IceHot, IceSearch, IconWarning, IconRating, IconClose, IceLike },
  setup() {
    // 菜单数据

    const LikeactiveKey = ref('0');
    const menuList = useLinkData().menuList;
    const LikeList = useLinkData().LikeList;
    const HotList = useLinkData().HotList;

    // 当前选中的菜单索引
    const selectedMenu = ref({ parentIndex: null, childIndex: null });
    const isNavCollapsed = ref(false);

    // 切换菜单展开/折叠状态
    const tabRefs = ref();
    const toggleMenu = (index) => {
      menuList[index].isOpen = !menuList[index].isOpen;
      isNavCollapsed.value = true ? false : !isNavCollapsed.value;
      const tabRefEle = tabRefs.value[index]
      if (tabRefEle) {
        tabRefEle.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    // 选中子菜单
    const selectItem = (parentIndex, childIndex) => {
      selectedMenu.value = { parentIndex, childIndex };
      menuList[parentIndex].activeKey = `${parentIndex}-${childIndex}`;
      const tabRefEle = tabRefs.value[parentIndex]
      if (tabRefEle) {
        tabRefEle.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    // 判断子菜单是否被选中
    const isSelected = (parentIndex, childIndex) => {
      return (
        selectedMenu.value.parentIndex === parentIndex &&
        selectedMenu.value.childIndex === childIndex
      );
    };

    // 子菜单高度样式
    const getCollapseStyle = (menu) => {
      const itemHeight = 44; // 每个子菜单项高度
      const totalHeight = menu.child.length * itemHeight;
      return {
        maxHeight: menu.isOpen ? `${totalHeight}px` : '0',
        overflow: 'hidden',
        transition: 'max-height 0.3s ease',
      };
    };

    // 导航折叠状态
    const toggleNavCollapse = () => {
      isNavCollapsed.value = !isNavCollapsed.value;
      if (isNavCollapsed.value) {
        // 使用 requestAnimationFrame 优化动画性能
        requestAnimationFrame(() => {
          menuList.forEach((menu) => {
            menu.isOpen = false;
          });
        });
      }
    };


    // 监听窗口大小变化
    const checkWindowSize = () => {
      let window_width = window.innerWidth;
      isNavCollapsed.value = window_width < 1100;
      isMobile.value = window_width <= 767;
      // console.log(window_width)
    };

    onMounted(() => {
      checkWindowSize();
      window.addEventListener('resize', checkWindowSize);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', checkWindowSize);
    });

    // 获取ice_content的dom
    const iceContentDom = () => {
      return document.getElementById('ice_content');
    };

    // 判断是否是移动端
    const isMobile = ref(false);
    const checkMobile = () => {
      isMobile.value = window.innerWidth < 768;
    };

    // 点击收藏
    const Likeitem = (item) => {
      var likeListTemp = [];
      likeListTemp = [...LikeList]
      if (likeListTemp.findIndex(i => i.link === item.link) === -1) {
        likeListTemp.push(item);
        useLinkData().updateLikeList(likeListTemp)
      } else {
        message.warning('已收藏过了')
      }

    };
    // 点击取消收藏
    const LikeCancelitem = (item) => {
      var likeListTemp = [];
      likeListTemp = [...LikeList]
      const index = likeListTemp.findIndex(i => i.link === item.link)
      if (index !== -1) {
        likeListTemp.splice(index, 1)
      }
      useLinkData().updateLikeList(likeListTemp)
    };

    // 点击更多 不同的tab打开不同
    const sortHotList = ref(null);
    const LikeMore = () => {
      if (LikeactiveKey.value === '0') {
        // console.log('添加自定义收藏')
        LikeMoreOpen.value = true;
      } else if (LikeactiveKey.value === '1') {
        // console.log('编辑热点') 延迟调用排序否则无法获取到dom
        HotMoreOpen.value = true;
        setTimeout(() => { sortHot(); }, 500);
      }
    };
    // 点击收藏更多模态框
    const LikeMoreOpen = ref(false);
    const LikeMoreItem = ref({ title: 'Iceooh【标题】', desc: 'Iceooh冰屋数据��【简介】', link: 'https://www.iceooh.com/', avatar: '/images/favicon.png' });
    const LikeMorehandleOk = () => {
      LikeMoreOpen.value = false;
      Likeitem(LikeMoreItem.value)
      LikeMoreItem.value = { title: 'Iceooh【标题】', desc: 'Iceooh冰屋数据网【简介】', link: 'https://www.iceooh.com/', avatar: '/images/favicon.png' };
    };

    // 点击热点更多模态框
    const IceHotRef = ref(null);
    const HotMoreOpen = ref(false);
    const HotMorehandleOk = () => {
      HotMoreOpen.value = false;
      if (HotListTemp.value !== null) {
        useLinkData().updateHotList(HotListTemp.value)
      }
      IceHotRef.value.updategetList(HotList);
    };
    const HotMorehandleClick = (item) => {
      item.show = !item.show;
    };



    // 收藏 和 热点 的tab切换
    // 移动端不渲染热点tab,点击滑动到顶部自动收起侧边栏
    const LiketabRefs = ref();
    const onLikeTabChange = () => {
      if (isMobile.value) { return }
      if (LikeactiveKey.value === '1') {
        //收起所有子菜单再收起侧边栏然后滑动到顶部
        menuList.forEach((menu) => {
          menu.isOpen = false;
        });
        isNavCollapsed.value = true;
        LiketabRefs.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        isNavCollapsed.value = false;
      }
    };

    // 排序热点
    const HotListTemp = ref([...HotList]);
    const sortHot = () => {
      Sortable.create(sortHotList.value, {
        animation: 150,
        handle: ".hot_item",
        onEnd: (evt) => {
          // 如果索引没有改变或索引无效，直接返回,否则排序点击OK后提交
          if (evt.oldIndex === evt.newIndex || evt.oldIndex == null || evt.newIndex == null) {
            return;
          }
          const movedItem = HotListTemp.value.splice(evt.oldIndex, 1)[0];
          HotListTemp.value.splice(evt.newIndex, 0, movedItem);
        },
      });
    };


    return {
      zhCN,
      menuList, // 菜单数据
      isNavCollapsed, // 导航折叠状态
      tabRefs, // 获取对应的tab的ref
      LiketabRefs, // 获取收藏的tab的ref
      toggleNavCollapse, // 导航折叠状态
      toggleMenu, // 切换菜单展开/折叠状态
      selectItem,  // 选中子菜单
      isSelected, // 判断子菜单是否被选中
      getCollapseStyle,   // 子菜单高度样式
      iceContentDom, // 获取ice_content的dom
      isMobile, // 判断是否是移动端
      Likeitem,
      LikeList,
      LikeactiveKey,
      LikeCancelitem,
      LikeMore,
      LikeMoreOpen,
      LikeMorehandleOk,
      LikeMoreItem,
      onLikeTabChange,
      HotMoreOpen,
      HotMorehandleOk,
      HotList,
      HotMorehandleClick,
      IceHotRef,
      sortHotList,
      sortHot
    };
  },
};
</script>
<style lang="less">
:root {
  --semi-white: 255, 255, 255;
  --semi-grey-8: 46, 50, 56;
  --semi-grey-9: 28, 31, 35;
  --semi-blue-0: 234, 245, 255;
  --semi-color-nav-bg: rgba(var(--semi-white), 1);
  --semi-color-border: rgba(var(--semi-grey-9), .08);
  --semi-border-radius-small: 3px;
  --semi-color-text-0: rgba(var(--semi-grey-9), 1);
  --semi-color-text-2: rgba(var(--semi-grey-9), .62);
  --semi-transition_duration-none: 0s;
  --semi-transition_function-easeIn: ease-in;
  --semi-transition_delay-none: 0s;
  --semi-color-fill-0: rgba(var(--semi-grey-8), .05);
  --semi-color-primary-light-default: rgba(var(--semi-blue-0), 1);
}

.ice_main {
  display: flex;
  flex-direction: row;
  height: 100vh;
  margin: 0;
  padding: 0;

  .ice_silder_btn {
    display: none;
  }

}



.ice_silder {
  // width: 30%;
  background-color: var(--semi-color-nav-bg);
  border-right: 1px solid var(--semi-color-border);
  box-sizing: border-box;
  margin: 0;
  outline: none;
  overflow: hidden;
  padding-left: 8px;
  padding-right: 8px;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-user-select: none;
  user-select: none;
  width: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-content: center;
  align-items: center;
  min-width: 60px;
  height: 100%;
  will-change: width; // 提示浏览器动画优化
  backface-visibility: hidden; // 防止动画闪烁
  transform: translateZ(0); // 启用GPU加速
}

.ice_nav_header {
  width: 100%;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: center;
  padding: 0 0 0 3px;

  .ice_logo.collapsed .ice_logo_icon {
    // margin: 0;
  }

  .ice_logo {
    // padding: 32px 8px;
    width: 100%;
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    color: #00B2FF;
    cursor: pointer;
  }

  .ice_logo_icon {
    width: 36px;
    margin-left: 0;
    margin-right: 8px;
    display: inline-flex;
    flex-shrink: 0;
    font-size: 36px;
  }

  .ice_logo_text {
    font-size: 16px;
    line-height: 24px;
    font-family: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
    font-weight: 600;
    color: var(--semi-color-text-0);
    white-space: nowrap;
    text-overflow: ellipsis;
    transition: opacity .2s cubic-bezier(.5, -.1, 1, .4);
    opacity: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .ice_logo_sub {
      font-size: 12px;
      line-height: 12px;
      font-weight: 400;
      color: var(--semi-color-text-2);
    }
  }
}

.ice_nav::-webkit-scrollbar {
  display: none;
  -webkit-overflow-scrolling: touch;
  -webkit-scrollbar-width: none;
  -ms-overflow-style: none;
  -moz-overflow-style: none;
  -o-overflow-style: none;
  -khtml-overflow-style: none;
}

.ice_nav {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: flex-start;
  align-items: center;
  overflow-y: auto;
  overflow-x: hidden;

  .ice_menu {
    padding-top: 12px;
    width: 100%;

    .ice_menu_item {
      cursor: pointer;
      display: flex;
      border-radius: var(--semi-border-radius-small);
      padding: 8px 12px;
      box-sizing: border-box;
      margin-top: 0;
      margin-bottom: 8px;
      font-size: 14px;
      line-height: 20px;
      font-family: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
      font-weight: 400;
      color: var(--semi-color-text-0);
      width: 100%;
      transition: background-color var(--semi-transition_duration-none) var(--semi-transition_function-easeIn) var(--semi-transition_delay-none);
      display: block;
      padding: 0;
      margin-top: 0;
      height: inherit;
      font-weight: 600;
    }

    .ice_menu_item_title:hover {
      background-color: var(--semi-color-fill-0);
      color: var(--semi-color-text-0);
    }

    .ice_menu_item_title {
      cursor: pointer;
      display: flex;
      border-radius: var(--semi-border-radius-small);
      padding: 8px 12px;
      box-sizing: border-box;
      margin-top: 0;
      margin-bottom: 8px;
      font-size: 14px;
      line-height: 20px;
      font-family: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
      font-weight: 400;
      color: var(--semi-color-text-0);
      width: 100%;
      transition: background-color var(--semi-transition_duration-none) var(--semi-transition_function-easeIn) var(--semi-transition_delay-none);
      display: flex;
      align-items: center;
      width: 100%;
      flex: 0 0 auto;
      display: flex;
      justify-content: flex-start;
      height: 36px;
      align-items: center;

    }

    .ice_menu_item_icon {
      display: inline-flex;
      color: var(--semi-color-text-2);
      margin-right: 12px;
      min-width: 20px;
      font-size: 20px;
      display: inline-block;
      font-style: normal;
      line-height: 0;
      text-align: center;
      text-transform: none;
      text-rendering: optimizeLegibility;
      fill: currentColor;
    }

    .ice_menu_item_arrow {
      display: inline-flex;
      color: var(--semi-color-text-2);
      margin-left: auto;
      transition: opacity .2s cubic-bezier(.5, -.1, 1, .4);
      opacity: 1;
      transition: transform .2s ease-in-out;
      transform: rotate(0);
    }

    .ice_menu_item_arrow.rotated {
      transform: rotate(180deg);
    }

    .ice_menu_item_text {
      opacity: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: opacity .2s cubic-bezier(.5, -.1, 1, .4);
      white-space: nowrap;
      font-weight: 600;
    }

    .ice_menu_item_collapse {
      overflow: hidden;
      opacity: 1;
      transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      will-change: max-height;
      transform: translateZ(0);

      .ice_menu_item_child {
        .ice_menu_item_child_item:hover {
          background-color: var(--semi-color-fill-0);
          color: var(--semi-color-text-0);
        }

        .ice_menu_item_selected {
          background-color: var(--semi-color-primary-light-default);
          color: var(--semi-color-text-0);
        }

        .ice_menu_item_child_item {
          cursor: pointer;
          display: flex;
          border-radius: var(--semi-border-radius-small);
          padding: 8px 12px;
          box-sizing: border-box;
          margin-top: 0;
          margin-bottom: 8px;
          font-size: 14px;
          line-height: 20px;
          font-family: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
          font-weight: 400;
          color: var(--semi-color-text-0);
          width: 100%;
          transition: background-color var(--semi-transition_duration-none) var(--semi-transition_function-easeIn) var(--semi-transition_delay-none);
          padding: 8px 12px;

          .ice_menu_item_text {
            font-weight: 400;
          }
        }
      }
    }
  }
}

.ice_nav_fotter {
  width: 100%;
  color: rgba(28, 31, 35, 0.8);
  padding-left: 8px;
  padding-right: 8px;
  box-sizing: border-box;
  padding: 16px 0px 8px 0px;
  display: inline-flex;
  align-items: center;

  .nav-collapse-btn {
    width: 100%;
  }

  .nav-button {
    width: 100%;
    box-shadow: none;
    font-size: 14px;
    line-height: 20px;
    font-family: Inter;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    cursor: pointer;
    user-select: none;
    border: 0 solid transparent;
    border-radius: var(--semi-border-radius-small);
    padding: 6px 12px;
    font-weight: 600;
    outline: none;
    vertical-align: middle;
    white-space: nowrap;
    font-size: 20px;
    background-color: #fff;
    color: #222;
    transition: width .2s cubic-bezier(.5, -.1, 1, .4);

    .btn-right {
      // width: 100%;
      min-width: 32px;
      display: block;
      margin-left: 12px;
      opacity: 1;
      transition: opacity .2s cubic-bezier(.5, -.1, 1, .4);
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      font-size: 14px;
      position: relative;
    }

    .btn_collapsed {
      opacity: 0;
      // width: 0;
      position: absolute;
    }
  }

  .nav-button:hover {
    background-color: #2e32380d;
    border: 0 solid transparent;
  }

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

  .ice_mian_content {
    width: 100%;
    padding: 0 20px;
    background-color: #F1F5F8;

    .ice_menu_like {
      .ice_menu_like_tabs {
        width: 100%;

        .ice_menu_like_more:hover {
          background-color: #2e32380d;
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
      background-color: #fff;

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

        cursor: pointer;
        transition: box-shadow 0.1s ease-in-out;
        padding: 24px;
        border-radius: 0 0 8px 8px;
        border: 1px solid #f0f0f0;
        padding: 0;
        color: rgba(0, 0, 0, 0.88);
        font-size: 14px;
        line-height: 1.5714285714285714;
        list-style: none;
        position: relative;
        background: #ffffff;
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
            color: #fff;
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
            border-radius: 50%;
            display: flex;
            align-items: center;
            flex-direction: column;
            flex-wrap: nowrap;
            justify-content: center;

          }

          .error_avatar {
            color: #fff;
            font-weight: bolder;
            padding: 0;
            color: #fff;
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
            border-radius: 50%;
            display: flex;
            align-items: center;
            flex-direction: column;
            flex-wrap: nowrap;
            justify-content: center;
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
            background: #00000040;
          }

          .ice_card_detail {
            overflow: hidden;
            flex: 1;

            .ice_card_title {
              margin-bottom: 8px;
              color: #000000e0;
              font-weight: 600;
              font-size: 16px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }

            .ice_card_desc {
              color: #00000073;
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

    .ice_silder_btn {
      position: absolute;
      top: 10px;
      left: 10px;
      z-index: 9999;
      color: #fff;
      font-size: 1.5rem;
      display: block;
    }

    .ice_silder_mask.show {
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
      background: #00000080;
      width: 100% !important;
      opacity: 1;

    }

    .ice_silder_mask.show .ice_silder {
      transform: translateX(0);
    }

    .ice_silder {
      position: fixed;
      transform: translateX(-100%);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      will-change: transform;
    }

    .ice_silder_mask {
      width: 0;
      height: 100% !important;
      top: 0 !important;
      position: fixed;
      z-index: 1090 !important;
      opacity: 0;
      transition: opacity .3s;
      backdrop-filter: blur(4px); // 添加模糊效果，提升视觉体验
    }

    .ice_mian_content {
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
</style>