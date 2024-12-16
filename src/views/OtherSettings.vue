<template>
    <div class="other_settings">
        <div class="background_box setting_item">
            <a-card style="height: 210px;overflow: hidden;">
                <div class="other_settings_title">背景设置</div>
                <transition name="backgroundTypeFade" tag="div">
                    <div class="show_item" v-if="backgroundState.type === 0">
                        <img src="/images/bgview1.png" alt=""
                            style="width: 100%;object-fit: cover;border-radius: 10px;">
                    </div>
                    <div class="show_item" v-else-if="backgroundState.type === 1">
                        <a-upload-dragger :showUploadList="false" :customRequest="fileUpload" @change="ImgUploadChange"
                            v-if="backgroundState.imgSrc == ''">
                            <IconImage style="font-size: 30px; color: #A5A5A5; " />
                            <p style="font-size: 12px; color:#A5A5A5;padding: 0 5px;">点击或拖拽文件到此处</p>
                        </a-upload-dragger>
                        <div class="show_item_img" v-else>
                            <IconClose class="close_icon" @click="backgroundState.imgSrc = ''" />
                            <div class="show_item_img_mask"
                                :style="{ 'backdrop-filter': `blur(${backgroundState.maskBlur}px)`, 'background-color': `rgba(0, 0, 0, ${backgroundState.mask})` }">
                            </div>
                            <img :src="backgroundState.imgSrc" alt="" style="width: 100%;object-fit: cover;">
                        </div>
                    </div>
                </transition>
                <div class="other_settings_bottom">
                    <a-segmented v-model:value="defaultType" :options="backgroundState.typeList"
                        @change="backgroundTypeChange" />
                    <a-button type="primary" @click="saveBackground" size="small">保存</a-button>
                </div>
            </a-card>
            <a-card style="height: 100px;">
                <a-slider v-model:value="backgroundState.mask" :min="0" :max="1" :step="0.1""
                    :disabled="backgroundState.type !== 1 || backgroundState.imgSrc == ''" />
                <a-slider v-model:value="backgroundState.maskBlur" :min="0" :max="10" :step="1"
                    :disabled="backgroundState.type !== 1 || backgroundState.imgSrc == ''" />
            </a-card>
        </div>
        <div class="title_card_box setting_item">
            <a-card class="title_card" style="height: 100px;">
                <div class="other_settings_title">标题设置</div>
                <div class="title_card_bottom">
                    <a-input v-model:value="titleState.value" :placeholder="useSettingData().otherSettings.searchTitle"
                        :disabled="!titleState.show" style="width: 180px;" />
                    <a-switch v-model:checked="titleState.show" checked-children="显" un-checked-children="隐" />
                </div>
            </a-card>
            <a-card style="height: 100px;">
                <div class="other_settings_title">字体颜色</div>
                <div class="color_card">
                    <div class="color_item_box">
                        <div class="color_item dark" @click="titleState.color = '#000000'"></div>
                        <div class="color_item light" @click="titleState.color = '#ffffff'"></div>
                        <a-input v-model:value="titleState.color" :bordered="true" style="width: 100px;"
                            placeholder="#ffffff" size="small" />
                    </div>
                    <a-button type="primary" size="small" @click="saveColor">应用</a-button>
                </div>
            </a-card>
            <a-card style="height: 100px;">
                <div class="other_settings_title">搜索框颜色 <span style="font-size: 12px;color: #A5A5A5;">透明度:{{
                    searchState.opacity }}</span></div>
                <div class="color_card">
                    <a-slider v-model:value="searchState.opacity" :min="0" :max="1" :step="0.1" style="flex: 1;" />
                    <a-switch v-model:checked="searchState.isDark" checked-children="深" un-checked-children="浅" />
                </div>

            </a-card>
        </div>
        <div class="disPaly_box setting_item">
            <a-card style="width: 100px;height: 100px;cursor: pointer;" @click="toggleTheme">
                <a-tooltip :title="`切换主题`" placement="bottom">
                    <div class="theme_switch_icon easy_item" :class="{ 'isDark': isDarkMode }">
                        <IconLight v-if="isDarkMode" />
                        <IconDark v-else />
                    </div>
                </a-tooltip>
            </a-card>
            <a-card style="width: 100px;height: 100px;">
                <a-tooltip :title="`每行显示${cardNum}个卡片`" placement="bottom">
                    <div class="disPaly_title easy_item" @click="changeCardNum">
                        {{ cardNum }}
                    </div>
                </a-tooltip>
            </a-card>
            <a-card style="width: 100px;height: 100px;">
                <a-tooltip :title="`打赏作者`" placement="bottom">
                    <div class="donate easy_item">
                        <i>
                            <svg t="1734327317060" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" p-id="10132" width="1em" height="1em">
                                <path
                                    d="M669.9 960.2h-321c-37 0-68.1-28.9-70.9-65.7l-58.8-666.9v-0.9c0-30.7 25-55.7 55.7-55.7h469c30.7 0 55.7 25 55.7 55.7l-0.1 1.8-58.8 666.2c-2.7 36.7-33.9 65.5-70.8 65.5zM260.3 226L319 891.1c1.2 15.8 14.3 27.9 29.9 27.9h320.9c15.6 0 28.7-12.2 29.9-27.7L758.4 226c-0.4-7.7-6.8-13.9-14.6-13.9h-469c-7.7 0-14.1 6.2-14.5 13.9z"
                                    :fill="`${isDarkMode ? '#FFF' : '#55422D'}`" p-id="10133"></path>
                                <path
                                    d="M219.9 340.4l36.3 444.4c0.8 10.3 9.4 18.2 19.7 18.2h467c10.3 0 18.9-7.9 19.7-18.2l36.3-444.4c0.9-11.5-8.2-21.4-19.7-21.4H239.6c-11.6 0-20.7 9.8-19.7 21.4z"
                                    :fill="`${isDarkMode ? '#00835e' : '#006440'}`" p-id="10134"></path>
                                <path
                                    d="M740 176.1H285.1c-17.1 0-28.7-17.2-22.4-33.1l13.9-34.9c3.7-9.2 12.5-15.2 22.4-15.2h427.1c9.9 0 18.8 6 22.4 15.2l13.9 34.9c6.4 15.9-5.3 33.1-22.4 33.1z"
                                    :fill="`${isDarkMode ? '#FFF' : '#55422D'}`" p-id="10135"></path>
                                <path
                                    d="M787.6 226.7H231.2c-9.1 0-16.1-8.2-14.6-17.2l12-71.8c1.2-7.1 7.4-12.3 14.6-12.3h532.4c7.2 0 13.4 5.2 14.6 12.3l12 71.8c1.5 9-5.5 17.2-14.6 17.2zM669.6 93.8h63.9V66.7c0-1.4-1.1-2.5-2.5-2.5h-58.9c-1.4 0-2.5 1.1-2.5 2.5v27.1z"
                                    :fill="`${isDarkMode ? '#FFF' : '#55422D'}`" p-id="10136"></path>
                                <path
                                    d="M421.4 637.9c-6.1-0.1-11.9-3-15.5-7.9-25.8-33.9-13.3-93.2 30.4-136.9 44.2-44.2 104.3-56.5 138-29.5 2 1.6 1.5 4.8-1 5.6-8.2 2.8-24.9 11.5-47.9 39-27.8 33.3-20.2 57.7-60.1 103.7-19 22-33.7 26.1-43.9 26zM596.7 484c6.7 0 12.9 3.3 16.9 8.7 25.1 34 12.4 92.7-31 136.1-44.2 44.2-104.3 56.5-138 29.5-2-1.6-1.5-4.8 1-5.6 8.2-2.8 24.9-11.5 47.9-39 27.8-33.3 20.2-57.7 60.1-103.7 18.4-21.5 32.8-25.9 43.1-26z"
                                    fill="#FFFFFF" p-id="10137"></path>
                            </svg>
                        </i>
                    </div>
                </a-tooltip>
            </a-card>
        </div>
        <div class="setting_item ">
            <a-card>
                <p style="font-size: 12px;color: #A5A5A5;">截止: {{ new Date().toLocaleDateString() }}</p>
                <!-- 引擎数  网页数  收藏数 -->
                <a-tag color="blue">引擎数: {{ dataState.engineNum }}</a-tag>
                <a-tag color="blue">网页数: {{ dataState.pageNum }}</a-tag>
                <a-tag color="blue">收藏数: {{ dataState.likeNum }}</a-tag>
            </a-card>
        </div>
        <div class="setting_item export_box">
            <a-card style="width: 155px;height: 100px;">
                <a-tooltip :title="`导出所有数据`" placement="bottom">
                    <div class="export_btn" 
                         @click="exportData"
                         :class="{ 'disabled': isExporting }">
                        <IconExport />
                    </div>
                </a-tooltip>
            </a-card>
            <a-card style="width: 155px;height: 100px;">
                <a-tooltip :title="`恢复备份数据`" placement="bottom">
                    <a-upload 
                        :file-list="importFile" 
                        :before-upload="beforeUpload" 
                        :show-upload-list="false"
                        :disabled="isImporting">
                        <div class="export_btn" :class="{ 'disabled': isImporting }">
                            <IconImport />
                        </div>
                    </a-upload>
                </a-tooltip>
            </a-card>
        </div>
    </div>
