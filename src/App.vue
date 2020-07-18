<template>
  <div id="app">
    <div v-if="phase==='setup'">
      <el-row :gutter="10">
        <el-button @click="setupPlayerIndex=0"><div class="playerColor red"/></el-button>
        <el-button @click="setupPlayerIndex=1"><div class="playerColor yellow"/></el-button>
        <el-button @click="setupPlayerIndex=2"><div class="playerColor blue"/></el-button>
        <el-button @click="setupPlayerIndex=3"><div class="playerColor green"/></el-button>
      </el-row>
      <div v-if="setupPlayerIndex!==null" class="setup-player">
        <div v-for="(chess, chessIndex) in players[setupPlayerIndex].chess" :key="chessIndex">
          {{chess.name}} <el-select v-model="players[setupPlayerIndex].chess[chessIndex].value">
              <el-option v-for="(opt,optIndex) in ALL_VALUE" :label="opt" :value="opt" :key="optIndex">
              </el-option>
            </el-select>
        </div>
        <el-button type="primary" @click="setupPlayerIndex=null" style="margin-top: 8px">确定</el-button>
      </div>
      <el-button v-if="setupPlayerIndex===null" type="primary" @click="phase='game'" style="margin-top: 48px">开始游戏</el-button>
    </div>
    <div v-if="phase==='game'">
      <el-row :gutter="16">
        <el-col :span="12">
          <div style="margin:8px">攻击方</div>
          <el-select :disabled="result!==null" v-model="attackerIndex">
            <el-option v-for="(player,playerIndex) in players" :label="player.colorName" :value="playerIndex" :key="playerIndex">
              <div :style="'color:'+player.color">{{player.colorName}}</div>
            </el-option>
          </el-select>
          <el-select :disabled="result!==null" v-model="attackerChessIndex">
            <el-option v-for="(chess,chessIndex) in ALL_CHESS" :label="chess" :value="chessIndex" :key="chessIndex">
            </el-option>
          </el-select>
          <div style="margin:8px">修正</div>
          <span>
            <el-button :disabled="result!==null" @click="attackerAdjust--" icon="el-icon-minus"/>
            <span style="margin: 8px">{{attackerAdjust}}</span>
            <el-button :disabled="result!==null" @click="attackerAdjust++" icon="el-icon-plus"/>
          </span>
          <div v-if="result">
            <div class="result" v-if="result.attackerResult.win">胜利</div>
            <div class="result" v-if="result.attackerResult.lose">失败</div>
            <div class="result point" v-if="result.attackerResult.point">得分：{{result.attackerResult.point}}</div>
          </div>
        </el-col>
        <el-col :span="12">
          <div style="margin:8px">防守方</div>
          <el-select :disabled="result!==null" v-model="defenderIndex">
            <el-option v-for="(player,playerIndex) in players" :label="player.colorName" :value="playerIndex" :key="playerIndex">
              <div :style="'color:'+player.color">{{player.colorName}}</div>
            </el-option>
          </el-select>
          <el-select :disabled="result!==null" v-model="defenderChessIndex">
            <el-option v-for="(chess,chessIndex) in ALL_CHESS" :label="chess" :value="chessIndex" :key="chessIndex">
            </el-option>
          </el-select>
          <div style="margin:8px">修正</div>
          <span>
            <el-button :disabled="result!==null" @click="defenderAdjust--" icon="el-icon-minus"/>
            <span style="margin: 8px">{{defenderAdjust}}</span>
            <el-button :disabled="result!==null" @click="defenderAdjust++" icon="el-icon-plus"/>
          </span>
          <div v-if="result">
            <div class="result" v-if="result.defenderResult.win">胜利</div>
            <div class="result" v-if="result.defenderResult.lose">失败</div>
            <div class="result point" v-if="result.defenderResult.point">得分：{{result.defenderResult.point}}</div>
          </div>
        </el-col>
      </el-row>
      <el-button v-if="result===null"  @click="onJudge" type="primary">判定</el-button>
      <el-button v-if="result!==null" @click="attackerIndex = defenderIndex = attackerChessIndex = defenderChessIndex = null;result=null" type="primary">确定</el-button>
    </div>
  </div>
</template>

<script>

const ALL_CHESS = ["A","B","C","D","E","F"];
const ALL_COLOR = ["red","yellow","blue","green"]
const ALL_COLOR_NAME = ["红","黄","蓝","绿"]
const ALL_VALUE = ["1","2","3","4","5","*"]
export default {
  name: 'App',
  components: {
    
  },
  data(){
    return {
      ALL_CHESS,
      ALL_COLOR,
      ALL_VALUE,
      setupPlayerIndex: null,
      players:ALL_COLOR.map((color,index)=>{
        return {
            color: color,
            colorName: ALL_COLOR_NAME[index],
            chess: ALL_CHESS.map(chess=>{
              return {
                name: chess,
                value:null
              }
            })
        }
      }),
      phase:"setup",
      attackerIndex: null,
      defenderIndex: null,
      attackerChessIndex:null,
      defenderChessIndex:null,
      attackerAdjust: 0,
      defenderAdjust: 0,
      result:null
    }
  },
  methods:{
    onSetPlayer(){
      
    },
    onStartGame(){

    },
    onJudge(){
      let attackerPlayer = this.players[this.attackerIndex];
      let defenderPlayer = this.players[this.defenderIndex];
      console.log(JSON.stringify(attackerPlayer))
      console.log(JSON.stringify(defenderPlayer))
      let attackerValue = attackerPlayer.chess[this.attackerChessIndex].value;
      let defenderValue = defenderPlayer.chess[this.defenderChessIndex].value;
      this.result = {}
      if ( attackerValue === "*" ) {
        let point = 1;
        if ( defenderValue === "*" ) {
          point = 2;
        }
        this.result.attackerResult = {
          win: true,
          point
        }
        this.result.defenderResult = {
          lose: true,
          point: 0
        }

        return;
      }
      if ( defenderValue === "*" ) {
        this.result.attackerResult = {
          win: true,
          point: 2
        }
        this.result.defenderResult = {
          lose: true,
          point: 0
        }

        
        return;
      }

      console.log(attackerValue)
      console.log(defenderValue)
      let attackerValue2 = Math.min(5,Math.max(1,parseInt(attackerValue)+this.attackerAdjust));
      let defenderValue2 = Math.min(5,Math.max(1,parseInt(defenderValue)+this.defenderAdjust));

      if ( ( attackerValue2 > defenderValue2 && !(attackerValue2===5 && defenderValue2===1)) || (attackerValue2===1 && defenderValue2===5)) {
        this.result.attackerResult = {
          win: true,
          point: 1
        }
        this.result.defenderResult = {
          lose: true,
          point: 0
        }
      } else if ( attackerValue2 === defenderValue2) {
        this.result.attackerResult = {
          lose: true,
          point: 1
        }
        this.result.defenderResult = {
          lose: true,
          point: 1
        }
      } else {
        this.result.attackerResult = {
          lose: true,
          point: 0
        }
        this.result.defenderResult = {
          win: true,
          point: 1
        }
      }
      return;
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.playerColor {
  width: 40px;
  height: 40px;
}

.playerColor.red {
  background-color:red
}

.playerColor.yellow {
  background-color:yellow
}

.playerColor.blue {
  background-color:blue
}

.playerColor.green {
  background-color:green
}

.setup-player {
  margin-top: 8px;
}

.result {
  font-size: 48px;
  font-weight: 400;
  margin: 8px;
}

.result.point {
  font-size: 32px;
}
</style>
