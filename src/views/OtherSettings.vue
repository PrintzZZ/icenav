<template>
    <div class="other_settings">
        <!-- 背景设置 -->
        <div class="background_box setting_item">
            <a-card style="height: 320px;overflow: hidden;">
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

                        <div class="show_item_img" v-else
                            :style="{ 'background-image': `url(${backgroundState.imgSrc})`, 'background-position': `center ${backgroundState.position}%` }">
                            <IconClose class="close_icon" @click="backgroundState.imgSrc = ''" />
                            <div class="show_item_img_mask"
                                :style="{ 'backdrop-filter': `blur(${backgroundState.maskBlur}px)`, 'background-color': `rgba(0, 0, 0, ${backgroundState.mask})` }">
                            </div>
                        </div>
                    </div>
                </transition>
                <div class="other_settings_bottom">
                    <a-segmented v-model:value="defaultType" :options="backgroundState.typeList"
                        @change="backgroundTypeChange" />
                    <a-button type="primary" @click="saveBackground" size="small">保存</a-button>
                </div>
                <div class="other_settings_title">图片位置<span style="font-size: 12px;color: #a5a5a5;"> 不支持动态背景</span>
                </div>
                <div class="background_position">
                    <div class="background_item">
                        <span class="desc">上下位置</span>
                        <a-slider class="slider" v-model:value="backgroundState.position" :min="0" :max="100" :step="1""
                            :disabled="backgroundState.type !== 1 || backgroundState.imgSrc == ''" />
                    </div>
                    <div class=" background_item">
                            <div class="background_item_slider">
                                <span class="desc">遮罩</span>
                                <a-slider class="slider" v-model:value="backgroundState.mask" :min="0" :max="1"
                                    :step="0.1""
                            :disabled="backgroundState.type !== 1 || backgroundState.imgSrc == ''" /></div>
                            <div class=" background_item_slider">
                                    <span class="desc">模糊</span>
                                    <a-slider class="slider" v-model:value="backgroundState.maskBlur" :min="0" :max="10"
                                        :step="1"
                                        :disabled="backgroundState.type !== 1 || backgroundState.imgSrc == ''" />
                            </div>
                    </div>
                </div>
            </a-card>
        </div>
        <div class="title_card_box setting_item">
            <a-card class="title_card" style="height: 100px;">
                <div class="other_settings_title">标题设置</div>
                <div class="title_card_bottom">
                    <a-input v-model:value="titleState.value" :placeholder="settings.searchTitle"
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
                    <div class="theme_switch_icon easy_item" :class="{ 'isDark': settings.defaultTheme === 'dark' }">
                        <component :is="settings.defaultTheme === 'dark' ? IconLight : IconDark" />
                    </div>
                </a-tooltip>
            </a-card>
            <a-card style="width: 100px;height: 100px;">
                <a-tooltip :title="`每行显示${settings.cardNum}个卡片`" placement="bottom">
                    <div class="disPaly_title easy_item" @click="changeCardNum">
                        {{ settings.cardNum }}
                    </div>
                </a-tooltip>
            </a-card>
            <a-card style="width: 100px;height: 100px;">
                <a-tooltip :title="`打赏作者`" placement="bottom">
                    <div class="donate easy_item" @click="showDonateModel = true">
                        <i class="bounce-icon">
                            <component :is="settings.defaultTheme === 'dark' ? IconCoffeeDark : IconCoffeeLight" />
                        </i>
                    </div>
                </a-tooltip>
            </a-card>

        </div>
        <div class="setting_item ">
            <a-card style="width: 320px;height: 100px;">
                <p style="font-size: 12px;color: #A5A5A5;">截止: {{ new Date().toLocaleDateString() }}</p>
                <!-- 引擎数  网页数  收藏数 -->
                <a-tag color="blue">引擎数: {{ dataState.engineNum }}</a-tag>
                <a-tag color="blue">网页数: {{ dataState.pageNum }}</a-tag>
                <a-tag color="blue">收藏数: {{ dataState.likeNum }}</a-tag>
            </a-card>
        </div>
        <div class="setting_item export_box">
            <a-card style="width: 100px;height: 100px;">
                <a-tooltip :title="`导出所有数据`" placement="bottom">
                    <div class="export_btn" @click="exportData" :class="{ 'disabled': isExporting }">
                        <IconExport />
                    </div>
                </a-tooltip>
            </a-card>
            <a-card style="width: 100px;height: 100px;">
                <a-tooltip :title="`恢复备份数据`" placement="bottom">
                    <a-upload :file-list="importFile" :before-upload="beforeUpload" :show-upload-list="false"
                        :disabled="isImporting">
                        <div class="export_btn" :class="{ 'disabled': isImporting }">
                            <IconImport />
                        </div>
                    </a-upload>
                </a-tooltip>
            </a-card>
            <a-card style="width: 100px;height: 100px;">
                <a-tooltip :title="`重置所有数据`" placement="bottom">
                    <div class="export_btn" @click="resetData" :class="{ 'disabled': isResetting }">
                        <IconReset />
                    </div>
                </a-tooltip>
            </a-card>
        </div>

        <div class="setting_item update_box">
            <a-card style="width: 100px;height: 100px;">
                <a-tooltip :title="`检查更新`" placement="bottom">
                    <ComUpdate />
                </a-tooltip>
            </a-card>
        </div>


        <div class="setting_item get_gold_box">
            <a-card style="width: 100px;height: 100px;">
                <a-tooltip :title="`${settings.showGetGold ? '关闭今日进度' : '开启今日进度'}`" placement="bottom">
                    <i class="icon_box" @click="closeGetGold"
                        :style="{ 'filter': `blur(${settings.showGetGold ? '0' : '5'}px)` }">
                        <svg class="icon" style="vertical-align: middle;fill: currentColor;overflow: hidden;"
                            viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9890"
                            width="1em" height="1em">
                            <path
                                d="M631.466667 375.466667l-19.2-32c32-19.2 93.866667-96 102.4-140.8 2.133333-10.666667 2.133333-27.733333-6.4-38.4-8.533333-8.533333-25.6-12.8-44.8-8.533334-17.066667 2.133333-23.466667 10.666667-34.133334 21.333334-6.4 6.4-12.8 14.933333-21.333333 19.2-10.666667 6.4-23.466667 4.266667-38.4-2.133334-10.666667-4.266667-17.066667-12.8-23.466667-21.333333-10.666667-12.8-19.2-23.466667-44.8-23.466667-10.666667 0-19.2 8.533333-32 21.333334-14.933333 17.066667-36.266667 38.4-70.4 29.866666-8.533333-2.133333-17.066667-6.4-25.6-8.533333-12.8-6.4-27.733333-10.666667-40.533333-12.8-10.666667 0-14.933333 2.133333-19.2 12.8-4.266667 10.666667-4.266667 25.6 4.266667 42.666667 8.533333 14.933333 21.333333 32 38.4 49.066666 32 32 68.266667 53.333333 68.266666 53.333334l-19.2 34.133333c-2.133333 0-40.533333-25.6-74.666666-59.733333-21.333333-21.333333-36.266667-40.533333-46.933334-59.733334-12.8-25.6-14.933333-51.2-4.266666-72.533333 10.666667-23.466667 29.866667-34.133333 53.333333-34.133333 17.066667 0 36.266667 8.533333 53.333333 14.933333 8.533333 2.133333 14.933333 6.4 19.2 6.4 10.666667 2.133333 19.2-4.266667 34.133334-19.2 14.933333-14.933333 32-34.133333 57.6-34.133333 44.8 0 61.866667 21.333333 74.666666 36.266666 4.266667 6.4 8.533333 10.666667 10.666667 10.666667 2.133333 2.133333 6.4 2.133333 6.4 2.133333l10.666667-10.666666c10.666667-12.8 25.6-29.866667 55.466666-34.133334 32-4.266667 59.733333 2.133333 76.8 21.333334 17.066667 17.066667 21.333333 40.533333 17.066667 70.4-10.666667 57.6-78.933333 142.933333-117.333333 166.4z"
                                fill="#FFB600" p-id="9891"></path>
                            <path
                                d="M497.066667 334.933333c-40.533333 0-81.066667 8.533333-117.333334 27.733334-34.133333 17.066667-66.133333 42.666667-96 76.8-53.333333 61.866667-93.866667 147.2-113.066666 241.066666-10.666667 53.333333-2.133333 96 23.466666 130.133334 25.6 29.866667 66.133333 53.333333 123.733334 68.266666 49.066667 12.8 108.8 19.2 179.2 19.2 70.4 0 130.133333-6.4 179.2-19.2 57.6-14.933333 100.266667-36.266667 125.866666-68.266666 27.733333-34.133333 38.4-76.8 27.733334-130.133334-17.066667-91.733333-55.466667-177.066667-113.066667-238.933333-57.6-70.4-134.4-106.666667-219.733333-106.666667z"
                                fill="#FFB600" p-id="9892"></path>
                            <path
                                d="M503.466667 913.066667c-155.733333 0-260.266667-32-311.466667-93.866667-32-38.4-42.666667-89.6-29.866667-151.466667 19.2-91.733333 57.6-177.066667 113.066667-238.933333 61.866667-72.533333 140.8-108.8 224-108.8 89.6 0 170.666667 38.4 236.8 108.8 57.6 64 98.133333 149.333333 113.066667 241.066667 10.666667 61.866667 0 113.066667-34.133334 151.466666-53.333333 59.733333-157.866667 91.733333-311.466666 91.733334z m-4.266667-556.8c-38.4 0-74.666667 8.533333-108.8 25.6-32 17.066667-61.866667 40.533333-87.466667 70.4-49.066667 57.6-87.466667 136.533333-104.533333 221.866666-10.666667 51.2-2.133333 89.6 23.466667 121.6 23.466667 27.733333 61.866667 49.066667 115.2 64 44.8 10.666667 102.4 17.066667 166.4 17.066667s121.6-6.4 166.4-17.066667c53.333333-12.8 91.733333-34.133333 115.2-61.866666 25.6-32 34.133333-70.4 25.6-121.6-14.933333-85.333333-51.2-164.266667-104.533334-221.866667-55.466667-66.133333-128-98.133333-206.933333-98.133333z"
                                fill="#FFB600" p-id="9893"></path>
                            <path
                                d="M488.533333 761.6V704h-72.533333v-23.466667h72.533333v-25.6h-72.533333v-25.6h59.733333L405.333333 503.466667h36.266667l51.2 91.733333c6.4 10.666667 10.666667 19.2 12.8 27.733333 2.133333-6.4 8.533333-14.933333 14.933333-27.733333l49.066667-89.6h38.4L533.333333 627.2h59.733334v25.6h-72.533334v25.6h72.533334V704h-72.533334v57.6h-32z"
                                fill="#F9F9F9" p-id="9894"></path>
                            <path
                                d="M392.533333 352l-102.4-110.933333V196.266667l23.466667-29.866667h44.8l23.466667 14.933333 10.666666 2.133334h14.933334l57.6-27.733334 32-23.466666 74.666666 46.933333 19.2-4.266667 42.666667-23.466666 25.6-12.8 40.533333 4.266666 14.933334 17.066667 8.533333 23.466667v34.133333l-14.933333 40.533333L661.333333 320l-36.266666 32z"
                                fill="#FFB600" p-id="9895"></path>
                            <path
                                d="M480 341.333333c-6.4 0-12.8-4.266667-17.066667-10.666666 0 0-6.4-12.8-10.666666-27.733334-10.666667-27.733333-10.666667-38.4-10.666667-44.8 0-10.666667 10.666667-17.066667 19.2-17.066666 10.666667 0 17.066667 10.666667 17.066667 19.2 0 6.4 8.533333 32 19.2 55.466666 4.266667 8.533333 0 19.2-8.533334 23.466667-4.266667 2.133333-6.4 2.133333-8.533333 2.133333z m44.8 12.8c-4.266667 0-10.666667-2.133333-12.8-6.4-6.4-8.533333-6.4-19.2 2.133333-25.6 0 0 6.4-8.533333 17.066667-46.933333 6.4-21.333333 10.666667-40.533333 10.666667-40.533333 2.133333-10.666667 12.8-17.066667 21.333333-14.933334 10.666667 2.133333 17.066667 12.8 14.933333 21.333334 0 0-4.266667 21.333333-10.666666 44.8-12.8 44.8-21.333333 55.466667-27.733334 61.866666-6.4 4.266667-10.666667 6.4-14.933333 6.4z"
                                fill="#FFFEFD" p-id="9896"></path>
                        </svg>
                    </i>
                </a-tooltip>
            </a-card>
            <a-card style="width: 100px;height: 100px;">
                <a-tooltip :title="`当前默认${settings.collapseSidebar ? '收起' : '展开'}侧边栏`" placement="bottom">
                    <span class="collapse_box" @click="collapseSidebar">
                        <component :is="settings.collapseSidebar ? IconSidebar : IconKanban"
                            style="font-size: 0.8em;" />
                    </span>
                </a-tooltip>
            </a-card>
            <a-card style="width: 100px;height: 100px;">
                <a-tooltip :title="`Dock栏已${settings.dockShow ? '显示' : '隐藏'}`" placement="bottom">
                    <span class="collapse_box" @click="dockShow">
                        <component :is="settings.dockShow ? IconExpand : IconShrink" style="font-size: 0.8em;" />
                    </span>
                </a-tooltip>
            </a-card>
            <a-card style="width: 100px;height: 100px;">
                <a-tooltip :title="`当前首页为${settings.backgroundFocus ? '信息' : '简洁'}`" placement="bottom">
                    <span class="collapse_box" @click="backgroundFocusChange">
                        <component :is="settings.backgroundFocus ? IconMinimize : IconMaximize"
                            style="font-size: 0.8em;" />
                    </span>
                </a-tooltip>
            </a-card>
            <a-card style="width: 100px;height: 100px;">
                <a-tooltip :title="`${settings.todoListShow ? '显示' : '隐藏'}todo列表`" placement="bottom">
                    <span class="collapse_box" @click="todoListShow" style="font-size: 30px;">
                        <component :is="settings.todoListShow ? IconList : IconCheckList" />
                    </span>
                </a-tooltip>
            </a-card>
        </div>


        <a-modal v-model:open="showDonateModel" title="✨️感谢你赋予我前进的力量！" footer destroyOnClose>
            <div class="pay-group">
                <div class="pay-item">
                    <a-image :width="150" src="/images/alipay.png" alt="支付宝" />
                    <span class="pay-item-text">支付宝扫一扫</span>
                </div>
                <div class="pay-item">
                    <a-image :width="150" src="/images/wechat.png" alt="微信" />
                    <span class="pay-item-text">微信扫一扫</span>
                </div>
            </div>
        </a-modal>
    </div>