</template>
<script setup>
import { reactive, ref, onMounted, watch, computed, watchEffect } from 'vue';
import { useSettingData } from '../store/SettingStore';
import { useLinkData } from '../store/LinkStore';
import { IconImage, IconLive, IconClose, IconLight, IconDark, IconSave, IconDatePicker, IconImport, IconExport } from '../components/icons';
import { message, Modal } from 'ant-design-vue';
import { IndexDBCache } from '../utils/indexedDB';
import LZString from 'lz-string';

const allData = ref()
const dataState = ref({
    engineNum: 0,
    pageNum: 0,
    likeNum: 0
})

const getAllData = () => {
    allData.value = {
        settingsData: useSettingData().otherSettings,
        hotData: useLinkData().HotList,
        searchData: useLinkData().searchMenu,
        menuData: useLinkData().menuList,
        likeData: useLinkData().LikeList
    }
    dataState.value.engineNum = allData.value.searchData.reduce(
        (total, item) => total + item.engines.length,
        0
    );
    dataState.value.pageNum = allData.value.menuData.reduce(
        (total, pageItem) => total + pageItem.child.reduce(
            (childTotal, item) => childTotal + item.item.length,
            0
        ),
        0
    );

    dataState.value.likeNum = allData.value.likeData.length

    // console.log(dataState.value);
}

