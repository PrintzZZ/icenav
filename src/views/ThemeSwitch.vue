<template>
  <div class="theme-switch">
    <div class="theme-switch-icon" @click="toggleTheme">
        <IconLight v-if="isDarkMode" />
        <IconDark v-else />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { IconDark, IconLight } from '../components/icons'
import { useLinkData } from '../store/LinkStore'
import { useSettingData } from '../store/SettingStore'

const isDarkMode = ref(false)

// 切换主题
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  useSettingData().updateOtherSettings({ defaultTheme: isDarkMode.value ? 'dark' : 'light' })
  document.documentElement.setAttribute('data-theme', isDarkMode.value ? 'dark' : 'light')
  //切换背景
  useLinkData().updatebackground(isDarkMode.value ? 'dark' : 'light');
}

// 组件挂载时同步当前主题状态
onMounted(() => {
  let otherSettings = useSettingData().otherSettings
  otherSettings.defaultTheme === 'light' ? isDarkMode.value = false : isDarkMode.value = true
})
</script>

<style scoped>

.theme-switch {
  display: inline-flex;
  align-items: center;
  margin-right: 2px;
}

.theme-switch-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  font-size: 22px;
  margin-left: 5px;
  color: #fff;
  cursor: pointer;
  border-radius: 3px;
  transition: .3s;
}

.theme-switch-icon:hover {
  background-color: #45428f9c;

}

</style>
