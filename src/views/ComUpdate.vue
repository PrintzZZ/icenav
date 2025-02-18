<template>
    <!-- 更新小组件 -->
    <div class="com-update" @click="checkUpdate">
        
        <IconSync />
    </div>

</template>
<script setup>
import { onMounted, ref } from 'vue';
import { IconSync } from '../components/unIcons';
import { defaultData } from '../utils/defaultData';
import { useLinkData } from '../store/LinkStore';
import { message, Modal } from 'ant-design-vue';

const updateList = ref(null);
const linkData = ref(useLinkData().menuList);



const checkUpdate = () => {
    Modal.confirm({
        title: '点击确认检查并更新',
        content: '仅拉取服务器最新导航数据，为防止破坏原有数据，只会新增。您可以更新后导出xlsx文件进行二次修改。',
        onOk: () => updateMenuList(), // 直接传递函数引用
    });
};

const updateMenuList = () => {


    updateList.value = [...linkData.value]; // 复制当前数据
    // 将 linkData 转换为映射表，提高查找效率
    const linkDataMap = createLinkDataMap(updateList.value);
    let hasUpdate = false; // 标记是否有新增数据

    // 遍历 defaultData 检查并更新数据
    defaultData.menuList.forEach(dItem => {
        dItem.child.forEach(cItem => {
            cItem.item.forEach(iItem => {

                if (!linkDataMap.has(iItem.title)) {
                    // 如果数据不存在，则新增
                    if (addNewItem(dItem, cItem, iItem)) {
                        hasUpdate = true;
                    }
                }
            });
        });
    });

    // 如果手动更新且有新增数据，则更新数据
    if (hasUpdate ) {
        useLinkData().updateMenuList(updateList.value); // 更新数据
        updateList.value = null; // 清空更新列表
        message.success('更新完成');
    }else{
        message.info('没有发现更新内容');
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



// **优化的新增数据方法**
const addNewItem = (parentNode, childNode, item) => {
    let parent = updateList.value.find(lItem => lItem.name === parentNode.name);

    // **如果父级不存在，则新增**
    if (!parent) {
        parent = {
            activeKey: parentNode.activeKey,
            icon: parentNode.icon,
            isOpen: false,
            name: parentNode.name,
            child: []
        };
        updateList.value.push(parent); // 添加父级
    }

    // **检查子级是否存在**
    let child = parent.child.find(c => c.name === childNode.name);
    if (!child) {
        child = {
            name: childNode.name,
            item: []
        };
        parent.child.push(child); // 添加子级
    }

    // **添加子项**
    child.item.push(item);
    return true; // 标记已更新
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
    position: relative;

    &:hover {
        background-color: var(--semi-color-fill-0);
        transform: scale(1.15);
    }

    .dot {
        position: absolute;
        width: 50px;
        height: 50px;
        top: 50%;
        right: 50%;
        transform: translate(50%, -50%);

        &::after {
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            width: 6px;
            height: 6px;
            background: #ff4d4f;box-shadow: 0 0 0 1px #ffffff;
            border-radius: 100%;
        }
    }
}
</style>