<template>
    <div class="ice-hot-container" :style="`grid-template-columns: repeat(${colSpan}, minmax(0px, 1fr));`">
        <div v-for="(item, index) in getList" :key="index" class="ice-hot-item">
            <a-card>
                <div class="hot-title">
                    <div class="hot-title-name">
                        <img :src="`/images/${item.name}.png`" alt="" class="hot-title-img">
                        <span>{{ item.title }}</span>
                    </div>
                    <div class="hot-title-desc"> {{ item.type }} </div>
                </div>
                <div class="hot-list">
                    <div class="hot-list-content">
                        <a-skeleton active v-for="i in 2" :key="i" v-if="item.isloading" style="padding: 0 16px;" />
                        <a target="_blank" rel="noopener noreferrer" v-for="(ite, inde) in item.data" :key="inde" v-else
                            :href="ite.url" class="hotitem">
                            <span class="hotindex" :class="{ 'one': inde == 0, 'two': inde == 1, 'three': inde == 2 }">
                                {{ inde + 1 }}
                            </span>
                            <span class="hottitle">{{ ite.title }}</span>
                            <span class="hotnum">
                                {{ ite.hot > 10000 ? (ite.hot / 10000).toFixed(1) + 'w' : ite.hot }}
                            </span>
                        </a>
                    </div>
                </div>
                <div class="hot-more">
                    <span class="hot-more-text">{{ item.isloading ? '加载中...' : formatDate(item.updateTime) }} </span>
                    <div class="hot-more-options">
                        <a-tooltip placement="top" title="刷新">
                            <i class="hot-more-icon" @click="refetchData(index)">
                                <svg width="1em" height="1em" viewBox="0 0 48 48" fill="none">
                                    <path d="M42 8V24" stroke="currentColor" stroke-width="4" stroke-linecap="round"
                                        stroke-linejoin="round"></path>
                                    <path d="M6 24L6 40" stroke="currentColor" stroke-width="4" stroke-linecap="round"
                                        stroke-linejoin="round"></path>
                                    <path
                                        d="M42 24C42 14.0589 33.9411 6 24 6C18.9145 6 14.3216 8.10896 11.0481 11.5M6 24C6 33.9411 14.0589 42 24 42C28.8556 42 33.2622 40.0774 36.5 36.9519"
                                        stroke="currentColor" stroke-width="4" stroke-linecap="round"
                                        stroke-linejoin="round"></path>
                                </svg>
                            </i>
                        </a-tooltip>
                    </div>
                </div>

            </a-card>
        </div>
    </div>
</template>
<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import axios from 'axios';
import { useLinkData } from '../store/LinkStore';
import { message } from 'ant-design-vue';
import { debounce } from 'lodash-es';


const screenWidth = ref(window.innerWidth);
const colSpan = computed(() => {
    if (screenWidth.value >= 1680) {
        return 5;
    } else if (screenWidth.value >= 1440) {
        return 4;
    } else if (screenWidth.value >= 1000) {
        return 3;
    } else if (screenWidth.value >= 769) {
        return 2;
    } else {
        return 1;
    }
});

const updateScreenWidth = debounce(() => {
    screenWidth.value = window.innerWidth;
}, 200);

const updategetList = () => {
    getList.value = filteredList.value.map((item, index) => ({
        key: index,
        name: item.name,
        title: item.title,
        type: '...',
        data: [],
        isloading: true,
        updateTime: '',
        show: item.show
    }));
    fetchData();
};

defineExpose({
    updategetList
});


const getList = ref([]);
const refetchData = (index) => {
    getList.value[index].isloading = true;
    console.log(getList.value[index].name)
    axios.get(`${baseURL}/${getList.value[index].name}?limit=20`).then(res => {
        const api = getList.value[index];
        const data = res.data;
        api.data = data.data;
        api.type = data.type;
        api.isloading = false;
        api.updateTime = data.updateTime;
    }).catch(err => {
        message.error('获取数据失败，请稍后再试');
    });
};

const baseURL = import.meta.env.VITE_API_URL || 'http://159.75.224.203:6688'

