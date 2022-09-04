<template>
  <div class="top-container">
    <div class="left-box">
      <div class="icon-wrapper">
        <span class="iconfont icon-home"></span>
        <span class="iconfont icon-sami-select"></span>
        <span class="iconfont icon-full-screen"></span>
      </div>
      <div class="history-wrapper">
        <span class="iconfont icon-arrow-lift"></span>
        <span class="iconfont icon-arrow-right"></span>
      </div>
    </div>
    <h1>MyMusic</h1>
    <div class="right-box">
      <div class="el-input el-input--small el-input--prefix">
        <!-- 搜索框 -->
        <input
            type="text"
            autocomplete="off"
            placeholder="搜索"
            class="el-input__inner"
            v-model="inputValue"
            @keyup.enter="toResult"
            id="find"
            @keyup="Finder"
        />
        <!--    搜索智能匹配框    -->
        <div class="finder" v-if="finder">
          <li>

          </li>
        </div>
        <span class="el-input__prefix">
          <i class="el-input__icon el-icon-search"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: "top",
  data () {
    return {
      inputValue: '',
      finder: false,
      // 收集匹配数据
      data:[]
    }
  },
  methods: {
    toResult () {
      /*如果输入框尾为空*/
      if (this.inputValue === '') {
        //弹出警告
        this.$message.warning('请输入你想输入的歌曲')
      } else {
        /*携带数据去搜索页，传数据给result组件*/
        this.$router.push('/result?q=' + this.inputValue)
      }
    },
    /*智能匹配*/
    Finder(){
      axios({
        method: 'GET',
        url: 'https://autumnfish.cn/search',
        params: {
          /*接收top组件传过来的数据*/
          keywords: this.inputValue,
          type: 1,
          limit: 15
        }
       }).then(resolve=>{
         this.data=resolve
        //  console.log(this.inputValue)
        console.log(resolve)
      })
    }
  }
}
</script>

<style scoped>
h1 {
  margin: 0px 100px;
  color: #99a9bf;
}

#find {
  width: 500px;
  background-color: #ece6e6;
}

.finder {
  width: 300px;
  height: 400px;
  position: absolute;
  background-color: #84bb58;
  z-index: 3;
  top: 50px;
  right: 100px;
}
</style>