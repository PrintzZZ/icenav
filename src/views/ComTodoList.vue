<template>
    <div class="com-todo-list">
        <transition-group name="list" tag="ul" class="todo-list">
            <li v-for="(task, index) in tasks" :key="task.text" class="todo-item" @click.stop="toggleTask(index)">
                <div class="todo-item-content">
                    <!-- <i class="checkbox-icon" :class="{ 'checked': task.completed }" ></i> -->
                    <span class="todo-text" :class="{ 'checked': task.completed }">{{ task.text }}</span>
                </div>
                <div class="todo-item-actions">
                    <i class="delete-icon" @click.stop="addTask(index)">增</i>
                    <i class="delete-icon" @click.stop="deleteTask(index)">删</i>
                </div>
            </li>
            <li v-if="tasks.length === 0" key="empty" class="todo-item empty-item" @click="addTask">
                <div class="todo-item-content todo-item-content-empty">
                    <span class="todo-text">点击添加新Todo...</span>
                </div>
            </li>
        </transition-group>



        <a-modal v-model:open="open" title="添加新事项" @ok="handleOk" @cancel="handleCancel">
            <a-input v-model:value="newTask" placeholder="输入任务内容..." @pressEnter="handleOk" ref="inputRef" />
            <template #footer>
                <a-button key="cancel" @click="handleCancel">取消</a-button>
                <a-button key="submit" type="primary" :disabled="!newTask?.trim()" @click="handleOk">
                    确定
                </a-button>
            </template>
        </a-modal>
    </div>

</template>

<script setup>
import { ref, nextTick } from 'vue'

const tasks = ref([
    {
        text: '任务1: 点击完成',
        completed: false
    },
    {
        text: '任务2: 增加与删除',
        completed: false
    }
])
const newTask = ref('')
const open = ref(false)
const inputRef = ref(null)

const addTask = () => {
    open.value = true
    nextTick(() => {
        inputRef.value?.focus()
    })
}

const handleOk = () => {
    if (newTask.value?.trim()) {
        tasks.value.push({
            text: newTask.value.trim(),
            completed: false
        })
        handleCancel()
    }
}

const handleCancel = () => {
    newTask.value = ''
    open.value = false
}

const toggleTask = (index) => {
    tasks.value[index].completed = !tasks.value[index].completed
}

const deleteTask = (index) => {
    tasks.value.splice(index, 1)
}
</script>

<style lang="less" scoped>
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
        transform: translateX(-30px);
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


        .todo-text {
            flex: 1;
            color: var(--earnings-font-color);
            transition: all 0.3s;
            padding: 10px 15px;
            padding-right: 10px;
            line-height: 16px;
            font-size: 14px;
            font-weight: lighter;

            &.checked {
                text-decoration: line-through;
                opacity: 0.6;
            }
        }

        .checkbox-icon {
            display: inline-block;
            width: 15px;
            height: 15px;
            border-radius: 3px;
            border: 1px solid #fff;
            cursor: pointer;
            transition: all 0.2s;
            margin-left: 15px;

            &.checked {
                background-color: #fff;
                position: relative;

                &:after {
                    content: '✔️';
                    position: absolute;
                    color: #000;
                    font-size: 12px;
                    top: 50%;
                    left: 50%;
                    transform: translateX(-50%) translateY(-50%);
                }
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
        width: 27px;
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
        

        &:hover {
            background-color: rgba(var(--semi-blue-2), 0.5);
            color: #fff;
        }
    }
}

.list-move, /* 对移动中的元素应用的过渡 */
.list-enter-active,
.list-leave-active {
  transition: all .50s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
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