const fetchData = async () => {
    try {
        const batchSize = 3;  // 增加并发数到3个
        const requests = getList.value.map(api => ({
            promise: axios.get(`${baseURL}/${api.name}?limit=20`),
            api
        }));

        // 使用reduce进行批量处理
        for (let i = 0; i < requests.length; i += batchSize) {
            const batch = requests.slice(i, i + batchSize);
            await Promise.all(batch.map(async ({ promise, api }) => {
                try {
                    const response = await promise;
                    const data = response.data;
                    api.data = data.data;
                    api.type = data.type;
                    api.updateTime = data.updateTime;
                } catch (error) {
                    console.error(`Error fetching ${api.name}:`, error);
                } finally {
                    api.isloading = false;
                }
            }));
        }
    } catch (err) {
        message.error('获取数据失败，请稍后再试');
    }
};

const timeUnits = [
    { unit: 60, text: '分钟' },
    { unit: 3600, text: '小时' },
    { unit: 86400, text: '天' }
];

const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return '刚刚更新';

    // 使用预定义的时间单位进行计算
    for (const { unit, text } of timeUnits) {
        if (diffInSeconds < unit * 24) {
            const value = Math.floor(diffInSeconds / unit);
            return `${value}${text}前更新`;
        }
    }

    // 缓存DateTimeFormat实例
    if (!formatDate.formatter) {
        formatDate.formatter = new Intl.DateTimeFormat('zh-CN', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });
    }

    return `更新于 ${formatDate.formatter.format(date)}`;
};

const filteredList = computed(() => {
    return useLinkData().HotList.filter(item => item.show);
});

onMounted(() => {
    window.addEventListener('resize', updateScreenWidth);
    updategetList();
});

onUnmounted(() => {
    window.removeEventListener('resize', updateScreenWidth);
});


</script>
<style lang="less">
.ice-hot-container {
    width: 100%;
    display: grid;

    gap: 24px;

    .ice-hot-item {}

    .ant-card-body {
        padding: 0;

    }

    .hot-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;

        .hot-title-name {
            font-size: 16px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;

            .hot-title-img {
                width: 20px;
                height: 20px;
                margin-right: 8px;
            }
        }

        .dhot-titl-esc {
            font-size: 12px;
        }
    }


    .hot-list {
        padding: 0 2px;
        height: 400px;

        .hot-list-content:hover::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, 0.2);
        }

        .hot-list-content::-webkit-scrollbar {
            width: 4px;
        }

        .hot-list-content::-webkit-scrollbar-thumb {
            transition: .3s;
            background-color: #00000000;
        }

        .hot-list-content {
            max-height: 400px;
            overflow-y: auto;


        }

        .hotitem:hover {
            background-color: var(--semi-color-fill-0);
            color: var(--semi-color-text-0);
        }

        .hotitem {
            display: flex;
            align-items: center;
            box-sizing: border-box;
            min-height: 35px;
            color: var(--semi-color-text-1);
            border-radius: 6px;
            margin: 4px;
            padding: 4px 14px;
        }


        .hotindex.one {
            background-color: var(--semi-hottiem-bg-1);
            color: #fff;
        }

        .hotindex.two {
            background-color: var(--semi-hottiem-bg-2);
            color: #fff;
        }

        .hotindex.three {
            background-color: var(--semi-hottiem-bg-3);
            color: #fff;
        }

        .hotindex {
            width: 24px;
            height: 24px;
            min-width: 24px;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: var(--semi-hottiem-bg-0);
            border-radius: 8px;
            transition: all .3s;
            flex: 0 0 24px;
        }

        .hottitle {
            flex: 1;
            padding: 0 10px;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            word-wrap: break-word;
            word-break: break-word;
        }

        .hotnum {
            flex: 0 0 30px;
            /* 右边固定宽度 */
            text-align: right;
            font-size: 12px;
        }
    }

    .hot-more {
        padding: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .hot-more-text {
            font-size: 14px;
            color: #767c82;
        }

        .hot-more-options {
            display: flex;

            .hot-more-icon:hover {
                background-color: #2e32380d;
            }


            .hot-more-icon {
                display: inline-flex;
                justify-content: center;
                align-items: center;
                width: 24px;
                height: 24px;
                cursor: pointer;
                border-radius: 3px;
            }
        }
    }
}
</style>