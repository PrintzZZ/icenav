<template>
    <!-- 邮箱网盘翻译等小组件 -->
    <div class="com-easy-tool">
        <ul class="com-easy-tool-list">
            <i class="com-easy-tool-item" style="width: 35px; cursor: pointer;" @click="toggleSidebar()">
                <IconMenu :style="{ color: fontColor }" />
            </i>
            <li v-for="(tool, index) in toolList" :key="tool.name" class="com-easy-tool-item"
                :style="{ color: fontColor }">
                <a-tooltip :title="`${tool.name}设置`">
                    <i class="com-easy-tool-icon" @click="setTool(index)">
                        <component :is="tool.icon" />
                    </i>
                </a-tooltip>
                <a :href="tool.url" target="_blank" :style="{ color: fontColor }" :alt="tool.name">{{ tool.name }}</a>
            </li>
        </ul>
    </div>
    <!-- 点击不同的工具，弹出不同的模态框 -->
    <a-modal v-model:open="setToolModal" :title="`${currentTool?.name}设置`" @ok="setToolOk" @cancel="setToolCancel">
        <div class="tool-settings">

            <div class="tool-settings-title"> 切换其他{{ currentTool?.name }} <span class="desc">点击确定以修改跳转的地址</span></div>
            <a-radio-group v-model:value="selectedUrl" :disabled="customUrl.length > 0">
                <a-radio-button v-for="item in currentTool?.backup" :key="item.url" :value="item.url">
                    {{ item.name }}
                </a-radio-button>
            </a-radio-group>
            <div class="tool-settings-title"> 自定义{{ currentTool?.name }} </div>
            <div class="tool-settings-input">
                <a-input v-model:value="customUrl" :placeholder="`请输入自定义${currentTool?.name}地址 http或https开头`" />
            </div>
        </div>
    </a-modal>
</template>
<script setup>
import { ref, computed, markRaw } from 'vue'
import { IconMenu } from '../components/icons';
import { IconLanguage, IconSave, IconGlobe, IconArchive } from '../components/unIcons';
import { useSettingData } from '../store/SettingStore';
import { message } from 'ant-design-vue';

const toolList = ref([
    {
        name: '邮箱',
        icon: markRaw(IconLanguage),
        url: 'https://mail.qq.com',
        backup: [
            {
                name: 'QQ邮箱',
                url: 'https://mail.qq.com'
            },
            {
                name: '163邮箱',
                url: 'https://mail.163.com'
            },
            {
                name: '126邮箱',
                url: 'https://mail.126.com'
            },
            {
                name: 'Gmail邮箱',
                url: 'https://mail.google.com'
            },
            {
                name: 'Outlook邮箱',
                url: 'https://outlook.live.com'
            },
        ]
    },
    {
        name: '网盘',
        icon: markRaw(IconSave),
        url: 'https://pan.baidu.com',
        backup: [
            {
                name: '百度网盘',
                url: 'https://pan.baidu.com'
            },
            {
                name: '阿里云盘',
                url: 'https://www.aliyundrive.com'
            },
            {
                name: '夸克网盘',
                url: 'https://pan.quark.cn'
            },
        ]
    },
    {
        name: '翻译',
        icon: markRaw(IconGlobe),
        url: 'https://fanyi.baidu.com',
        backup: [
            {
                name: '百度翻译',
                url: 'https://fanyi.baidu.com'
            },
            {
                name: '有道翻译',
                url: 'https://fanyi.youdao.com'
            },
            {
                name: '谷歌翻译',
                url: 'https://translate.google.com'
            },
            {
                name: 'DeepL翻译',
                url: 'https://www.deepl.com/translator'
            },
            {
                name: '腾讯翻译',
                url: 'https://fanyi.qq.com'
            },
        ]
    },
    {
        name: '文档',
        icon: markRaw(IconArchive),
        url: 'https://docs.qq.com',
        backup: [
            {
                name: '腾讯文档',
                url: 'https://docs.qq.com'
            },
            {
                name: '金山文档',
                url: 'https://docs.wps.cn'
            },
            {
                name: '飞书文档',
                url: 'https://docs.feishu.cn'
            },
            {
                name: '语雀',
                url: 'https://www.yuque.com'
            },
            {
                name: '有道云笔记',
                url: 'https://note.youdao.com'
            },
        ]
    }
])

const currentTool = ref(null);
const selectedUrl = ref('');
const customUrl = ref('');

const setTool = (index) => {
    currentTool.value = toolList.value[index];
    selectedUrl.value = currentTool.value.url;
    setToolModal.value = true;
}

const setToolModal = ref(false);

const setToolOk = () => {
    if (customUrl.value.length > 0) {
        // 正则校验
        if (!/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(customUrl.value)) {
            message.error('请输入正确的地址');
            return;
        }
        currentTool.value.url = customUrl.value;
    } else {
        currentTool.value.url = selectedUrl.value;
    }
    useSettingData().updateOtherSettings({
        toolList: toolList.value
    });
    setToolModal.value = false;
    message.success(`${currentTool.value?.name}设置成功`);
    customUrl.value = '';
}

const setToolCancel = () => {
    setToolModal.value = false;
}

const toggleSidebar = () => {
    useSettingData().updateOtherSettings({
        collapseSidebar: !useSettingData().otherSettings.collapseSidebar
    });
}

const fontColor = computed(() => useSettingData().otherSettings.fontColor);

</script>
<style lang="less">
// 移动端不显示
@media (max-width: 768px) {
    .com-easy-tool {
        display: none;
    }
}

.com-easy-tool {}

.com-easy-tool-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 0;
    padding: 0;
    gap: 5px;

    .com-easy-tool-item {
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 3px;
        transition: 0.3s;
        padding: 0 7.5px;
        font-size: 12px;
        gap: 2px;

        &:hover {
            background-color: #45428f52;
        }

        .com-easy-tool-icon {
            display: flex;
            cursor: pointer;
            margin-right: 2px;
            padding: 10px 0px;
        }

        a {
            display: block;
            width: 100%;
            height: 100%;
            text-align: center;
            padding: 10px 0px;

        }
    }
}

.tool-settings {

    .desc {
        font-size: 12px;
        color: var(--semi-color-text-3);
    }

    .tool-settings-title {
        margin: 10px 0;
        color: var(--semi-color-text-2);
    }

    .tool-settings-input {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }

}
</style>