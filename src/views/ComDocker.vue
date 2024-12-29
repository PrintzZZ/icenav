<template>
    <Transition name="fade">
        <div class="dock-container" id="dock-container" style="left: 50%;" v-if="dockShow && dockerShowNow">
            <div class="dock" id="dock">
                <ul class="dock-icons">
                <!-- 右键删除 -->
                <li class="dock-icon" v-for="(item, index) in dockIcons" :key="item.name" :title="item.name"
                    @contextmenu.prevent="onRightClick($event, index)">
                    <a :href="item.url" target="_blank">
                        <img :src="item.icon" :alt="item.name">
                    </a>
                </li>
                <li class="dock-icon-divider ">
                    <hr class="dock-divider"> <!-- 添加分割线 -->
                </li>
                <li class="dock-icon add-app" title="添加应用" @click="onAddApp">
                    <i class="dock-icon-svg">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"
                            focusable="false" aria-hidden="true">
                            <path d="M9 2a2 2 0 0 0-2 2v1h9c2 0 3 1 3 3v9h1a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H9Z"
                                fill="currentColor"></path>
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M3 9c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Zm6 2a1 1 0 1 1 2 0v2h2a1 1 0 1 1 0 2h-2v2a1 1 0 1 1-2 0v-2H7a1 1 0 1 1 0-2h2v-2Z"
                                fill="currentColor"></path>
                        </svg>
                    </i>
                </li>
                <li class="dock-icon close-app" title="收起" @click="onCloseApp">
                    <i class="dock-icon-svg">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"
                            focusable="false" aria-hidden="true">
                            <path
                                d="M2.44 2.44a1.5 1.5 0 0 0 0 2.12L6.88 9H4a1.5 1.5 0 0 0 0 3h6.5a1.5 1.5 0 0 0 1.5-1.5V4a1.5 1.5 0 0 0-3 0v2.88L4.56 2.44a1.5 1.5 0 0 0-2.12 0Z"
                                fill="currentColor">
                            </path>
                            <path
                                d="M20 12a1.5 1.5 0 0 1 0 3h-2.88l4.44 4.44a1.5 1.5 0 1 1-2.12 2.12L15 17.12V20a1.5 1.5 0 1 1-3 0v-6.5a1.5 1.5 0 0 1 1.5-1.5H20Z"
                                fill="currentColor">
                            </path>
                        </svg>
                    </i>
                </li>
            </ul>
        </div>
    </div>
    </Transition>
    <!-- 添加应用模态框 -->
    <Modal v-model:open="visible" title="添加网站" @ok="addAppOk" destroyOnClose>
        <p>添加后右键点击即可删除</p>
        <p class="add-app-label">*网站名称</p>
        <Input v-model:value="addAppValue.name" placeholder="请输入网站名称" />
        <p class="add-app-label">*网站地址</p>
        <Input v-model:value="addAppValue.url" placeholder="请输入网站地址 http/https开头" />
        <p class="add-app-label">网站图标<span>（自动获取）</span></p>
        <Input v-model:value="addAppValue.icon" placeholder="不填写链接自动获取网址图标" />
    </Modal>
</template>
<script setup>
// 自动获取图标
// https://t3.gstatic.cn/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=128&url=https://www.iceooh.com

import { ref,watchEffect } from 'vue';
import { Modal, Input, message } from 'ant-design-vue';
import { useSettingData } from '@/store/SettingStore'


const dockIcons = ref([
    {
        name: '冰屋数据',
        url: 'https://www.iceooh.com/',
        icon: 'https://t3.gstatic.cn/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=128&url=https://www.iceooh.com'
    },
])

const visible = ref(false);
const addAppValue = ref({
    name: '',
    url: '',
    icon: ''
});


const onRightClick = (event, index) => {
    console.log(event, index);
    // 右键删除, 模态框确认后删除
    Modal.confirm({
        title: '确定要删除吗？',
        content: `网站名称：${dockIcons.value[index].name}`,
        centered: true,
        
        onOk: () => {
            dockIcons.value.splice(index, 1);
        }
    });

}

const onAddApp = () => {
    visible.value = true;
}

const addAppOk = () => {
    // 验证
    if (!addAppValue.value.name) {
        message.error('请输入网站名称');
        return;
    }
    // 使用正则验证网站地址
    const urlReg = /^(https?:\/\/)?[^\s/$.?#].[^\s]*$/;
    if (!urlReg.test(addAppValue.value.url)) {
        message.error('请输入正确的网站地址');
        return;
    }

    // 添加到dockIcons
    dockIcons.value.push(addAppValue.value);
    // 关闭模态框
    visible.value = false;
    // 清空输入框
    addAppValue.value = {
        name: '',
        url: '',
        icon: ''
    };
}

const dockShow = ref(true)
const dockerShowNow = ref(true)
const onCloseApp = () => {
    // 本次隐藏 永久隐藏
    Modal.confirm({
        title: '收起dock栏',
        content: '本次隐藏或者永久隐藏',
        centered: true,
        okText: '本次隐藏',
        cancelText: '永久隐藏',
        onOk: () => {
            dockerShowNow.value = false;
            message.success('已收起,下次启动时恢复');
        },
        onCancel: () => {
            dockShow.value = !dockShow.value;
            useSettingData().updateOtherSettings({ dockShow: dockShow.value });
            message.success('已永久隐藏,可通过设置打开');
        }
    });
}
watchEffect(()=>{
    dockShow.value = useSettingData().otherSettings.dockShow;
})

</script>
<style lang="less" scoped>

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease
}


.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}


.add-app-label {
    margin: 10px 0;
    font-size: 14px;
    color: var(--semi-color-text-0);

    & span {
        font-size: 12px;
        color: var(--semi-color-text-3);
    }
}

.dock-container {
    display: flex;
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 999;

    .dock {
        display: flex;
        align-items: center;
        background-color: var(--semi-color-bg-0);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        padding: 10px;
        border: 1px solid var(--semi-color-border);
        box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);

        .add-app {
            cursor: pointer;
        }

        .close-app {
            cursor: pointer;
        }

        .dock-icons {
            display: flex;
            align-items: center;
            margin: 0;
            padding: 0;
            list-style: none;

            .dock-divider {
                height: 20px;
                border: 1px solid var(--semi-color-text-3);
                border-radius: 2px;
            }

            .dock-icon-divider {
                margin: 0 5px;
                width: 2px;
            }

            .dock-icon {
                will-change: transform;
                position: relative;
                width: 50px;
                height: 50px;
                background-color: #fff0;
                border-radius: 12px;
                margin: 0 5px;
                transition: .3s;
                transform-origin: bottom center;



                &:hover {
                    transform: scale(1.6) translateY(-5px);
                    margin-left: 18px;
                    margin-right: 18px;
                    transition: all 0.2s;
                }

                & a {
                    width: 100%;
                    height: 100%;
                }

                & img {
                    display: flex;
                    width: 100%;
                    height: 100%;
                    border-radius: 12px;
                    pointer-events: none;
                }

                .dock-icon-svg {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    height: 100%;
                    font-size: 1.5rem;
                    color: var(--semi-color-bg-0);
                    background-color: rgba(var(--semi-blue-5), 1);
                    border-radius: 12px;
                }
            }
        }
    }
}
</style>