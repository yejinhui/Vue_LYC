<template>
<div class="demo-icon-item"
     v-if="isAuth(['ROOT', 'ICON:CHECK'])"
     element-loading-text="拼命加载中"
     v-loading="loading_icon">
  <ul class="demo-icon-list">
    <li class="icon-item" v-for="item of iconNameList" :key="item.id" @click="copyText(item.iconName)">
      <component :is="item.iconName" class="com-icon"></component>
      <span class="icon-name">{{ item.iconName }}</span>
    </li>
  </ul>
</div>
</template>

<script>

import {Plus} from "@element-plus/icons-vue";
import {defineComponent} from "vue";
import {ElMessage} from "element-plus";

export default defineComponent({
  computed: {
    Plus() {
      return Plus
    }
  },
  data:function (){
    return{
      iconNameList:[],
      loading_icon:false
    }
  },
  methods:{
    //异步复制到剪贴板功能：https://juejin.cn/post/6979763242134405128
    async copyText(text) {
      try {
        await navigator.clipboard.writeText(text)
        ElMessage({
          showClose: true,
          message: '已复制',
          type: 'success',
        })
        // console.log('页面内容已复制到剪贴板 ')
      } catch (e) {
        // console.log(`复制文案失败: ${e}`)
        ElMessage({
          showClose: true,
          message: '复制失败'+e.message,
          type: 'success',
        })
      }
    }
  },
  mounted:function () {
    let that = this;
    that.loading_icon = true;
    that.$http('icon/searchIconName','GET',null,true,function (resp) {
      that.iconNameList = resp.iconNameList;
      that.loading_icon = false;
    })
  }
})
</script>

<style>
.demo-icon-list {
  overflow: hidden;
  list-style: none;
  border-radius: 4px;
}
ul{
  line-height: 1.7;
  padding-left: 0;
  //margin-left: 0.3vw;
}
.icon-item {
  font-size: 10px;
  border: 1px solid RGB(242, 246, 252);
  cursor: pointer;
  word-wrap: break-word;
  float: left;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 90px;
  text-align: center;
}
.icon-item span{
  width: 7.1vw;
}
.icon-item:hover{
  background-color: #f6f3f3;
}
.com-icon {
  width: 2em;
  height: 2em;
}
</style>
