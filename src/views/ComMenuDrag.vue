<template>
    <div class="ComMenuDrag">
        <transition-group name="list" tag="div" class="cardDrag_container">
            <div class="cardDrag_item" v-for="(item, index) in menuList" :key="item.activeKey" draggable="true"
                :class="{ 'drag-preview': previewIndex === index }" @dragstart="onDragStart(index)"
                @dragover.prevent="onDragOver(index)" @dragenter.prevent="onDragEnter(index)" @drop="onDrop(index)"
                @dragend="onDragEnd">
                <span class="cardDrag_icon">
                    <component :is="Icons.IconDraggable" />
                </span>
                <span class="cardDrag_title_icon" @click="changeIcon(index)"
                    :class="{ 'active': changeIconIndex === index }">
                    <component :is="Icons[item.icon]" />
                </span>
                <span class="cardDrag_title">{{ item.name }}</span>
            </div>
        </transition-group>
        <div class="cardDrag_iconList" v-if="changeIconIndex !== null">
            <div v-for="(icon, index) in Icons" :key="index" class="cardDrag_iconItem" @click="chooseIcon(index)">
                <component :is="icon" />
            </div>
        </div>
    </div>
</template>



<script setup>
import { ref } from 'vue';
import { useLinkData } from '../store/LinkStore';
import * as Icons from '../components/icons';

const menuList = ref(useLinkData().menuList);
const IconShow = ref({});

const changeIconIndex = ref(null);
const changeIcon = (index) => {
    changeIconIndex.value = index;
};
const chooseIcon = (index) => {
    if (changeIconIndex.value === null) return;
    menuList.value[changeIconIndex.value].icon = index;
    changeIconIndex.value = null;
};


// 保存拖拽开始和预览位置索引
const dragIndex = ref(null);
const previewIndex = ref(null);

// 拖拽开始事件
const onDragStart = (index) => {
    dragIndex.value = index;
};

// 拖拽进入事件，用于更新预览位置
const onDragEnter = (index) => {
    previewIndex.value = index;
};

// 拖拽悬停事件，防止无效的触发
const onDragOver = (index) => {
    if (dragIndex.value !== index) {
        previewIndex.value = index;
    }
};

// 拖拽放下事件
const onDrop = (dropIndex) => {
    if (dragIndex.value !== null && dragIndex.value !== dropIndex) {
        const temp = menuList.value[dragIndex.value];
        menuList.value.splice(dragIndex.value, 1);
        menuList.value.splice(dropIndex, 0, temp);
    }
    dragIndex.value = null;
    previewIndex.value = null;
};

// 拖拽结束事件，用于清理状态
const onDragEnd = () => {
    dragIndex.value = null;
    previewIndex.value = null;
    // console.log(menuList.value);
    //重置activeKey
    menuList.value.forEach((item, index) => {
        item.activeKey = `${index}-0`;
    });
};
</script>



<style lang="less">
.ComMenuDrag {
    display: flex;

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
        transition: transform 0.3s, background-color 0.3s;
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

    /* 拖拽预览动画 */
    .drag-preview {
        background-color: var(--semi-color-fill-0);
        transform: scale(1.1);
        transition: transform 0.2s ease,
            opacity 0.2s ease,
            background-color 0.2s ease;
        opacity: 0.2;
    }

    /* 过渡动画 */
    .list-move {
        transition: transform 0.3s;
    }

    .list-enter-active,
    .list-leave-active {
        transition: all 0.3s;
    }

    .list-enter-from {
        opacity: 0;
        transform: translateY(-20px);
    }

    .list-enter-to {
        opacity: 1;
        transform: translateY(0);
    }

    .list-leave-from {
        opacity: 1;
        transform: translateY(0);
    }

    .list-leave-to {
        opacity: 0;
        transform: translateY(20px);
    }
}
</style>