<template>
  <!--加载动画链接：https://codepen.io/haitham/pen/brpGrm-->
  <div :class="brploading ? 'folding' : ''">
    <div class="sk-cube1 sk-cube"></div>
    <div class="sk-cube2 sk-cube"></div>
    <div class="sk-cube4 sk-cube"></div>
    <div class="sk-cube3 sk-cube"></div>
  <!--element-loading-background加载的背景颜色-->
  <!--v-loading.fullscreen.lock设置全屏加载-->
    <div class="common-layout"
         v-loading.fullscreen.lock="loading_main"
         v-show="!brploading">
      <el-container>
        <el-header class="el-header" height="100%">
          <el-row>
            <el-col :span="2" class="home-left">
              <p>
                <a :href="img2">
                  {{ title }}
                  <img :src="img1" :alt="title">
                </a>
              </p>
            </el-col>
            <el-col :span="21" class="home-center">
              <el-menu
                  :default-active="activeIndex"
                  :router="true"
                  class="el-menu-demo"
                  mode="horizontal"
                  @select="handleSelect"
              >
                <el-menu-item v-for="zitem in navList"
                              :key="zitem.id"
                              :index="zitem.col"
                              @click="pushHandle(zitem.link)"
                              v-show="zitem.colChild===null">
                  <el-icon>
                    <component :is="zitem.img"/>
                  </el-icon>
                  {{ zitem.col }}
                </el-menu-item>
                <el-sub-menu v-for="zitem in navList"
                             :key="zitem.id"
                             :index="zitem.col"
                             @click="pushHandle(zitem.link)" v-show="zitem.colChild!==null">
                  <template #title>
                    <el-icon>
                      <component :is="zitem.img"/>
                    </el-icon>
                    {{ zitem.col }}
                  </template>
                  <el-menu-item v-for="items in zitem.colChild" :key="items.id" :index="items.col"
                                @click="pushHandle(items.link)">
                    <el-icon>
                      <component :is="items.img"/>
                    </el-icon>
                    {{ items.col }}
                  </el-menu-item>
                </el-sub-menu>
              </el-menu>
            </el-col>
            <el-col :span="1" class="home-right">
                <el-dropdown>
                  <span class="el-dropdown-link">
                    <el-avatar :size="35" style="margin-right: 5px" :src="photo" @error="errorHandler" loading = 'lazy'/>
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
            </el-col>
          </el-row>
        </el-header>
        <el-main class="el-main">
          <router-view/>
        </el-main>
        <el-footer class="el-footer" height="100%">
          <Footer/>
        </el-footer>
      </el-container>
    </div>
      <el-backtop :right="20" :bottom="100"/>
    </div>
</template>

<script>
import UpdateUserInfo from "@/views/public/update-Info.vue";
import UpdatePassword from "@/views/public/update-password.vue";
import Footer from "@/views/public/footer.vue";

export default {
  components: {UpdatePassword,UpdateUserInfo,Footer},
  data() {
    return {
      activeIndex: "首页",//默认选中项
      navList: [],
      itemList: [],
      photo:'',
      brploading:true,
      img1: null,
      title: null,
      name: null,
      loading_main: false,
      errorHandler: true,
      updatePasswordVisible: false,
      updateUserInfoVisible: false,
      img2: null
    }
  },
  methods: {
    //定时器，设置强制让加载时长增加
    componentDidMount() {
      setTimeout(() => { this.brploading = false; }, 3000);
    },
    //登出
    logout: function () {
      let that = this;
      that.$http("user/logout", "GET", null, true, function (resp) {
        //退出登陆之后没有必要在storage中保存用户权限，所以删除permissions
        localStorage.removeItem("permissions");
        localStorage.removeItem("token");
        //跳转到登陆页面
        that.$router.push({name: "Login"});
      })
    },
    //被选中的内容显示下划线
    handleSelect(key) {
      this.activeIndex = key
    },
    //修改个人密码
    updatePasswordHandle: function () {
      this.updatePasswordVisible = true;
      //清空表单控件，然后显示弹窗。
      this.$nextTick(() => {
        //debugger;
        this.$refs.updatePassword.init();
      });
    },
    //修改个人资料
    updateUserInfoHandle: function () {
      this.updateUserInfoVisible = true;
      //清空表单控件，然后显示弹窗。
      this.$nextTick(() => {
        //debugger;
        this.$refs.updateUserInfo.init();
      });
    },
    //点击执行的懒加载的方法
    pushHandle: function (resp) {
      this.$router.push({name: resp})
    },
    //$emit进行子传父
    changeHandle(photo, name) {
      this.photo = photo;
      this.name = name;
    },
    //$emit进行子传父
    photoHandle(photo) {
      this.photo = photo;
    }
  },
  mounted: function () {
      let that = this;
      that.loading_main = true;
      //加载用户数据
      that.$http('userInfo/homeInfo', 'POST', {page: '/user/home'}, true, function (resp) {
        let List = resp.List;
        let summary = resp.summary;
        that.img1 = List['img1'];
        that.img2 = List['img2'];
        that.title = List['title'];
        that.name = summary.name;
        that.photo = summary.photo;
      });
      //加载首页图片
      that.$http("userInfo/homeSelectInfo", "POST", {page: '/user/home'}, true, function (resp) {
        if (resp && resp.code === 200) {
          //轮播图
          that.navList = resp.navList;
          //遍历图片
          that.itemList = resp.itemList;
        }
      });
    that.loading_main = false;

    //进入定时器进行退出加载
    that.componentDidMount();
  },
  //开启路由缓存
  beforeRouteLeave(to,from,next){
    to.meta.keepAlive = true
    next(0)
  },
}
</script>

<style lang="scss">
@import '@/assets/scss/index.scss';
@import "@/assets/loadimg.css";
</style>