</template>
<script setup>
import { reactive, ref, onMounted, watch, computed, watchEffect } from 'vue';
import { useSettingData } from '../store/SettingStore';
import { useLinkData } from '../store/LinkStore';
import { IconImage, IconLive, IconLight, IconDark, IconKanban, IconImport, IconExport, IconReset, IconSidebar } from '../components/icons';
import { IconShrink, IconExpand, IconMaximize, IconMinimize, IconSave, IconClose, IconCheckList, IconList, IconCoffeeDark, IconCoffeeLight } from '../components/unIcons';
import { message, Modal } from 'ant-design-vue';
import { IndexDBCache } from '../utils/indexedDB';
import ComUpdate from './ComUpdate.vue';
import LZString from 'lz-string';


const showDonateModel = ref(false)
const settings = useSettingData().otherSettings;

// 首页高度
const backgroundFocusChange = () => {
    settings.backgroundFocus = !settings.backgroundFocus
    message.success(`首页调整为${settings.backgroundFocus ? '信息' : '简洁'}`);
}

// todo列表
const todoListShow = () => {
    settings.todoListShow = !settings.todoListShow
    message.success(`todo列表已${settings.todoListShow ? '隐藏' : '显示'}`);
}

// dock栏
const dockShow = () => {
    settings.dockShow = !settings.dockShow
    message.success(`dock栏已${settings.dockShow ? '显示' : '隐藏'}`);
}

