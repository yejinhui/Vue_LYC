<template>
  <!--element-loading-background加载的背景颜色-->
  <!--v-loading.fullscreen.lock设置全屏加载-->
  <div
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner=""
      v-loading.fullscreen.lock="loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="tableData"
      style="width: 100%;margin-bottom: 10px"
  >
    <!--https://blog.csdn.net/qq_36538012/article/details/109571270?utm_medium=distribute.pc_feed_404.none-task-blog-2~default~BlogCommendFromBaidu~Rate-5-109571270-blog-null.262^v1^pc_404_mixedpudn&depth_1-utm_source=distribute.pc_feed_404.none-task-blog-2~default~BlogCommendFromBaidu~Rate-5-109571270-blog-null.262^v1^pc_404_mixedpud-->
    <div class="echart_user" id="myEchart">

    </div>


  </div>
</template>

<script>

// export default {
//   data() {
//     return {
//       loading: false
//     }
//   },
//   methods:{
//     drawLine(){
//       let charts = echarts.init(document.getElementById('echart_user'));
//       charts.setOption({
//         tooltip: {
//           trigger: "axis",
//         },
//         legend: {
//           data: ["近七日收益"],
//         },
//         grid: {
//           left: "3%",
//           right: "4%",
//           bottom: "3%",
//           containLabel: true,
//         },
//         toolbox: {
//           feature: {
//             saveAsImage: {},
//           },
//         },
//         xAxis: {
//           type: "category",
//           boundaryGap: false,
//           data: ["1", "2", "3", "4", "5"],
//         },
//         yAxis: {
//           type: "value",
//         },
//
//         series: [
//           {
//             name: "近七日收益",
//             type: "line",
//             stack: "总量",
//             data: ["3", "2", "4", "4", "5"],
//           },
//         ],
//       })
//     }
//   },
//   mounted: function (){
//     this.drawLine();
//   }
// }
</script>

<style lang="scss">
@import '@/assets/scss/index.scss';
@import "@/assets/loadimg.css";
</style>
