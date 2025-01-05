<template>
    <div class="com-todo-list" v-if="!useSettingData().otherSettings.todoListShow">
        <transition-group name="list" tag="ul" class="todo-list">
            <li v-for="(task, index) in tasks" :key="task.text" class="todo-item" @click.stop="toggleTask(index)">
                <div class="todo-item-content">
                    <!-- <i class="checkbox-icon" :class="{ 'checked': task.completed }" ></i> -->
                    <span class="todo-text" :class="{ 'checked': task.completed }">{{ task.text }}</span>
                </div>
                <div class="todo-item-actions">
                    <i class="delete-icon" @click.stop="addTask(index)">+</i>
                    <i class="delete-icon" @click.stop="deleteTask(index)">-</i>
                </div>
            </li>
            <li v-if="tasks.length === 0" key="empty" class="todo-item empty-item" @click="addTask">
                <div class="todo-item-content todo-item-content-empty">
                    <span class="todo-text">点击添加新Todo...</span>
                </div>
            </li>
        </transition-group>



        <a-modal v-model:open="open" title="🔥添加新事项">
            <p class="add-task-modal-tip">已存在{{ tasks.length }}个待办事项，还可添加 {{ 7 - tasks.length - formState.tasks.length
                }} 个</p>
            <a-form :model="formState" layout="vertical">
                <template v-for="(field, index) in formState.tasks" :key="index">
                    <a-form-item>
                        <a-input-group compact>
                            <a-input v-model:value="field.text" placeholder="输入任务内容..."
                                :ref="index === 0 ? (el) => inputRef = el : undefined"
                                style="width: calc(100% - 65px);" />
                            <a-button type="primary" danger @click="removeTask(index)"
                                :disabled="formState.tasks.length <= 1" style="width: 65px;">
                                删除
                            </a-button>
                        </a-input-group>
                    </a-form-item>
                </template>
            </a-form>
            <template #footer>
                <div class="add-task-modal-footer">
                    <div class="add-task-modal-footer-left">
                        <a-button type="dashed" block @click="addNewTask"
                            :disabled="formState.tasks.length + tasks.length >= 7">
                            + 添加更多任务
                        </a-button>
                    </div>
                    <div class="add-task-modal-footer-right">
                        <a-button key="cancel" @click="handleCancel">取消</a-button>
                        <a-button key="submit" type="primary"
                            :disabled="!formState.tasks.some(task => task.text?.trim())" @click="handleOk">
                            确定
                        </a-button>
                    </div>
                </div>
            </template>
        </a-modal>
    </div>

</template>

<script setup>
import { ref, reactive, nextTick, h } from 'vue'
import { IconClose } from '@/components/unIcons'
import { message } from 'ant-design-vue'
import { useSettingData } from '@/store/SettingStore'

const tasks = ref(useSettingData().todoList)
const open = ref(false)
const inputRef = ref(null)

const formState = reactive({
    tasks: [{ text: '' }]
})

const addNewTask = () => {
    if (formState.tasks.length + tasks.value.length == 6) {
        message.warning('最多添加7个待办事项')
    }
    formState.tasks.push({ text: '' })
}

const removeTask = (index) => {
    formState.tasks.splice(index, 1)
}

// 添加任务
const handleOk = () => {
    const newTasks = formState.tasks
        .map(task => task.text.trim())
        .filter(text => text)
        .map(text => ({
            text,
            completed: false
        }))

    if (newTasks.length > 0) {
        tasks.value.push(...newTasks)
        useSettingData().updateTodoList(tasks.value)
        handleCancel()
    }
}

// 删除任务
const deleteTask = (index) => {
    tasks.value.splice(index, 1)
    useSettingData().updateTodoList(tasks.value)
}

// 切换任务状态
const toggleTask = (index) => {
    tasks.value[index].completed = !tasks.value[index].completed
    // 所有的任务都完成
    if (tasks.value.every(task => task.completed)) {
        message.success('太棒了，所有待办都已完成！')
    }
}

