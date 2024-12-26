<template>
    <div class="ice_side_btn" @click="toggleNavCollapse()" v-if="isMobile">
        <component :is="getIcon('IconMenu')" />
    </div>
    <div class="ice_side_mask" :class="{ show: !isNavCollapsed }" @click="toggleNavCollapse()">
        <div class="ice_side" :style="{ width: isNavCollapsed ? '60px' : '200px', }">
            <div class="ice_nav_header">
                <div class="ice_logo" :class="{ collapsed: isNavCollapsed }">
                    <a href="/" target="">
                        <img src="/images/favicon.png" alt="ICEOOH冰屋学术导航logo" class="ice_logo_icon">
                    </a>
                    <span class="ice_logo_text" v-if="!isNavCollapsed">
                        <span class="ice_logo_main">冰屋综合导航</span>
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
                                    <component :is="getIcon(menu.icon)" />
                                </i>
                                <span class="ice_menu_item_text">{{ menu.name }}</span>
                                <i class="ice_menu_item_arrow" :class="{ rotated: menu.isOpen }">
                                    <component :is="getIcon('IconArrow')" v-if="!isNavCollapsed" />
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
            <div class="ice_nav_footer">
                <div class="nav-collapse-btn">
                    <button class="nav-button" @click.stop="toggleNavCollapse()" aria-label="折叠侧边栏">
                        <component :is="getIcon(isNavCollapsed ? 'IconKanban' : 'IconSidebar')" />
                        <span class="btn-right" :class="{ 'btn_collapsed': isNavCollapsed }">
                            {{ isNavCollapsed ? '' : '收起侧边栏' }}</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useLinkData } from '../store/LinkStore';
// 引入所有图标
import * as Icons from '../components/icons';

const menuList = useLinkData().menuList;
const selectedMenu = ref({ parentIndex: null, childIndex: null });
const isNavCollapsed = computed(() => props.isNavCollapsed);

const props = defineProps({
    isNavCollapsed: {
        type: Boolean,
        default: false
    },
    tabRefs: {
        type: Array,
        default: () => []
    },

    isMobile: {
        type: Boolean,
        default: false
    }
});
const emit = defineEmits(['update:isNavCollapsed']);

// 获取图标组件的方法
const getIcon = (iconName) => {
    return Icons[iconName] || null;
};

// 切换菜单展开/折叠状态
const toggleMenu = (index) => {
    menuList[index].isOpen = !menuList[index].isOpen;
    emit('update:isNavCollapsed', false);
    scrollToTab(index);
};

// 滚动到对应的tab
const scrollToTab = (index) => {
    if (props.tabRefs && props.tabRefs[index]) {
        props.tabRefs[index].scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
};


// 选中子菜单
const selectItem = (parentIndex, childIndex) => {
    selectedMenu.value = { parentIndex, childIndex };
    menuList[parentIndex].activeKey = `${parentIndex}-${childIndex}`;
    scrollToTab(parentIndex);
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
    const newValue = !props.isNavCollapsed;
    emit('update:isNavCollapsed', newValue);

};
// 监听侧边栏折叠状态
watch(() => props.isNavCollapsed, (newVal) => {
    if (newVal == true) {
        requestAnimationFrame(() => {
            menuList.forEach((menu) => {
                menu.isOpen = false;
            });
        });
    }
});


// 监听 props 变化
watch(
    () => props.isMobile,
    (newVal) => {
        if (newVal) {
            emit('update:isNavCollapsed', true);
        }
    }
);

// 组件挂载时，如果是移动端则收起侧边栏
onMounted(() => {
    if (props.isMobile) {
        emit('update:isNavCollapsed', true);
    }
});

</script>
<style lang="less">
.ice_side_btn {
    display: none;
}

.ice_side {
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
    scrollbar-width: none;
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

.ice_nav_footer {
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
        background-color: var(--semi-color-nav-bg);
        color: var(--semi-color-text-0);
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
        background-color: var(--semi-color-fill-0);
        color: var(--semi-color-text-0);
        border: 0 solid transparent;
    }

}

// 移动端样式优化
@media screen and (max-width: 768px) {
    .ice_side_btn {
        position: fixed;
        top: 10px;
        left: 10px;
        z-index: 9999;
        color: #fff;
        font-size: 1.5rem;
        display: block;

        &:active {
            transform: scale(0.95);
        }
    }

    .ice_side_mask {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;

        &.show {
            opacity: 1;
            visibility: visible;
        }
    }

    .ice_side {
        position: fixed;
        height: 100%;
        transform: translateX(-100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

        .show & {
            transform: translateX(0);
        }
    }
}
</style>