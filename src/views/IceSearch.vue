<template>
    <div class="ice_search_content">

        <IceHeader />
        <div class="search_video_bg">
            <iframe class="search_bg" scrolling="no" sandbox="allow-scripts" :src="computedSrc"></iframe>
        </div>
        <div class="search_container">
            <div class="search_title">
                <h2>学术搜索引擎</h2>
            </div>
            <div class="search_menu">
                <div class="search_menu_line" :style="{ left: lineStyle.left + 'px', width: lineStyle.width + 'px' }">
                </div>
                <div class="search_menu_item" :class="{ active: menu.active }" v-for="(menu, index) in searchMenu"
                    :key="index" @click="menuClick(index, $event)">
                    <span class="search_menu_name">{{ menu.name }}</span>
                </div>
            </div>
            <form @submit.prevent="handleSubmit" method="get" target="_blank" class="search_form">
                <input type="text" class="search_input" :placeholder="searchFrom.placeholder" v-model="searchQuery"
                    autocomplete="off" />
                <i class="close_icon" @click="clearSearch" v-if="searchQuery.length > 0">
                    <IconClose />
                </i>
                <button type="submit" class="search_btn">
                    <i class="search_icon">
                        <IconSearch />
                    </i>
                </button>
            </form>
            <div class="search_list">
                <ul>
                    <li v-for="(item, itemindex) in searchMenu[searchMenuActiveIndex].engines" :key="itemindex"
                        class="search_list_item" :class="{ active: searchListActiveIndex == itemindex }"
                        @click="listClick(itemindex)">
                        <i class="search_list_icon">
                            <IconTriangle />
                        </i>
                        {{ item.name }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import { ref,computed } from 'vue';
import { IconSearch, IconTriangle, IconClose } from '../components/icons';
import IceHeader from '../views/IceHeader.vue';
import { useLinkData } from '../store/LinkStore';

export default {
    components: {
        IconSearch, IconTriangle, IconClose, IceHeader
    },
    setup() {

        const searchMenu = useLinkData().searchMenu;
        
        const searchMenuActiveIndex = ref(0);
        const searchListActiveIndex = ref(0);
        const lineStyle = ref({ left: 0, width: 0 });
        const searchQuery = ref("");
        const searchFrom = ref({
            name: '百度', link: 'https://www.baidu.com/s?wd=', placeholder: '百度一下', namearrt: 'wd'
        });

        const menuClick = (index, event) => {
            searchMenu.forEach(item => {
                item.active = false;
            });
            searchMenu[index].active = true;
            const span = event.currentTarget.firstElementChild;

            // 更新下划线位置和宽度
            lineStyle.value.left = span.offsetLeft + event.currentTarget.offsetLeft + 20;
            lineStyle.value.width = span.offsetWidth - 40;

            searchMenuActiveIndex.value = index;
            searchFrom.value = searchMenu[index].engines[0];
            searchListActiveIndex.value = 0;
        }
        const listClick = (index) => {
            searchListActiveIndex.value = index;
            searchFrom.value = searchMenu[searchMenuActiveIndex.value].engines[index];
        }

        const handleSubmit = () => {
            window.open(searchFrom.value.link + searchQuery.value, '_blank');
        }

        const clearSearch = () => {
            searchQuery.value = '';
        };
        
        // const backgrounddata = useLinkData().backgrounddata;
        const computedSrc = computed(() => {
            return `${useLinkData().backgrounddata}`;
        });

        return {
            searchMenu,
            searchMenuActiveIndex,
            searchListActiveIndex,
            searchFrom,
            menuClick,
            listClick,
            lineStyle,
            searchQuery,
            handleSubmit,
            clearSearch,
            // backgrounddata,
            computedSrc 
        }
    },
}

</script>
<style lang="less">
.ice_search_content {
    width: 100%;
    height: 450px;
    // background-color: #071336a8;
    padding-top: 120px;
    padding-bottom: 200px;
    position: relative;

    .search_video_bg {
        width: 100%;
        position: absolute;
        top: 0;
        height: 100%;
        z-index: -2;
        background-color: #071336a8;

        .search_bg {
            width: 100%;
            height: 100%;
            border-width: 0;
        }
    }

    .search_container {
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        align-content: center;
        justify-content: center;
        align-items: center;
        max-width: 800px;
        margin: 0 auto;
        padding: 0 20px;

        .search_form {
            width: 100%;
            position: relative;
        }

        .search_icon {
            color: #fff;
            font-size: 25px;
            display: inline-flex;
            flex-direction: row;
            flex-wrap: nowrap;
            align-content: center;
            justify-content: center;
            align-items: center;
        }

        .search_btn {
            position: absolute;
            top: 0;
            right: 0;
            background: transparent;
            border: 0 !important;
            height: 50px;
            width: 50px;
            margin: 0 9px;
            line-height: 50px;
            border-radius: 3px;
            display: flex;
            flex-direction: column;
            flex-wrap: nowrap;
            align-content: center;
            justify-content: center;
            align-items: center;
            cursor: pointer;
        }

        .close_icon:hover {
            opacity: 1;
        }

        .close_icon {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 60px;
            font-size: 20px;
            color: #757575;
            cursor: pointer;
            padding: 0 10px;
            border-right: #23232399 solid 2px;
            opacity: 0.8;
            transition: opacity 0.3s ease-in-out;
        }

        .search_input {
            display: block;
            width: 100%;
            font-weight: 400;
            line-height: 1.5;
            height: 50px;
            font-size: 1pc;
            transition: 0.3s;
            border-radius: 50px;
            color: #fff;
            border: 1px solid rgba(255, 255, 255, 0.05);
            padding: 9px 20px;
            -webkit-backdrop-filter: blur(5px);
            backdrop-filter: blur(5px);
            background-color: rgba(0, 0, 0, 0.6);
            outline: 0;
            border: none;
        }

        .search_title {
            margin-bottom: 1rem;
            font-weight: 500;
            line-height: 1.2;
            font-size: 2.5rem;
            letter-spacing: 6px;
            color: #fff;
        }

        .search_menu {
            width: 100%;
            position: relative;
            height: 50px;
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            align-content: center;
            justify-content: center;
            align-items: center;

            .search_menu_line {
                background: #fff;
                border-radius: 100px;
                height: 4px;
                bottom: 5px;
                -webkit-transition: .25s;
                transition: .25s;
                position: absolute;
                opacity: 1;
            }

            .search_menu_item {
                opacity: .5;
                transition: opacity .3s;
                cursor: pointer;
                color: #fff;
                font-size: 15px;
                text-align: center;
                font-weight: normal;
                margin-bottom: 0;
                padding: 2px 0px;
                word-break: keep-all;
                cursor: pointer;
                transition: .3s;
                position: relative;
                display: inline-block;
            }

            .search_menu_name {
                padding: 10px 20px;
            }

            .search_menu_item::after {
                content: '';
                height: 4px;
                width: 4px;
                border-radius: 2px;
                position: absolute;
                left: 50%;
                bottom: -8px;
                margin-left: -2px;
                background-color: rgba(255, 255, 255, 0);
                transition: .3s;
            }

            .search_menu_item:not(.active):hover::after {
                background-color: #fff;
            }

            .search_menu_item:hover {
                opacity: 1;
            }

            .search_menu_item.active {
                opacity: 1;
            }
        }




        .search_list {
            width: 100%;

            ul {
                width: 100%;
                position: relative;
                height: 50px;
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                align-content: center;
                justify-content: center;
                align-items: center;
            }

            .search_list_item.active {
                opacity: 1;
            }

            .search_list_item.active .search_list_icon {
                display: flex;
            }

            .search_list_item:hover {
                opacity: 1;
            }

            .search_list_item {
                height: 100%;
                cursor: pointer;
                color: #fff;
                font-size: 12px;
                text-align: center;
                font-weight: normal;
                margin-bottom: 0;
                padding: 2px 0px;
                word-break: keep-all;
                cursor: pointer;
                transition: .3s;
                position: relative;
                display: inline-block;
                padding: 10px 20px;
                opacity: .5;
                transition: opacity .3s;
                display: flex;
                flex-direction: column;
                align-content: center;
                justify-content: center;
                align-items: center;

                .search_list_icon {
                    position: absolute;
                    top: -12px;
                    display: flex;
                    flex-direction: column;
                    align-content: flex-start;
                    justify-content: flex-start;
                    align-items: flex-start;
                    font-size: 30px;
                    color: rgba(0, 0, 0, 0.6);
                    display: none;
                    cursor: pointer;
                }
            }
        }
    }
}

@media screen and (max-width: 768px) {
    #IceoohNavigate .mobile {
        .ice_search_content {
            padding: 50px 0px;
        }

        .search_container {
            padding: 0 10px;

            .search_title {
                font-size: 1.5rem;
            }

            .search_input {
                height: 45px;
                font-size: 0.9rem;
            }

            .search_btn {
                height: 45px;
            }
        }

        .search_menu {
            overflow-x: auto;
            justify-content: flex-start;

            .search_menu_line {
                bottom: 5px;
                left: 27px;
                width: 38px;
            }
        }

        .search_list_item.active {
            opacity: 1;
        }

        .search_menu_item::after {
            display: none;
        }

        .search_list ul {
            overflow: auto;
            padding: 0 10px;
            justify-content: flex-start;
        }

        .search_list ul::-webkit-scrollbar {
            display: none;
        }

        .search_menu::-webkit-scrollbar {
            display: none;

        }

    }
}
</style>