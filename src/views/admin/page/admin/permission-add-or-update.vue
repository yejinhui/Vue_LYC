<template>
  <el-dialog
      :title="!dataForm.id ? '新增' : '修改'"
      v-if="isAuth(['ROOT', 'ADMIN_PERMISSION:INSERT', 'ADMIN_PERMISSION:UPDATE'])"
      :close-on-click-modal="false"
      v-model="visible"
      class="dialog"
      width="360px"
  >
    <el-form :inline="true" :model="dataForm" ref="dataForm" :rules="dataRule" label-width="auto">
      <el-form-item label="菜单" prop="moduleCode">
        <!--el-select搜索属性：https://element-plus.org/zh-CN/component/select.html#%E8%BF%9C%E7%A8%8B%E6%90%9C%E7%B4%A2-->
        <!--eallow-create能创建新项目，在输入时会预想原输入的内容。filterable开启模糊搜索功能。default-first-option模糊搜索时回车能默认选中第一个-->
        <el-select v-model="dataForm.moduleCode"
                   class="m-2"
                   filterable
                   default-first-option
                   validate-event
                   placeholder="请选择菜单" size="large">
          <el-option
              v-for="item in moduleNameList"
              :key="item.moduleCode"
              :label="item.moduleName"
              :value="item.moduleCode"
              placeholder="请选择菜单"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="功能" prop="actionCode">
        <el-select v-model="dataForm.actionCode"
                   class="m-2"
                   filterable
                   default-first-option
                   validate-event
                   placeholder="请选择功能" size="large">
          <el-option
              v-for="item in actionNameList"
              :key="item.actionCode"
              :label="item.actionName"
              :value="item.actionCode"
              placeholder="请选择功能"
          />
        </el-select>
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
      moduleNameList:[],
      actionNameList: [],
      dataForm: {
        id: null,
        moduleCode: null,
        actionCode: null,
      },
      //表单验证
      dataRule: {
        moduleCode: [{required: true,message: '菜单必选！'}],
        actionCode: [{required: true,message: '功能必选！'}],
      }
    };
  },
  mounted() {
    // console.log('挂载元素')
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
          that.$http('permission/searchPermissionById', 'POST', {id: id}, false, function (resp) {
            let params = resp.params;
            console.log(params)
            that.dataForm.actionCode = params.actionCode;
            that.dataForm.moduleCode = params.moduleCode;
          });
        };
        //加载部门下拉数据
        that.$http('module/selectModuleInfoList', 'GET', null, true, function (resp) {
          that.moduleNameList = resp.moduleNameList
        });
        //加载部门下拉数据
        that.$http('action/selectActionInfoList', 'GET', null, true, function (resp) {
          that.actionNameList = resp.actionNameList
        });
      });
    },
    //提交报表（新增/更新）
    dataFormSubmit: function () {
      let that = this;
      this.$refs['dataForm'].validate(valid => {
        console.log(this.dataForm)
        if (valid) {
          let data = {
            id: that.dataForm.id,
            moduleCode: that.dataForm.moduleCode,
            actionCode: that.dataForm.actionCode,
          }
           console.log(data.moduleCode)
          that.$http(`permission/${!that.dataForm.id ? 'insertPermission' : 'updatePermission'}`, 'POST', data, true, function (
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
