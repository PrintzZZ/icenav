<template>
    <div class="ice_header">
        <div class="ice_header_left"></div>
        <div class="ice_header_right">
            <div class="easy_set">
                <ul>
                    <a-tooltip placement="bottom" title="切换背景">
                        <li class="easy_set_item" @click="easySetClick(0)">
                            <i class="theme_icon">
                                <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                        d="M1.66634 7.00037C1.48225 7.00037 1.33301 7.1496 1.33301 7.3337L1.33301 10.0004C1.33301 11.1049 2.22844 12.0004 3.33301 12.0004L6.66624 12.0004L6.66624 14.0006C6.66624 14.737 7.26319 15.3339 7.99957 15.3339C8.73595 15.3339 9.3329 14.737 9.3329 14.0006V12.0004L12.6663 12.0004C13.7709 12.0004 14.6663 11.1049 14.6663 10.0004V7.3337C14.6663 7.1496 14.5171 7.00037 14.333 7.00037L1.66634 7.00037Z"
                                        fill="#6A6F7F"></path>
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                        d="M9.33309 0.666992L6.66648 0.666992L6.66648 4.00026C6.66648 4.36845 6.368 4.66693 5.99981 4.66693C5.63163 4.66693 5.33315 4.36845 5.33315 4.00026V0.666992L3.33301 0.666992C2.22844 0.666992 1.33301 1.56242 1.33301 2.66699V5.66699C1.33301 5.85109 1.48225 6.00033 1.66634 6.00033L14.333 6.00033C14.5171 6.00033 14.6663 5.85109 14.6663 5.66699V2.66699C14.6663 1.56242 13.7709 0.666992 12.6663 0.666992L10.6664 0.666992V2.6669C10.6664 3.03509 10.3679 3.33356 9.99975 3.33356C9.63156 3.33356 9.33309 3.03508 9.33309 2.66689V0.666992Z"
                                        fill="#DDE3E8"></path>
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
        <a-modal v-model:open="modelopen" title="" width="1200px" :footer="null" wrap-class-name="ice_setPanel_modal"
            @cancel="modelClose()">
            <div class="ice_setPanel">
                <div class="setPanel_left setPanel_card">
                    <div class="card_title">相关设置</div>
                    <div class="card_content">
                        <div class="card_item" v-for="(item, index) in settingdata" :key="index"
                            @click="itemClick(index)" :class="{ 'item_active': index === itemIndex }">
                            <div class="card_item_title">
                                <i class="card_item_icon_icon">
                                    <component :is="item.icon" />
                                </i>
                                <span class="card_item_title_text">{{ item.name }}</span>
                            </div>
                            <div class="card_item_desc"> {{ item.desc }} </div>
                        </div>
                    </div>
                </div>
                <a-table v-if="itemIndex === 0" :columns="columns" :data-source="dataSource" bordered>
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="['name', 'link', 'placeholder'].includes(column.dataIndex)">
                            <div>
                                <a-input v-if="editableData[record.key]"
                                    v-model:value="editableData[record.key][column.dataIndex]" style="margin: -5px 0" />
                                <template v-else>
                                    {{ text }}
                                </template>
                            </div>
                        </template>
                        <template v-else-if="column.dataIndex === 'operation'">
                            <div class="editable-row-operations">
                                <span v-if="editableData[record.key]">
                                    <a-typography-link @click="save(record.key)">保存</a-typography-link>
                                    <a-popconfirm title="确认取消编辑?" @confirm="cancel(record.key)">
                                        <a style="margin-left: 5px;">取消</a>
                                    </a-popconfirm>
                                </span>
                                <!-- 编辑 -->
                                <span v-else>
                                    <a @click="edit(record.key)">编辑</a>
                                    <!-- 删除功能：仅在非编辑状态显示 -->

                                    <span class="edit_option">
                                        <a-popconfirm title="确认删除此条记录?" @confirm="onDelete(record.key)">
                                            <span class="edit_option_text" title="删除">-</span>
                                        </a-popconfirm>
                                        <span class="edit_option_text selected" @click="add(record.key)"
                                            title="添加">+</span>
                                    </span>
                                </span>
                            </div>
                        </template>
                    </template>
                </a-table>
                <div class="setPanel_right setPanel_card" v-if="itemIndex === 1">
                    <div class="setPanel_right_left">
                        <p class="card_title">导入导出设置</p>
                        <p class="card_desc">可通过exlce导入，数据为xlsx格式</p>
                        <ComxlsxUpload />
                        <a-divider />
                        <div class="export_btn">
                            <p class="card_title">备份数据</p>
                            <p class="card_desc">导出当前设置，数据为xlsx格式</p>
                            <a-button type="primary" @click="exportData">导出设置</a-button>
                        </div>
                        <a-divider />
                        <div class="export_btn">
                            <p class="card_title">恢复默认</p>
                            <p class="card_desc">恢复初始化默认设置</p>
                            <a-button type="dashed" @click="resetData">重置默认</a-button>
                        </div>
                    </div>
                    <div class="setPanel_right_right">
                        <p class="card_title">侧边栏排序</p>
                        <p class="card_desc">拖拽排序、点击图标设置Icon</p>
                        <ComMenuDrag />
                    </div>
                </div>
                <div class="setPanel_right" v-if="itemIndex === 2"></div>
            </div>
        </a-modal>

    </div>