// 导出相关状态
const isExporting = ref(false);

// 导出数据
const exportData = async () => {
    if (isExporting.value) {
        message.warning('正在处理上一个导出请求，请稍候...');
        return;
    }

    try {
        isExporting.value = true;
        message.loading('正在准备导出数据...', 0);

        await getAllData();
        
        const data = allData.value;
        if (!data) {
            throw new Error('数据为空');
        }

        // 压缩 JSON
        const jsonString = JSON.stringify(data);
        const compressed = LZString.compressToBase64(jsonString);
        
        // 创建 Blob
        const blob = new Blob([compressed], { 
            type: 'application/json' 
        });

        // 获取当前日期时间字符串
        const dateStr = new Date().toISOString().split('T')[0];
        const fileName = `ice_backup_${dateStr}.ice`;  // 使用自定义扩展名

        // 使用 URL.createObjectURL 创建下载链接
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        
        document.body.appendChild(a);
        a.click();
        
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        message.destroy();
        message.success('成功导出网页数据和设置');
    } catch (error) {
        message.error('导出失败：' + error.message);
    } finally {
        isExporting.value = false;
    }
};

// 导入文件相关
const importFile = ref([]);
const isImporting = ref(false);

// 数据校验函数
const validateImportData = (data) => {
    if (!data) return false;
    
    const requiredKeys = ['settingsData', 'hotData', 'searchData', 'menuData', 'likeData'];
    const hasAllKeys = requiredKeys.every(key => key in data);
    
    if (!hasAllKeys) {
        message.error('备份文件格式错误：缺少必要数据');
        return false;
    }

    // 验证各个数据的结构
    if (!Array.isArray(data.hotData) || !Array.isArray(data.searchData) || 
        !Array.isArray(data.menuData) || !Array.isArray(data.likeData)) {
        message.error('备份文件数据结构错误');
        return false;
    }

    return true;
};

