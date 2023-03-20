<template>
  <main>
      <el-button type="primary" @click="startTest">开始测试</el-button>

      <div class="result" v-show="JSON.stringify(result) !== '{}'">
          <pre>
              {{ JSON.stringify(result,null,4)}}
          </pre>
      </div>

  </main>
</template>

<script setup lang="ts">
import {onMounted,inject,ref} from 'vue';
import { useRoute } from 'vue-router';
import {testRequest} from '@/api/api'

let route = useRoute();
let result=ref({})

let site=route.query.site || 'dad';
let platform = route.query.platform || 'm';
let range = route.query.range || 'all';

onMounted(()=>{
    document.title='Auto Test For Trade.'
})

function startTest(){
    let url = `/test/${range}/${site}/${platform}`
    testRequest(url).then((res)=>{
        result.value = res.data
    })
}

</script>

