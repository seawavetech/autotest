<template>
    <main class="p-3 h-full relative bg-white">
        <div class="m-header sticky top-20 bg-white">
            <Row class="my-3">
                <Button class="mr-3" type="default" @click="startTest(['drw', 'm'])">DRW移动版下单流程</Button>
                <Button class="mr-3" type="default" @click="startTest(['drw', 'pc'])">DRW桌面版下单流程</Button>

                <Button class="mr-3" type="default" @click="startTest(['dad', 'm'])">DAD移动版下单流程</Button>
                <Button class="mr-3" type="default" @click="startTest(['dad', 'pc'])">DAD桌面版下单流程</Button>
            </Row>

            <div class=" p-2 bg-blue-100 text-md" v-if="isLoading">
                正在测试<span class="inline-block mx-1 px-2 bg-green-400 text-white">{{ curSite.site }}</span>站
                <span class="inline-block mx-1 px-2 bg-red-400 text-white">{{ curSite.platform }}</span>端
            </div>

            <Row class="my-3" v-if="!isLoading">
                <!-- <Button class="mr-3" type="default" plain @click="closeSocket" v-if="wsConnected">断开webSocket连接</Button> -->
                <Button class="mr-3 bg-blue-200" type="default" plain @click="resultListInit"
                    v-if="resultList.length > 1">清空测试结果</Button>
            </Row>
        </div>

        <div class="result-list mt-3" v-if="resultList.length > 1">
            <div class=" p-2 bg-blue-100 text-md" v-if="!isLoading">
                测试结果：<span class="inline-block mx-1 px-2 bg-green-400 text-white">{{ curSite.site }}</span>站
                <span class="inline-block mx-1 px-2 bg-red-400 text-white">{{ curSite.platform }}</span>端
            </div>
            <div class="item flex mb-2 py-1 px-2 border rounded" :class="item.type" v-for="(item, index) in resultList"
                :key="index">
                <div class="icon w-1/12">
                    <CheckCircleOutlined v-if="item.type === 'success'" />
                    <InfoCircleOutlined v-else-if="item.type === 'info'" />
                    <CloseCircleOutlined v-else-if="item.type === 'error'" />
                </div>
                <div class="type w-3/12"> {{ item.type }} </div>
                <div class="position w-3/12">{{ item.position }}</div>
                <div class="message w-5/12 flex-grow-0">{{ item.message }}</div>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Row, Button } from 'ant-design-vue';
import { CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons-vue';

// import { useRoute } from 'vue-router';
import { useGlobSetting } from '/@/hooks/setting';

import { io, Socket } from 'socket.io-client';

import type { Ref } from 'vue'
interface ResultDataType {
    type: 'info' | 'ctrl' | 'success' | 'error' | '结果';
    message: string;
    position: 'common' | 'index' | 'category' | 'product' | 'cart' | 'checkout' | 'user' | '模块';
}

interface siteType {
    site: 'dad' | 'drw';
    platform: 'pc' | 'm';
}

const globSetting = useGlobSetting();

let socket: Socket
let wsConnected = ref(false);
let isLoading = ref(false);
let curSite = <Ref<siteType>>ref({});
let resultList = <Ref<ResultDataType[]>>ref([])

onMounted(() => {
    document.title = 'Auto Test For Trade.'
    resultListInit();
})

function resultListInit() {

    resultList.value = [
        {
            type: '结果',
            position: '模块',
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
        path: globSetting.wsPrefix,
        autoConnect: false
    });

    socket.connect();

    // console.log(socket);
    socket.on('connect', () => {
        isLoading.value = true;
        wsConnected.value = true;
        console.log('connect,id:', socket.id);

        socket.emit('message', {
            type: 'test',
            site: curSite.value.site,
            platform: curSite.value.platform,
            range: 'all'
        })
    })

    socket.on("connect_error", () => {
        isLoading.value = false;
        wsConnected.value = false;
        console.log('socket connect error');
        // socket.connect();
    });

    socket.on("disconnect", (reason) => {
        isLoading.value = false;
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

function startTest(siteInfo) {

    if (isLoading.value) return;

    let [site, platform] = siteInfo
    curSite.value = {
        site,
        platform,
    }

    resultListInit();
    wsInit();

}

function closeSocket() {
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

