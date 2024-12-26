<template>
    <div class="footer-bar-links">
        <div class="footer-bar-left">
            <div id="footer-bar-tips">
                <div class="copyright">Copyright © 2025 By
                    <a class="footer-bar-link footer-iceooh" target="_blank" href="/" rel="external nofollow">
                        <img class="author-avatar entered loading" src="/images/favicon.png" alt="avatar"
                            data-ll-status="loading">Iceooh冰屋导航
                    </a>
                </div>
                <div class="beian-group">
                    <a class="footer-bar-link" href="https://beian.miit.gov.cn/" target="_blank"
                        rel="noopener external nofollow noreferrer">皖ICP备2023015298号</a>
                    <a class="footer-bar-link allsite_ok" href="https://status.iceooh.com/" target="_blank"
                        rel="noopener external nofollow noreferrer" id="allsite_status"
                        title="最新更新时间: 2024/12/26 02:33:26">
                        <div class="status-light"></div><span>所有业务正常</span>
                    </a>
                </div>
            </div>
        </div>
        <div class="footer-bar-right">
            <a class="footer-bar-link" href="https://txc.qq.com/products/679436" rel="external nofollow"
                target="_blank">反馈与留言</a>
            <span class="footer-bar-link cursor" @click="handleClick">打赏</span>
            <span class="footer-bar-link">©️</span>
        </div>
    </div>
    <a-modal v-model:visible="visible" title="✨️感谢你赋予我前进的力量！" footer>
        <div class="pay-group">
            <div class="pay-item">
                <a-image :width="150" src="/images/alipay.png" alt="支付宝" />
                <span class="pay-item-text">支付宝扫一扫</span>
            </div>
            <div class="pay-item">
                <a-image :width="150" src="/images/wechat.png" alt="微信" />
                <span class="pay-item-text">微信扫一扫</span>
            </div>
        </div>
    </a-modal>
</template>
<script setup>
import { ref } from 'vue';

const visible = ref(false);

const handleClick = () => {
    visible.value = true;
};
</script>
<style lang="less" scoped>
.footer-bar-links {
    display: flex;
    justify-content: space-between;
    // max-width: 1400px;
    width: 100%;
    // margin: 0 auto;
    flex-wrap: wrap;
    align-items: center;
    line-height: 1;
    padding: 20px;
}

.cursor {
    cursor: pointer;
}

.footer-bar-left .copyright {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 0.9rem;
}

.footer-bar-left .footer-iceooh {
    font-size: 0.9rem;
}

.footer-bar-left {
    display: flex;
    flex-wrap: wrap;
    min-height: 32px;
    align-items: center
}

div#footer-bar-tips {
    display: flex;
    gap: 8px;
    flex-direction: column;
}



.beian-group {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.beian-group .footer-bar-link {
    font-size: 12px;
    font-weight: 400;
    color: var(--semi-color-text-2);
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 3px;
}

img.beian-icon {
    height: 14px;
    min-width: 13px;
    min-height: 14px;
}

.footer-bar-link {
    margin: 0 4px;
    color: var(--semi-color-text-0);
    font-size: .8rem;
    font-weight: 700;
    white-space: nowrap;
    padding: 8px;
    border-radius: 32px;
    line-height: 1;
    display: flex;
    align-items: center;
    gap: 4px
}

.footer-bar-link .author-avatar {
    width: 20px;
    // border-radius: 20px;
    min-height: 20px;
    min-width: 20px;
    max-width: 100%;
    transition: all .2s ease 0s;
    border-style: none;
}

.footer-bar-link.cc {
    margin-right: 0
}

.footer-bar-link.cc i {
    font-size: 18px
}

.footer-bar-left>span {
    margin-right: 1rem
}

.allsite_ok .status-light {
    background: #57bd6a56;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    border-radius: 50%;
}

.allsite_ok .status-light::after {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #57bd6a;
}

.footer-bar-right {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
}

.pay-group {
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    gap: 1rem;
    margin: 1rem 0;
}

.pay-item {
    display: flex;
    flex-direction: column;
    align-content: center;
    align-items: center;
}

.pay-item-text {
    font-size: 12px;
    color: var(--semi-color-text-2);
}

@media screen and (max-width: 767px) {
    .footer-bar-links {
        justify-content: center;
        gap: 8px;
    }

    .beian-group {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        justify-content: center;
        flex-direction: column;
        align-content: center;
        align-items: center;
    }
}
</style>