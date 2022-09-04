<template>
  <!--此组件作用于歌单  -->
  <div class="playlist-container">
    <div class="top-wrap">
      <div class="img-wrap">
        <!-- 封面 -->
        <img :src="playlist.coverImgUrl" alt=""/>
      </div>
      <div class="info-wrap">
        <!-- 名字 -->
        <p class="title">{{ playlist.name }}</p>
        <div class="author-wrap">
          <!-- 头像 -->
          <img class="avatar" :src="playlist.creator.avatarUrl" alt=""/>
          <span class="name">{{ playlist.creator.nickname }}/</span>
          <span class="time">{{ playlist.createTime }} 创建</span>
        </div>
        <div class="play-wrap">
          <span class="iconfont icon-circle-play"></span>
          <span class="text">播放全部</span>
        </div>
        <div class="tag-wrap">
          <span class="title">标签:</span>
          <!-- 分类标签 -->
          <ul>
            <li v-for="(item, index) in playlist.tags" :key="index">
              {{ item }}
            </li>
          </ul>
        </div>
        <div class="desc-wrap">
          <span class="title">简介:</span>
          <!-- 简介 -->
          <span class="desc">
            {{ playlist.description }}
          </span>
        </div>
      </div>
    </div>
    <el-tabs v-model="activeIndex">
      <el-tab-pane label="歌曲列表" name="1">
        <table class="el-table playlit-table">
          <thead>
          <th></th>
          <th></th>
          <th>音乐标题</th>
          <th>歌手</th>
          <th>专辑</th>
          <th>时长</th>
          </thead>
          <tbody>
          <tr class="el-table__row" v-for="(item,index) in playlist.tracks" :key="index"
              @click="play(item.id)">
            <td>{{ index + 1 }}</td>
            <td>
              <div class="img-wrap">
                <img :src="item.al.picUrl" alt=""/>
                <span class="iconfont icon-play"></span>
              </div>
            </td>
            <td>
              <div class="song-wrap">
                <div class="name-wrap">
                  <span>{{ item.name }}</span>
                  <span class="iconfont icon-mv" v-if="item.mv!== 0" @click="toMV(item.mv)"></span>
                </div>

              </div>
            </td>
            <td>{{ item.ar[0].name }}</td>
            <td>{{ item.al.name }}</td>
            <td>{{ item.dt }}</td>
          </tr>

          </tbody>
        </table>
      </el-tab-pane>
      <el-tab-pane :label="`评论：${total}`" name="2">
        <!-- 精彩评论 -->
        <div class="comment-wrap">
          <p class="title">
            精彩评论
            <span class="number">({{ hotCount }})</span>
          </p>
          <div class="comments-wrap">
            <!-- 评论 -->
            <div v-for="(item, index) in hotComment" :key="index" class="item">
              <div class="icon-wrap">
                <!-- 头像 -->
                <img :src="item.user.avatarUrl" alt=""/>
              </div>
              <div class="content-wrap">
                <div class="content">
                  <!-- 昵称 -->
                  <span class="name">{{ item.user.nickname }}:</span>
                  <span class="comment">{{ item.content }}</span>
                </div>
                <!-- 评论的回复 -->
                <div class="re-content" v-if="item.beReplied.length != 0">
                  <span class="name"
                  >{{ item.beReplied[0].user.nickname }}：</span
                  >
                  <span class="comment">{{ item.beReplied[0].content }}</span>
                </div>
                <div class="date">{{ item.time }}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 最新评论 -->
        <div class="comment-wrap">
          <p class="title">
            最新评论
            <span class="number">( {{ total }} )</span>
          </p>
          <div class="comments-wrap">
            <div class="item" v-for="(item,index) in comments" :key="index">
              <div class="icon-wrap">
                <img :src="item.user.avatarUrl" alt=""/>
              </div>
              <div class="content-wrap">
                <div class="content">
                  <span class="name">{{ item.user.nickname }}：</span>
                  <span class="comment">{{ item.content }}</span>
                </div>
                <div class="re-content" v-if="item.beReplied.length!=0">
                  <span class="name">{{ item.beReplied[0].user.nickname }}：</span>
                  <span class="comment">{{ item.beReplied[0].content }}</span>
                </div>
                <div class="date">{{ item.time }}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 分页器 -->
        <el-pagination
            class="pages"
            @current-change="handleCurrentChange"
            background
            layout="prev, pager, next"
            :total="total"
            :current-page="page"
        ></el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: "result",
  data () {
    return {
      activeIndex: "1",
      // 总条数
      total: 0,
      // 页码
      page: 1,
      // 歌单详情数据
      // tracks 歌曲列表
      playlist: {},
      // 热门评论
      hotComment: [],
      // 热门评论的个数
      hotCount: 0,
      limit: 10,
      currentMusicIndex: 0, // 当前播放的歌曲在本页歌单中的索引
      // 普通评论
      comments: [],
      url:''
    }
  },
  created () {
    axios({
      method: 'GET',
      url: 'https://autumnfish.cn/playlist/detail',
      params: {
        id: this.$route.query.q
      }
    }).then(resolve => {
      this.playlist = resolve.data.playlist
    }).catch(reject => {
      console.log('获取失败')
    })
    /*获取评论*/
    axios({
      method: 'GET',
      url: 'https://autumnfish.cn/comment/hot',
      params: {
        /*接收playlists组件传过来的参数*/
        id: this.$route.query.q,
        /*传输类型*/
        type: 2
      }
    }).then(resolve => {
      // console.log(resolve)
      this.hotComment = resolve.data.hotComments;
      /*获取总个数*/
      this.hotCount = resolve.data.hotComments.length
    }).catch(reject => {
      console.log('获取评论失败')
    })
  },
  methods: {
    // 获取最新评论
    getNewList () {
      axios({
        method: 'GET',
        url: 'https://autumnfish.cn/comment/playlist',
        params: {
          id: this.$route.query.q,
          limit: 10,
          offset: (this.page - 1) * 10
        }
      }).then(resolve => {
        /*获取最新评论的总数*/
        console.log('zh' + resolve)
        this.total = resolve.data.total;
        /*获取评论数据*/
        this.comments = resolve.data.comments;
        console.log(this.comments)
      })
    },
    handleCurrentChange (val) {
      /*改变页数*/
      this.page = val
      //重新获取数据
      this.getNewList();
    },
    /*播放音乐*/
    play(id) {
      axios({
        method:'GET',
        url:'https://autumnfish.cn/song/url',
        params:{
          id:id
        }
      }).then(resolve=>{
        /*获取当前的播放地址*/
        this.url=resolve.data.data[0].url
        /*设置父组件的播放地址*/
        this.url=this.$parent.musicUrl
        // console.log(this.$parent.musicUrl)
      })
    },
    /*跳转到mv播放界面*/
    toMV(id){
      console.log(id)
      this.$router.push(`/mv?q=${id}`)
    }
  }
}
</script>

<style scoped>
.pages {
  position: relative;
  bottom: 45px;
}
</style>