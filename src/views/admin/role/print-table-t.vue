<template>
  <el-dialog
      title="模版打印"
      :close-on-click-modal="false"
      v-model="visible"
      class="dialog"
      width="1100px"
  >
    <div class="symContainer" id="printArea">
      <div class="sym-tit">
        萧县永堌镇窦庄葡萄溯源平台
      </div>
      <ul class="symInfo">
        <li>产品名称：萧县永堌镇窦庄葡萧县永堌镇窦庄葡</li>
        <li>生产日期：2020-06-05</li>
        <li>企业电话：18888888888</li>
        <li>溯源码：1100K620174130</li>
      </ul>
      <div class="sym" id="qrcode" ref="qrcode"></div>
    </div>
    <template #footer>
			<span class="dialog-footer">
        <!--根据id打印对应的内容-->
        <el-button type="primary" onclick="printJS('printArea', 'html')">打 印</el-button>
        <el-button type="primary" @click="copyImg">截 屏</el-button>
				<el-button size="medium" type="danger" @click="visible = false"><el-icon><Close/></el-icon>取消</el-button>
			</span>
    </template>
  </el-dialog>
</template>

<script>
//打印
import printJS from 'print-js'
import {Close} from "@element-plus/icons-vue";
import html2canvas from "html2canvas";

export default {
  components: {Close},
  data: function () {
    return {
      visible: false
    }
  },
  methods: {
    //初始化表单数据
    init: function () {
      this.visible = true;
      this.$nextTick(() => {

      });
    },
    //截屏并复制到剪贴板:https://juejin.cn/post/7197374354093752375
    //参考2：https://juejin.cn/post/7207342547361267771
    async copyImg() {
      html2canvas(document.getElementById('printArea')).then(async (canvas) => {
        let imgUrl = canvas.toDataURL();
        // console.log(imgUrl);
        const data = await fetch(imgUrl);
        const blob = await data.blob();
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob,
          }),
        ]);
      })
    },
  }
}
</script>
