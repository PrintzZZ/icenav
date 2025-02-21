<template>
    <div class="ice_menu_like ice_menu_content" ref="LiketabRefs" :class="{ 'ice_hot': LikeActiveKey === '1' }">
        <a-tabs v-model:activeKey="LikeActiveKey" class="ice_menu_like_tabs" @change="onLikeTabChange">
            <a-tab-pane key="0" tab="我的收藏">
                <div class="ice_card_content" ref="sortLikeListRefs">

                    <!-- 卡片样式1 -->
                    <div class="ice_like_card" v-for="(item, key) in LikeList" :key="key" :data-id="key">
                        <div class="drag-handle">⋮⋮</div>
                        <span class="like_close_icon" @click.stop="LikeCancelItem(item)" >
                            <IconTriangleDown />
                        </span>
                        <a :href="item.link" class="ice_card_meta" target="_blank">
                            <div class="ice_card_avatar">
                                <div class="avatar-container">
                                    <img v-if="!item.load" :src="item.avatar" loading="lazy" :alt="item.title"
                                        @load="(event) => checkImgLoad(item, event)" :class="{ 'loaded': imageLoaded }"
                                        alt="avatar" />
                                    <div class="error_avatar" v-else style="background-color: #007FFF;">{{
                                        item.title.split('')[0][0] }}
                                    </div>
                                </div>
                            </div>
                            <div class="ice_card_detail">
                                <a-tooltip placement="bottom" :title="item.desc">
                                    <div class="ice_card_title">{{ item.title }}</div>
                                </a-tooltip>
                            </div>
                        </a>
                    </div>
                </div>
            </a-tab-pane>
            <a-tab-pane key="1" tab="今日热点" v-if="!isMobile">
                <IceHot ref="IceHotRef" />
            </a-tab-pane>
            <template #rightExtra>
                <i class="ice_menu_like_more" @click.stop="LikeMore">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"
                        focusable="false" aria-hidden="true">
                        <rect x="1" y="4" width="22" height="16" rx="3" fill="#DDE3E8"></rect>
                        <circle cx="6" cy="12" r="2" fill="#6A6F7F"></circle>
                        <circle cx="12" cy="12" r="2" fill="#6A6F7F"></circle>
                        <circle cx="18" cy="12" r="2" fill="#6A6F7F"></circle>
                    </svg>
                </i>
                <!-- 添加收藏模态框 -->
                <a-modal v-model:open="LikeMoreOpen" title="添加自定义收藏" @ok="LikeMoreHandleOk" :maskClosable="false"
                    :destroyOnClose="true" :confirmLoading="confirmLoading" @cancel="handleCancel">
                    <div class="like-more-modal">
                        <a-form :model="LikeMoreItem" :rules="rules" ref="formRef" layout="vertical">
                            <div class="preview-card">
                                <a-card style="width: 300px;">
                                    <a-card-meta :title="LikeMoreItem.title">
                                        <template #avatar>
                                            <a-avatar shape="square" size="large"
                                                :src="LikeMoreItem.avatar == '' ? `https://t3.gstatic.cn/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=128&url=${LikeMoreItem.link}` : LikeMoreItem.avatar"
                                                @error="handleAvatarError" class="preview-avatar">
                                                <template #icon>
                                                    <div class="skeleton-avatar"></div>
                                                </template>
                                                {{ LikeMoreItem.title?.[0] || 'N/A' }}
                                            </a-avatar>
                                        </template>
                                        <template #description>
                                            <div class="ellipsis-text">{{ LikeMoreItem.desc }}</div>
                                        </template>
                                    </a-card-meta>
                                </a-card>
                            </div>

                            <div class="form-items">
                                <a-form-item label="网站标题" name="title">
                                    <a-input v-model:value="LikeMoreItem.title" placeholder="请输入标题"
                                        @change="debouncePreview" />
                                </a-form-item>

                                <a-form-item label="网站地址" name="link" :rules="[
                                    { required: true, message: '请输入网址' },
                                    { type: 'url', message: '请输入有效的网址' }
                                ]">
                                    <a-input v-model:value="LikeMoreItem.link" placeholder="请输入网址(http/https)"
                                        @change="debouncePreview" />
                                </a-form-item>

                                <a-form-item label="网站描述" name="desc">
                                    <a-textarea v-model:value="LikeMoreItem.desc" placeholder="请输入网站描述"
                                        :auto-size="{ minRows: 2, maxRows: 4 }" @change="debouncePreview" />
                                </a-form-item>

                                <a-form-item label="网站图标" name="avatar">
                                    <a-input v-model:value="LikeMoreItem.avatar" placeholder="不填写链接自动获取网址图标"
                                        @change="debouncePreview">
                                        <template #suffix>
                                            <a-tooltip title="支持http/https图片地址">
                                                <IconWarning style="color: rgba(0, 0, 0, 0.45)" />
                                            </a-tooltip>
                                        </template>
                                    </a-input>
                                </a-form-item>
                            </div>
                        </a-form>
                    </div>
                </a-modal>
                <!-- 热点设置模态框 -->
                <a-modal v-model:open="HotMoreOpen" title="自定义热点、支持拖拽排序" @ok="HotMoreHandleOk"
                    :destroyOnClose="!HotMoreOpen">
                    <div class="Hot_setting">
                        <a-radio-group v-model:value="HotShowNum" button-style="solid" @change="HotShowNumChange">
                            <a-radio-button value="1">每行显示1个</a-radio-button>
                            <a-radio-button value="2">显示2个</a-radio-button>
                            <a-radio-button value="3">显示3个</a-radio-button>
                            <a-radio-button value="4">显示4个</a-radio-button>
                            <a-radio-button value="5">显示5个</a-radio-button>
                        </a-radio-group>
                    </div>
                    <div class="HotMore_modal_content">
                        <ul class="ice_menu_like_hot_list" ref="sortHotListRefs">
                            <li v-for="(item, index) in HotList" :key="index" :data-id="index" class="hot_item"
                                :class="{ 'noshow': !item.show }" @click.stop="HotMorehandleClick(item)">
                                <img class="item_img" :src="`/images/${item.name}.png`" alt="">
                                <span class="item_title">{{ item.title }}</span>
                            </li>
                        </ul>
                    </div>
                </a-modal>
            </template>
        </a-tabs>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick, onUnmounted } from 'vue';
