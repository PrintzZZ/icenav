<template>
    <div class="ice_setPanel">
        <div class="setPanel_left setPanel_card">
            <div class="card_title">
                <IconIceooh class="card_title_icon" />相关设置
            </div>
            <div class="card_content">
                <div class="card_item" v-for="(item, index) in setData" :key="index" @click="itemClick(index)"
                    :class="{ 'item_active': index === itemIndex }">
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
        <a-table v-if="itemIndex === 0" :columns="columns" :data-source="dataSource" bordered :scroll="{ y: 580 }">
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
                                <span class="edit_option_text selected" @click="add(record.key)" title="添加">+</span>
                            </span>
                        </span>
                    </div>
                </template>
            </template>
        </a-table>
        <div class="setPanel_right setPanel_card" v-if="itemIndex === 1">
            <div class="setPanel_right_left">
                <p class="card_title">导入设置</p>
                <p class="card_desc"> 支持xlsx表格, 建议备份数据后再导入。</p>
                <ComXlsxUpload />
                <a-divider />
                <div class="export_btn">
                    <p class="card_title">备份数据</p>
                    <p class="card_desc">导出数据为xlsx格式</p>
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
        <div class="setPanel_right" v-if="itemIndex === 2">
            <OtherSettings />
        </div>
    </div>
</template>
<script setup>
import { reactive, ref, createVNode, defineEmits } from 'vue';
import { IconSet, IconToast, IconCheckbox, IconCalendar, IconIceooh } from '../components/icons';
import ComXlsxUpload from './ComXlsxUpload.vue';
import ComMenuDrag from './ComMenuDrag.vue';
import OtherSettings from './OtherSettings.vue';
import { useLinkData } from '../store/LinkStore';
import { message, Modal } from 'ant-design-vue';
import { cloneDeep } from 'lodash-es';
import * as XLSX from 'xlsx'

// 首先声明要触发的事件
const emit = defineEmits(['update:dataSource'])

//设置item数据
const setData = [{
    name: '搜索引擎设置',
    icon: IconToast,
    desc: '包括搜索引擎名称、链接、提示词等。',
},
{
    name: '侧边栏设置',
    icon: IconCalendar,
    desc: '侧边分类排序',
},
{
    name: '其他设置',
    icon: IconCheckbox,
    desc: '私有化全自定义导航数据',
}];

//设置item点击
const itemIndex = ref(0);
const itemClick = index => {
    itemIndex.value = index;
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
    delete editableData[key];
    // 触发事件，将新的dataSource传给父组件
    emit('update:dataSource', dataSource.value);
};
const cancel = key => {
    delete editableData[key];
};
const onDelete = key => {
    if (key.split('-')[1] === '0') {
        message.info('不能删除第一项');
        return;
    }
    dataSource.value = dataSource.value.filter(item => item.key !== key);
    // 触发事件，将新的dataSource传给父组件
    emit('update:dataSource', dataSource.value);
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
    dataSource.value.splice(indexToInsert + 1, 0, newItem);
    // 触发事件，将新的dataSource传给父组件
    emit('update:dataSource', dataSource.value);
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

// 定义一个方法返回当前的dataSource
const getDataSource = () => {
    return dataSource.value;
};

// 将方法暴露给父组件
defineExpose({
    getDataSource
});

</script>
<style lang="less">
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
    width: 100%;
    height: calc(100% - 30px);
    overflow: hidden;
    min-height: 700px;

    .ant-table-wrapper {
        max-width: 70% !important;

        .ant-table-body {
            font-size: 13px;
        }

        .ant-table-body::-webkit-scrollbar {
            width: 1px;
        }
    }

    .setPanel_card {
        background: var(--semi-color-bg-0);
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid var(--semi-color-border);
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
            justify-content: flex-start;
            margin: 0 0 16px 0;

            .card_title_icon {
                color: #4CC3FA;
                font-size: 30px;
                margin-right: 5px;
                position: relative;
                top: 5px;
            }
        }

        .card_desc {
            color: var(--semi-color-text-0);
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
            background: var(--semi-color-bg-1);
            border-radius: 12px;
            border: 1px solid var(--semi-color-border);
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
                color: var(--semi-color-text-2);
            }

            .card_item_title {
                display: flex;
                align-items: center;
                gap: 8px;
                border-bottom: 1px solid var(--semi-color-border);
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
</style>