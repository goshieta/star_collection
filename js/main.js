//canvasのサイズを変更
const changeCanvasSize=()=>{
    document.getElementById('app').width=window.innerWidth
    document.getElementById('app').height=window.innerHeight
}
window.addEventListener("resize",changeCanvasSize)

const gameApp=Vue.createApp({
    data(){
        return {
            stage:stageGeometryArray,
            nowSelectStage:0,
            viewMode:0,
            dialogMes:"読み込み中",
            fps:60,
            scoreInfo:{
                mainScore:0,
                detailScore:[]
            }
        }
    },
    methods:{
        start(stageNum){
            //ゲームスタート
            changeCanvasSize()
            let stage=new createjs.Stage("app")
            let backGround=new createjs.Shape()
            backGround.graphics.beginFill("#0066ba")
            backGround.graphics.drawRect(0,0,window.innerWidth,window.innerHeight)
            window.addEventListener("resize",()=>{
                backGround.graphics.drawRect(0,0,window.innerWidth,window.innerHeight)
            })
            stage.addChild(backGround)

            this.viewMode=1
            //アニメーションを実装
            if(this.fps==60)createjs.Ticker.timingMode = createjs.Ticker.RAF;
            else createjs.Ticker.timingMode=this.fps
            createjs.Ticker.addEventListener("tick",stage)

            //ファイルの読み込み処理
            const defaultLoadMani=[
                {id:"timer",src:"./img/timer.png"},
                {id:"science",src:"./img/experiment.png"},
                {id:"mainChara",src:"./img/mainchara.png"}
            ]
            const manifest=defaultLoadMani.concat(stageGeometryArray[stageNum].loadMani)
            let queue=new createjs.LoadQueue(true)
            queue.on("progress",(e)=>{
                this.dialogMes=`${Math.floor(e.progress*100)}% 読み込み中`
            })
            queue.loadManifest(manifest,true)

            const eventObj=(bgStage,mainCharaObj)=>{
                const keydownBind=(e)=>mainCharaObj.keyDownEve(e)
                const keyupBind=(e)=>mainCharaObj.keyUpEve(e)
                window.addEventListener('keydown',keydownBind)
                window.addEventListener("keyup",keyupBind)
                let time=0
                let timerInter=setInterval(()=>{
                    time++
                    bgStage.para["seconds"].txtObj.text=time
                    if(bgStage.endGameStatus){
                        clearInterval(timerInter)
                        window.removeEventListener("keydown",keydownBind)
                        window.removeEventListener('keyup',keyupBind)
                    }
                },1000)
            }

            //読み込み終わったら
            queue.addEventListener("complete",(e)=>{
                let bgStage=new stageGeometry(stage,stageNum,e)
                let mainCharaObj=new oneMainChara(stage,bgStage,e)

                //3,2,1,スタート!
                let leftOver=3
                this.dialogMes=leftOver
                const countObj=()=>{
                    leftOver--
                    this.dialogMes=leftOver
                    if(leftOver==0){
                        this.dialogMes="スタート!"
                    }else if(leftOver==-1){
                        eventObj(bgStage,mainCharaObj)
                        clearInterval(countTimer)
                        return
                    }
                }
                const countTimer=setInterval(countObj,1000)

                //ゲームオーバーの監視
                const watchOver=()=>{
                    if(bgStage.endGameStatus){
                        let mainScoreJson={}
                        bgStage.paraDictionary.forEach(paraName=>{
                            let paraInfo=String(bgStage.para[paraName].txtObj.text).split("/")[0]
                            this.scoreInfo.detailScore.push({name:bgStage.para[paraName].paraShowName,value:paraInfo})
                            mainScoreJson[paraName]=paraInfo
                        })
                        this.scoreInfo.mainScore=stageGeometryArray[stageNum].calculateScore(mainScoreJson)
                        this.viewMode=2
                        createjs.Ticker.removeEventListener("tick",stage)
                    }
                    else requestAnimationFrame(watchOver)
                }
                watchOver()
            })
        },
        changeActive(stageNum){
            this.nowSelectStage=stageNum
        },
        clear(){
            //メソッド内を初期化。リトライやトップ画面に戻る時に使う
            this.dialogMes="読み込み中"
            this.scoreInfo={
                mainScore:0,
                detailScore:[]
            }
        }
    }
})
gameApp.mount("#VueApp")