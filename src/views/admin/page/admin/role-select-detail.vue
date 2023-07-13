<template>
  <el-dialog
      :title="'角色详情'"
      v-if="isAuth(['ROOT', 'ROLE:SELECT'])"
      :close-on-click-modal="false"
      v-model="visible"
      class="dialog"
      width="660px"
  >
    <el-form :inline="true" :model="dataForm" ref="dataForm" label-width="auto">
      <el-form-item label="角色名称:" prop="roleName">
        <el-text class="el-text-cont-detail">{{ dataForm.roleName }}</el-text>
      </el-form-item>
      <el-form-item label="权限数量:" prop="permissions">
        <el-text class="el-text-cont-detail">({{ dataForm.permissions }}){{ dataForm.permissionNames }}</el-text>
      </el-form-item>
      <el-form-item label="关联用户:" prop="users">
        <el-text class="el-text-cont-detail">({{ dataForm.users }}){{ dataForm.userNames }}</el-text>
      </el-form-item>
      <el-form-item label="备注:" prop="desc">
        <el-text class="el-text-cont-detail">{{ dataForm.desc }}</el-text>
      </el-form-item>
      <el-form-item label="内置角色:" prop="systemic">
        <el-text class="el-text-cont-detail">{{ dataForm.systemic ? '是' : '否' }}</el-text>
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
        roleName: null,
        desc: null,
        systemic: null,
        userNames: null,
        permissionNames: null,
        users:null,
        permissions:null,
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
          that.$http('role/searchRoleAllById', 'POST', {id : id}, true, function(resp) {
            let params = resp.param;
            that.dataForm.roleName = params.roleName;
            that.dataForm.desc = params.desc;
            that.dataForm.systemic = params.systemic;
            that.dataForm.userNames = params.userNames;
            that.dataForm.permissionNames = params.permissionNames;
            that.dataForm.users = params.users;
            that.dataForm.permissions = params.permissions;
            that.dataListLoading = false;
          });
        }
      });
    },
  },
};
</script>
<style>
.el-text-cont-detail{
  width: 600px;
}
</style>
