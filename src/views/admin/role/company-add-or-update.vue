<template>
  <el-dialog
      :title="!dataForm.id ? '新增' : '修改'"
      v-if="isAuth(['ROOT', 'COMPANY:INSERT', 'COMPANY:UPDATE'])"
      :close-on-click-modal="false"
      v-model="visible"
      class="dialog"
      width="680px"
  >
    <el-form :inline="true" :model="dataForm" ref="dataForm" :rules="dataRule" label-width="auto">
      <el-form-item label="公司" prop="companyName">
        <el-input v-model="dataForm.companyName" size="medium" style="width: 200px" clearable/>
      </el-form-item>
      <el-form-item label="公司英文" prop="companyEngName">
        <el-input v-model="dataForm.companyEngName" size="medium" style="width: 200px" clearable/>
      </el-form-item>
      <el-form-item label="公司地址" prop="address">
        <el-input v-model="dataForm.address" size="medium" style="width: 200px" clearable/>
      </el-form-item>
      <el-form-item label="电话" prop="tel">
        <el-input v-model="dataForm.tel" size="medium" style="width: 200px" clearable/>
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
      <el-form-item label="描述" prop="desc">
        <el-input v-model="dataForm.desc" size="medium" type="textarea" style="width: 520px" clearable/>
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
        companyEngName: null,
        address: null,
        companyName: null,
        createTime: null,
        desc: null,
        tel: null,
        companyNameList:[],
        status: null
      },
      //表单验证
      dataRule: {
        tel: [{pattern: '^1[0-9]{10}$', message: '联系电话格式错误'}],
        companyName: [{required: true,pattern: '^[\u4e00-\u9fa5]{2,20}$',message: '部门必填！'}],
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
          that.$http('company/searchCompanyById', 'POST', {id: id}, false, function (resp) {
            let params = resp.params;
            that.dataForm.tel = params.tel;
            that.dataForm.companyName = params.companyName;
            that.dataForm.desc = params.desc;
            that.dataForm.address = params.address;
            that.dataForm.companyEngName = params.companyEngName;
            that.dataForm.createTime = params.createTime;
            if (params.status === 1) {
              that.dataForm.status = '有效';
            } else if (params.status === 0) {
              that.dataForm.status = '无效';
            }
          });
        };
        //加载部门下拉数据
        that.$http('company/selectCompanyInfoList', 'GET', null, true, function (resp) {
          that.dataForm.companyNameList = resp.companyNameList
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
            desc: that.dataForm.desc,
            address: that.dataForm.address,
            companyName: that.dataForm.companyName,
            companyEngName: that.dataForm.companyEngName,
            tel: that.dataForm.tel,
            status: that.dataForm.status,
            email: that.dataForm.email
          }
          if (that.dataForm.status === "有效") {
            data.status = 1;
          } else if (that.dataForm.status === "无效") {
            data.status = 0;
          }
          that.$http(`company/${!that.dataForm.id ? 'insertCompany' : 'updateCompany'}`, 'POST', data, true, function (
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
