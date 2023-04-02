<template>
    <el-row style="background-color: #252d35;">
        <el-col>
            <el-switch v-model="switchStatus" class="ml-2" inline-prompt
                style="--el-switch-on-color: #45d7c4; --el-switch-off-color: #868686" active-text="展开" inactive-text="收起" />
            <el-menu active-text-color="#ffd04b" background-color="#252d35" default-active="2" text-color="#fff"
                :collapse="switchStatus" @open="handleOpen" @close="handleClose">
                <template v-for="(nav, index) in navList" :key="index">
                    <el-sub-menu :index="`${index}`" v-if="nav.children && nav.children.length > 0">
                        <template #title>
                            <el-icon>
                                <icon-menu />
                            </el-icon>
                            <span>{{ nav.title }}</span>
                        </template>
                        <template v-for="(nav2, index2) in nav.children" :key="index2">
                            <el-menu-item-group :title="nav2.title" v-if="nav2.group && nav2.group.length > 0">
                                <el-menu-item :index="`${index}-${index2}-${index3}`" v-for="(nav3, index3) in nav2.group"
                                    :key="index3">
                                    <router-link :to="nav3.url">{{ nav3.title }}</router-link>
                                </el-menu-item>
                            </el-menu-item-group>
                            <el-menu-item :index="`${index}-${index2}`" v-else>
                                <router-link :to="nav2.url">{{ nav2.title }}</router-link>
                            </el-menu-item>
                        </template>
                    </el-sub-menu>
                    <el-menu-item :index="`${index}`" v-else>
                        <el-icon>
                            <setting />
                        </el-icon>
                        <router-link :to="nav.url">{{ nav.title }}</router-link>
                    </el-menu-item>
                </template>
            </el-menu>
        </el-col>
    </el-row>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
    Document,
    Menu as IconMenu,
    Location,
    Setting,
} from '@element-plus/icons-vue'

const switchStatus = ref(false);
/*
* 导航配置
* 1. 顶级不分组，可独立，可有子项
* 2. 二级可分组，可独立，无子项
* */
let navList = ref([
    {
        title: '常规测试',
        url: '',
        icon: '',
        children: []
    },
    {
        title: '其它测试',
        url: '',
        children: []
    }
])

onMounted(() => {
})


const handleOpen = (key: string, keyPath: string[]) => {
    // console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
    // console.log(key, keyPath)
}
</script>

<style lang="less" scoped>
a {
    color: #fff;
}
</style>
