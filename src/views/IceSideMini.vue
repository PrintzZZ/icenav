<template>
    <div class="miniSticky">
        <div class="sideMini">
            <ul class="miniList">
                <li v-for="(item, index) in menuList" :key="item.name" class="miniItem">
                    <i class="miniItemIcon">
                        <component :is="getIcon(item.icon)" />
                    </i>
                    <span>{{ item.name }}</span>
                    <ul class="miniSubChild">
                        <li v-for="(subItem, childIndex) in item.child" :key="subItem.name" class="miniSubItem"
                        @click.stop="selectItem(index, childIndex)">
                            <span class="miniSubItemSpan">{{ subItem.name }}</span>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import * as Icons from '../components/icons';
import { useLinkData } from '../store/LinkStore';
const menuList = useLinkData().menuList;
const selectedMenu = ref({ parentIndex: null, childIndex: null });

const props = defineProps({
    tabRefs: {
        type: Array,
        default: () => []
    }
});
// console.log(menuList);



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

// 获取图标组件的方法
const getIcon = (iconName) => {
    return Icons[iconName] || null;
};
</script>

<style scoped>
.miniSticky {
    display: block !important;
    position: sticky;
    top: 24px;
    z-index: 999;
}

.sideMini {
    width: 124px;
    position: absolute !important;
    top: 0;
    left: calc(-24px - 124px);
    padding: 8px 0px;
    background: #fff;
    box-shadow: 0 0 0.1rem 0 rgba(158, 158, 158, 0.1);
    border-radius: var(--semi-border-radius-small);
    border: 1px solid #abb7ec4f;
    transition: border-color 0.3s ease;
    

    .miniList {
        margin: 0;
    }

    .miniItemIcon {
        font-size: 19px;
        text-align: center;
        width: 1.25em;

    }

    .miniItem {
        position: relative;
        list-style: none;
        cursor: pointer;
        margin: 0px 5px;
        padding: 12px 12px;
        margin: 0px 5px;
        height: 39px;
        font-size: 14px;
        display: flex;
        align-items: center;
        border-radius: var(--semi-border-radius-small);

        &:hover {
            background-color: var(--semi-color-fill-0);
            color: var(--semi-color-text-0);
        }

        &:hover .miniSubChild {
            opacity: 1;
            visibility: visible;
            -webkit-transform: translateY(0px);
            transform: translateY(0px);
        }

        &.active {
            background-color: var(--semi-color-fill-0);
            color: var(--semi-color-text-0);
        }
    }

    span {
        margin-left: 8px;
    }
}

.miniSubChild {
    min-width: 245px;
    padding: 6px;
    position: absolute;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 5px 20px 0px rgb(0 0 0 / 5%);
    -webkit-transition: .3s;
    -o-transition: .3s;
    transition: .3s;
    -webkit-transform: translateY(15px);
    transform: translateY(15px);
    will-change: transform;
    left: 127px;
    top: 0px;
    border: 1px solid #abb7ec4f;
    opacity: 0;
    visibility: hidden;
    z-index: 999;



    .miniSubItem {
        position: relative;
        list-style: none;
        width: 50%;
        float: left;
        border-radius: var(--semi-border-radius-small);

        &:hover {
            background-color: var(--semi-color-fill-0);
            color: var(--semi-color-text-0);
        }

        .miniSubItemSpan {
            display: inline-block;
            padding: 12px 12px;
            margin: 0px 5px;
            height: 39px;
            font-size: 14px;
        }
    }
}
</style>