<template>
  <div class="common-layout">
    <el-container>
      <el-header height="50">
        <div class="el-header-left" :style="widthLeft">
          <h1>
            <a>{{ title_name }}</a>
          </h1>
        </div>
        <div class="el-header-center">
          <button style="width: 50px;height: 50px;padding: 0;margin: 0 0 0 0;border: 0;" @click="handleSwitch">
            <el-icon size="20">
              <Grid name="zhedie" class="icon-svg" />
            </el-icon>
          </button>
        </div>
        <div class="el-header-right">
          <el-dropdown>
                    <span class="el-dropdown-Alink">
              <el-avatar :size="35" style="margin-right: 5px;vertical-align:middle" :src="photo" @error="errorHandler" loading = 'lazy'/>
                      {{ name }}
                      <!--下拉箭头-->
                      <!--<el-icon class="el-icon--right">
                           <arrow-down/>
                      </el-icon>-->
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item disabled>{{ name }}</el-dropdown-item>
                <el-dropdown-item divided @click="updateUserInfoHandle()">修改资料</el-dropdown-item>
                <el-dropdown-item @click="updatePasswordHandle()">修改密码</el-dropdown-item>
                <el-dropdown-item divided @click="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <update-password v-if="updatePasswordVisible" ref="updatePassword"></update-password>
          <update-user-info v-if="updateUserInfoVisible" ref="updateUserInfo" @changeHandle="changeHandle" @photoHandle="photoHandle"></update-user-info>
        </div>
      </el-header>
      <el-container>
        <!-- 侧边栏菜单区域(unique-opened为true时，可以控制菜单侧边栏显示，是否只显示一个子菜单） -->
        <el-aside width="200px">
          <el-menu
              :default-active="menuActiveName || 'home'"
              :collapse="sidebarFold"
              :collapseTransition="false"
              class="site-sidebar__menu"
          >
            <el-menu-item index="home" @click="$router.push({ name: 'AdminHome' })">
              <SvgIcon name="home" class="icon-svg" />
              <span slot="title">首页</span>
            </el-menu-item>
            <!-- 一级菜单 -->
            <el-sub-menu v-for="item in moduleList"
                         :key="item.id"
                         :index="item.id"
                         :popper-class="'site-sidebar--' + sidebarLayoutSkin + '-popper'"
                         v-show="permisModuleCode(item.moduleCode)"
                         hide-on-click="true">
              <!-- 一级菜单模板区域 -->
              <template #title>
                <el-icon>
                  <component :is="item.iconName"/>
                </el-icon>
                <span slot="title">{{item.moduleName}}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item v-for="subItem in item.childList"
                            :key="subItem.id"
                            :index="subItem.id"
                            v-show="permisModuleCode(subItem.moduleCode)"
                            @click="pushHandle(subItem.link)">
                <template #title>
                  <el-icon>
                    <component :is="subItem.iconName" />
                  </el-icon>
                  <span slot="title">{{subItem.moduleName}}</span>
                </template>
              </el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>
        <el-container style="width: auto">
          <el-main>Main</el-main>
          <el-footer>Footer</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>

import {defineComponent} from "vue";
import UpdateUserInfo from "@/views/public/update-Info.vue";
import UpdatePassword from "@/views/public/update-password.vue";
import SvgIcon from "@/components/SvgIcon.vue";

export default defineComponent({
  components: {SvgIcon, UpdatePassword, UpdateUserInfo},
  data:function(){
    return{
      // 左侧菜单数据对象
      moduleList: [],
      sidebarFold:false,
      errorHandler: true,
      //加载属性
      loading_car:true,
      name: '',
      photo: '',
      title_name:'六叶草管理系统',
      name_1:'UI',
      widthLeft:'width:200px'
    }
  },
  methods: {
    logout:function(){
      let that=this;
      that.$http("user/logout","GET",null,true,function(resp){
        //退出登陆之后没有必要在storage中保存用户权限，所以删除permissions
        localStorage.removeItem("permissions");
        localStorage.removeItem("token");
        //跳转到登陆页面
        that.$router.push({name:"Login"});
      })
    },
    //更新密码
    updatePasswordHandle:function(){
      let that = this;
      that.updatePasswordVisible=true;
      //清空表单控件，然后显示弹窗。
      that.$nextTick(()=>{
        // debugger;
        that.$refs.updatePassword.init();
      });
    },
    //修改个人资料
    updateUserInfoHandle: function () {
      let that = this;
      that.updateUserInfoVisible = true;
      //清空表单控件，然后显示弹窗。
      that.$nextTick(() => {
        //debugger;
        that.$refs.updateUserInfo.init();
      });
    },
    //点击执行的懒加载的方法
    pushHandle: function (resp) {
      this.$router.push({name: resp})
    },
    //将没有权限的菜单进行隐藏
    permisModuleCode:function (moduleCode) {
      let permissions = localStorage.getItem("permissions");
      let moduleCheck = moduleCode + ':CHECK';
      return permissions.indexOf(moduleCheck) !== -1 || permissions.indexOf('ROOT')!==-1;
    },
    //$emit进行子传父
    changeHandle(photo, name) {
      this.photo = photo;
      this.name = name;
    },
    //$emit进行子传父
    photoHandle(photo) {
      this.photo = photo;
    },
    handleSwitch: function() {
      let z_name = this.title_name;
      if (this.sidebarFold) {
        this.navbarLayoutType = '';
        this.widthLeft = 'width:200px';
      } else {
        this.navbarLayoutType = 'fold';
        this.widthLeft = 'width:64px';
      }
      this.title_name = this.name_1;
      this.name_1 = z_name;
      this.sidebarFold = !this.sidebarFold;
    }
  },
  mounted: function() {
    let that = this;
    //加载用户数据
    that.$http('userInfo/homeInfo', 'POST', {page: '/user/home'}, true, function (resp) {
      let summary = resp.summary;
      that.name = summary.name;
      that.photo = summary.photo;
    });
    //加载菜单数据
    that.$http('module/moduleInfo', 'GET', null, true, function (resp) {
      that.moduleList = resp.moduleList;
      that.loading_car = false;
    });
  }
})
</script>

<style lang="scss">
@import '@/assets/scss/admin-test/adminmain.scss';
</style>
