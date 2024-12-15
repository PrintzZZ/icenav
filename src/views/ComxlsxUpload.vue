<template>
    <div class="ice_upload_set" :style="{height: `${fileList.length > 0 ? 160 : 100}px`}">
        <div class="setting upload">
            <a-upload-dragger class="upload_dragger" v-model:file-list="fileList" name="file" accept=".xlsx"
                :max-count="1" :customRequest="fileUpload" :before-upload="beforeUpload" @change="handleChange">
                <IconUpload style="font-size: 30px; color: #A5A5A5; " />
                <p style="font-size: 12px; color:#A5A5A5;padding: 0 5px;">点击或拖拽文件到此处</p>
                <template #itemRender="{ file, actions }">
                    <a-space>
                        <div class="list_main">
                            <div class="list_card">
                                <div class="card-preview">
                                    <IconFile />
                                </div>
                                <div class="card-info-main">
                                    <!-- 文件信息 -->
                                    <div class="card-info-main-text">
                                        <div class="info-text">{{ file.name }}</div>
                                        <div class="info-size">{{ `${parseFloat(file.size / 1024).toFixed(1)}KB` }}
                                        </div>
                                    </div>
                                    <!-- 进度条 -->
                                    <div class="card-info-main-progress" role="progressbar" style="width: 100%;"
                                        v-if="(file.status === 'uploading' || file.status === 'done' )&& !uploadError">
                                        <div class="progress-track" style="background-color: #2e32380d;">
                                            <div class="progress-track-inner"
                                                :style="`background: #3bb346;width: ${readProgress}%;`"></div>
                                        </div>
                                        <span class="progress_check" v-if="file.status === 'done'">
                                            <IconChecked />
                                        </span>
                                    </div>
                                    <!-- 上传失败 -->
                                    <div class="card-info-main-control" v-if="uploadError">
                                        <span class="card-info-validate-message">
                                            <IconWarning />上传失败
                                        </span>
                                        <!-- <span class="card-info-retry">重试</span> -->
                                    </div>
                                </div>
                                <!-- 关闭按钮 -->
                                <button class="card-close" @click="actions.remove">
                                    <span class="card-close-icon">
                                        <IconClose />
                                    </span>
                                </button>
                            </div>
                        </div>
                    </a-space>
                </template>
            </a-upload-dragger>
        </div>



    </div>

</template>
<script setup>
import { ref } from 'vue';
import { useLinkData } from '../store/LinkStore';
import { message } from 'ant-design-vue';
import { IconUpload, IconFile, IconWarning, IconClose, IconChecked } from '../components/icons';
import * as XLSX from 'xlsx'

const fileList = ref([]);
const excelData = ref([]);
const uploadError = ref(false);
const readProgress = ref(0);
const menuList = useLinkData().menuList; //初始化侧边栏数据




// 处理上传状态变化
const handleChange = (info) => {
    if (info.file.status === 'done') {
        // console.log('上传成功', info.file);
        uploadError.value = false;

        let data = convertData(excelData.value)
        useLinkData().updateMenuList(data)
        message.success('数据更新成功');

        // console.log('上传成功', data);

    } else if (info.file.status === 'error') {
        // console.error('上传失败');
        uploadError.value = true;
        message.error('文件解析失败，请检查文件格式是否正确');
    }
    if (info.file.status === 'removed') {
        readProgress.value = 0;
    }
};



// 上传文件
const fileUpload = async ({ file, onSuccess, onError }) => {
    const data = await getXlsxData(file)
    if (data.length === 0) { onError(); return; }
    excelData.value = data;
    onSuccess();
};


//读取excel文件
const readFile = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsArrayBuffer(file)
        reader.onload = (e) => {
            resolve(e.target.result)
        }
        reader.onerror = (e) => {
            reject(e)
        }
    })
}


//读取表格数据
const getXlsxData = async (file) => {
    const dataBinary = await readFile(file)

    try {
        const workBook = XLSX.read(dataBinary)
        const workSheet = workBook.Sheets[workBook.SheetNames[0]]
        const data = XLSX.utils.sheet_to_json(workSheet)
        const newData = data.slice(0, data.length - 1)
        return newData
    } catch (error) {
        return [];
    }
}

// 上传前的校验
const beforeUpload = file => {
    const isXlsx = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    if (!isXlsx) {
        message.error(`${file.name} 不是 .xlsx 文件`);
        uploadError.value = true; // 上传失败
        return false;   // 阻止上传
    }
    return true;
};


