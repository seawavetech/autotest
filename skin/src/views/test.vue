<template>
    <main>
        <el-button type="primary" @click="startTest">开始测试</el-button>
        <el-button type="primary" @click="wsInit">连接webSocket</el-button>
        <el-button type="primary" @click="wsSend" v-if="wsConnected">webSocket测试</el-button>

        <div class="result" v-show="JSON.stringify(result) !== '{}'">
            <pre>{{ JSON.stringify(result, null, 4) }} </pre>
        </div>

        <div class="result-list" v-if="resultList.length">
            <div class="item" v-for="(item, index) in resultList" :key="index">
                <span>{{ item.type }}--</span>
                <span>{{  item.position }}--</span>
                <span>{{  item.message }}</span>
            </div>
        </div>

    </main>
</template>

<script setup lang="ts">
import { onMounted, inject, ref } from 'vue';
import { useRoute } from 'vue-router';
import { testRequest } from '@/api/api'
import { io, Socket } from 'socket.io-client';

import type { Ref } from 'vue'
interface ResultDataType {
    type: 'info' | 'success' | 'error';
    message: string;
    position: 'common' | 'index' | 'category' | 'product' | 'cart' | 'checkout' | 'user';
}

let route = useRoute();
let result = ref({})

let site = route.query.site || 'dad';
let platform = route.query.platform || 'm';
let range = route.query.range || 'all';

let socket: Socket
let wsConnected = ref(false);
let resultList=<Ref<ResultDataType[]>>ref([])

onMounted(() => {
    document.title = 'Auto Test For Trade.'

    resultList.value.push({
        type:'info',
        message:'test',
        position: 'common'
    })
    resultList.value.push({
        type:'info',
        message:'test',
        position: 'common'
    })
    resultList.value.push({
        type:'info',
        message:'test',
        position: 'common'
    })
})

function startTest() {
    let url = `/test/${range}/${site}/${platform}`
    testRequest(url).then((res) => {
        result.value = res.data
    })
}

function wsInit() {
    // ws连接由客户端发起，由服务器端发送完数据后关闭。
    socket = io('ws://localhost:3333', {
        path: '/ws/',
        autoConnect: false
    });

    socket.connect();

    console.log(socket);
    socket.on('connect', () => {
        wsConnected.value = true;
        console.log(socket.id);
    })

    socket.on("connect_error", () => {
        // socket.connect();
    });

    socket.on("disconnect", (reason) => {
        wsConnected.value = false;
        console.log(reason)
    });

    socket.on('result', (data:ResultDataType) => {
        console.log(data);
        resultList.value.push(data)
    })


}

let count = 0;
function wsSend() {
    socket.emit('message', {
        type: 'test',
        site: 'dad',
        platform: 'm',
        range: 'all'
    })
}




</script>