import { message,Modal } from 'ant-design-vue';
import { useLinkData } from '../store/LinkStore';
import { useSettingData } from '../store/SettingStore';
import IceHot from './IceHot.vue';
import { IconWarning } from '../components/icons';
import { IconClose,IconTriangleDown } from '../components/unIcons';
import Sortable from "sortablejs";
import { debounce } from 'lodash-es';

const props = defineProps({
    isMobile: {
        type: Boolean,
        default: false
    },
    isNavCollapsed: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:isNavCollapsed']);
 
const LikeActiveKey = ref('0');
const linkStore = useLinkData();
const LikeList = computed(() => linkStore.LikeList);
const HotList = computed(() => linkStore.HotList);
const IceHotRef = ref(null);
const LiketabRefs = ref(null);
const sortHotListRefs = ref(null);
const sortLikeListRefs = ref(null);

const HotShowNum = ref(useSettingData().otherSettings.HotShowNum);
const HotShowNumChange = (e) => {
    useSettingData().updateOtherSettings({ HotShowNum: e.target.value });
};

// 收藏相关
const LikeMoreOpen = ref(false);
const LikeMoreItem = ref({
    title: 'Iceooh',
    desc: 'Iceooh冰屋数据网',
    link: 'https://www.iceooh.com/',
    avatar: ''
});

const LikeCancelItem = (item) => {

    Modal.confirm({
        title: '确认删除收藏',
        content: `确认删除 "${item.title}" 收藏？`,
        onOk: async () => {
            await linkStore.updateLikeList(LikeList.value.filter(i => i.link !== item.link));
            message.success('删除成功');
        },
        onCancel: () => {
            message.info('已取消');
        }
    });
};



const LikeMore = () => {
    if (LikeActiveKey.value === '0') {
        LikeMoreOpen.value = true;
    } else if (LikeActiveKey.value === '1') {
        HotMoreOpen.value = true;
        nextTick(() => {
            if (hotSortableInstance) {
                hotSortableInstance.destroy();
            }
            hotSortableInstance = initHotSort();
        });
    }
};

// 表单相关
const formRef = ref(null);
const confirmLoading = ref(false);
const previewLoading = ref(false);

// 表单验证规则
const rules = {
    title: [{ required: true, message: '请输入标题' }],
    link: [
        { required: true, message: '请输入网址' },
        { type: 'url', message: '请输入有效的网址' }
    ],
    desc: [{ required: false, message: '请输入描述' }]
};

// 优化预览更新
const debouncePreview = debounce(() => {
    previewLoading.value = true;
    setTimeout(() => {
        previewLoading.value = false;
    }, 300);
}, 300);

// 处理头像加载错误
const handleAvatarError = () => {
    LikeMoreItem.value.avatar = null;
};

// 优化提交处理
const LikeMoreHandleOk = async () => {
    try {
        confirmLoading.value = true;
        await formRef.value.validate();

        if (LikeList.value.some(i => i.link === LikeMoreItem.value.link)) {
            message.warning('已收藏过了');
            return;
        }

        // 自动获取头像
        if (LikeMoreItem.value.avatar == '') {
            const imgUrl = `https://t3.gstatic.cn/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=128&url=${LikeMoreItem.value.link}`;
            LikeMoreItem.value.avatar = imgUrl;
        }


        const newList = [...LikeList.value, { ...LikeMoreItem.value }];
        await linkStore.updateLikeList(newList);

        message.success('添加成功');
        LikeMoreOpen.value = false;
        resetForm();
    } catch (error) {
        console.error('表单验证失败:', error);
    } finally {
        confirmLoading.value = false;
    }
};

// 处理取消
const handleCancel = () => {
    LikeMoreOpen.value = false;
    resetForm();
};

// 重置表单
const resetForm = () => {
    formRef.value?.resetFields();
    // imageLoaded.value = false;
    LikeMoreItem.value = {
        title: 'Iceooh',
        desc: 'Iceooh冰屋数据网',
        link: 'https://www.iceooh.com/',
        avatar: ''
    };
};

// 热点相关
const HotMoreOpen = ref(false);
let hotSortableInstance = null;

// 热点排序临时变量，点击OK后更新
const HotListTemp = ref([]);
const HotMoreHandleOk = () => {
    HotMoreOpen.value = false;
    if (hotSortableInstance) {
        hotSortableInstance.destroy();
        hotSortableInstance = null;
    }
    // 更新热点列表状态 
    if (HotListTemp.value.length > 0) {
        linkStore.updateHotList(HotListTemp.value);
    }
    // 更新热点列表请求
    IceHotRef.value.updategetList();
};

const HotMorehandleClick = (item) => {
    item.show = !item.show;
};

// 修改热点排序初始化
const initHotSort = () => {
    if (!sortHotListRefs.value) return null;

    return Sortable.create(sortHotListRefs.value, {
        animation: 150,
        handle: ".hot_item",
        ghostClass: "sortable-ghost",
        chosenClass: "sortable-chosen",
        dragClass: "sortable-drag",
        forceFallback: true,
        store: {
            get: () => [...Array(HotList.value.length)].map((_, i) => i),
            set: async (sortable) => {
                const order = sortable.toArray().map(Number);
                const newList = order.map(i => HotList.value[i]);

                HotListTemp.value = newList;
            }
        },
        onStart: (evt) => {
            document.body.style.cursor = 'grabbing';
        },
        onEnd: (evt) => {
            document.body.style.cursor = 'default';
        }
    });
};

const onLikeTabChange = () => {
    if (props.isMobile) return;
    if (LikeActiveKey.value === '1') {
        // emit('update:isNavCollapsed', true);
        LiketabRefs.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        // emit('update:isNavCollapsed', false);
    }
};

// 添加图片加载状态控制
const imageLoaded = ref(false);

const checkImgLoad = (item, event) => {
    imageLoaded.value = true;
    const img = event.target;
    const width = img.naturalWidth;
    if (width < 32) {
        item.load = '使用占位';
        item.avatar = '';
    } else {
        item.avatar = img.src;
    }
};

// 修改收藏排序初始化
const initLikeSort = () => {
    if (!sortLikeListRefs.value) return null;

    return Sortable.create(sortLikeListRefs.value, {
        animation: 150,
        handle: ".ice_like_card",
        ghostClass: "sortable-ghost",
        chosenClass: "sortable-chosen",
        dragClass: "sortable-drag",
        forceFallback: true,
        store: {
            get: () => [...Array(LikeList.value.length)].map((_, i) => i),
            set: async (sortable) => {
                const order = sortable.toArray().map(Number);
                const newList = order.map(i => LikeList.value[i]);
                setTimeout(() => {
                    linkStore.updateLikeList(newList);
                }, 150);
            }
        },
        onStart: (evt) => {
            document.body.style.cursor = 'grabbing';
        },
        onEnd: (evt) => {
            document.body.style.cursor = 'default';
        }
    });
};

// 确保组件卸载时清理Sortable实例
let sortableInstance = null;

onMounted(() => {
    if (LikeActiveKey.value === '0') {
        nextTick(() => {
            sortableInstance = initLikeSort();
        });
    }
});

onUnmounted(() => {
    if (sortableInstance) {
        sortableInstance.destroy();
    }
    if (hotSortableInstance) {
        hotSortableInstance.destroy();
    }
});

// 计算卡片样式

// const cardStyle = computed(() => {
//     if (props.isMobile) { return {} }
//     const num = useSettingData().otherSettings.cardNum || 5;
//     const gap = 10; // 卡片间距
//     const width = `calc((100% - ${gap * (num - 1)}px) / ${num})`;
//     return {
//         flex: `0 0 ${width}`,
//         maxWidth: width,
//         minWidth: '150px', // 设置最小宽度
//     };
// });

// 监听列表变化，确保排序正确
watch(LikeList, () => {
    if (LikeActiveKey.value === '0') {
        nextTick(() => {
            if (sortableInstance) {
                sortableInstance.destroy();
            }
            sortableInstance = initLikeSort();
        });
    }
}, { deep: true });

// 添加标签页切换时的清理
watch(() => LikeActiveKey.value, (newVal, oldVal) => {
    if (oldVal === '0' && sortableInstance) {
        sortableInstance.destroy();
        sortableInstance = null;
    }
});

// 监听模态框关闭
watch(() => HotMoreOpen.value, (newVal) => {
    if (!newVal && hotSortableInstance) {
        hotSortableInstance.destroy();
        hotSortableInstance = null;
    }
});
</script>

<style lang="less" scoped>
.ice_hot {
    background-color: var(--semi-color-bg-main) !important;
    border: none !important;
}

.Hot_setting {
    margin: 16px 0;
}

.ellipsis-text {
    white-space: nowrap;
    /* 不换行 */
    overflow: hidden;
    /* 超出隐藏 */
    text-overflow: ellipsis;
    /* 省略号 */
    width: 100%;
    /* 限制宽度 */
    display: block;
}

.like-more-modal {
    .preview-card {
        margin-bottom: 24px;
        display: flex;
        justify-content: center;
        height: 100px;
        max-height: 100px;
    }

    .form-items {
        max-width: 500px;
        margin: 0 auto;
    }

    :deep(.ant-form-item) {
        margin-bottom: 16px;
    }

    :deep(.ant-input-affix-wrapper) {
        width: 100%;
    }
}

.ice_card_avatar {
    position: relative;
    width: 40px;
    height: 40px;
    border-radius: 6px;
    overflow: hidden;
    flex-shrink: 0; // 防止头像被压缩

    .avatar-container {
        position: relative;
        width: 100%;
        height: 100%;

        .skeleton {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg,
                    rgba(190, 190, 190, 0.2) 25%,
                    rgba(129, 129, 129, 0.24) 37%,
                    rgba(190, 190, 190, 0.2) 63%);
            background-size: 400% 100%;
            animation: skeleton-loading 1.4s ease infinite;
        }

        img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0;
            transition: opacity 0.3s ease;

            &.loaded {
                opacity: 1;
            }
        }
    }

    &.errorImg {
        background: rgba(0, 0, 0, 0.25);

        .error_avatar {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 16px;
            font-weight: bold;
        }
    }
}

