<template>
    <div class="other_settings">
        <a-card style="width: 300px;overflow: hidden;">
            <div class="other_settings_title">背景设置</div>
            <transition name="backgroundTypeFade" tag="div">
                <div class="show_item" v-if="backgroundType === '网页'">
                    <img src="/images/bgview1.png" alt="">
                </div>
                <div class="show_item" v-else-if="backgroundType === '图片'">
                    <a-upload-dragger :showUploadList="false" :customRequest="fileUpload" @change="ImgUploadChange"
                        v-if="upImgSrc == ''">
                        <IconImage style="font-size: 30px; color: #A5A5A5; " />
                        <p style="font-size: 12px; color:#A5A5A5;padding: 0 5px;">点击或拖拽文件到此处</p>
                    </a-upload-dragger>
                    <div class="show_item_img" v-else>
                        <IconClose class="close_icon" @click="upImgSrc = ''" />
                        <img :src="upImgSrc" alt="" style="width: 100%;object-fit: cover;">
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
import { reactive, ref, onMounted } from 'vue';
import { useSettingData } from '../store/SettingStore';
import { IconImage, IconLive, IconClose } from '../components/icons';
import { message } from 'ant-design-vue';
import { IndexDBCache } from '../utils/indexedDB'


const backgroundTypeList = reactive(['网页', '图片', '视频']);
const backgroundType = ref(backgroundTypeList[0]);
const upImgSrc = ref('');
const db = ref(null);


const backgroundTypeChange = (value) => {
    // 0:iframe 1:img 2:video
}

// 重写上传文件action
const fileUpload = async ({ file, onSuccess, onError }) => {
    try {
        if (!db.value) {
            throw new Error('数据库未初始化');
        }
        
        // 清除旧数据
        await db.value.clearDB();
        
        // 保存新图片
        await db.value.addData({ 
            imageName: file.name, 
            imageFile: file 
        });
        
        onSuccess();
    } catch (err) {
        console.error('文件上传失败:', err);
        message.error('图片保存失败');
        onError();
    }
};




// 初始化indexedDB
const initIndexDB = async () => {
    try {
        const indexDB = new IndexDBCache({
            dbName: "imageStore",
            cacheTableName: "imageCache",
            keyPath: "imageName",
            indexs: [{ name: 'imageFile', unique: true }]
        });
        await indexDB.initDB();
        db.value = indexDB;
        console.log('IndexDB 初始化成功');
    } catch (err) {
        console.error('IndexDB 初始化失败:', err);
        message.error('背景存储初始化失败');
    }
};

// 图片上传
const ImgUploadChange = (info) => {
    if (info.file.status === 'done') {
        upImgSrc.value = URL.createObjectURL(info.file.originFileObj);
        message.success('图片上传成功');
    } else if (info.file.status === 'error') {
        message.error('图片上传失败');
    }
}

// 视频上传
const VideoUploadChange = (info) => {
    console.log(info);
}

// 保存背景
const saveBackground = () => {
    try {
        let saveIndex = backgroundTypeList.indexOf(backgroundType.value);
        let storeIndex = useSettingData().otherSettings.backgroundType;
        
        if (saveIndex !== storeIndex) {
            if (saveIndex === 1 && !upImgSrc.value) {
                message.warning('请先上传图片');
                return;
            }
            
            if (saveIndex === 1) {
                useSettingData().updateOtherSettings({ 
                    backgroundType: saveIndex, 
                    backgroundImg: { url: upImgSrc.value } 
                });
            } else {
                useSettingData().updateOtherSettings({ backgroundType: saveIndex });
            }
            message.success('更换背景成功');
        } else {
            message.warning('背景类型未发生变化');
        }
    } catch (err) {
        console.error('保存背景失败:', err);
        message.error('保存背景失败');
    }
}

// 初始化indexedDB
onMounted(() => {
    initIndexDB();
})

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