// 打开添加任务弹窗
const addTask = (index) => {
    if (tasks.value.length >= 7) {
        message.warning('最多添加7个待办事项,请先删除一些事项')
        return
    }
    open.value = true
}
// 关闭添加任务弹窗
const handleCancel = () => {
    formState.tasks = [{ text: '' }]
    open.value = false
}
</script>

<style lang="less" scoped>
.add-task-modal-tip {
    margin-bottom: 10px;
    font-size: 14px;
    color: var(--semi-color-text-2);
}

.add-task-modal-item {
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: space-between;
}

.add-task-modal-footer {
    display: flex;
    justify-content: space-between;
    gap: 10px;

    .add-task-modal-footer-left {
        flex: 1;
    }
}

.com-todo-list {


    .todo-list {
        width: 210px;
        margin: 0;
        padding: 0;
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 8px;
        min-height: 36px;
        transition: all 0.3s;
    }

    .add-task-btn {
        margin-top: 10px;
        display: flex;
        align-items: center;
        gap: 5px;
        cursor: pointer;
        color: var(--earnings-font-color);
        opacity: 0.8;
        transition: opacity 0.2s;

        &:hover {
            opacity: 1;
        }

        .plus-icon {
            font-size: 16px;
        }
    }
}

.todo-item {
    display: flex;
    align-items: center;
    gap: 10px;
    transition: all 0.3s;
    position: relative;
    border-radius: 6px;
    width: 100%;



    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        right: 0;
        width: 3px;
        height: 100%;
        background-color: rgba(var(--semi-blue-2), 0.8);
        border-top-right-radius: 6px;
        border-bottom-right-radius: 6px;
    }

    &:hover .todo-item-content {
        transform: translateX(-39px);
    }

    &:hover .todo-item-content-empty {
        transform: translateX(0px);
    }

    &:hover .todo-item-actions {
        opacity: 1;
    }



    .todo-item-content {
        display: flex;
        align-items: center;
        gap: 10px;
        flex: 1;
        border-radius: 6px;
        background-color: #ffffff1f;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        transition: all 0.3s;
        backdrop-filter: blur(10px);
        overflow: hidden;
        cursor: pointer;


        .todo-text {
            flex: 1;
            color: var(--earnings-font-color);
            transition: all 0.3s;
            padding: 10px 15px;
            padding-right: 10px;
            line-height: 16px;
            font-size: 14px;
            font-weight: lighter;
            transition: all 0.3s;

            &.checked {
                text-decoration: line-through;
                opacity: 0.6;
                animation: checkText .3s cubic-bezier(0.25, 0.1, 0.25, 1.0) forwards;
                position: relative;

                &::before {
                    content: '✓';
                    position: absolute;
                    left: 0px;
                    opacity: 0.6;
                }
            }
        }

        @keyframes checkText {
            0% {
                opacity: 1;
                transform: translateX(0px);
            }

            100% {
                opacity: 0.6;
                transform: translateX(10px);
            }
        }



    }

    .todo-item-actions {
        opacity: 0;
        cursor: pointer;
        transition: all 0.3s;
        position: absolute;
        right: 0;
        display: flex;
        flex-direction: column;
        width: 36px;
        margin-right: 3px;
    }




    .delete-icon {
        color: var(--earnings-font-color);
        font-size: 14px;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2px 10px;
        box-shadow: inset -4px 0px 2px 0px #6363631f;
        border-radius: 2px;
        margin: 0 2px;

        &:hover {
            background-color: rgba(var(--semi-blue-2), 0.5);
            color: #fff;
        }
    }
}

.list-move,
/* 对移动中的元素应用的过渡 */
.list-enter-active,
.list-leave-active {
    transition: all .50s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateY(30px);
}

.list-leave-active {
    position: absolute;
}


.empty-item {
    cursor: pointer;
    background-color: #ffffff0f;
    backdrop-filter: blur(10px);

    &:hover {
        opacity: 1;
    }

    .todo-item-content {
        background-color: #ffffff0f;
    }
}
</style>