<template>
  <el-dialog
      :title="!dataForm.id ? '新增' : '修改'"
      v-if="isAuth(['ROOT', 'USER:INSERT', 'USER:UPDATE'])"
      :close-on-click-modal="false"
      v-model="visible"
      class="dialog"
      width="1000px"
  >
    <el-form :inline="true" :model="dataForm" ref="dataForm" :rules="dataRule" label-width="auto">
      <el-form-item label="照片" prop="photo" required>
        <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            action="html"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :http-request="handlerUpload"
        >
          <el-avatar :size="52" v-if="dataForm.photo" :src="dataForm.photo" @error="errorHandler" loading='lazy' />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus/>
          </el-icon>
        </el-upload>
      </el-form-item>
      <br/>
      <el-form-item label="编号" prop="code" v-show="dataForm.id">
        <el-input v-model="dataForm.code" size="medium" style="width: 200px" clearable disabled/>
      </el-form-item>
      <el-form-item label="真实姓名" prop="name" required>
        <el-input v-model="dataForm.name" size="medium" style="width: 200px" clearable/>
      </el-form-item>
      <el-form-item label="用户名" prop="username" required>
        <el-input v-model="dataForm.username" size="medium" style="width: 200px" clearable/>
      </el-form-item>
      <el-form-item label="电子邮件" prop="email" required>
        <el-input v-model="dataForm.email" size="medium" style="width: 200px" clearable/>
      </el-form-item>
      <el-form-item label="登录密码" prop="password" :required="!dataForm.id">
        <el-input v-model="dataForm.password" size="medium" style="width: 200px" clearable
                  :placeholder="placeHandle(dataForm.id)"/>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="dataForm.nickname" size="medium" style="width: 200px" clearable/>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <div style="width: 200px">
          <el-radio v-model="dataForm.sex" label="男" border>男</el-radio>
          <el-radio v-model="dataForm.sex" label="女" border>女</el-radio>
        </div>
      </el-form-item>
      <el-form-item label="联系电话" prop="tel">
        <el-input v-model="dataForm.tel" size="medium" style="width: 200px" clearable/>
      </el-form-item>
      <el-form-item label="出生日期" prop="birthday">
        <el-col style="width: 200px">
          <el-date-picker
              v-model="dataForm.birthday"
              type="date"
              label="请选择出生日期"
              :editable="false"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              placeholder="请选择出生日期"
              style="width: 100%"
          />
        </el-col>
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
        photo: null,
        name: null,
        username: null,
        password: null,
        code: null,
        nickname: null,
        sex: null,
        tel: null,
        hiredate: null,
        birthday: null,
        status: null,
        email: null
      },
      //表单验证
      dataRule: {
        name: [{required: true, pattern: '^[\u4e00-\u9fa5]{2,20}$', message: '真实姓名格式错误'}],
        username: [{required: true, pattern: '^[a-zA-Z0-9]{5,50}$', message: '用户名格式错误'}],
        nickname: [{pattern: '^[a-zA-Z0-9\u4e00-\u9fa5]{2,10}$', message: '昵称格式错误'}],
        tel: [{required: true, pattern: '^1[0-9]{10}$', message: '联系电话格式错误'}],
        email: [{
          required: true,
          pattern: '^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$',
          message: '电子邮箱格式错误'
        }],
        password: [{required: true, pattern: '^[a-zA-Z0-9]{6,20}$', message: '密码格式错误'}],
        photo: [{required: true,message: '必须上传！'}],
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
          that.$http('user/searchUserById', 'POST', {id: id}, false, function (resp) {
            let params = resp.params;
            that.dataForm.photo = params.photo;
            that.dataForm.name = params.name;
            that.dataForm.username = params.username;
            that.dataForm.code = params.code;
            that.dataForm.nickname = params.nickname;
            that.dataForm.sex = params.sex;
            that.dataForm.tel = params.tel;
            that.dataForm.birthday = params.birthday;
            that.dataForm.email = params.email;
            if (params.status === 1) {
              that.dataForm.status = '有效';
            } else if (params.status === 0) {
              that.dataForm.status = '无效';
            }
          });
        }
      });
    },
    //提交报表（新增/更新）
    dataFormSubmit: function () {
      let that = this;
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          let data = {
            userId: that.dataForm.id,
            name: that.dataForm.name,
            username: that.dataForm.username,
            nickname: that.dataForm.nickname,
            password: that.dataForm.password,
            photo: that.dataForm.photo,
            sex: that.dataForm.sex,
            tel: that.dataForm.tel,
            email: that.dataForm.email,
            code: that.dataForm.code,
            status: that.dataForm.status,
            birthday: that.dataForm.birthday
          }
          if (that.dataForm.deptName == null || that.dataForm.deptName === '') {
            data.companyName = null;
          }
          if (that.dataForm.companyName == null || that.dataForm.companyName === '') {
            data.deptName = null;
          }
          if (that.dataForm.status === "有效") {
            data.status = 1;
          }else if(that.dataForm.status === "无效"){
            data.status = 0;
          }
          that.$http(`user/${!that.dataForm.id ? 'insertEmployee' : 'updateEmployee'}`, 'POST', data, true, function (
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
    },
    //密码在新增/更新文本框不同的显示方式
    placeHandle: function (id) {
      if (id) {
        return "<不填则默认已设置的密码>";
      } else {
        return "";
      }
    },
    handleAvatarSuccess() {

    },
    //上传图片之前进行验证
    beforeAvatarUpload(file) {
      let isJPG = file.type === "image/jpg" || file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
      let isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG、PNG、GIF 格式!");
      } else if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //图片上传
    handlerUpload(param) {
      let that = this;
      let file = param.file;//获取到上传的图片
      let formData = new FormData();//通过formdata上传
      formData.append('file', file);
      formData.append("userId", that.dataForm.id);
      that.$httpImg('user/uploadPicById', 'POST', formData, true, function (resp) {
        if (resp && resp.code === 200) {
          that.$emit('refreshDataList');
          that.dataForm.photo = resp.photo;
          that.$message({
            message: resp.msg,
            type: 'success',
            duration: 1200
          });
        } else {
          that.$message({
            message: '上传失败！',
            type: 'error',
            duration: 1200
          });
          that.$router.push({name: "Login"})
        }
      });
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

.input {
  width: 160px !important;
}
</style>
