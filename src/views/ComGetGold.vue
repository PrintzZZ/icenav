<template>

    <div class="earnings-container" v-if="showGetGold" @mouseleave="showSettings = false"
        @mouseenter="showSettings = true">
        <transition name="earnings-fade">
            <div class="earnings-card earnings-setting" v-if="showSettings">
                <i class="icon-setting" @click="earningsOpen = true;">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"
                        focusable="false" aria-hidden="true">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M10.3 1a1 1 0 0 0-.98.78l-.67 2.95a8 8 0 0 0-1.27.74l-2.9-.9a1 1 0 0 0-1.16.46l-1.7 2.94a1 1 0 0 0 .19 1.24l2.22 2.06a8.1 8.1 0 0 0 0 1.46L1.81 14.8a1 1 0 0 0-.19 1.24l1.7 2.94a1 1 0 0 0 1.17.46l2.9-.9a8 8 0 0 0 1.26.74l.67 2.95c.1.46.51.78.98.78h3.4a1 1 0 0 0 .98-.78l.67-2.95c.45-.2.87-.46 1.27-.74l2.9.9a1 1 0 0 0 1.16-.46l1.7-2.94a1 1 0 0 0-.19-1.24l-2.22-2.06a8.1 8.1 0 0 0 0-1.46l2.22-2.06a1 1 0 0 0 .19-1.24l-1.7-2.94a1 1 0 0 0-1.17-.46l-2.9.9a8 8 0 0 0-1.26-.74l-.67-2.95A1 1 0 0 0 13.7 1h-3.4Z"
                            fill="#DDE3E8"></path>
                        <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" fill="#AAB2BF">
                        </path>
                        <circle cx="12" cy="12" r="3" fill="#324350"></circle>
                    </svg>
                </i>
            </div>

            <div class="earnings-card" v-else>
                <div class="earnings-header">
                    <p class="title" v-if="progressWidth == 0">
                        <span class="title-start" :style="{ color: textColor }">今天预计可以赚 {{ Currency }} {{ dailySalary.toFixed(2) }}</span>
                    </p>
                    <p class="title" v-if="progressWidth > 0 && progressWidth < 100">
                        <span class="icon">💰</span>
                        <span class="title-text" :style="{ color: textColor }">{{ showMainText }}{{ Currency }}{{ currentEarnings.toFixed(2) }}</span>
                    </p>
                    <p class="title" v-if="progressWidth >= 100">
                        <span class="icon">💼</span>
                        <span class="title-text" :style="{ color: textColor }"> 到点下班！</span>
                    </p>
                    <p class="titleSub" :style="{ color: textColor }">{{ subText }}</p>
                </div>
                <div class="earnings-footer">
                    <div class="progress-bar" :style="{ backgroundColor: showColor.backColor, }">
                        <div class="progress" :style="{ width: progressWidth + '%' ,backgroundColor: showColor.proColor}"></div>
                    </div>
                </div>
            </div>
        </transition>

        <a-modal v-model:open="earningsOpen" title="💰 薪酬设置" @ok="saveSettings" @cancel="cancelSettings"
            :maskClosable="false" width="400px">
            <div class="earnings-settings">
                <div class="settings-item">
                    <span class="label">月薪设置</span>
                    <a-input-number v-model:value="tempSettings.monthlySalary" :min="0" :max="1000000"
                        :addon-before="Currency" style="width: 200px" />
                </div>

                <div class="settings-item">
                    <span class="label">工作时间</span>
                    <div class="time-picker-group">
                        <a-time-picker v-model:value="workTimeRange[0]" format="HH:mm" :minute-step="30"
                            placeholder="开始时间" style="width: 95px" />
                        <span class="time-separator">至</span>
                        <a-time-picker v-model:value="workTimeRange[1]" format="HH:mm" :minute-step="30"
                            placeholder="结束时间" style="width: 95px" />
                    </div>
                </div>

                <div class="settings-item">
                    <span class="label">每月工作天数</span>
                    <a-input-number v-model:value="tempSettings.workDays" :min="1" :max="31" style="width: 200px" />
                </div>

                <div class="settings-item">
                    <span class="label">货币符号</span>
                    <a-select v-model:value="tempSettings.currency" style="width: 200px">
                        <a-select-option value="¥">人民币 (¥)</a-select-option>
                        <a-select-option value="$">美元 ($)</a-select-option>
                        <a-select-option value="€">欧元 (€)</a-select-option>
                        <a-select-option value="£">英镑 (£)</a-select-option>
                    </a-select>
                </div>

                <div class="settings-item">
                    <span class="label">文字颜色</span>
                    <a-input-group compact style="width: 200px">
                        <a-select v-model:value="textColor" style="width: 50%">
                            <a-select-option v-for="item in textOptions" :value="item.value">{{ item.label }}</a-select-option>
                        </a-select>
                        <a-input v-model:value="textColor" style="width: 50%" />
                    </a-input-group>
                </div>

                <div class="settings-item">
                    <span class="label">进度颜色</span>
                    <a-select v-model:value="progressColor" style="width: 200px">
                        <a-select-option value="blue">蓝色</a-select-option>
                        <a-select-option value="orange">橙色</a-select-option>
                        <a-select-option value="red">红色</a-select-option>
                        <a-select-option value="green">绿色</a-select-option>
                    </a-select>
                </div>
            </div>
        </a-modal>
    </div>

