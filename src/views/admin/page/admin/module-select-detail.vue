<template>
  <el-dialog
      :title="'菜单详情'"
      v-if="isAuth(['ROOT', 'MODULE:SELECT'])"
      :close-on-click-modal="false"
      v-model="visible"
      class="dialog"
      width="715px"
  >
    <el-form :inline="true" :model="dataForm" ref="dataForm" label-width="auto">
      <el-form-item label="菜单ID:" prop="id">
        <el-text class="el-text-cont">{{ dataForm.id }}</el-text>
      </el-form-item>
      <el-form-item label="菜单编码:" prop="moduleCode">
        <el-text class="el-text-cont">{{ dataForm.moduleCode }}</el-text>
      </el-form-item>
      <el-form-item label="菜单名称:" prop="moduleName">
        <el-text class="el-text-cont">{{ dataForm.moduleName }}</el-text>
      </el-form-item>
      <el-form-item label="链接:" prop="link">
        <el-text class="el-text-cont">{{ dataForm.link }}</el-text>
      </el-form-item>
      <el-form-item label="父ID:" prop="parentId">
        <el-text class="el-text-cont">{{ dataForm.parentId }}</el-text>
      </el-form-item>
      <el-form-item label="图片:" prop="iconName">
        <el-text class="el-text-cont">{{ dataForm.iconName }}</el-text>
      </el-form-item>
      <el-form-item label="状态:" prop="status">
        <el-text class="el-text-cont">{{ dataForm.status }}</el-text>
      </el-form-item>
      <el-form-item label="是否默认功能:" prop="defaultModule">
        <el-text class="el-text-cont">{{ dataForm.defaultModule }}</el-text>
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
        moduleCode: null,
        moduleName: null,
        defaultModule: null,
        link: null,
        parentId: null,
        iconName: null,
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
          that.$http('module/searchModuleById', 'POST', {id : id}, true, function(resp) {
            let params = resp.params;
            that.dataForm.moduleCode = params.moduleCode;
            that.dataForm.moduleName = params.moduleName;
            that.dataForm.link = params.link;
            that.dataForm.parentId = params.parentId;
            that.dataForm.iconName = params.iconName;
            if (params.status === 1) {
              that.dataForm.status = '有效';
            } else if (params.status === 0) {
              that.dataForm.status = '无效';
            }
            if (params.defaultModule === 1) {
              that.dataForm.defaultModule = '是';
            } else if (params.defaultModule === 0) {
              that.dataForm.defaultModule = '否';
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
