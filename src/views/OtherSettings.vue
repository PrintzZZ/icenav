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
                <div class="theme_switch_icon" :class="{'isDark':isDarkMode}">
                    <IconLight v-if="isDarkMode" />
                    <IconDark v-else />
                </div>
            </a-card>
            <a-card style="width: 100px;height: 100px;">
                <a-tooltip :title="`每行显示${cardNum}个卡片`" placement="bottom">
                    <div class="disPaly_title" @click="changeCardNum">
                        {{ cardNum }}
                    </div>
                </a-tooltip>
            </a-card>
        </div>
    </div>
</template>
<script setup>
import { reactive, ref, onMounted, watch, computed, watchEffect } from 'vue';
import { useSettingData } from '../store/SettingStore';
import { useLinkData } from '../store/LinkStore';
import { IconImage, IconLive, IconClose, IconLight, IconDark } from '../components/icons';
import { message } from 'ant-design-vue';
import { IndexDBCache } from '../utils/indexedDB';




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

// 背景类型defaultType用于初始化控制��
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
});
</script>
<style lang="less">
.other_settings {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;

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

    .background_box {}

    .title_card_box {}

    @media (max-width: 769px) {
        .setting_item.disPaly_box {
            width: 320px !important;
            display: flex;
            flex-direction: row;
        }
    }

    .disPaly_box {
        width: 100px;
        .theme_switch_icon.isDark:hover{
            color: #FBCD2C;
        }
        .theme_switch_icon:hover{
            color: #FBCD2C;
        }
        .theme_switch_icon {
            width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 30px;
            transition: color .5s;
        }

        .disPaly_title {
            width: 60px;
            height: 60px;
            padding: 5px;
            border-radius: 5px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            font-weight: 700;
            color: var(--semi-color-text-0);
            cursor: pointer;
            line-height: 60px;
            user-select: none;
            transition: all 0.3s ease;
            
            &:hover {
                background-color: var(--semi-color-fill-0);
                transform: scale(1.05);
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
            // width: 260px;
            height: 100px;
            // top: calc(20px + 30px + 10px);
            // left: 20px;
            z-index: 1;
            border-radius: 10px;
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
}
</style>