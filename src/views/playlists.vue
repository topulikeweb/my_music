<template>
  <div class="playlists-container">
    <!-- 同步 -->
    <div class="top-card">
      <div class="icon-wrap">
        <!-- 封面 -->
        <img :src="topList.coverImgUrl" alt=""/>
      </div>
      <div class="content-wrap">
        <div class="tag">精品歌单</div>
        <!-- 标题 -->
        <div class="title">
          {{ topList.name }}
        </div>
        <!-- 介绍 -->
        <div class="info">
          {{ topList.description }}
        </div>
      </div>
      <!-- 背景 -->
      <img :src="topList.coverImgUrl" alt="" class="bg"/>
      <div class="bg-mask"></div>
    </div>
    <div class="tab-container">
      <!-- tab栏 顶部 -->
      <div class="tab-bar">
        <span
            class="item"
            :class="{ active: tag == '全部' }"
            @click="tag = '全部'"
        >
          全部
        </span>
        <span
            class="item"
            :class="{ active: tag == '欧美' }"
            @click="tag = '欧美'"
        >
          欧美
        </span>
        <span
            class="item"
            :class="{ active: tag == '华语' }"
            @click="tag = '华语'"
        >
          华语
        </span>
        <span
            class="item"
            :class="{ active: tag == '流行' }"
            @click="tag = '流行'"
        >
          流行
        </span>
        <span
            class="item"
            :class="{ active: tag == '说唱' }"
            @click="tag = '说唱'"
        >
          说唱
        </span>
        <span
            class="item"
            :class="{ active: tag == '摇滚' }"
            @click="tag = '摇滚'"
        >
          摇滚
        </span>
        <span
            class="item"
            :class="{ active: tag == '民谣' }"
            @click="tag = '民谣'"
        >
          民谣
        </span>
        <span
            class="item"
            :class="{ active: tag == '电子' }"
            @click="tag = '电子'"
        >
          电子
        </span>
        <span
            class="item"
            :class="{ active: tag == '轻音乐' }"
            @click="tag = '轻音乐'"
        >
          轻音乐
        </span>
        <span
            class="item"
            :class="{ active: tag == '影视原声' }"
            @click="tag = '影视原声'"
        >
          影视原声
        </span>
        <span
            class="item"
            :class="{ active: tag == 'ACG' }"
            @click="tag = 'ACG'"
        >
          ACG
        </span>
        <span
            class="item"
            :class="{ active: tag == '怀旧' }"
            @click="tag = '怀旧'"
        >
          怀旧
        </span>
        <span
            class="item"
            :class="{ active: tag == '治愈' }"
            @click="tag = '治愈'"
        >
          治愈
        </span>
        <span
            class="item"
            :class="{ active: tag == '旅行' }"
            @click="tag = '旅行'"
        >
          旅行
        </span>
      </div>
      <!-- tab的内容区域 -->
      <div class="tab-content">
        <div class="items">
          <div class="item" v-for="(item, index) in list" :key="index">
            <div class="img-wrap">
              <div class="num-wrap">
                播放量:
                <span class="num">{{ item.playCount }}</span>
              </div>
              <img :src="item.coverImgUrl" alt=""/>
              <span class="iconfont icon-play" @click="toPlaylist(item.id)"></span>
            </div>
            <p class="name">{{ item.name }}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 分页器
      total 总条数
      current-page 当前页
      page-size 每页多少条数据
      current-change 页码改变事件
     -->
    <el-pagination class="pagelist"
                   @current-change="handleCurrentChange"
                   background
                   layout="prev, pager, next"
                   :total="total"
                   :current-page="page"
                   :page-size="10"
    ></el-pagination>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: "playlists",
  data () {
    return {
      // 总条数
      total: 0,
      // 页码
      page: 1,
      // 顶部的推荐歌单
      topList: {},
      // 歌单列表
      list: [],
      // 当前选择的数据
      tag: '全部'
    }
  },
  watch: {
    /*当tag发生变化的时候就会调用*/
    tag: {
      handler () {
        /*改变顶部的歌曲*/
        this.todoData();
        /*重新获取歌单数据*/
        this.listData();
        /*将页面初始化为1*/
        this.page = 1
      }
    }
  },
  created () {
    /*创建的时候就获取歌单列表，和顶部封面*/
    this.todoData();
    this.listData();
  },
  methods: {
    /*请求封面数据源*/
    todoData () {
      axios({
        method: 'GET',
        url: "https://autumnfish.cn/top/playlist/highquality",
      }).then(resolve => {
        /*请求出的数据的第一个拿来当封面数据*/
        this.topList = resolve.data.playlists[0]
        console.log(resolve)
      }).catch(reject => {
        console.log('请求封面图片失败')
      })
    },

    /*请求到列表数据*/
    listData () {
      axios({
        method: 'GET',
        url: 'https://autumnfish.cn/top/playlist/',
        params: {
          /*限制每一页请求到的数据的数量*/
          limit: 10,
          /*offset的意思是从第好多开始请求，比如页码为2时，就从（2-1）*10 第10个数据开始请求，为3时，就从第20个数据开始，为1时，就从第0个数据开始请求*/
          offset: (this.page - 1) * 10,
          /*接口中的cat属性是类别的意思*/
          cat: this.tag
        }
      }).then(resolve => {
        /*将请求到的数据放入list里*/
        // console.log('zh', resolve)
        this.list = resolve.data.playlists
        /*统计总个数*/
        this.total = resolve.data.total
      }).catch(reject => {
        console.log('请求列表数据失败')
      })
    },

    /*去歌单页详情*/
    toPlaylist (id) {
      /*这里要将playlist组件完善后才能使用*/
      this.$router.push(`/playlist?q=${id}`)
    },
    /*页码改变事件*/
    handleCurrentChange (val) {
      // console.log(val)
      this.page = val
      /*重新获取数据*/
      this.listData();
    }
  }
}
</script>

<style scoped>
.pagelist {
  position: relative;
  bottom: 45px;
}
</style>