<template>
    <!-- 更新小组件 -->
    <div class="com-update" @click="checkUpdate">
        <IconSync />
    </div>

</template>
<script setup>
import { ref } from 'vue';
import { IconSync } from '../components/unIcons';
import { defaultData } from '../utils/defaultData';
import { useLinkData } from '../store/LinkStore';
import { message, Modal } from 'ant-design-vue';

const updateList = ref(null);
const linkData = ref(useLinkData().menuList);

const checkUpdate = () => {
    updateList.value = [...linkData.value];
    Modal.confirm({
        title: '点击确认检查并更新',
        content: '仅拉取服务器最新导航数据，为防止破坏原有数据，只会新增。您可以更新后导出xlsx文件进行二次修改。',
        onOk: updateMenuList, // 直接传递函数引用
    });
};

const updateMenuList = () => {
    // 将 linkData 转换为映射表，提高查找效率
    const linkDataMap = createLinkDataMap(updateList.value);
    let hasUpdate = false; // 标记是否有新增数据

    // 遍历 defaultData 检查并更新数据
    defaultData.menuList.forEach(dItem => {
        dItem.child.forEach(cItem => {
            cItem.item.forEach(iItem => {
                if (!linkDataMap.has(iItem.title)) {
                    // 数据不存在于映射表，执行新增逻辑
                    if (addNewItem(dItem.name, cItem.name, iItem)) {
                        hasUpdate = true; // 设置更新标记
                    }
                }
            });
        });
    });

    // 根据更新结果提示用户
    if (hasUpdate) {
        useLinkData().updateMenuList(updateList.value); // 更新数据
        updateList.value = null; // 清空更新列表
        message.success('更新完成');
    } else {
        message.info('没有新增数据，无需更新');
    }
};

// 创建映射表：title -> 数据项
const createLinkDataMap = (dataList) => {
    const map = new Map();
    dataList.forEach(lItem => {
        lItem.child.forEach(lChildItem => {
            lChildItem.item.forEach(slChildItem => {
                map.set(slChildItem.title, {
                    parent: lChildItem.item,
                    data: slChildItem,
                });
            });
        });
    });
    return map;
};

// 新增数据项到指定父级
const addNewItem = (parentName, childName, item) => {
    const parent = updateList.value.find(lItem => lItem.name === parentName);
    if (parent) {
        console.log(parent);
        const child = parent.child.find(c => c.name === childName);
        console.log(child);
        if (child) {
            child.item.push(item); // 添加新数据项
            return true; // 返回新增标记
        }
    }
    return false; // 未新增
};





</script>
<style lang="less">
.com-update {
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
</style>