</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watchEffect } from 'vue';
import dayjs from 'dayjs';
import { message } from 'ant-design-vue';
import { useSettingData } from '@/store/SettingStore';

const monthlySalary = ref(10000); // 月薪
const startHour = ref(8); // 上班时间
const endHour = ref(18); // 下班时间
const workDays = ref(30); // 工作天数
const startMinute = ref(0);
const endMinute = ref(0);
const workHoursPerDay = computed(() => {
    const startTimeInMinutes = startHour.value * 60 + startMinute.value;
    const endTimeInMinutes = endHour.value * 60 + endMinute.value;
    return (endTimeInMinutes - startTimeInMinutes) / 60;
});
// const showGetGold = useSettingData().otherSettings.showGetGold;
const showGetGold = ref(false)
watchEffect(()=>{
    showGetGold.value = useSettingData().otherSettings.showGetGold;
})

const showSettings = ref(false)
const earningsOpen = ref(false);

const Currency = ref('¥');

const textColor = ref(['#FFFFFF']);
const textOptions = ref([{ value: '#FFFFFF', label: '白色' }, { value: '#000000', label: '黑色' },]);

let colorList = [
    {value:'blue',lable:'蓝色',proColor:'#0095EE',backColor:'#95D8F8'},
    {value:'orange',lable:'橙色',proColor:'#FC8800',backColor:'#FED998'},
    {value:'red',lable:'红色',proColor:'#F93920',backColor:'#FDB7A5'},
    {value:'green',lable:'绿色',proColor:'#3BB346',backColor:'#A4E0A7'}
]
const progressColor = ref('blue');
const showColor = computed(()=>{
    return colorList.find(item => item.value === progressColor.value);
})

// 预设文本
const PreText = ref({
    mainText: [
        '今天的小成果：',
        '今日收获：',
        '今日已累计：',
        '今天已赚取：',
        '今日收益突破：'
    ],
    subText: [
        '每一步的努力，都是离成功更近的一步！',
        '坚持就是胜利，努力总会有回会报！',
        '别停下，属于你的高光时刻在到来！',
        '每天的付出，都会成为未来的基石！',
        '今天的你已经很棒了，继续保持！'
    ]
})
const showMainText = ref(PreText.value.mainText[Math.floor(Math.random() * PreText.value.mainText.length)])
const subText = ref(PreText.value.subText[Math.floor(Math.random() * PreText.value.subText.length)])



// 计算每天的薪资
const dailySalary = computed(() => {
    return monthlySalary.value / workDays.value;
});

// 计算每小时的薪资
const hourlySalary = computed(() => {
    const hours = workHoursPerDay.value;
    if (!hours || hours <= 0) return 0;
    return dailySalary.value / hours;
});

// 当前收入
const currentEarnings = ref(0);

// 计算工作进度
const progressWidth = computed(() => {
    const now = new Date();
    const start = new Date();
    start.setHours(startHour.value, startMinute.value, 0, 0);
    const end = new Date();
    end.setHours(endHour.value, endMinute.value, 0, 0);
    const progress = (now - start) / (end - start) * 100;
    return Math.min(Math.max(progress, 0), 100);
});

