<template>
    <div class="ice_header">
        <div class="ice_header_left">
            <ComEasyTool />
        </div>
        <div class="ice_header_right">
            <Comweather />
            <a-tooltip placement="bottom" title="切换主题">
                <ThemeSwitch class="theme_switch_btn" />
            </a-tooltip>
            <div class="easy_set">
                <ul>
                    <a-tooltip placement="bottom" title="切换背景">
                        <li class="easy_set_item" @click="easySetClick(0)">
                            <i class="theme_icon">
                                <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                        d="M1.66634 7.00037C1.48225 7.00037 1.33301 7.1496 1.33301 7.3337L1.33301 10.0004C1.33301 11.1049 2.22844 12.0004 3.33301 12.0004L6.66624 12.0004L6.66624 14.0006C6.66624 14.737 7.26319 15.3339 7.99957 15.3339C8.73595 15.3339 9.3329 14.737 9.3329 14.0006V12.0004L12.6663 12.0004C13.7709 12.0004 14.6663 11.1049 14.6663 10.0004V7.3337C14.6663 7.1496 14.5171 7.00037 14.333 7.00037L1.66634 7.00037Z"
                                        fill="currentColor"></path>
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                        d="M9.33309 0.666992L6.66648 0.666992L6.66648 4.00026C6.66648 4.36845 6.368 4.66693 5.99981 4.66693C5.63163 4.66693 5.33315 4.36845 5.33315 4.00026V0.666992L3.33301 0.666992C2.22844 0.666992 1.33301 1.56242 1.33301 2.66699V5.66699C1.33301 5.85109 1.48225 6.00033 1.66634 6.00033L14.333 6.00033C14.5171 6.00033 14.6663 5.85109 14.6663 5.66699V2.66699C14.6663 1.56242 13.7709 0.666992 12.6663 0.666992L10.6664 0.666992V2.6669C10.6664 3.03509 10.3679 3.33356 9.99975 3.33356C9.63156 3.33356 9.33309 3.03508 9.33309 2.66689V0.666992Z"
                                        fill="currentColor"></path>
                                </svg>
                            </i>
                        </li>
                    </a-tooltip>
                </ul>
            </div>
            <a-tooltip placement="bottom" title="设置">
                <div class="set_btn" @click="showDrawer">
                    <div class="btn_bg">
                        <i class="btn_line left"></i>
                        <i class="btn_line center"></i>
                        <i class="btn_line right"></i>
                    </div>
                </div>
            </a-tooltip>

        </div>
        <a-modal v-model:open="modelOpen" title="" width="1200px" :footer="null" wrap-class-name="ice_setPanel_modal"
            @cancel="modelClose()">
            <IceSetPanel ref="panelRef"
                @update:dataSource="handleDataSourceUpdate" />
        </a-modal>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { useLinkData } from '../store/LinkStore';
import ThemeSwitch from './ThemeSwitch.vue';
import IceSetPanel from './IceSetPanel.vue';
import Comweather from './ComWeather.vue';
import ComEasyTool from './ComEasyTool.vue';
// 切换背景
const easySetClick = () => useLinkData().updateBackground();

//设置面板开关
const modelOpen = ref(false);
const showDrawer = () => modelOpen.value = true;

// 父组件接受子组件的数据,关闭面板同步数据给store
// parentDataSource是临时变量
const panelRef = ref(null);
const parentDataSource = ref([]);
const handleDataSourceUpdate = (newData) => parentDataSource.value = newData;
const modelClose = () => {
    const groupMap = parentDataSource.value.reduce((acc, item) => {
        if (!acc[item.group]) {
            acc[item.group] = {
                name: item.group,
                value: item.group,
                active: true,
                engines: []
            };
        }
        acc[item.group].engines.push({
            name: item.name,
            link: item.link,
            placeholder: item.placeholder
        });
        return acc;
    }, {});
    useLinkData().updateSearchMenu(Object.values(groupMap))
};

</script>
<style lang="less">
.ice_header {
    width: 100%;
    // height: 40px;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 26px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;

}
.ice_setPanel_modal {
    .ant-modal {
        max-width: 100%;
        top: 50px;
        padding-bottom: 0;
        margin: 0 auto;
        overflow: hidden;
        transition: .3s;
    }

    .ant-modal-content {
        display: flex;
        flex-direction: column;
        background-color: var(--semi-color-bg-main);
    }

    .ant-modal-body {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
}

.ant-modal-mask {
    backdrop-filter: blur(2px);
}

@media screen and (max-width: 768px) {
    #IceoohNavigate .mobile .ice_header {
        .set_btn {
            display: none;
        }
    }
}