// 读取json文件
const readJson = (file) => {
    if (!file.name.endsWith('.ice')) {
        message.error('请选择.ice格式的备份文件');
        return;
    }

    isImporting.value = true;
    const reader = new FileReader();
    
    reader.onload = () => {
        try {
            // 解压缩数据
            const decompressed = LZString.decompressFromBase64(reader.result);
            const data = JSON.parse(decompressed);
            
            if (validateImportData(data)) {
                allData.value = data;
                importData();
            }
        } catch (error) {
            message.error('文件解析失败：' + error.message);
        } finally {
            isImporting.value = false;
            importFile.value = [];
        }
    };

    reader.onerror = () => {
        message.error('文件读取失败');
        isImporting.value = false;
        importFile.value = [];
    };

    reader.readAsText(file);
};

// 导入数据
const importData = () => {
    try {
        // 使用 Modal 确认导入
        Modal.confirm({
            title: '确认导入',
            content: '导入新数据将覆盖现有配置，是否继续？',
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
                // 显示加载状态
                message.loading('正在导入数据...', 0);
                
                // 使用 Promise.all 并行更新数据
                await Promise.all([
                    useLinkData().updateHotList(allData.value.hotData),
                    useLinkData().updateSearchMenu(allData.value.searchData),
                    useLinkData().updateMenuList(allData.value.menuData),
                    useLinkData().updateLikeList(allData.value.likeData),
                    useSettingData().updateOtherSettings(allData.value.settingsData)
                ]);

                // 关闭加载提示
                message.destroy();
                message.success('数据导入成功，3秒后刷新页面');
                
                // 延迟刷新页面
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            }
        });
    } catch (error) {
        message.error('导入失败：' + error.message);
    }
};

// 文件上传前的处理
const beforeUpload = (file) => {
    if (isImporting.value) {
        message.warning('正在处理上一个导入请求，请稍候...');
        return false;
    }
    
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
        message.error('备份文件大小不能超过 5MB');
        return false;
    }

    importFile.value = [file];
    readJson(file);
    return false;
};

const settings = useSettingData().otherSettings;
// 背景设置相关状态
const backgroundState = reactive({
    typeList: ['动态', '图片'],
    type: settings.backgroundType || 0,
    imgSrc: settings.backgroundImgUrl || '',
    mask: settings.mask == 0 ? 0 : settings.mask || 0.5,
    maskBlur: settings.maskBlur == 0 ? 0 : settings.maskBlur || 2
});


// 标题设置相关状态
const titleState = reactive({
    value: settings.searchTitle || '',
    show: settings.showTitle || true,
    color: settings.fontColor || '#FFFFFF'
});

// 搜索框设置相关状态
const searchState = reactive({
    isDark: settings.searchInputColor || true,
    opacity: settings.searchInputOpacity || 0.6
});

const saveColor = () => {
    useSettingData().updateOtherSettings({
        fontColor: titleState.color
    });
};

// 背景类型defaultType用于初始化控制
const defaultType = ref(backgroundState.typeList[backgroundState.type]);
const backgroundTypeChange = (value) => {
    backgroundState.type = value === '图片' ? 1 : 0;
};

// 重写上传文件action
const fileUpload = async ({ file, onSuccess, onError }) => {
    const data = await SaveImage(file)
    if (data == false) { onError(); return; }
    onSuccess();
};


// 图片上传
const ImgUploadChange = (info) => {
    //  https://blog.csdn.net/weiCong_Ling/article/details/131437456
    if (info.file.status === 'done') {
        // console.log('上传成功', info.file);
        backgroundState.imgSrc = URL.createObjectURL(info.file.originFileObj);
    } else if (info.file.status === 'error') {
        // console.error('上传失败');
    }
}