// 格式化工作时间
const formatWorkTime = computed(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
});

// 计算剩余工作时间
const remainingTime = computed(() => {
    const now = new Date();
    const end = new Date();
    end.setHours(endHour.value, endMinute.value, 0, 0);

    if (now > end) return '工作结束';

    const diff = end - now;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `剩余 ${hours}h${minutes}m`;
});

// 更新收入
const updateEarnings = () => {
    const now = new Date();
    const start = new Date();
    start.setHours(startHour.value, startMinute.value, 0, 0);

    const elapsedMilliseconds = Math.max(now - start, 0);
    const elapsedHours = elapsedMilliseconds / (1000 * 60 * 60);

    if (!hourlySalary.value || isNaN(hourlySalary.value)) {
        currentEarnings.value = 0;
        return;
    }

    const earnings = elapsedHours * hourlySalary.value;
    currentEarnings.value = Math.min(earnings, dailySalary.value);
};

let timer;
onMounted(() => {
    const settings = useSettingData().otherSettings;
    if (settings) {
        monthlySalary.value = settings.monthlySalary || 10000;
        startHour.value = settings.startHour || 8;
        startMinute.value = settings.startMinute || 0;
        endHour.value = settings.endHour || 18;
        endMinute.value = settings.endMinute || 0;
        workDays.value = settings.workDays || 30;
        Currency.value = settings.currency || '¥';
        textColor.value = settings.textColor || '#FFFFFF';
        progressColor.value = settings.progressColor || 'blue';
    }

    tempSettings.value = {
        monthlySalary: monthlySalary.value,
        workDays: workDays.value,
        currency: Currency.value,
        showGetGold: showGetGold,
        textColor: textColor.value,
        progressColor: progressColor.value
    };

    workTimeRange.value = [
        dayjs().hour(startHour.value).minute(startMinute.value),
        dayjs().hour(endHour.value).minute(endMinute.value)
    ];

    updateEarnings();
    timer = setInterval(updateEarnings, 1000);
});

onUnmounted(() => {
    clearInterval(timer);
});

// 临时设置对象
const tempSettings = ref({
    monthlySalary: monthlySalary.value,
    workDays: workDays.value,
    currency: Currency.value,
    showGetGold: showGetGold.value,
    textColor: textColor.value,
    progressColor: progressColor.value
});

// 工作时间范围
const workTimeRange = ref([
    dayjs().hour(startHour.value).minute(startMinute.value),
    dayjs().hour(endHour.value).minute(endMinute.value)
]);

// 保存设置
const saveSettings = () => {
    if (!tempSettings.value.monthlySalary || !workTimeRange.value[0] || !workTimeRange.value[1]) {
        message.error('请填写完整信息');
        return;
    }

    monthlySalary.value = tempSettings.value.monthlySalary;
    workDays.value = tempSettings.value.workDays;
    Currency.value = tempSettings.value.currency;

    // 更新工作时间（包括分钟）
    startHour.value = workTimeRange.value[0].hour();
    startMinute.value = workTimeRange.value[0].minute();
    endHour.value = workTimeRange.value[1].hour();
    endMinute.value = workTimeRange.value[1].minute();

    // 保存到 SettingStore
    useSettingData().updateOtherSettings({
        showGetGold: tempSettings.value.showGetGold,
        monthlySalary: monthlySalary.value,
        startHour: startHour.value,
        endHour: endHour.value,
        startMinute: startMinute.value,
        endMinute: endMinute.value,
        workDays: workDays.value,
        currency: Currency.value,
        textColor: textColor.value,
        progressColor: progressColor.value
    });

    message.success('设置已保存');
    earningsOpen.value = false;
    updateEarnings();
};

// 取消设置
const cancelSettings = () => {
    // 重置临时设置
    tempSettings.value = {
        monthlySalary: monthlySalary.value,
        workDays: workDays.value,
        currency: Currency.value,
        showGetGold: showGetGold.value,
        textColor: textColor.value,
        progressColor: progressColor.value
    };
    workTimeRange.value = [
        dayjs().hour(startHour.value).minute(startMinute.value),
        dayjs().hour(endHour.value).minute(endMinute.value)
    ];
    earningsOpen.value = false;
};
</script>

