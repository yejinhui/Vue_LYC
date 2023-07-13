<template>
  <el-carousel :interval="5000" v-loading="loading_car"  arrow="always">
    <el-carousel-item v-for="item in imgList" :key="item.sort_id">
      <a :href="item.url" target="_blank">
        <el-image
            fit="cover"
            class="el-img-home" :src="item.img_link" :key="item.url" loading="lazy"></el-image>
      </a>
    </el-carousel-item>
  </el-carousel>
  <div class="div-home">
  <el-card
      :body-style="{ padding: '0px' }"
      class="el-card-home"
      shadow="hover"
      v-for="item in ECardList"
      :key="item.sortId"
      v-loading="loading_car">
    <el-image fit="cover"
        :src="item.imgLink"
        class="image"
    />
    <div style="padding: 14px">
      <span class="tmp">{{ item.content }}</span>
      <div class="bottom">
        <time class="time">{{ item.imgTime }}</time>
        <el-popover
            placement="top-start"
            :title="item.title"
            :width="200"
            trigger="hover"
            :content="item.content"
        >
          <template #reference>
            <el-button text class="button">{{ item.butCon }}</el-button>
          </template>
        </el-popover>
      </div>
    </div>
  </el-card>
  </div>
</template>
<script>

export default {
  data() {
    return {
      imgList: [],
      ECardList: [],
      loading_car:true
    }
  },
  mounted: function () {
    let that = this;
    //加载用户数据
    that.$http('home/homeInfo', 'GET', null, true, function (resp) {
      that.imgList = resp.imgList;
    });
    that.$http('home/homeInfoCard', 'GET', null, true, function (resp) {
      that.ECardList = resp.ECardList;
    });
    that.loading_car = false;
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/index.scss';
</style>
