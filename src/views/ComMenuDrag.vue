<template>
    <div class="ComMenuDrag">
        <div class="cardDrag_container" ref="dragContainer">
            <div class="cardDrag_item" v-for="(item, index) in menuList" :key="`${item.name}-${index}`"
                :data-id="index"
                :class="{ 'drag-preview': previewIndex === index }">
                <span class="cardDrag_icon">
                    <component :is="Icons.IconDraggable" />
                </span>
                <span class="cardDrag_title_icon" @click="changeIcon(index)"
                    :class="{ 'active': changeIconIndex === index }">
                    <component :is="Icons[item.icon]" />
                </span>
                <span class="cardDrag_title">{{ item.name }}</span>
            </div>
        </div>
        <div class="cardDrag_iconList" v-if="changeIconIndex !== null">
            <div v-for="(icon, index) in Icons" :key="index" class="cardDrag_iconItem" @click="chooseIcon(index)">
                <component :is="icon" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useLinkData } from '../store/LinkStore';
import * as Icons from '../components/icons';
import Sortable from 'sortablejs';

const menuList = ref(useLinkData().menuList);
const dragContainer = ref(null);
const previewIndex = ref(null);
const changeIconIndex = ref(null);

// 图标选择相关方法
const changeIcon = (index) => {
    changeIconIndex.value = index;
};

const chooseIcon = (index) => {
    if (changeIconIndex.value === null) return;
    menuList.value[changeIconIndex.value].icon = index;
    changeIconIndex.value = null;
};

// 修改收藏排序初始化
const initMenuSort = () => {
    if (!dragContainer.value) return null;

    return Sortable.create(dragContainer.value, {
        animation: 150,
        handle: ".cardDrag_item",
        ghostClass: "sortable-ghost",
        chosenClass: "sortable-chosen",
        dragClass: "sortable-drag",
        forceFallback: false,
        dataIdAttr: 'data-id',
        onEnd: (evt) => {
            document.body.style.cursor = 'default';
            const order = evt.to.children;
            const newList = Array.from(order).map(el => {
                const id = el.getAttribute('data-id');
                return menuList.value[id];
            });
            newList.forEach((item, index) => {
                item.activeKey = `${index}-0`;
            });
            useLinkData().updateMenuList(newList);
        }
    });
};


let sortableInstance = null;
// 初始化Sortable
onMounted(() => {
    sortableInstance = initMenuSort();
});

onUnmounted(() => {
    if (sortableInstance) {
        sortableInstance.destroy();
    }
});

</script>

<style lang="less">
.ComMenuDrag {
    display: flex;

    .cardDrag_container {
        width: 250px;
        
        > * {
            transition: all 0.3s ease;
        }
    }

    .cardDrag_item:hover {
        background-color: var(--semi-color-fill-0);
        color: var(--semi-color-text-0);
    }

    .cardDrag_item:active {
        cursor: grabbing;
    }

    .cardDrag_iconList {
        width: 200px;
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        align-content: flex-start;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 5px;
        font-size: 25px;

        .cardDrag_iconItem:hover {
            background-color: #2e32380d;
        }

        .cardDrag_iconItem {
            padding: 5px;
            display: flex;
            cursor: pointer;
            border-radius: 3px;
        }
    }

    .cardDrag_item {
        width: 250px;
        min-height: 36px;
        box-sizing: border-box;
        padding: 8px 9px 8px 12px;
        -webkit-user-select: none;
        user-select: none;
        font-size: 14px;
        line-height: 20px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-wrap: nowrap;
        color: var(--semi-color-text-2);
        cursor: pointer;
        transition: all 0.3s ease;
        border-radius: 3px;
        cursor: grab;
        padding: 12px 0;

        .cardDrag_icon {
            display: flex;
            width: 20px;
            align-items: center;
            justify-content: center;

        }

        .cardDrag_title_icon.active {
            border: 2px dashed var(--semi-color-primary);
            opacity: 0.5;
            border-radius: 3px;
            box-sizing: border-box;
        }

        .cardDrag_title_icon {
            display: flex;
            /* width: 36px; */
            align-items: center;
            justify-content: center;
            font-size: 20px;
            margin: 0 5px;
            cursor: pointer;
        }

        .cardDrag_title {
            display: flex;
            align-items: center;
            justify-content: flex-start;
        }
    }

    .sortable-chosen {
        background-color: var(--semi-color-fill-0);
        opacity: 1 !important;
    }

    .sortable-ghost {
        opacity: 0.3;
        background-color: var(--semi-color-fill-0);
    }

    .sortable-drag {
        opacity: 1;
        background-color: var(--semi-color-fill-0);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
}
</style>