@media screen and (max-width: 1200px) {
    .ice_setPanel_modal {
        padding: 0 10px;
    }

    .ice_setPanel_modal .ice_setPanel {
        flex-direction: column;

        .ant-table-wrapper {
            max-width: 100% !important;
        }

        .setPanel_left {
            flex-direction: row;
            width: 100%;
            margin-bottom: 20px;
            align-content: center;
            justify-content: flex-start;
            align-items: center;

            .card_title {
                width: 20px;
                margin: 0;
            }

            .card_content {
                display: flex;
                flex-wrap: nowrap;
                flex-direction: row;
                overflow-x: auto;
            }
        }

        .setPanel_right {
            width: 100% !important;
        }
    }

}



.edit_option {
    margin-left: 5px;
    position: relative;
    display: inline-flex;
    align-items: stretch;
    justify-items: flex-start;
    // width: 100%;
    border-radius: 4px;
    padding: 2px;
    color: var(--semi-color-text-0);
    font-size: 14px;
    line-height: 1.5;
    list-style: none;
    background: var(--semi-color-fill-0);
    transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    gap: 2px;

    .edit_option_text:not(.selected):hover {
        color: #000000e0;
        background-color: var(--semi-color-fill-0);
    }

    .edit_option_text.selected:hover {
        box-shadow:
            inset 0 1px 2px 0 #c8d0e7,
            inset 0 1px 2px -1px #00000005;
    }

    .edit_option_text.selected {
        border-radius: 2px;
        background-color: var(--semi-edit-1);
        box-shadow: 0 1px 2px 0 #00000008, 0 1px 6px -1px #00000005, 0 2px 4px 0 #00000005;
        color: var(--semi-color-text-0);
        position: relative;
        text-align: center;
        cursor: pointer;
        transition: color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);

    }

    .edit_option_text {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        min-height: 20px;
        line-height: 20px;
        padding: 0 7px;
        cursor: pointer;
        border-radius: 3px;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

.ice_header_right:hover .easy_set {
    opacity: 1;
}

.ice_header_right:hover .theme_switch_btn
, .ice_header_right:hover .weather_container {
    opacity: 1;
}

.weather_container,.theme_switch_btn {
    opacity: 0;
    transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.ice_header_right {
    width: 100px;
    height: 40px;
    display: flex;
    flex-direction: row;
    align-content: center;
    align-items: center;
    justify-content: flex-end;


    .easy_set {
        height: 35px;
        color: var(--semi-color-text-0);
        transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        opacity: 0;

        ul {
            height: 100%;
            margin: 0;
            display: flex;
            flex-direction: row-reverse;
            align-content: center;
            justify-content: center;
            align-items: center;

            .easy_set_item:hover {
                background-color: #45428f52;
            }

            .easy_set_item {
                display: flex;
                color: #fff;
                font-size: 20px;
                cursor: pointer;
                width: 30px;
                height: 30px;
                align-items: center;
                flex-direction: column;
                align-content: center;
                justify-content: center;
                border-radius: 3px;
            }
        }
    }

    .set_btn {
        height: 35px;
        width: 35px;
        flex: 0 0 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 40px;
        color: #363636;
        transition: .3s;
        padding: 10px 7.5px;

        .btn_bg {
            display: flex;
            position: relative;
            width: 100%;
            height: 100%;
            cursor: pointer;
        }

        .btn_line {
            transition: all .3s;
            position: absolute;
            border-radius: 12px;
            background: #fff;
        }

        .left {
            top: 0;
            width: 100%;
            height: 6px;
        }

        .center {
            bottom: 0;
            width: 6px;
            height: 6px;
        }

        .right {
            right: 0;
            bottom: 0;
            width: 10px;
            height: 6px;
        }

    }

    .set_btn:hover {
        transition: .3s;

        .btn_line {
            // background-color: #222;
        }

        .left {
            width: 10px;
            height: 6px;
        }

        .center {
            width: 10px;
            height: 6px;
        }

        .right {
            width: 6px;
            height: 100%;
        }

    }
}

@media screen and (max-width: 768px) {
    #IceoohNavigate .mobile {
        .ice_header {
            padding: 0 10px;
        }

    }

}
</style>