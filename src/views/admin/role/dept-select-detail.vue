<template>
  <el-dialog
      :title="'部门详情'"
      v-if="isAuth(['ROOT', 'DEPT:SELECT'])"
      :close-on-click-modal="false"
      v-model="visible"
      class="dialog"
      width="660px"
  >
    <el-form :inline="true" :model="dataForm" ref="dataForm" label-width="auto">
      <el-form-item label="部门:" prop="deptName">
        <el-text class="el-text-cont">{{ dataForm.deptName }}</el-text>
      </el-form-item>
      <el-form-item label="电子邮件:" prop="email">
        <el-text class="el-text-cont">{{ dataForm.email }}</el-text>
      </el-form-item>
      <el-form-item label="电话:" prop="deptName">
        <el-text class="el-text-cont">{{ dataForm.tel }}</el-text>
      </el-form-item>
      <el-form-item label="状态:" prop="status">
        <el-text class="el-text-cont">{{ dataForm.status }}</el-text>
      </el-form-item>
      <el-form-item label="创建时间:" prop="createTime">
        <el-text class="el-text-cont" style="width: 600px;">{{ dataForm.createTime }}</el-text>
      </el-form-item>
      <el-form-item label="员工人数:" prop="emps">
        <el-text class="el-text-cont" style="width: 600px;">({{ dataForm.emps }}人){{ dataForm.userNames }}</el-text>
      </el-form-item>
      <el-form-item label="描述:" prop="deptName">
        <el-text truncated class="el-text-cont">{{ dataForm.desc }}</el-text>
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
        deptName: null,
        emps:null,
        email: null,
        tel: null,
        desc: null,
        status: null,
        userNames:null,
        createTime: null
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
          that.$http('dept/searchDeptById', 'POST', {id : id}, true, function(resp) {
            let params = resp.params;
            that.dataForm.tel = params.tel;
            that.dataForm.deptName = params.deptName;
            that.dataForm.desc = params.desc;
            that.dataForm.email = params.email;
            that.dataForm.createTime = params.createTime;
            that.dataForm.emps = params.emps;
            that.dataForm.userNames = params.userNames;
            if (params.status === 1) {
              that.dataForm.status = '有效';
            } else if (params.status === 0) {
              that.dataForm.status = '无效';
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
