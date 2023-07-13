<template>
  <div class="footer-main">
    <el-row>
      <el-col :span="0"></el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <el-image style="width:100%; height: 60%" :src="img1"/>
        <p style="text-align: center;line-height: 0">{{ col4 }}</p>
      </el-col>
      <el-col :span="8" class="footer-center-center">
          <h3>{{ title1 }}</h3>
          <ul v-for="(item,index) in footerMain1" :key="index">
            <li><el-icon style="vertical-align: top"><Sunny /></el-icon>{{ item }}</li>
          </ul>
      </el-col>
      <el-col :span="8" class="footer-center-right">
        <h3>{{ title2 }}</h3>
        <ul v-for="(item,index) in footerMain2" :key="index">
          <li><el-icon style="vertical-align: top"><Sunny /></el-icon>{{ item }}</li>
        </ul>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="footer-buttom">
        <p>{{ col1 }}</p>
        <p>{{ col2 }}</p>
        <p>{{ col3 }}</p>
        <a>
          <p class="img"><img :src="img2">{{ col5 }}</p>
        </a>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {Sunny} from "@element-plus/icons-vue";

export  default {
  components: {Sunny},
  data(){
    return{
      col1:null,
      col2:null,
      col3:null,
      col4:null,
      col5:null,
      img1:'',
      img2:'',
      title1:null,
      title2:null,
      footerMain1:[],
      footerMain2:[]
    }
  },
  mounted:function (){
    let that = this;
    //加载用户数据
    that.$http('userInfo/loadFooterInfo', 'POST', { page: '/footer' }, true, function(resp) {
      let param = resp.param;
      let list = resp.list;
      that.col1 = param['col1'];
      that.col2 = param['col2'];
      that.col3 = param['col3'];
      that.col4 = param['col4'];
      that.col5 = param['col5'];
      that.img1 = param['img1'];
      that.img2 = param['img2'];
      that.title1 = param['title1'];
      that.title2 = param['title2'];
      that.footerMain1 = list['footerMain1'];
      that.footerMain2 = list['footerMain2'];
    });
  }
}
</script>


<style lang="scss">
@import '@/assets/scss/index.scss';
</style>