// 打赏
const closeGetGold = () => {
    settings.showGetGold = !settings.showGetGold
    message.success(`已${settings.showGetGold ? '开启' : '关闭'}今日进度`);
}

// 侧边栏
const collapseSidebar = () => {
    settings.collapseSidebar = !settings.collapseSidebar
    message.success(`调整为默认${settings.collapseSidebar ? '收起' : '展开'}侧边栏`);
}

// 每行卡片数
const changeCardNum = () => {
    settings.cardNum = settings.cardNum + 1;
    if (settings.cardNum > 8) {
        settings.cardNum = 1;
    }
}

// 切换主题
const toggleTheme = () => {
    settings.defaultTheme = settings.defaultTheme === 'dark' ? 'light' : 'dark'
    useLinkData().updateBackground(settings.defaultTheme === 'dark' ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', settings.defaultTheme)
}

// 数据统计
const dataState = ref({
    engineNum: 0,
    pageNum: 0,
    likeNum: 0
})
const allData = ref()
const getAllData = () => {
    allData.value = {
        settingsData: settings,
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
const isResetting = ref(false);

// 重置数据
const resetData = () => {
    try {
        // 使用 Modal 确认导入
        Modal.confirm({
            title: '确认重置',
            content: '将恢复所有默认数据（包括网页数据），建议备份后重置，是否继续？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                isResetting.value = true;
                message.loading('正在重置数据...', 0);
                localStorage.clear();
                message.destroy();
                isResetting.value = false;
                message.success('数据重置成功，3秒后刷新页面');
                // 延迟刷新页面
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            },
            onCancel: () => {
                isResetting.value = false;
            }

        });
    } catch (error) {
        message.error('重置失败：' + error.message);
        isResetting.value = false;
    }
}

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


// 背景设置相关状态
const backgroundState = reactive({
    typeList: ['动态', '图片'],
    type: settings.backgroundType || 0,
    imgSrc: settings.backgroundImgUrl || '',
    mask: settings.mask == 0 ? 0 : settings.mask || 0.5,
    maskBlur: settings.maskBlur == 0 ? 0 : settings.maskBlur || 2,
    position: settings.backgroundPosition || 0
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
    settings.fontColor = titleState.color
};

// 背景类型defaultType用于初始化控制
const defaultType = ref(backgroundState.typeList[backgroundState.type]);
const backgroundTypeChange = (value) => {
    backgroundState.type = value === '图片' ? 1 : 0;
};


// 优化watch函数，使用组合式函数
const setupWatchers = () => {
    // 防抖函数
    const debounce = (fn, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
    };
    // 设置数据
    const settingData = useSettingData();
    const updateSettings = debounce((settingsOption) => {
        settingData.updateOtherSettings(settingsOption);
    }, 300);

    watch(() => titleState.value, (newVal, oldVal) => {
        if (newVal === oldVal) return;
        if (newVal.length > 10) {
            message.error('标题最多10个字');
            return;
        }
        updateSettings({
            showTitle: titleState.show,
            searchTitle: newVal
        });
    });


    watch(() => ({
        showTitle: titleState.show,
        opacity: searchState.opacity,
        isDark: searchState.isDark,
    }), (newVal) => {
        updateSettings({
            showTitle: newVal.showTitle,
            searchInputOpacity: newVal.opacity,
            searchInputColor: newVal.isDark
        });
    });

    watch(() => ({
        showGetGold: settings.showGetGold,
        todoListShow: settings.todoListShow,
        dockShow: settings.dockShow,
        cardNum: settings.cardNum,
        defaultTheme: settings.defaultTheme,

    }), (newVal) => {
        updateSettings(newVal);
    });


    watch(() => ({
        position: backgroundState.position,
        mask: backgroundState.mask,
        maskBlur: backgroundState.maskBlur,
    }), (newVal) => {
        updateSettings({
            backgroundPosition: newVal.position,
            mask: newVal.mask,
            maskBlur: newVal.maskBlur
        });
    });


};

// 重写上传文件action
const fileUpload = async ({ file, onSuccess, onError }) => {
    const data = await SaveImage(file)
    if (data == false) { onError(); return; }
    onSuccess();
};

// 图片上传
const ImgUploadChange = (info) => {
    if (info.file.status === 'done') {
        backgroundState.imgSrc = URL.createObjectURL(info.file.originFileObj);
    } else if (info.file.status === 'error') {
        // console.error('上传失败');
    }
}

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
            maskBlur: backgroundState.maskBlur,
            backgroundPosition: backgroundState.position
        })
    };
    useSettingData().updateOtherSettings(settings);
    message.success(`更换${saveIndex === 0 ? '动态' : '图片'}背景成功`);
};