// 优化watch函数，使用组合式函数
const setupWatchers = () => {
    watch(() => titleState.value, (newVal) => {
        if (newVal.length > 9) {
            message.error('标题最多9个字');
            return;
        }
        useSettingData().updateOtherSettings({
            showTitle: titleState.show
        });
    });

    watch(() => titleState.show, (newVal) => {
        useSettingData().updateOtherSettings({
            showTitle: newVal
        });
    });

    watch([
        () => searchState.opacity,
        () => searchState.isDark
    ], ([newOpacity, newIsDark]) => {
        useSettingData().updateOtherSettings({
            searchInputOpacity: newOpacity,
            searchInputColor: newIsDark
        });
    });
};

// 图片处理相关逻辑优化
const imageDB = new IndexDBCache({
    dbName: "imageStore",
    cacheTableName: "imageCache",
    keyPath: "imageName",
    indexs: [{ name: 'imageFile', unique: true }]
});

const SaveImage = async (file) => {
    imageDB.clearDB()
    await imageDB.addData({
        imageName: file.name,
        imageFile: file
    }).then((res) => {
        // console.log('保存图片成功', res);
        return true;
    }).catch((err) => {
        // console.error('保存图片失败', err);
        return false;
    })

};

// 背景保存逻辑优化
const saveBackground = () => {
    const saveIndex = backgroundState.type;

    if (saveIndex === 1 && !backgroundState.imgSrc) {
        message.error('请先上传图片');
        return;
    }
    const settings = {
        backgroundType: saveIndex,
        backgroundImgUrl: saveIndex === 0 ? '' : backgroundState.imgSrc,
        ...(saveIndex === 1 && {
            mask: backgroundState.mask,
            maskBlur: backgroundState.maskBlur
        })
    };
    useSettingData().updateOtherSettings(settings);
    message.success(`更换${saveIndex === 0 ? '动态' : '图片'}背景成功`);
};

// 切换主题
const isDarkMode = ref(false)
const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
    useSettingData().updateOtherSettings({ defaultTheme: isDarkMode.value ? 'dark' : 'light' })
    document.documentElement.setAttribute('data-theme', isDarkMode.value ? 'dark' : 'light')
    //切换背景
    useLinkData().updatebackground(isDarkMode.value ? 'dark' : 'light');
}
// 自动监听并响应变化
watchEffect(() => {
    // console.log('Other settings updated:', useSettingData().otherSettings.defaultTheme); 
    isDarkMode.value = useSettingData().otherSettings.defaultTheme === 'dark' ? true : false
});

// 每行卡片数
const cardNum = ref(useSettingData().otherSettings.cardNum || 5);
const changeCardNum = () => {
    cardNum.value = cardNum.value + 1;
    if (cardNum.value > 7) {
        cardNum.value = 1;
    }
    useSettingData().updateOtherSettings({
        cardNum: cardNum.value
    });
}

