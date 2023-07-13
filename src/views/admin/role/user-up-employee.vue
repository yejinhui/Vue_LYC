<template>
  <el-dialog
      title="注册员工"
      v-if="isAuth(['ROOT','USER:UPDATE'])"
      :close-on-click-modal="false"
      v-model="visible"
      class="dialog"
      width="360px"
  >
    <el-form :inline="true" :model="dataForm" :rules="dataRule" ref="dataForm" label-width="auto">
      <el-form-item label="入职日期" prop="hiredate">
        <el-col style="width: 200px">
          <el-date-picker
              v-model="dataForm.hiredate"
              type="datetime"
              label="请选择入职日期"
              format="YYYY-MM-DD HH:mm:ss"
              :editable="false"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择入职日期"
              style="width: 100%"
          />
        </el-col>
        <span class="note">（ 不选就会按照当前日期 ）</span>
      </el-form-item>
      <el-form-item label="部门" prop="deptName" required>
        <el-select v-model="dataForm.deptName"
                   class="m-2"
                   clearable
                   placeholder="请选择部门" size="large">
          <el-option
              v-for="item in dataForm.deptNameList"
              :key="item.id"
              :label="item.deptName"
              :value="item.deptName"
              placeholder="请选择部门"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="公司" prop="companyName" required>
        <el-select v-model="dataForm.companyName"
                   class="m-2"
                   clearable
                   placeholder="请选择公司" size="large">
          <el-option
              v-for="item in dataForm.companyNameList"
              :key="item.id"
              :label="item.companyName"
              :value="item.companyName"
              placeholder="请选择公司"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
			<span class="dialog-footer">
				<el-button size="medium" type="danger" @click="visible = false"><el-icon><Close /></el-icon>取消</el-button>
				<el-button size="medium" type="info" @click="resetHandle"><el-icon><RefreshRight /></el-icon>重置</el-button>
				<el-button type="primary" size="medium" @click="dataFormSubmit"><el-icon><Check /></el-icon>确定</el-button>
			</span>
    </template>
  </el-dialog>
</template>

<script>
import {Check, Close, Plus, RefreshRight} from "@element-plus/icons-vue";

export default {
  components: {RefreshRight, Check, Close, Plus},
  //数据集
  data: function () {
    return {
      visible: false,
      dataForm: {
        id: null,
        deptName: null,
        hiredate: null,
        companyNameList:[],
        deptNameList:[],
        companyName: null
      },
      dataRule: {
        deptName: { required: true, message: '请选择部门！' },
        companyName: { required: true, message: '请选择公司！' },
      }
    };
  },

  methods: {
    //初始化表单数据
    init: function (id) {
      let that = this;
      that.dataForm.id = id || 0;
      that.visible = true;
      that.$nextTick(() => {
        that.$refs['dataForm'].resetFields();
        //加载部门下拉数据
        that.$http('dept/selectDeptInfoList', 'GET', null, true, function (resp) {
          that.dataForm.deptNameList = resp.deptNameList
        });
        //加载公司下拉数据
        that.$http('company/selectCompanyInfoList', 'GET', null, true, function (resp) {
          that.dataForm.companyNameList = resp.companyNameList
        });
      });
    },
    //提交报表（注册员工）
    dataFormSubmit: function () {
      let that = this;
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          let data={
            userId: that.dataForm.id,
            deptName: that.dataForm.deptName,
            companyName: that.dataForm.companyName,
            hiredate: that.dataForm.hiredate
          }
          that.$http('user/userUpEmployee', 'POST', data, true, function (
              resp
          ) {
            if (resp.rows === 1) {
              that.$message({
                message: resp.msg,
                type: 'success',
                duration: 1200
              });
              that.visible = false;
              that.$emit('refreshDataList');
            } else {
              that.$message({
                message: '注册失败！',
                type: 'error',
                duration: 1200
              });
            }
          });
        }
      });
    },
    //重置已填内容的数据
    resetHandle: function () {
      this.$refs.dataForm.resetFields();
    },
  },
};
</script>

<style lang="less" scoped="scoped">
.note {
  margin-left: 20px;
  color: #999;
}

//头像上传
.avatar-uploader {
  text-align: center;
  width: 68px;
  height: 52px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.27);
}

.avatar-uploader:hover {
  //cursor: url(https://dl.zhutix.net/2023/04/83669.png), default;
}

.avatar-uploader .el-upload {
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 12px;
  color: #8c939d;
  text-align: center;
}

.el-upload .el-icon {
  border-radius: 50%;
  width: 4em;
  height: 4em;
}
.note {
  margin-left: 5px;
  color: #999;
}

.input {
  width: 160px !important;
}
</style>
