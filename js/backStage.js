class stageGeometry{
    constructor(stage,stageNum,loadData){
        this.stage=stage
        this.stageNum=stageNum
        this.loadData=loadData
        this.endGame=false

        //バックのステージを実装
        this.backStage=new createjs.Container()
        this.backStage.x=window.innerWidth/2-200
        this.backStage.y=0
        stage.addChild(this.backStage)

        //当たり判定に使う情報をチャンクごとに分けてしまったもの
        this.chankBlock={
            number:{},//オブジェクトの数が示されたヘッダーのようなもの
            custom:[]//カスタムイベントエレメントの情報
        }

        //表示するパラメーター
        //パラメータの名前辞書
        this.paraDictionary=["star","seconds","position","hit"]
        this.para={
            star:{
                txtObj:new createjs.Text(`0 / ${Object.keys(stageGeometryArray[stageNum].star).length}`,"24px Arial","black"),
                paraShowName:"星",
                titleImg:()=>{
                    let starIcon=new createjs.Shape()
                    starIcon.graphics.beginFill("#ffc800")
                    starIcon.graphics.drawPolyStar(20,20,16,5,0.6,-90)
                    starIcon
                    return starIcon
                }
            },
            seconds:{
                txtObj:new createjs.Text("0","24px Arial","black"),
                paraShowName:"かかった時間(秒)",
                titleImg:(loadData)=>{
                    const timerIcon=new createjs.Bitmap(loadData.target._loadedResults.timer)
                    timerIcon.scaleX=0.625
                    timerIcon.scaleY=0.625
                    timerIcon.regX=-5
                    timerIcon.regY=-5
                    return timerIcon
                }
            },
            position:{
                txtObj:new createjs.Text("(0,0)","24px Arial","black"),
                paraShowName:"座標",
                titleImg:(loadData)=>{
                    const exeicon=new createjs.Bitmap(loadData.target._loadedResults.science)
                    exeicon.scaleX=0.625
                    exeicon.scaleY=0.625
                    exeicon.regX=-5
                    exeicon.regY=-5
                    return exeicon
                },
            },
            hit:{
                txtObj:new createjs.Text("true","24px Arial","black"),
                paraShowName:"地面に対する当たり判定",
                titleImg:(loadData)=>{
                    const exeicon=new createjs.Bitmap(loadData.target._loadedResults.science)
                    exeicon.scaleX=0.625
                    exeicon.scaleY=0.625
                    exeicon.regX=-5
                    exeicon.regY=-5
                    return exeicon
                },
            }
        }
        //カスタムパラメータを記述
        const cusparaArr=stageGeometryArray[stageNum].custumVariable
        if(cusparaArr!=undefined){
            cusparaArr.forEach(oneNewPara=>{
                this.paraDictionary.push(oneNewPara.name)
                this.para[oneNewPara.name]=oneNewPara
            })
        }

        //地面
        let ground=new createjs.Shape()
        ground.graphics.beginFill("green")
        ground.graphics.drawRect(0,0,5000,40)
        ground.graphics.beginFill("#9e2a00")
        ground.graphics.drawRect(0,40,5000,500)
        ground.y=500
        this.backStage.addChild(ground)
        this.pushChank(ground,[-200,0,5000],"ground")

        this.makeGrass()
        this.makeTerrain()
        this.makeStar()
        this.makeCustomElem()
        this.drawParameter()
        //ここまでくると生成終わってる
        console.log(this.chankBlock)

        //ステージの座標&クリアしているかどうか確かめる
        const positionReload=()=>{
            if(!this.endGameStatus)requestAnimationFrame(positionReload)
            this.para.position.txtObj.text=`(${-(this.backStage.x-window.innerWidth/2+200)},${this.backStage.y})`
            this.fixParaWidth()

            //クリアしているか確かめる
            let clearCondition=stageGeometryArray[stageNum].clearCondition
            let trueNum=0
            clearCondition.forEach(oneCondition=>{
                let parameterA=String(this.para[oneCondition[0]].txtObj.text).split("/")[0].replace(" ","")
                let parameterB=oneCondition[1]
                if(parameterA==parameterB){
                    trueNum++
                }
            })
            if(trueNum==clearCondition.length){this.endGame=true}
        }
        positionReload()
    }
    pushChank(obj,objInfo,type){
        //引数にオブジェクトを渡すとチャンクごとにプッシュする
        //objInfoの構成[x,y,length]
        let startX=objInfo[0]
        let leftOverLen=objInfo[2]
        const add=(num)=>{
            if(this.chankBlock[String(num)]==undefined){
                this.chankBlock[String(num)]={}
            }
            if(this.chankBlock[String(num)][type]==undefined) this.chankBlock[String(num)][type]=[]
            this.chankBlock[String(num)][type].push(obj)
        }
        //一回目
        let nowAddX=Math.floor(startX/100)*100
        add(nowAddX)
        leftOverLen=(leftOverLen+startX)-(nowAddX+100)//残りを算出
        startX=Math.floor(startX/100)*100+100
        //二回目以降
        while(leftOverLen>0){
            add(startX)
            startX+=100
            leftOverLen-=100
        }
        return true
    }
    makeGrass(){
        //草
        let grassPosiArr=[]
        for(let i=0;i<Math.floor(Math.random()*20+20);i++){
            let oneGrass=new createjs.Shape()
            oneGrass.graphics.beginFill("#0cb000")
            oneGrass.graphics.moveTo(0,50)
            oneGrass.graphics.lineTo(15,10)
            oneGrass.graphics.lineTo(35,40)
            oneGrass.graphics.lineTo(50,10)
            oneGrass.graphics.lineTo(65,40)
            oneGrass.graphics.lineTo(85,10)
            oneGrass.graphics.lineTo(100,50)
            oneGrass.graphics.lineTo(0,50)
            oneGrass.y=450
            let newX=Math.floor(Math.random()*5000)
            //x座標の重なり検査
            let overlap=true
            while(overlap){
                newX=Math.floor(Math.random()*5000)
                overlap=false
                grassPosiArr.forEach(val=>{
                    if(Math.abs(val-newX)<=100)overlap=true
                })
            }
            //追加
            grassPosiArr.push(newX)
            oneGrass.x=newX
            this.backStage.addChild(oneGrass)
        }
    }
    makeTerrain(){
        //ステージの浮島作成
        //浮島の座標などをしまい込んだリスト[x,y,lengh],座標はスポーンを0,0とする座標
        const floatList=stageGeometryArray[this.stageNum].ground
        floatList.forEach(oneFloatInfo=>{
            let oneFloat=new createjs.Shape()
            oneFloat.graphics.beginFill("green")
            oneFloat.graphics.drawRect(0,0,oneFloatInfo[2],15)
            oneFloat.graphics.beginFill("#9e2a00")
            oneFloat.graphics.drawRect(0,15,oneFloatInfo[2],20)
            oneFloat.x=oneFloatInfo[0]+200
            oneFloat.y=-(oneFloatInfo[1]-500)
            this.backStage.addChild(oneFloat)
            this.pushChank(oneFloat,oneFloatInfo,"ground")
        })
    }
    makeStar(){
        //星を作成
        const starPosiList=stageGeometryArray[this.stageNum].star
        this.chankBlock.number.star=0
        starPosiList.forEach((starPosi)=>{
            let oneStar=new createjs.Shape()
            const fillCommand=oneStar.graphics.beginFill("rgb(255, 191, 94)").command
            oneStar.graphics.drawPolyStar(0,0,20,5,0.6,-90)
            oneStar.x=starPosi[0]+200
            oneStar.y=-(starPosi[1]-500)-22
            this.backStage.addChild(oneStar)
            this.chankBlock.number.star++
            this.pushChank(oneStar,[starPosi[0],starPosi[1],0],"star")

            createjs.ColorPlugin.install("rgb")
            createjs.Tween.get(fillCommand,{loop:-1})
                .to({style:"rgb(255, 247, 0)"},1000)
                .to({style:"rgb(255, 191, 94)"},1000)
            createjs.Tween.get(oneStar,{loop:-1})
                .to({scaleX:0.7,scaleY:0.7},1000)
                .to({scaleX:1,scaleY:1},1000)
        })
    }
    makeCustomElem(){
        //カスタムエレメントを生成
        const custuemElementInfo=stageGeometryArray[this.stageNum].customElements

        custuemElementInfo.forEach(oneElem=>{
            const type=oneElem.type
            if(type=="event"){
                this.chankBlock.custom.push({name:oneElem.name,customEvent:oneElem.customEvent})
                oneElem.start()
            }
            oneElem.position.forEach(elemPosi=>{
                let customCreate=oneElem.draw(elemPosi[2],this.loadData)
                customCreate.x=elemPosi[0]+200
                customCreate.y=-(elemPosi[1]-500)
                this.backStage.addChild(customCreate)
                if(type=="event"){
                    this.pushChank(customCreate,[elemPosi[0],elemPosi[1],0],oneElem.name)
                }
            })
        })
    }
    drawParameter(){
        let nowX=0
        let Allparameter=new createjs.Container()
        console.log(this.para)
        this.paraDictionary.forEach((paraName,index)=>{
            const oneParaInfo=this.para[paraName]
            let paraComp=new createjs.Container()
            paraComp.y=10
            paraComp.x=nowX+20
            let txt=oneParaInfo.txtObj
            txt.y=20
            txt.textBaseline = "middle"
            txt.x=50
            let txtWidth=txt.getMeasuredWidth()
            let back=new createjs.Shape()
            back.graphics.beginFill("white")
            back.alpha=0.8
            back.graphics.drawRoundRect(0,0,txtWidth+60,40,10,10)
            let icon=oneParaInfo.titleImg(this.loadData)
            icon.x=5
            icon.y=0
            paraComp.addChild(back)
            paraComp.addChild(icon)
            paraComp.addChild(txt)
            Allparameter.addChild(paraComp)
            this.para[paraName].comp=paraComp
            nowX+=(txtWidth+80)
        })
        this.stage.addChild(Allparameter)
    }
    fixParaWidth(){
        let nowX=0
        this.paraDictionary.forEach((paraName)=>{
            const oneParaInfo=this.para[paraName]
            oneParaInfo.comp.x=nowX+20
            const child=oneParaInfo.comp.children
            const txtWidth=child[2].getMeasuredWidth()
            let backGra=child[0].graphics
            backGra.clear()
            backGra.beginFill("white")
            child[0].alpha=0.8
            backGra.drawRoundRect(0,0,txtWidth+60,40,10,10)
            nowX+=(txtWidth+80)
        })
    }
    get endGameStatus(){
        return this.endGame
    }
    set endGameStatus(value){
        this.endGame=value
    }
}