// 初始化
onMounted(() => {
    imageDB.initDB();
    setupWatchers();
    getAllData();
});
</script>
<style lang="less">
.other_settings {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;

    .ant-slider {
        &.hover {
            .ant-slider-track {
                background-color: var(--semi-color-primary-hover);
            }
        }

        .ant-slider-track {
            background-color: var(--semi-color-primary);
        }
    }

    .ant-card {
        width: 320px;

        .ant-card-body {
            padding: 20px;
        }
    }

    .setting_item {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        flex-direction: column;
        width: 320px;
    }

    .export_box {
        flex-direction: row;

        .ant-card {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .export_btn {
            width: 100px;
            height: 60px;
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 30px;
            color: var(--semi-color-text-0);
            transition: all 0.3s;
            cursor: pointer;

            &:hover {
                background-color: var(--semi-color-fill-0);
                transform: scale(1.15);
            }
        }
    }

    @media (max-width: 769px) {
        .setting_item.disPaly_box {
            width: 320px !important;
            display: flex;
            flex-direction: row;
        }
    }

    .disPaly_box {
        width: 100px;

        .easy_item {
            width: 60px;
            height: 60px;
            padding: 5px;
            border-radius: 5px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            transition: all 0.3s ease;
            cursor: pointer;
            user-select: none;
            color: var(--semi-color-text-0);
            font-size: 40px;
            line-height: 60px;
        }

        .theme_switch_icon {
            font-size: 30px;
            transition: color .5s;

            &:hover {
                color: #FBCD2C;
                background-color: var(--semi-color-fill-0);
                transform: scale(1.05);
            }

            &.isDark:hover {
                color: #FBCD2C;
            }
        }

        .disPaly_title {
            &:hover {
                background-color: var(--semi-color-fill-0);
                transform: scale(1.05);
            }
        }

        .donate {
            &:hover {
                animation: flipInY 1s ease;
                animation-delay: 0.3s;
                background-color: var(--semi-color-fill-0);
                backface-visibility: visible !important;
            }
        }

        @keyframes flipInY {
            0% {
                transform: perspective(400px) rotateY(90deg);
                animation-timing-function: ease-in;
                opacity: 0;
            }

            40% {
                transform: perspective(400px) rotateY(-20deg);
                animation-timing-function: ease-in;
            }

            60% {
                transform: perspective(400px) rotateY(10deg);
                opacity: 1;
            }

            80% {
                transform: perspective(400px) rotateY(-5deg);
            }

            100% {
                transform: perspective(400px);
            }
        }
    }

    .title_card {
        overflow: hidden;
        position: relative;

        .title_card_bottom {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-direction: row;
        }
    }

    .color_card {
        display: flex;
        gap: 10px;
        flex-direction: row;
        flex-wrap: nowrap;
        align-content: center;
        align-items: center;
        justify-content: space-between;

        .color_item_box {
            display: flex;
            gap: 10px;
            flex-direction: row;
            flex-wrap: nowrap;
            align-content: center;
            align-items: center;
        }

        .color_item {
            width: 20px;
            height: 20px;
            border-radius: 3px;
            cursor: pointer;
            border: 1px solid var(--semi-color-border);
        }

        .color_item.light {
            background-color: #fff;
        }

        .color_item.dark {
            background-color: #000;
        }

    }



    .backgroundTypeFade-move,
    .backgroundTypeFade-enter-active,
    .backgroundTypeFade-leave-active {
        transition: all .50s cubic-bezier(0.55, 0, 0.1, 1);

        .close_icon {
            display: none;
        }

        .show_item_img_mask {
            opacity: 0;
        }
    }

    .backgroundTypeFade-enter-from,
    .backgroundTypeFade-leave-to {
        opacity: 0;
        transform: translateX(-100%);

        .close_icon {
            display: none;
        }


        .show_item_img_mask {
            display: none;
        }
    }

    .backgroundTypeFade-leave-active {
        position: absolute;

    }


    .other_settings_title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 5px;
        height: 25px;
    }

    .other_settings_bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        align-content: center;
        flex-direction: row;
        margin-top: 10px;
    }




    .show_item {

        width: 100%;
        height: 100px;
        object-fit: cover;
        border-radius: 10px;
        padding: 0;
        box-sizing: border-box;
        overflow: hidden;
        // position: relative;
        border: 1px dashed var(--semi-color-border);

        img {
            max-width: 276px;
        }

        .show_item_img_mask {
            position: absolute;
            width: 276px;
            height: 100px;
            // top: calc(20px + 30px + 10px);
            // left: 20px;
            z-index: 1;
            border-radius: 5px;
            transition: opacity .5s;
        }

        .close_icon:hover {
            background-color: var(--semi-color-bg-1);
            opacity: 1;
        }

        .close_icon {
            position: absolute;
            top: calc(24px + 30px + 10px + 5px);
            right: calc(24px + 5px);
            cursor: pointer;
            background-color: var(--semi-color-bg-3);
            border-radius: 3px;
            color: var(--semi-color-text-0);
            opacity: 0.2;
            transition: all 0.3s;
            z-index: 2;
        }

        .ant-upload {
            width: 276px;
            height: 100px;
            border: none;
        }
    }

    .export_btn {
        &.disabled {
            opacity: 0.5;
            cursor: not-allowed;
            
            &:hover {
                transform: none !important;
            }
        }

        // 添加加载动画
        &.disabled .icon {
            animation: rotating 2s linear infinite;
        }

        @keyframes rotating {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }
    }
}
</style>