<style lang="less">
:root {
    --earnings-progress-bar-height: 12px;
    // --earnings-progress-bar-color: #d2c169;
    --earnings-progress-bar-color: #0095EE;
    --earnings-progress-bar-background-color: #95D8F8;
    --earnings-font-size: 14px;
    --earnings-font-weight: 700;
    --earnings-card-width: 210px;
    --earnings-card-height: 86px;
    --earnings-card-background-color: #ffffff1f;
    --earnings-font-color: #fff;
    --earnings-font-color-2: #fff;
}

.earnings-container {
    width: var(--earnings-card-width);
    height: var(--earnings-card-height);

    .earnings-fade-enter-from,
    .earnings-fade-leave-to {
        opacity: 0;
        transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
    }

    .earnings-fade-leave-active {
        position: absolute;

    }

    .earnings-setting {
        display: flex;
        flex-direction: row;
        align-content: center;
        justify-content: center;
        align-items: center;
        font-size: 30px;
        cursor: pointer;

        .icon-setting {
            width: calc(var(--earnings-card-height) - 30px);
            height: calc(var(--earnings-card-height) - 30px);
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 6px;
            transition: all 0.3s ease;

            &:hover {
                background-color: #ffffff1f;
                transform: scale(1.1);
            }
        }
    }

    .earnings-card {
        border-radius: 6px;
        backdrop-filter: blur(10px);
        padding: 15px;
        transition: all 0.3s ease;
        width: 100%;
        height: 100%;
        // border-bottom: 1px solid #ffffff9c;
        background-color: var(--earnings-card-background-color);

        .earnings-header {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            flex-direction: column;
            margin-bottom: 10px;



            .title {
                width: 100%;
                font-size: var(--earnings-font-size);
                color: var(--earnings-font-color);
                font-weight: var(--earnings-font-weight);
                //超出隐藏
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin: 0;

                .icon {
                    font-size: var(--earnings-font-size);
                    animation: bounce 1.5s infinite;
                    position: absolute;
                }

                .title-text {
                    margin-left: 20px;
                }
            }

            .titleSub {
                font-size: 10px;
                font-weight: 400;
                color: var(--earnings-font-color-2);
                margin: 0;
            }
        }

        .earnings-footer {
            .progress-bar {
                position: relative;
                height: var(--earnings-progress-bar-height);
                background-color: var(--earnings-progress-bar-background-color);
                overflow: hidden;
                border-radius: 10px;

                .progress {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    width: 50%;
                    height: 100%;
                    display: flex;
                    -webkit-box-pack: center;
                    justify-content: center;
                    -webkit-box-align: center;
                    align-items: center;
                    background-color: var(--earnings-progress-bar-color);
                    transition: width .1s linear 0s;
                    animation: 3s linear 0s infinite normal none running progressBar;
                    background-size: 20px 20px;
                    background-image: linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);
                }
            }
        }
    }
}

@keyframes progressBar {
    0% {
        background-position: 0 0;
    }

    100% {
        background-position: 40px 0;
    }
}

@keyframes bounce {

    0%,
    20%,
    50%,
    80%,
    100% {
        transform: translateY(0);
    }

    40% {
        transform: translateY(-5px);
    }

    60% {
        transform: translateY(-2px);
    }
}

.earnings-settings {
    padding: 10px;

    .settings-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;

        .label {
            font-size: 14px;
            color: var(--semi-color-text-0);
            font-weight: 500;
            min-width: 100px;
        }

        &:last-child {
            margin-bottom: 0;
        }

        .time-picker-group {
            display: flex;
            align-items: center;
            gap: 8px;
            width: 200px;

            .time-separator {
                color: var(--semi-color-text-2);
                font-size: 12px;
            }
        }
    }
}

// 自定义模态框样式
:deep(.ant-modal-content) {
    background: var(--semi-color-bg-2);
    border-radius: 12px;
}

:deep(.ant-modal-header) {
    background: transparent;
    border-bottom: 1px solid var(--semi-color-border);
}

:deep(.ant-modal-footer) {
    border-top: 1px solid var(--semi-color-border);
}
</style>