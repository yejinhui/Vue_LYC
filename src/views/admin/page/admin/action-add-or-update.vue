<template>
  <el-dialog
      :title="!dataForm.id ? '新增' : '修改'"
      v-if="isAuth(['ROOT', 'ACTION:INSERT', 'ACTION:UPDATE'])"
      :close-on-click-modal="false"
      v-model="visible"
      class="dialog"
      width="730px"
  >
    <el-form :inline="true" :model="dataForm" ref="dataForm" :rules="dataRule" label-width="auto">
      <el-form-item label="菜单编码" prop="actionCode">
        <el-input v-model="dataForm.actionCode" size="medium" :rules="dataRule" style="width: 200px" clearable/>
      </el-form-item>
      <el-form-item label="菜单名称" prop="actionName">
        <el-input v-model="dataForm.actionName" size="medium" style="width: 200px" clearable/>
      </el-form-item>
      <el-form-item label="状态" prop="status" v-show="dataForm.id">
        <el-select
            v-model="dataForm.status"
            placeholder="请选择状态"
        >
          <el-option label="无效" value="0"/>
          <el-option label="有效" value="1"/>
        </el-select>
      </el-form-item>
      <el-form-item label="是否默认功能" prop="defaultAction">
        <el-input v-model="dataForm.defaultAction" size="medium" style="width: 200px" disabled/>
      </el-form-item>
    </el-form>
    <template #footer>
			<span class="dialog-footer">
				<el-button size="medium" type="danger" @click="visible = false"><el-icon><Close /></el-icon>取消</el-button>
				<el-button size="medium" type="info" @click="resetHandle" v-show="!dataForm.id"><el-icon><RefreshRight /></el-icon>重置</el-button>
				<el-button type="primary" size="medium" @click="dataFormSubmit"><el-icon><Check /></el-icon>确定</el-button>
			</span>
    </template>
  </el-dialog>
</template>

<script>
import {Check, Close, Plus, RefreshRight} from "@element-plus/icons-vue";

export default {
  components: {Check, RefreshRight, Close, Plus},
  //数据集
  data: function () {
    return {
      visible: false,
      errorHandler: true,
      dataForm: {
        id: null,
        actionCode: null,
        actionName: null,
        defaultAction: '否',
        actionNameList:[],
        status: null
      },
      //表单验证
      dataRule: {
        actionCode: [{required: true,message: '功能编码必填！'}],
        actionName: [{required: true,message: '功能名称必填！'}],
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
        if (id) {
          that.$http('action/searchActionById', 'POST', {id: id}, false, function (resp) {
            let params = resp.params;
            that.dataForm.actionCode = params.actionCode;
            that.dataForm.actionName = params.actionName;
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
          });
        };
        //加载部门下拉数据
        that.$http('action/selectActionInfoList', 'GET', null, true, function (resp) {
          that.dataForm.actionNameList = resp.actionNameList
        });
      });
    },
    //提交报表（新增/更新）
    dataFormSubmit: function () {
      let that = this;
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          let data = {
            id: that.dataForm.id,
            actionCode: that.dataForm.actionCode,
            actionName: that.dataForm.actionName,
            status: that.dataForm.status,
            defaultAction: that.dataForm.defaultAction
          }
          if (that.dataForm.status === "有效") {
            data.status = 1;
          } else if (that.dataForm.status === "无效") {
            data.status = 0;
          }
          if (that.dataForm.defaultAction === "是") {
            data.defaultAction = 1;
          } else if (that.dataForm.defaultAction === "否") {
            data.defaultAction = 0;
          }
          that.$http(`action/${!that.dataForm.id ? 'insertAction' : 'updateAction'}`, 'POST', data, true, function (
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
                message: '操作失败！',
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
    }
  }
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

.input {
  width: 160px !important;
}
</style>