</template>
<script>
import { reactive, ref, createVNode, defineAsyncComponent } from 'vue';
import { cloneDeep } from 'lodash-es';
import { useLinkData } from '../store/LinkStore';
import { IconSet, IconToast, IconCheckbox, IconCalendar, IconWarning } from '../components/icons';
import { message, Modal } from 'ant-design-vue';
import * as XLSX from 'xlsx'


import ComxlsxUpload from './ComxlsxUpload.vue';
import ComMenuDrag from './ComMenuDrag.vue';


export default {
    components: {
        IconSet, IconToast, IconCheckbox, IconCalendar,ComxlsxUpload,ComMenuDrag
    },
    setup() {
        //设置item数据
        const settingdata = ref([{
            name: '搜索引擎设置',
            icon: 'IconToast',
            desc: '包括搜索引擎名称、链接、提示词等。',
        },
        {
            name: '侧边栏设置',
            icon: 'IconCalendar',
            desc: '侧边分类排序',
        },
        {
            name: '其他设置',
            icon: 'IconCheckbox',
            desc: '私有化全自定义导航数据',
        }]);
        const itemIndex = ref(0);
        const itemClick = index => {
            itemIndex.value = index;
        };

        //设置面板开关
        const modelopen = ref(false);
        const showDrawer = () => {
            modelopen.value = true;

        };
        const modelClose = () => {

            const groupMap = dataSource.value.reduce((acc, item) => {
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



        //初始化搜索数据
        const searchMenu = useLinkData().searchMenu;
        const dataSource = ref([]);
        const columns = ref([]);
        columns.value.push({
            title: '分组',
            dataIndex: 'group',
            key: 'group',
            width: '10%',
            ellipsis: true,
        }, {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            width: '15%',
            ellipsis: true,
        }, {
            title: '链接',
            dataIndex: 'link',
            key: 'link',
            ellipsis: true,
        }, {
            title: '提示词',
            dataIndex: 'placeholder',
            key: 'placeholder',
            ellipsis: true,
        }, {
            title: '编辑',
            dataIndex: 'operation',
            key: 'placeholder',
            width: '17%',
        },
        )

        //根据数据生成表格
        searchMenu.forEach((item, index) => {
            item.engines.forEach((ite, ind) => {
                dataSource.value.push({
                    key: `${index}-${ind}`,
                    group: item.name,
                    name: ite.name,
                    link: ite.link,
                    placeholder: ite.placeholder,
                });
            });
        });

        //编辑表格

        const editableData = reactive({});
        const edit = key => {
            editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0]);
        };
        const save = key => {
            Object.assign(dataSource.value.filter(item => key === item.key)[0], editableData[key]);
            // useLinkData().setSearchMenu(key, editableData[key])
            delete editableData[key];
        };
        const cancel = key => {
            delete editableData[key];
        };
        const onDelete = key => {
            if (key.split('-')[1] === '0') {
                message.info('不能删除第一项');
                return;
            }
            Object.assign(dataSource.value = dataSource.value.filter(item => item.key !== key));
        };
        const add = addkey => {
            const indexToInsert = dataSource.value.findIndex(item => item.key === addkey);
            const group = dataSource.value[indexToInsert].group;
            const newItem = {
                key: `${addkey.split('-')[0]}-${new Date().getTime()}`,
                group: group,
                name: '',
                link: '',
                placeholder: ''
            };
            Object.assign(dataSource.value.splice(indexToInsert + 1, 0, newItem));
        };



        const exportData = () => {
            // 将数据转换为工作表
            const data = useLinkData().menuList;
            const excelData = formatDataForExcel(data);
            // console.log(excelData);
            // 设置列宽（例如：第一列宽度 100px，第二列宽度 200px，第三列宽度 150px）

            const ws = XLSX.utils.json_to_sheet(excelData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            XLSX.writeFile(wb, 'excelData.xlsx');
        };

        // 格式化数据，将嵌套结构转换为平面数据
        const formatDataForExcel = (data) => {
            const result = [];
            data.forEach(item => {
                if (item.child) {
                    item.child.map(ite => {
                        if (ite.item) {
                            ite.item.map(itechild => {
                                result.push({
                                    '一级分类': item.name,
                                    '二级分类': ite.name,
                                    '网站标题': itechild.title,
                                    '网站描述': itechild.desc,
                                    '网站链接': itechild.link,
                                    '网站图标': itechild.avatar,
                                });
                            })
                        }
                    });


                } else {
                }
            });

            return result;
        };

        // 重置数据
        const resetData = () => {
            Modal.confirm({
                title: '确认恢复默认设置?',
                content: createVNode('div', { style: 'color:red;' }, ' 恢复后将丢失所有自定义设置，请谨慎操作！ 建议备份数据后再恢复。'),
                onOk() {
                    const linkDataStore = useLinkData();
                    let DefaultMenuList2 = useLinkData().defaultmenuList;
                    linkDataStore.updateMenuList(DefaultMenuList2)
                    message.success('恢复默认设置成功');
                },
                onCancel() {
                    // console.log('Cancel');
                },
                class: 'test',
            });
        };

        const easySetClick = (index) => {
            useLinkData().updatebackground();
            console.log(useLinkData().backgrounddata);
        };

        return {
            //设置面板开关
            modelopen,
            showDrawer,
            modelClose,
            //搜索数据
            columns,
            dataSource,

            //编辑状态
            editableData,
            edit,
            save,
            cancel,
            onDelete,
            add,

            //设置item数据
            settingdata,
            itemIndex,
            itemClick,

            exportData,
            resetData,
            easySetClick,
        }
    },
}
</script>
<style lang="less">
.ice_header {
    width: 100%;
    height: 40px;
    background-color: #00000000;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 26px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
}

.ice_setPanel_modal::-webkit-scrollbar {
    width: 6px;
}

.ice_setPanel_modal::-webkit-scrollbar-thumb {
    background: #e0e0e09d;
    border-radius: 3px;
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
    // background-color: #ffffffd9 !important;
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

.ice_setPanel {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    align-items: flex-start;
    justify-content: space-between;
    transition: 0.3s;
    margin: 0 30px;
    transform: translateY(10px);
    width: calc(100% - 30px);
    height: calc(100% - 30px);
    overflow: hidden;
    min-height: 700px;

    .ant-table-wrapper {
        max-width: 70% !important;
    }

    .setPanel_card {
        background: #ffffff99;
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid #e3e8f7;
        box-shadow: 0 8px 16px -4px rgba(44, 45, 48, 0.047);
        padding: 20px;
        gap: 24px;
        display: flex;
        flex-direction: column;

        .card_title {
            font-size: 20px;
            font-weight: 700;
            line-height: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 0 0 16px 0;
        }

        .card_desc {
            color: #a5a5a5;
            max-width: 90%;
            font-size: 14px;
            line-height: 1.5;

        }

        .card_content {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            min-height: 100px;
            width: 100%;
            flex-direction: column;
        }

        .card_item:hover {
            border: 1px solid #425aef;
        }

        .card_item.item_active {
            border: 1px solid #425aef;
        }

        .card_item {
            position: relative;
            width: calc(100% / 2 - 8px);
            width: 100%;
            background: #fff;
            border-radius: 12px;
            border: 1px solid #e3e8f7;
            padding: 14px;
            cursor: pointer;
            transition: .3s;
            overflow: hidden;
            gap: .5rem;
            display: flex;
            flex-direction: column;
            max-height: 98px;
            overflow: hidden;

            .card_item_desc {
                transition: .3s;
                overflow: hidden;
                text-overflow: ellipsis;
                line-height: 1.5;
                font-size: 14px;
                color: #3c3c43cc;
            }

            .card_item_title {
                display: flex;
                align-items: center;
                gap: 8px;
                border-bottom: 1px solid #e3e8f7;
                padding-bottom: 8px;

                .card_item_title_text {
                    font-weight: 700;
                    font-size: 18px;
                    transition: 0.3s;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

                .card_item_icon_icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    background: #f5f5f5;
                    color: #363636;
                    font-size: 25px;
                }
            }

            .card_item_desc {}
        }
    }

    .setPanel_left {
        margin-right: .5rem;
        width: 28%;
        height: 100%;
        transition: .3s;
        min-width: 100px;
    }

    .setPanel_right {
        display: flex;
        justify-content: space-between;
        height: 100%;
        width: 70% !important;
        min-width: 70%;
        overflow-y: auto;
        flex-direction: row;
        flex-wrap: nowrap;
        min-height: 700px;
        max-height: 712px;
        transition: 0.3s;
        min-width: 500px;
        align-content: flex-start;
        align-items: flex-start;
        gap: 40px;

        .setPanel_right_left {
            padding: 0 10px;
            width: 40%;
            min-width: 260px;

            .export_btn {
                margin-bottom: 10px;
            }
        }

        .setPanel_right_right {
            width: 40%;
            min-width: 260px;
            flex: 1;
        }
    }


}

.edit_option {
    margin-left: 5px;
    position: relative;
    display: flex;
    align-items: stretch;
    justify-items: flex-start;
    // width: 100%;
    border-radius: 4px;
    padding: 2px;
    color: #000000a6;
    font-size: 14px;
    line-height: 1.5;
    list-style: none;
    display: inline-block;
    background-color: #f5f5f5;
    transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);

    .edit_option_text:not(.selected):hover {
        color: #000000e0;
        background-color: #0000000f;
    }

    .edit_option_text.selected:hover {
        box-shadow:
            inset 0 1px 2px 0 #c8d0e7,
            inset 0 1px 2px -1px #00000005;
    }

    .edit_option_text.selected {
        border-radius: 2px;
        background-color: #ffffff;
        box-shadow: 0 1px 2px 0 #00000008, 0 1px 6px -1px #00000005, 0 2px 4px 0 #00000005;
        color: #000000e0;
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
    }
}

.ice_header_right:hover .easy_set {
    opacity: 1;
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
        color: #fff;
        transition: .3s;
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
                background-color: #45428f9c;
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
        // background: #;
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