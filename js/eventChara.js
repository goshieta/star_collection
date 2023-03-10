let stageGeometryArray=[
    {
        stageName:"Basic",
        stageDiff:1,
        desc:"Basicステージは一番基本的なステージです。基本的なステージのため、一番簡単な難易度設定とはなっていますが、そうはいってもそれなりの難易度があるステージです。上級者の方は、指慣らしにちょうどいいような感じで～す♡",
        star:[[560,0],[200,200],[430,200],[950,500],[1350,500],[1780,500],[2035,700],[1410,950],[995,950],[965,1800],[925,1500],[1400,2500],[945,3000],[195,3200],[200,3800],[200,4200],[200,4600],[200,5100],[100,5100],[300,5100],[-550,4000],[-955,4400],[-1640,4800],[-1835,4800],[-1990,4800],[-2130,4800],[945,4000],[1345,4400],[1955,4800],[2230,4800],[2330,4800],[1920,1200],[2380,1400],[2800,1500],[3390,1400],[4100,1500],[3750,1900],[3430,2100],[2840,2500],[2555,2500],[2275,2500],[2125,2500],[2695,0],[4990,-100],[4990,-1000],[5280,-1000],[4515,-1000],[4060,-1000],[3675,-1000],[2890,-1000],[2150,-1000],[2075,-1000],[1650,-1000],[2705,-1400],[2705,-1100],[2960,-1500],[2715,-1600],[2455,-1700],[2705,-1800],[2575,-1800],[2845,-1800]],
        ground:[[50,200,500],[900,500,80],[1500,350,200],[1700,500,200],[1900,700,200],[1000,950,800],[800,1200,250],[800,1500,250],[800,1800,250],[800,2100,250],[800,2400,250],[800,2700,250],[800,3000,250],[150,3200,100],[100,3500,200],[50,3800,300],/*ここから三つに分岐するところ*//*1*/[-600,4000,100],[-800,4200,100],[-1000,4400,100],[-1200,4600,100],[-2300,4800,700],/*2*/[150,4000,100],[150,4200,100],[150,4400,100],[150,4600,100],[150,4800,100],[0,5100,400],/*3*/[900,4000,100],[1100,4200,100],[1300,4400,100],[1500,4600,100],[1900,4800,700],/*二つに分岐するところの二つ目*/[1750,1200,250],[2300,1400,200],[2800,1300,200],[3300,1400,200],[3800,1300,200],[4300,1400,200],[4000,1700,80],[3700,1900,80],[3400,2100,80],[3100,2300,80],[2800,2500,80],[2000,2500,600],/*地下*/[4800,-1000,600],[4400,-1000,200],[4000,-1000,200],[3600,-1000,200],[3200,-1000,200],[2800,-1000,200],[2400,-1000,200],[2000,-1000,200],[1600,-1000,200],[2500,-1400,400],[2800,-1500,200],[2400,-1500,200],[2500,-1600,400],[2800,-1700,200],[2400,-1700,200],[2500,-1800,400]],
        customElements:[],
        loadMani:[],
        calculateScore:(mainScoreJson)=>Math.floor(mainScoreJson.star*100+(1200/mainScoreJson.seconds*(mainScoreJson.star/61))),
        clearCondition:[["star","61"]]
    },
    {
        stageName:"呉市",
        stageDiff:2,
        desc:"呉市に行ったことはありますか？呉市はド田舎です。そんな呉市のように、閑散としているのがこのコースの特徴です。閑散としている分、コースの全容をつかみにく、初心者にはわかりにくいコースとなっています。このコースで遊べば、台パンすること間違いなし！！",
        star:[[-500,100],[2520,-300],[1130,500],[585,2100],[690,3000],[755,3300],[-950,1400],[-3825,0],[-3550,170],[-3160,510],[-3960,510],[-3755,800],[-3770,1020],[-3230,1105],[-3850,1400],[-3820,1660],[-3461,1660],[-3280,1660],[2820,0],[2195,400],[2480,500],[1300,2500],[4700,1500]],
        ground:[[-900,0,70],[-1200,200,70],[-700,350,70],[0,400,70],[200,500,1000],[500,700,200],[500,1000,200],[500,1300,200],[500,1600,200],[500,1900,200],[500,2100,200],[500,2400,200],[500,2700,200],[500,3000,200],[400,3300,400],
        [2100,400,500],[2100,500,500],[3000,700,100],[3500,900,100],[4000,1100,100],[4500,1300,100],[5000,1500,100],[5500,1700,100],[6000,1900,100],[6500,2100,100],[7000,2300,100],[7500,2500,100],[8000,2700,100],[8200,3000,500],
        [8700,-900,100],[9000,-900,500],[9000,-1200,1000],[9000,-1500,1000],[9000,-1800,1000],[9000,-2100,1000],//牡蠣養殖場
        [-800,1500,500],[-1100,1200,200],[-1400,1000,200],[-1700,800,200],[-2000,600,200],[-2300,400,200],[-2600,200,200],[-2900,0,200],[-4000,0,900],/*クライミング *//*3*/[-4000,170,70],[-3585,170,70],[-3170,170,70],/*2*/[-3795,340,70],[-3375,340,70],/*3*/[-4000,510,70],[-3585,510,70],[-3170,510,70],/*2*/[-3795,680,70],[-3375,680,70],/*3*/[-4000,850,70],[-3585,850,70],[-3170,850,70],/*2*/[-3795,1020,70],[-3375,1020,70],/*3*/[-4000,1190,70],[-3585,1190,70],[-3170,1190,70],/*2*/[-3795,1360,70],[-3375,1360,70],[-4000,1660,900],
        [-350,-300,70],
        ],
        customElements:[{
            name:"orange",
            type:"decoration",
            draw(info,loadData){
                const oneOrange=new createjs.Bitmap(loadData.target._loadedResults["レモン"])
                oneOrange.regX=24
                oneOrange.regY=42
                return oneOrange
            },
            position:[[-1165,200],[400,500],[930,500],[595,3300],[1320,0],[-680,1500],[-1645,800],[-2185,400]]
        },{
            name:"signboard",
            type:"decoration",
            draw(info){
                const oneBoard=new createjs.Container()
                const back=new createjs.Shape()
                back.graphics.beginFill("#FF8600")
                back.graphics.drawRoundRect(0,0,150,50,5,5)
                back.graphics.drawRect(70,50,10,40)
                oneBoard.addChild(back)
                const text=new createjs.Text(info,"bold 15px monospace","black")
                text.textAlign="center"
                text.textBaseline = "middle"
                text.y=15
                text.x=75
                oneBoard.addChild(text)
                oneBoard.regX=75
                oneBoard.regY=90
                return oneBoard
            },
            position:[[2550,500,"天への階段 →"],[8600,3000,"残念～☆ここには\n\n何もありません"],[8755,-900,"大規模牡蠣養殖場\n\n大日本製鉄(株)"],[-3745,1660,"呉市両城の\n\n階段住宅"],[-785,1500,"呉湾の夕焼け"]]
        },{
            name:"kurePhoto1",
            type:"decoration",
            draw(info,loadData){
                const photo=new createjs.Bitmap(loadData.target._loadedResults["両城"])
                photo.regY=200
                return photo
            },
            position:[[-3625,1660]]
        },{
            name:"kurePhoto1",
            type:"decoration",
            draw(info,loadData){
                const photo=new createjs.Bitmap(loadData.target._loadedResults["呉湾"])
                photo.regY=150
                return photo
            },
            position:[[-570,1500]]
        },{
            name:"oyster",
            type:"event",
            start(){
                this.position=[]
                stageGeometryArray[1].custumVariable[0].txtObj.text="0 / 10"
                for(let i=0;i<10;i++){
                    this.position.push([Math.floor(Math.random()*1000+9000),-1200-(Math.floor(Math.random()*4)*300)])
                }
            },
            draw(info,loadData){
                const oyster=new createjs.Bitmap(loadData.target._loadedResults["牡蠣"])
                oyster.regY=50
                oyster.regX=30
                oyster.scaleX=0.7
                oyster.scaleY=0.7
                return oyster
            },
            customEvent(parentThis){
                let beforeNum=Number(parentThis.parameter.oyster.txtObj.text.split("/")[0])
                parentThis.parameter.oyster.txtObj.text=`${beforeNum+1} / 10`
            },
            position:[]
        }],
        custumVariable:[{
            name:"oyster",
            txtObj:new createjs.Text("0 / 10","24px Arial","black"),
            paraShowName:"牡蠣",
            titleImg:(loadData)=>{
                const oysterIcon=new createjs.Bitmap(loadData.target._loadedResults["牡蠣"])
                oysterIcon.scaleX=0.5
                oysterIcon.scaleY=0.6
                oysterIcon.regX=-5
                oysterIcon.regY=-5
                return oysterIcon
            }
        }],
        loadMani:[
            {id:"レモン",src:"./img/レモン.png"},
            {id:"牡蠣",src:"./img/牡蠣.png"},
            {id:"両城",src:"./img/両城.jpg"},
            {id:"呉湾",src:"./img/呉湾.jpg"}
        ],
        calculateScore:(mainScoreJson)=>Math.floor(mainScoreJson.star*100+(1200/mainScoreJson.seconds*(mainScoreJson.star/23))+(mainScoreJson.oyster*20)),
        clearCondition:[["star","23"],["oyster","10"]],
    },
    {
        stageName:"鬼が島",
        stageDiff:3,
        desc:"桃太郎に出てくる鬼ヶ島は、絵本ということもあってか、結構簡単に攻略できているような印象がありますが、このゲームの鬼ヶ島は、そんな楽なものではありません。なぜならこのステージに登場する鬼に触れると即死するからです。せいぜい触れないように頑張ってください。",
        star:[],
        ground:[],
        customElements:[],
        loadMani:[],
        calculateScore:(mainScoreJson)=>Math.floor(mainScoreJson.star*100+(1200/mainScoreJson.seconds*mainScoreJson.star)),
        clearCondition:[]
    }
]