<template>
  <el-dialog
      :title="'功能详情'"
      v-if="isAuth(['ROOT', 'ACTION:SELECT'])"
      :close-on-click-modal="false"
      v-model="visible"
      class="dialog"
      width="715px"
  >
    <el-form :inline="true" :model="dataForm" ref="dataForm" label-width="auto">
      <el-form-item label="功能编码:" prop="actionCode">
        <el-text class="el-text-cont">{{ dataForm.actionCode }}</el-text>
      </el-form-item>
      <el-form-item label="功能名称:" prop="actionName">
        <el-text class="el-text-cont">{{ dataForm.actionName }}</el-text>
      </el-form-item>
      <el-form-item label="状态:" prop="status">
        <el-text class="el-text-cont">{{ dataForm.status }}</el-text>
      </el-form-item>
      <el-form-item label="是否默认功能:" prop="defaultAction">
        <el-text class="el-text-cont">{{ dataForm.defaultAction }}</el-text>
      </el-form-item>
    </el-form>
    <template #footer>
			<span class="dialog-footer">
				<el-button size="medium" type="danger" @click="visible = false"><el-icon><Close /></el-icon>关闭</el-button>
			</span>
    </template>
  </el-dialog>
</template>

<script>
import {Close, Plus} from "@element-plus/icons-vue";

export default {
  components: {Close, Plus},
  data: function() {
    return {
      visible: false,
      errorHandler: true,
      dataForm: {
        id: null,
        actionCode: null,
        actionName: null,
        defaultAction: null,
        status: null,
      },
    };
  },
  methods: {
    init: function(id) {
      let that = this;
      that.dataForm.id = id || 0;
      that.visible = true;
      that.$nextTick(() => {
        that.$refs['dataForm'].resetFields();
        if (id) {
          that.$http('action/searchActionById', 'POST', {id : id}, true, function(resp) {
            let params = resp.params;
            that.dataForm.actionName = params.actionName;
            that.dataForm.actionCode = params.actionCode;
            if (params.status === 1) {
              that.dataForm.status = '有效';
            } else if (params.status === 0) {
              that.dataForm.status = '无效';
            }
            if (params.defaultAction === 1) {
              that.dataForm.defaultAction = '是';
            } else if (params.defaultAction === 0) {
              that.dataForm.defaultAction = '否';
            }
            that.dataListLoading = false;
          });
        }
      });
    },
  },
};
</script>
<style>
.el-text-cont{
  width: 200px;
}
</style>
