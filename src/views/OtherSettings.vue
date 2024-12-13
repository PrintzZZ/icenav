<template>
    <div class="other_settings">
        <a-card style="width: 300px;overflow: hidden;">
            <div class="other_settings_title">背景设置</div>
            <transition name="backgroundTypeFade" tag="div">
                <div class="show_item" v-if="backgroundType === '网页'">
                    <img src="/images/bgview1.png" alt="">
                </div>
                <div class="show_item" v-else-if="backgroundType === '图片'">
                    <a-upload-dragger :showUploadList="false" @change="ImgUploadChange" v-if="upImgSrc == ''">
                        <IconImage style="font-size: 30px; color: #A5A5A5; " />
                        <p style="font-size: 12px; color:#A5A5A5;padding: 0 5px;">点击或拖拽文件到此处</p>
                    </a-upload-dragger>
                    <div class="show_item_img" v-else>
                        <IconClose class="close_icon" @click="upImgSrc = ''" />
                        <img :src="upImgSrc" alt="">
                    </div>
                </div>
                <div class="show_item" v-else="backgroundType === '视频'">
                    <a-upload-dragger :showUploadList="false" @change="VideoUploadChange">
                        <IconLive style="font-size: 30px; color: #A5A5A5; " />
                        <p style="font-size: 12px; color:#A5A5A5;padding: 0 5px;">点击或拖拽文件到此处</p>
                    </a-upload-dragger>
                </div>
            </transition>
            <div class="other_settings_bottom">
                <a-segmented v-model:value="backgroundType" :options="backgroundTypeList"
                    @change="backgroundTypeChange" />
                <a-button type="primary" @click="saveBackground" size="small">保存</a-button>
            </div>


        </a-card>
    </div>
</template>
<script setup>
import { reactive, ref } from 'vue';
import { useSettingData } from '../store/SettingStore';
import { IconImage, IconLive, IconClose } from '../components/icons';
import { message } from 'ant-design-vue';


const backgroundTypeList = reactive(['网页', '图片', '视频']);
const backgroundType = ref(backgroundTypeList[0]);
const upImgSrc = ref('');


const backgroundTypeChange = (value) => {
    // 0:iframe 1:img 2:video
}

const ImgUploadChange = (info) => {
    upImgSrc.value = URL.createObjectURL(info.file.originFileObj);
    console.log(upImgSrc.value);
}

const VideoUploadChange = (info) => {
    console.log(info);
}

const saveBackground = () => {
    let saveIndex = backgroundTypeList.indexOf(backgroundType.value);
    let storeIndex = useSettingData().otherSettings.backgroundType;
    let storeImg = useSettingData().otherSettings.backgroundImg;
    if (saveIndex !== storeIndex) {

        useSettingData().updateOtherSettings({ backgroundType: saveIndex });
        message.success('更换背景成功');
    } else {
        message.warning('背景类型未发生变化');
    }
}

</script>
<style lang="less">
.backgroundTypeFade-move,
.backgroundTypeFade-enter-active,
.backgroundTypeFade-leave-active {
    transition: all .5s cubic-bezier(0.55, 0, 0.1, 1);
}

.backgroundTypeFade-enter-from,
.backgroundTypeFade-leave-to {
    opacity: 0;
    transform: translateX(-100%);
}

.backgroundTypeFade-leave-active {
    position: absolute;
}


.other_settings_title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
}

.other_settings_bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
}




.show_item {

    width: 250px;
    height: 100px;
    object-fit: cover;
    border-radius: 10px;
    padding: 0;
    box-sizing: border-box;
    overflow: hidden;
    // position: relative;
    border: 1px dashed var(--semi-color-border);
    margin-bottom: 10px;

    .close_icon:hover {
        background-color: var(--semi-color-bg-1);
        opacity: 1;
    }

    .close_icon {
        position: absolute;
        top: 65px;
        right: 30px;
        cursor: pointer;
        background-color: var(--semi-color-bg-3);
        border-radius: 3px;
        color: var(--semi-color-text-0);
        opacity: 0.2;
        transition: all 0.3s;
    }
    .ant-upload {
        width: 250px;
        height: 100px;
        border: none;
    }
}

</style>