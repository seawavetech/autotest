<template>
    <main>
        <!-- <Button type="primary" @click="startTest">开始测试</Button> -->
        <Button type="primary" @click="wsInit">{{ wsConnected ? '已' : '' }}连接webSocket</Button>

        <Row class="my-3" v-if="wsConnected">
            <Button type="default" @click="startTest('dad', 'm')">DAD移动版下单流程</Button>
            <Button type="default" @click="startTest('dad', 'pc')">DAD桌面版下单流程</Button>
            
            <Button type="default" @click="startTest('drw', 'm')">DRW移动版下单流程</Button>
            <Button type="default" @click="startTest('drw', 'pc')">DRW桌面版下单流程</Button>
        </Row>

        <Row class="my-3">
            <Button type="default" plain @click="closeSocket" v-if="wsConnected">断开webSocket连接</Button>
            <Button type="default" plain @click="resultListInit"  v-if="resultList.length > 1">清空测试结果</Button>
        </Row>

        <div class="result-list mt-3" v-if="resultList.length > 1">
            <div class="item d-flex mb-2 py-1 px-2 border rounded-2" :class="item.type" v-for="(item, index) in resultList"
                :key="index">
                <div class="icon">
                    <i class="bi bi-check-circle" v-if="item.type === 'success'"></i>
                    <i class="bi bi-info-circle" v-else-if="item.type === 'info'"></i>
                    <i class="bi bi-exclamation-triangle-fill" v-else-if="item.type === 'error'"></i>
                </div>
                <div class="type"> {{ item.type }} </div>
                <div class="position">{{ item.position }}</div>
                <div class="message">{{ item.message }}</div>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Row,Button } from 'ant-design-vue';
// import { useRoute } from 'vue-router';
import { useGlobSetting } from '/@/hooks/setting';

import { io, Socket } from 'socket.io-client';

import type { Ref } from 'vue'
interface ResultDataType {
    type: 'info' | 'ctrl' | 'success' | 'error' | '结果';
    message: string;
    position: 'common' | 'index' | 'category' | 'product' | 'cart' | 'checkout' | 'user' | '页面';
}

// let route = useRoute();
// let result = ref({})

// let site = route.query.site || 'dad';
// let platform = route.query.platform || 'm';
// let range = route.query.range || 'all';

const globSetting = useGlobSetting();

let socket: Socket
let wsConnected = ref(false);
let resultList = <Ref<ResultDataType[]>>ref([])

onMounted(() => {
    document.title = 'Auto Test For Trade.'
    resultListInit();
})

function resultListInit() {

    resultList.value = [
        {
            type: '结果',
            position: '页面',
            message: '测试项'
        }
    ]
}


function wsInit() {
    if (wsConnected.value) {
        return;
    }
    // ws连接由客户端手动发起，由服务器端发送完数据后，发出关闭指令，客户端自动关闭连接。
    socket = io(`${globSetting.wsUrl}`, {
        path: '/ws/',
        autoConnect: false
    });

    resultListInit();

    socket.connect();

    // console.log(socket);
    socket.on('connect', () => {
        wsConnected.value = true;
        console.log('connect,id:',socket.id);
    })

    socket.on("connect_error", () => {
        wsConnected.value = false;
        console.log('socket connect error');
        // socket.connect();
    });

    socket.on("disconnect", (reason) => {
        wsConnected.value = false;
        console.log('socket disconnect:', reason)
    });

    socket.on('result', (data: ResultDataType) => {
        // console.log(data);
        handlerResult(data);
    })
}

function handlerResult(data: ResultDataType) {
    switch (data.type) {
        case 'ctrl':
            handlerCtrlMessage(data);
            break;
        case 'success':
        case 'error':
        case 'info':
            resultList.value.push(data)
            break;
        default:
            break;
    }
}

function handlerCtrlMessage(data: ResultDataType) {
    switch (data.message) {
        case 'close':
            socket.close();
            break;
        default:
            break;
    }
}

function startTest(site = 'dad', platform = 'm') {
    socket.emit('message', {
        type: 'test',
        site: site,
        platform: platform,
        range: 'all'
    })

}

function closeSocket(){
    socket.close();
}

</script>

<style lang="less" scoped>
.result-list {
    background-color: #fff;

    .item {
        width: 600px;

        .icon {
            width: 60px;
        }

        .type {
            width: 100px;
            text-transform: capitalize;
        }

        .position {
            width: 100px;
        }

        .message {
            flex-grow: 1;
        }

        &.info {
            background-color: #dcdcd0;
            color: #333;
        }

        &.success {
            background-color: #47a03d;
            color: #fff;
        }

        &.error {
            background-color: #be5050;
            color: #e9e957;
        }
    }
}
</style>

