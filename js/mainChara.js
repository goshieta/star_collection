//メインキャラクターを動かす！！！
class oneMainChara{
    constructor(stage,backStage,chankBlock,parameter,loadData){
        this.stage=stage
        this.backStage=backStage
        this.parameter=parameter
        this.position=[0,0]//テスト用にスポーン地点の座標を変更。実際の座標は[0,0]
        this.speedX=0
        this.haveStar=0
        this.startStarLength=chankBlock.number.star
        this.pressKey={
            a:false,
            d:false,
        }
        this.chankBlock=chankBlock
        //y軸の動きに関するパラメータ
        this.startTime=null
        this.firstSpeed=0
        this.firstY=0
        //前回算出された高さ。これをもとに上っているか上っていないかを判断し、上っている途中は当たり判定を無効化する。
        this.beforeH=-1

        //メインキャラクターを定義
        let mainChara=new createjs.Bitmap(loadData.target._loadedResults.mainChara)
        mainChara.x=window.innerWidth/2
        mainChara.y=500
        mainChara.scaleX = 0.5;
        mainChara.scaleY = 0.5;
        mainChara.regY=192
        mainChara.regX=62
        stage.addChild(mainChara)
        this.mainChara=mainChara

        //各種関数呼び出し
        window.addEventListener("resize",()=>{
            mainChara.x=window.innerWidth/2
        })
        setInterval(this.movechara.bind(this),10)
    }
    keyDownEve(e){
        if(e.key=="d"){
            this.pressKey.d=true
        }
        if(e.key=="a"){
            this.pressKey.a=true
        }
        if(e.key=="w"&&this.startTime==null){
            //上方に打ち上げる
            this.startTime=0
            this.firstSpeed=75  //メートル毎秒
            this.firstY=this.position[1]
        }
    }
    keyUpEve(e){
        if(e.key=="d"){
            this.pressKey.d=false
        }
        if(e.key=="a"){
            this.pressKey.a=false
        }
    }
    movechara(){
        //座標を入れると参照すべき当たり判定の配列を返す
        const returnArray=(x)=>{
            let reArr=this.chankBlock[String(Math.floor(x/100)*100)]
            if(reArr==undefined)return {star:[],ground:[]}
            else return reArr
        }

        //星との当たり判定
        let searchStarArr=[]
        //もしチャンクをまたいでいたらそれに応じて配列を作る必要がある
        if(Math.floor((this.position[0]+31)/100)*100==Math.floor((this.position[0]-31)/100)*100)searchStarArr=searchStarArr.concat(returnArray(this.position[0]).star)
        else searchStarArr=Array.from(new Set(searchStarArr.concat(returnArray(this.position[0]+31).star).concat(returnArray(this.position[0]-31).star)))
        //検査
        searchStarArr.forEach((star,index)=>{
            if(star==undefined)return
            let point=star.localToLocal(0,0,this.mainChara)
            if(this.mainChara.hitTest(point.x,point.y)){
                this.backStage.removeChild(star)
                this.haveStar++
                this.parameter["star"].txtObj.text=`${this.haveStar} / ${this.startStarLength}`
            }
        })

        //カスタムエレメントとの当たり判定
        this.chankBlock.custom.forEach(oneCustom=>{
            let searchCeArr=[]
            //もしチャンクをまたいでいたらそれに応じて配列を作る必要がある
            if(Math.floor((this.position[0]+31)/100)*100==Math.floor((this.position[0]-31)/100)*100)searchCeArr=searchCeArr.concat(returnArray(this.position[0])[oneCustom.name])
            else searchCeArr=Array.from(new Set(searchCeArr.concat(returnArray(this.position[0]+31)[oneCustom.name]).concat(returnArray(this.position[0]-31)[oneCustom.name])))
            searchCeArr.forEach((custom,index)=>{
                if(custom==undefined)return
                let point=custom.localToLocal(0,0,this.mainChara)
                if(this.mainChara.hitTest(point.x,point.y)){
                    this.backStage.removeChild(custom)
                    oneCustom.customEvent(this)
                }
            })
        })

        //キーが押されているか判断
        if(this.pressKey.d)this.speedX+=1
        else if(this.pressKey.a)this.speedX-=1
        this.position[0]+=this.speedX*0.5
        this.speedX=this.speedX*0.9

        //地面に触れているかいないか判定
        const BooltouchGround=()=>{
            let returnBoolean=false
            returnArray(this.position[0]+31)["ground"]?.forEach(oneGround=>{
                let point=oneGround.globalToLocal(window.innerWidth/2+31,500)
                if(oneGround.hitTest(point.x,point.y))returnBoolean=true
            })
            returnArray(this.position[0]-31)["ground"]?.forEach(oneGround=>{
                let point=oneGround.globalToLocal(window.innerWidth/2-31,500)
                if(oneGround.hitTest(point.x,point.y))returnBoolean=true
            })
            this.parameter["hit"].txtObj.text=String(returnBoolean)
            return returnBoolean
        }
        let nowBooltouchGround=BooltouchGround()

        //地面に触れていないかつ、現在他のプロセスが実行されていないのであれば、落ちるセッションを開始する
        if(!nowBooltouchGround&&this.startTime==null){
            this.startTime=0
            this.firstSpeed=0  //メートル毎秒
            this.firstY=this.position[1]
        }

        //Y軸のパラメータをいじる
        if(this.startTime!=null){
            let startTimeRange=this.startTime/8
            //物理のありがたい法則 h=V0*t - 1/2g*t^2  (V0:初速度,h:高さ,g:重力加速度,t:時間（秒）)
            let nowH=this.firstSpeed*startTimeRange-(9.8*startTimeRange**2)/2
            if(nowBooltouchGround){
                //地面に触れていた場合
                let HeightDiff=nowH-this.beforeH
                if(HeightDiff>0){
                    //もし上っている途中ならば
                    this.beforeH=nowH
                    this.position[1]=this.firstY+nowH
                    this.startTime++
                }
                else{
                    //地面に触れたかつ上っている途中でもないのでセッションを停止する
                    //仕様上どうしてもy軸のずれが生じてしまう。そのずれの調整。
                    //本来止まるべき場所は、今回算出したy座標の上にあると考え、今回算出したy座標に最も近いかつ今回算出したy座標よりも大きいy座標を持った地形オブジェクトを発見し、そのオブジェクトの座標を使用する。
                    let thisTimeY=this.firstY+nowH
                    let mostNearY=undefined
                    let searchArr=Array.from(new Set(returnArray(this.position[0]+31)["ground"].concat(returnArray(this.position[0]-31)["ground"])))
                    searchArr.forEach(og=>{
                        let thisTimeGroundY=-(og.y-500)
                        if(thisTimeGroundY-thisTimeY>=0&&(mostNearY>thisTimeGroundY||mostNearY==undefined)){
                            mostNearY=thisTimeGroundY
                        }
                    })
                    this.position[1]=mostNearY
                    //初期化
                    this.startTime=null
                    this.beforeH=-1
                }
            }
            else{
                //地面に触れていない場合
                this.beforeH=nowH
                this.position[1]=this.firstY+nowH
                this.startTime++
            }
        }
    
        this.backStage.x=window.innerWidth/2-200+Math.round(-this.position[0])
        this.backStage.y=Math.round(this.position[1])
    }
}