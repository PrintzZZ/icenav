<template>
    <div class="other_settings">
        <a-card style="width: 300px;overflow: hidden;">
            <div class="other_settings_title">背景设置</div>
            <transition-group name="backgroundTypeFade" class="background_type_show" tag="div">
                <img class="show_item" v-if="backgroundType === '网页'" src="/images/bgview1.png" alt="">
                <div class="show_item" v-else-if="backgroundType === '图片'">
                    <a-upload-dragger :showUploadList="false" @change="ImgUploadChange">
                        <IconImage style="font-size: 30px; color: #A5A5A5; " />
                        <p style="font-size: 12px; color:#A5A5A5;padding: 0 5px;">点击或拖拽文件到此处</p>
                    </a-upload-dragger>
                </div>
                <div class="show_item" v-else="backgroundType === '视频'">
                    <img :src="upImgSrc"  alt="" v-if="upImgSrc">
                    <a-upload-dragger :showUploadList="false" @change="VideoUploadChange">
                        <IconLive style="font-size: 30px; color: #A5A5A5; " />
                        <p style="font-size: 12px; color:#A5A5A5;padding: 0 5px;">点击或拖拽文件到此处</p>
                    </a-upload-dragger>

                </div>
            </transition-group>
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
import { IconImage, IconLive } from '../components/icons';
import { message } from 'ant-design-vue';


const backgroundTypeList = reactive(['网页', '图片', '视频']);
const backgroundType = ref(backgroundTypeList[0]);
const upImgSrc = ref('');


const backgroundTypeChange = (value) => {
    // 0:iframe 1:img 2:video
}

const ImgUploadChange = (info) => {
    upImgSrc.value = URL.createObjectURL(info.file.originFileObj);
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

.background_type_show {
    margin-bottom: 10px;
    background-color: var(--semi-color-bg-0);

    .show_item {
        width: 250px;
        height: 100px;
        object-fit: cover;
        border: 1px dashed var(--semi-color-border);
        border-radius: 10px;
        padding: 0;
        box-sizing: border-box;

        .ant-upload {
            border: none;
        }
    }
}
</style>