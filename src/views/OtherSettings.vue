<template>
    <div class="other_settings">
        <a-card style="width: 300px;overflow: hidden;">
            <div class="other_settings_title">背景设置</div>
            <transition name="backgroundTypeFade" tag="div">
                <div class="show_item" v-if="backgroundType === '网页'">
                    <img src="/images/bgview1.png" alt="">
                </div>
                <div class="show_item" v-else-if="backgroundType === '图片'">
                    <a-upload-dragger :showUploadList="false" :customRequest="fileUpload" @change="ImgUploadChange" v-if="upImgSrc == ''">
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
import { IndexDBCache } from '../utils/indexedDB'


const backgroundTypeList = reactive(['网页', '图片', '视频']);
const backgroundType = ref(backgroundTypeList[0]);
const upImgSrc = ref('');


const backgroundTypeChange = (value) => {
    // 0:iframe 1:img 2:video
}

// 上传文件
const fileUpload = async ({ file, onSuccess, onError }) => {
    clearIndexDB();
    const data = await ChangeVal(file)
    if (data.length === 0) { onError(); return; }
    onSuccess();
};

// 初始化indexedDB
const params = {
	dbName: "test",
	cacheTableName: "imageCache",
	keyPath: "imageName",
	indexs: [
		{name: 'imageFile', unique: true}
	]
}
let imageDB = new IndexDBCache(params)
const initIndexDB = () => {
	imageDB.initDB().then(res => {
		if (res.type == 'upgradeneeded') {
			console.log('indexDB 数据库创建或更新成功!')
		} else {
			console.log('indexDB 数据库初始化成功!')
		}
	}).catch((err) => {
		console.log('indexDB 数据库初始化失败! ', err)
	})
}
const ChangeVal = async (file) => {
    initIndexDB();
    setTimeout(() => {
        const data = { imageName: file.name,  imageFile: file }
        console.log(data);
        imageDB.addData(data).then((res) => {
            console.log('写入 indexDB 数据库成功', res)
        }).catch((err) => {
            console.log('写入 indexDB 数据库失败==>', err)
        })
    }, 1000)
    return ['写入 indexDB 数据库成功']
}

const ImgUploadChange = async (info) => {
    // 将图片保存到indexedDB
    // 根据项目实际需求，设置对应数据库名、表名和数据库主键（主键需要为添加对象内的key，否则新增和获取会失败）
    //  https://blog.csdn.net/weiCong_Ling/article/details/131437456
    if (info.file.status === 'done') {
        console.log('上传成功');

    } else if (info.file.status === 'error') {
        console.error('上传失败');
    }
}

const clearIndexDB = () => {
	imageDB.clearDB()
}


const VideoUploadChange = (info) => {
    console.log(info);
}

const saveBackground = () => {
    let saveIndex = backgroundTypeList.indexOf(backgroundType.value);
    let storeIndex = useSettingData().otherSettings.backgroundType;
    let storeImg = useSettingData().otherSettings.backgroundImg;
    if (saveIndex !== storeIndex) {
        if (saveIndex === 1) {
            useSettingData().updateOtherSettings({ backgroundType: saveIndex, backgroundImg: { url: upImgSrc.value } });
        } else {
            useSettingData().updateOtherSettings({ backgroundType: saveIndex });
        }
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