// 预览卡片中的头像样式
.preview-avatar {
    .skeleton-avatar {
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg,
                rgba(190, 190, 190, 0.2) 25%,
                rgba(129, 129, 129, 0.24) 37%,
                rgba(190, 190, 190, 0.2) 63%);
        background-size: 400% 100%;
        animation: skeleton-loading 1.4s ease infinite;
    }
}

@keyframes skeleton-loading {
    0% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0 50%;
    }
}

.preview-card {
    margin-bottom: 24px;
    display: flex;
    justify-content: center;
    height: 100px;
    max-height: 100px;

    :deep(.ant-card-meta-avatar) {
        width: 40px;
        height: 40px;
        margin-right: 16px;
        flex-shrink: 0;
    }
}

.ice_card_content {
    .ice_like_card {
        position: relative;
        width: 80px;
        height: 80px;
        list-style: none;
        position: relative;
        background-color: var(--semi-color-bg-0);
        border-radius: 8px;
        
        &:hover {
            border: 1px solid var(--semi-color-border);
        }

        &:hover {
            .like_close_icon {
                opacity: 1;
            }
        }

        .ice_card_meta {
            display: flex;
            flex-direction: column;
            flex-wrap: nowrap;
            align-content: center;
            justify-content: center;
            align-items: center;
            gap: 2px;
            width: 100%;
            height: 100%;

            .ice_card_detail {
                height: 20px;

                .ice_card_title {
                    font-size: 12px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    display: block;
                    color: var(--semi-color-text-2);
                }
            }
        }

        // 删除按钮样式
        .like_close_icon {
            position: absolute;
            top: 0px;
            right: 0px;
            opacity: 0;
            transition: all 0.2s;
            color: #bfbfbf;
            cursor: pointer;
            transform: rotate(-45deg);
            font-size: 16px;

            &:hover {
                color: red;
                transform: scale(1.2) rotate(-45deg);;
            }
        }

        // 拖动把手样式
        .drag-handle {
            position: absolute;
            top: 0px;
            left: 5px;
            cursor: grab;
            opacity: 0;
            transition: opacity 0.2s;
            color: #bfbfbf;
            font-size: 16px;
            z-index: 1;
            user-select: none;
        }

        &:hover .drag-handle {
            opacity: 1;
        }

        // 拖动时的状态样式
        &.sortable-ghost {
            opacity: 0.2;
            background: #f0f0f0;
            transform: scale(0.95);
        }

        &.sortable-chosen {
            background: #ffffff;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
            transform: scale(1.02);
        }

        &.sortable-drag {
            cursor: grabbing;
            transform: scale(1.05);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }
    }
}

// 拖动时的光标样式
:deep(.sortable-drag) {
    cursor: grabbing !important;
}

.HotMore_modal_content {
    .ice_menu_like_hot_list {
        .hot_item {
            &.sortable-ghost {
                opacity: 0.2;
                background: #f0f0f0;
                transform: scale(0.95);
            }

            &.sortable-chosen {
                background: #ffffff;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
                transform: scale(1.02);
            }

            &.sortable-drag {
                cursor: grabbing;
                transform: scale(1.05);
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
            }
        }
    }
}
</style>