//转换数据结构
const convertData = (originalDataArray) => {
    const transformed = [];
    const iconList = ['IconHome','IconBanner','IconCalendar','IconRating','IconDesc','IconDatePicker','IconLive','Icontabs','IconDesktop']
    originalDataArray.forEach((item, index) => {
        let category = transformed.find(cat => cat.name === item['一级分类']);
        if (!category) {
            category = {
                name: item['一级分类'],
                icon: 'IconBanner',
                isOpen: false,
                activeKey: `${index}-0`,
                child: []
            };
            transformed.push(category);
        }
        let subCategory = category.child.find(subCat => subCat.name === item['二级分类']);
        if (!subCategory) {
            subCategory = {
                name: item['二级分类'],
                item: []
            };
            category.child.push(subCategory);
        }
        subCategory.item.push({
            
            title: item['网站标题'],
            avatar: item['网站图标'],
            desc: item['网站描述'],
            link: item['网站链接']
        });
        readProgress.value = ((index + 1) / originalDataArray.length) * 100;
    });

    //重置activeKey
    transformed.forEach((item, index) => {
        item.activeKey = `${index}-0`;
        item.icon = iconList[index % iconList.length];
    });
    console.clear()
    
    return transformed;
};

</script>
<style lang="less">
.ice_upload_set {
    display: flex;
    flex-wrap: nowrap;
    align-content: flex-start;
    justify-content: space-between;
    align-items: flex-start;
    flex-direction: row;
    transition: height 0.3s;

    .setting {
        width: 250px;
        height: 100px;
        background-color: var(--semi-color-bg-1);
        border-radius: 6px;
        display: flex;
        align-items: center;

    }

    .upload_dragger {
        width: 250px;
        height: 100%;

        .ant-upload-drag {
            background: #00000000;
        }
    }


    .upload {
        width: 100%;
    }






}

.list_main {
    display: flex;
    flex-wrap: wrap;
    flex-shrink: 0;
    gap: 8px;
    margin: 8px 0;
    // max-height: 172px;
    // overflow-y: scroll;

    .list_card:hover {
        background-color: var(--semi-color-fill-1);
    }

    .list_card {
        border-radius: 6px;
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        height: 52px;
        width: 250px;
        background-color: var(--semi-color-fill-0);
        cursor: pointer;

        .card-preview {
            height: 36px;
            width: 36px;
            margin: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 3px;
            flex-shrink: 0;
            background-color: rgba(var(--semi-grey-3), 1);
            color: rgba(var(--semi-white), 1);

        }

        .card-info-main {
            display: flex;
            flex-wrap: wrap;
            flex: 1 1;

            .card-info-main-text {
                display: flex;
                align-items: center;
                flex-basis: 100%;

                .info-text {
                    width: 0;
                    flex: 1 1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    display: inline-block;
                    font-size: 14px;
                    line-height: 20px;
                    font-weight: 600;
                    color: var(--semi-color-text-0);

                }

                .info-size {
                    font-size: 12px;
                    line-height: 16px;
                    font-weight: 400;
                    margin-left: 8px;
                    color: var(--semi-color-text-2);
                    margin-top: 1px;
                }
            }

            .card-info-main-progress {
                width: 100%;
                height: 4px;
                transition: width .3s cubic-bezier(.62, .05, .36, .95);
                margin: 4px 0;
                display: flex;
                align-items: center;

                .progress_check {
                    background-color: #3bb346;
                    border-radius: 50%;
                    color: rgb(255, 255, 255);
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    margin-left: 5px;
                    font-size: 10px;
                }

                .progress-track {
                    border-radius: 3px;
                    height: 100%;
                    width: 100%;
                    background-color: #2e32380d;
                }

                .progress-track-inner {
                    background: #3bb346;
                    width: 0%;
                    height: 100%;
                    border-radius: 3px;
                    transition: width .3s;
                    transition-timing-function: cubic-bezier(.62, .05, .36, .95);
                }
            }

            .card-info-main-control {
                display: flex;

                .card-info-validate-message {
                    color: #f93920;
                    font-size: 12px;
                    line-height: 16px;
                    display: flex;
                    align-items: center;

                    img {
                        width: 16px;
                        margin-right: 2px;
                    }
                }

                .card-info-retry {
                    color: #0064fa;
                    cursor: pointer;
                    margin-left: 8px;
                    font-size: 12px;
                    line-height: 16px;

                }
            }

        }

        .card-close {
            padding: 4px;
            margin: 8px;
            border: none;
            background: #2220;
            color:  var(--semi-color-text-1);
            justify-content: center;
            align-items: center;
            display: inline-flex;
            height: 24px;
            transition: background-color 0 ease-in 0;
            border-radius: 3px;
            cursor: pointer;

            .card-close-icon {
                font-size: 16px;
                display: inline-block;
                font-style: normal;
                line-height: 0;
                text-align: center;
                text-transform: none;
                text-rendering: optimizeLegibility;
                fill: currentColor;
            }
        }

        .card-close:hover {
            background-color: #2e32380d;
            border: 0 solid transparent;
        }
    }


}
</style>