// 初始化
onMounted(() => {
    imageDB.initDB();
    setupWatchers();
    getAllData();
});

</script>
<style lang="less">
.pay-group {
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    gap: 1rem;
    margin: 1rem 0;
}

.pay-item {
    display: flex;
    flex-direction: column;
    align-content: center;
    align-items: center;
}

.pay-item-text {
    font-size: 12px;
    color: var(--semi-color-text-2);
}

.other_settings {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;

    .background_position {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        align-items: flex-start;

        .background_item {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            gap: 5px;

            .slider {
                flex: 1;
            }

            .background_item_slider {
                width: 48%;
                display: flex;
                align-content: center;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
                gap: 5px;

                .desc {
                    width: 30px;
                }

            }
        }
    }

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
        background-color: var(--semi-color-bg-0);
        border: none;

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

    .icon_box {
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 10px;
        font-size: 40px;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s;
        color: #FFB600;

        &:hover {
            background-color: var(--semi-color-fill-0);
            transform: scale(1.15);
        }
    }

    .update_box {
        width: 100px;
    }

    .export_box {
        flex-direction: row;

        .ant-card {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .export_btn {
            width: 60px;
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

    .get_gold_box {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 10px;

        .collapse_box {
            width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: row;
            flex-wrap: wrap;
            gap: 10px;
            font-size: 40px;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s;
            color: var(--semi-color-text-0);
            text-decoration: none;

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
                background-color: var(--semi-color-fill-0);
            }

            .bounce-icon {
                display: flex;
                align-items: center;
                justify-content: center;
            }

            &:hover .bounce-icon {
                animation: bounceReverse 2s ease infinite;
                backface-visibility: visible !important; // 解决动画抖动问题
                transform-origin: center;
            }
        }

        @keyframes bounceReverse {
            0% {
                transform: translateY(0) scaleY(1);
            }

            20% {
                transform: translateY(-15px) scaleY(1.1);
            }

            40% {
                transform: translateY(0) scaleY(0.85);
            }

            50% {
                transform: translateY(0) scaleY(1) rotateY(180deg);
            }

            60% {
                transform: translateY(-15px) scaleY(1.05);
            }

            80% {
                transform: translateY(0) scaleY(0.95);
            }

            100% {
                transform: translateY(0) scaleY(1) rotateY(360deg);
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

    .other_settings_title::before {
        content: '';
        display: block;
        width: 3px;
        height: 15px;
        border-radius: 3px;
        background-color: var(--main-logo-color);
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
    }

    .other_settings_title {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 5px;
        height: 25px;
        position: relative;
        padding-left: 8px;
    }

    .other_settings_bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        align-content: center;
        flex-direction: row;
        margin-top: 15px;
        margin-bottom: 15px;
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

        .show_item_img {
            height: 100%;
            background-size: cover;
        }

        .show_item_img_mask {
            position: absolute;
            width: 280px;
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