<template>
  <main>

  </main>
</template>

<script setup lang="ts">
import {onMounted,inject} from 'vue';

const $http = inject('$http');

onMounted(()=>{
    $http.testDadM_All()
})

</script>

