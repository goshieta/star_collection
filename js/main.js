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
            fps:60
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
                window.addEventListener('keydown',mainCharaObj.keyDownEve.bind(mainCharaObj))
                window.addEventListener("keyup",mainCharaObj.keyUpEve.bind(mainCharaObj))
                let time=0
                setInterval(()=>{
                    time++
                    bgStage.para["seconds"].txtObj.text=time
                },1000)
            }
            //読み込み終わったら
            queue.addEventListener("complete",(e)=>{
                let bgStage=new stageGeometry(stage,stageNum,e)
                let mainCharaObj=new oneMainChara(stage,bgStage.backStage,bgStage.chankBlock,bgStage.para,e)
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
            })
        },
        changeActive(stageNum){
            this.nowSelectStage=stageNum
        }
    }
})
gameApp.mount("#VueApp")