<template>
    <div class="weather_container" v-if="weatherData">
        <div class="weather_icon" @mouseenter="showDetail = true" @mouseleave="showDetail = false">
            <img :src="`/iconWeather/${weatherData.weather}.png`" :alt="weatherData.weather">

            <!-- 悬浮框 -->
            <transition name="slide-fade">
                <div v-show="showDetail">
                    <div class="weather_detail_popup">
                        <div class="weather_info">
                            <span class="temperature">{{ weatherData.temperature }}°</span>
                            <span class="weather_text">{{ weatherData.weather }}</span>
                        </div>
                        <div class="weather_detail">
                            <span>{{ weatherData.city }}</span>
                            <span>湿度 {{ weatherData.humidity }}%</span>
                        </div>
                        <div class="weather_update">
                            {{ formatTime(weatherData.reporttime) }}
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';

const weatherData = ref(null);
const CACHE_KEY = 'weather_cache';
const CACHE_DURATION = 10 * 60 * 1000; // 10分钟缓存
const GAODE_KEY = 'f42ee1057785426e86002fa86d8af9cc'

const showDetail = ref(false);

// 格式化时间
const formatTime = (timeStr) => {
    const date = new Date(timeStr);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes} 更新`;
};

// 从缓存获取数据
const getCache = () => {
    const cache = localStorage.getItem(CACHE_KEY);
    if (cache) {
        const { data, timestamp } = JSON.parse(cache);
        if (Date.now() - timestamp < CACHE_DURATION) {
            return data;
        }
    }
    return null;
};

// 设置缓存
const setCache = (data) => {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
        data,
        timestamp: Date.now()
    }));
};



// 获取天气数据
const getWeather = async (city) => {
    try {
        const url = `https://restapi.amap.com/v3/weather/weatherInfo?city=${city}&key=${GAODE_KEY}`;
        const response = await axios.get(url);
        if (response.data.status === '1' && response.data.lives?.length > 0) {
            const data = response.data.lives[0];
            weatherData.value = data;
            setCache(data);
        } else {
            throw new Error('获取天气数据失败');
        }
    } catch (err) {
        console.error('天气获取失败:', err);
        message.error('天气获取失败');
    }
};

// 获取城市信息
const getCity = async () => {
    try {
        const url = 'https://qifu-api.baidubce.com/ip/local/geo/v1/district';
        const response = await axios.get(url);
        if (response.data?.data?.adcode) {
            return response.data.data.adcode;
        }
        throw new Error('获取城市信息失败');
    } catch (err) {
        console.error('获取城市信息失败:', err);
        return '110101'; // 默认北京
    }
};

// 初始化
const initWeather = async () => {
    // 尝试从缓存获取
    const cache = getCache();
    if (cache) {
        weatherData.value = cache;
        return;
    }

    // 获取新数据
    const cityCode = await getCity();
    await getWeather(cityCode);
};

onMounted(() => {
    initWeather();
});
</script>

<style lang="less" scoped>
.weather_container {
    position: relative;

    .weather_icon {
        width: 30px;
        height: 30px;
        cursor: pointer;
        position: relative;

        img {
            width: 30px;
            height: 30px;
            object-fit: contain;
            transition: transform 0.3s;
        }

        &:hover img {
            border-radius: 3px;
            background-color: #45428f52;
        }
    }


    .slide-fade-enter-active,
    .slide-fade-leave-active {
        transition: all 0.2s  cubic-bezier(0.645, 0.045, 0.355, 1);
    }

    .slide-fade-enter-from,
    .slide-fade-leave-to {
        transform: scale(0);
        opacity: 0;
    }

    .weather_detail_popup {
        position: absolute;
        top: calc(100% + 10px);
        left: 50%;
        transform: translateX(-50%) scale(1);
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(8px);
        padding: 12px 16px;
        border-radius: 10px;
        color: #fff;
        min-width: 160px;
        z-index: 1000;

        // 添加小三角
        &::before {
            content: '';
            position: absolute;
            top: -6px;
            left: 50%;
            transform: translateX(-50%);
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-bottom: 6px solid rgba(0, 0, 0, 0.8);
        }

        .weather_info {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 4px;

            .temperature {
                font-size: 24px;
                font-weight: bold;
            }

            .weather_text {
                font-size: 14px;
            }
        }

        .weather_detail {
            font-size: 12px;
            display: flex;
            gap: 8px;
            margin-bottom: 2px;
        }

        .weather_update {
            font-size: 11px;
            opacity: 0.8;
            margin-top: 4px;
        }
    }
}
</style>