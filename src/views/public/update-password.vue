<template>
	<el-dialog title="修改密码" v-model="visible" width="25%" class="updatepassword">
		<el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
			<el-form-item label="原密码" prop="password">
				<el-input type="password" v-model="dataForm.password" show-password :prefix-icon="Unlock" size="medium" clearable />
			</el-form-item>
			<el-form-item label="新密码" prop="newPassword">
				<el-input type="password" v-model="dataForm.newPassword" show-password :prefix-icon="Unlock" size="medium" clearable />
			</el-form-item>
			<el-form-item label="确认密码" prop="confirmPassword">
				<el-input type="password" v-model="dataForm.confirmPassword" show-password :prefix-icon="Unlock" size="medium" clearable />
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button size="medium" @click="visible = false">取消</el-button>
				<el-button type="primary" size="medium" @click="dataFormSubmit">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script>
import {Unlock} from "@element-plus/icons-vue";

export default {
  computed: {
    Unlock() {
      return Unlock
    }
  },
	data() {
		const validateConfirmPassword = (rule, value, callback) => {
			if (value !== this.dataForm.newPassword) {
				callback(new Error('两次输入的密码不一致'));
			} else {
				callback();
			}
		};

		return {
			visible: false,
			dataForm: {
				password: '',
				newPassword: '',
				confirmPassword: ''
			},
			dataRule: {
				password: [{ required: true, pattern: '^[a-zA-Z0-9]{6,20}$', message: '密码格式错误' }],
				newPassword: [{ required: true, pattern: '^[a-zA-Z0-9]{6,20}$', message: '密码格式错误' }],
				confirmPassword: [
					{ required: true, pattern: '^[a-zA-Z0-9]{6,20}$', message: '密码格式错误' },
					{ validator: validateConfirmPassword, trigger: 'blur' }
				]
			}
		};
	},
	methods: {
		init:function(){
			this.visible=true;
			this.$nextTick(()=>{
				this.$refs['dataForm'].resetFields();
			});
		},
		dataFormSubmit:function(){
			let that=this;
			that.$refs['dataForm'].validate(function(valid){
				if(valid){
					let data={password:that.dataForm.confirmPassword};
					that.$http("user/updatePassword","POST",data,true,function(resp){
              if (resp.rows === 1) {
                that.$message({
                  message: '密码修改成功,请重新登录！',
                  type: 'success',
                  duration: 1200
                });
                that.visible = false;
                //退出登陆之后没有必要在storage中保存用户权限，所以删除permissions
                localStorage.removeItem("permissions");
                localStorage.removeItem("token");
                //跳转到登陆页面
                that.$router.push({name: "Login"});
              } else {
                that.$message({
                  message: '密码修改失败',
                  type: 'error',
                  duration: 1200
                });
              }
					})
				}
			})
		}
	}
};
</script>
