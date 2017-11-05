var GameMoveScene = cc.Scene.extend({
    WinSize     :   null,
    Layer       :   null,
    YzScore     :   null,
    LpArrs      :   [],
    isGameOver  :   false,
    GAMESTATE   :   null,
    YZ_SCORE    :   [],
    islock      :   false,//是否为开奖中
    isrefreshDATA   : true,//是否刷新界面数据
    GUIZE       :   null,
    FAILUREindex     :   null,

    onEnter: function () {
        this._super();
        this.YZ_SCORE = GC.YZ_ID['score'];
        GC.SCENE['node'] = this;
        GC.SCENE['id'] = 'GameMoveScene';
        var cache = cc.spriteFrameCache;
        cache.addSpriteFrames(res.GameImg, res.GameImg_png);

        this.WinSize = cc.winSize;

        this.initMoveLayer();

        this.initBtns();

        this.GameState('GameStart');

    },
    GameState : function(State){
        var me = this;

        switch(State){
            case 'GameStart':
                me.GAMESTATE = State;
                me.YzScore = this.YZ_SCORE[0];
                this.initGameData();
                break;
            case 'GameOver':
                me.GAMESTATE = State;
                me.isGameOver = true;

                var Roulette = this.Layer['rouletteIndex'];
                for(var i=0;i<GC.PC.length-1;i++){
                    Roulette['$_'+GC.PC[i].flaxres].btnon= false;
                }
                me.setRouletteEnabled(false);
                me.GameOver();
                break;
            case 'replay':
                me.GAMESTATE = State;
                X.tip_NB.show({
                    str:LNG.REPLAY,
                    isSpecialshow:true
                });
                this.initGameData();
                me.btn_fallbackMethods(true);

                var Roulette = this.Layer['rouletteIndex'];
                for(var i=0;i<GC.PC.length-1;i++){
                    Roulette['$_'+GC.PC[i].flaxres+'_bj'].setVisible(false);
                    Roulette['$_'+GC.PC[i].flaxres].btnon= true;
                }

                //提前玩家进入 进阶,高级场  0不提醒 1提醒
                if(GC.USER_DATA.DATA['levelsign']){
                    if(GC.YZ_ID['id']=='GS_SCORE'){
                        return;
                    }


                    if(GC.USER_DATA.DATA['points']<500&&GC.YZ_ID['id']=='XS_SCORE'){
                      X.Promptbox.Getinstance({
                            btnsType:5,
                            txt:X.stringFormat(LNG.TSRC,'进阶'),
                            callback:function(){
                                GC.YZ_ID = GC.YZ_SCORE['JJ_SCORE'];
                                flax.replaceScene('GameMove');
                            },
                            isShowRemoveBtn : true
                        });
                    }else if(GC.USER_DATA.DATA['points']>=500)
                    {
                        X.Promptbox.Getinstance({
                            btnsType:5,
                            txt: X.stringFormat(LNG.TSRC,'高手'),
                            callback:function(){
                                GC.YZ_ID = GC.YZ_SCORE['GS_SCORE'];
                                flax.replaceScene('GameMove');
                            },
                            isShowRemoveBtn : true
                        });

                    }
                }
                break;
        }
    },
    initMoveLayer : function(){
        var me = this;

        this.Layer = flax.assetsManager.createDisplay(GC.YZ_ID['res'], "scene", {
            parent: this,
            x: this.WinSize.width / 2,
            y: this.WinSize.height / 2
        });

       // this.MoveLayer['img'].setScaleX(cc.winSize.width/this.MoveLayer['img'].getContentSize().width);
        var Roulette = this.Layer['rouletteIndex'];

        X.DataMger.Getinstance({
            'attributes': {
                'bigtxt': '',
                'styletxt': '',
                'numtxt': '',
            },
            'node': me.Layer
        });

        initUserData();
        //初始化数据
        function initUserData(){

            //初始化玩家数据
            X.DataMger.Getinstance({
                'attributes':{'userbean':GC.USER_DATA.DATA['points']},
                'node':me.Layer
             });

            //初始化AI
            me.getAINode().initData();
            me.getAINode().GMoveAiCountManage();
            //初始化轮盘数据
            X.DataMger.Getinstance({
                'attributes':{
                    'txt_1':GC.USER_DATA.DATA[GC.YZ_ID['txtid']]['num_desc'],
                    'txt_2':GC.USER_DATA.DATA[GC.YZ_ID['txtid']]['style_desc'],
                    'txt_3':GC.USER_DATA.DATA[GC.YZ_ID['txtid']]['big_desc']},
                'node':Roulette
            });
        }

    },
    initBtns : function(){
        var me = this;
        var Roulette = this.Layer['rouletteIndex'];
        initBtns();
        me.setRouletteEnabled(false);
        //初始化界面按钮
        function initBtns(){
            // 轮盘按钮
            var res;
            for(var i=0;i<GC.PC.length-1;i++){
                res = '$_'+GC.PC[i].flaxres;
                Roulette[res+'_bj'].setVisible(false);
                Roulette[res+'_utxt'].setVisible(false);
                Roulette[res+'_aitxt'].setVisible(false);
               // Roulette[res].mainCollider.debugDraw();
                Roulette[res].icon= null;
                Roulette[res].iconai= null;
                Roulette[res].linessize= GC.LINES_SIZE[GC.PC[i].Type];
                Roulette[res].readid= GC.PC[i].readid;
                Roulette[res].id= GC.PC[i].id;
                Roulette[res].type= GC.PC[i].Type;
                Roulette[res].flaxres= GC.PC[i].flaxres;
                Roulette[res].btnon= true;
                flax.inputManager.addListener(Roulette[res],me.btns_roulette,InputType.up,me);
                me.LpArrs.push(Roulette[res]);
            }
            //其他按钮
            for(var j=0;j<GC.GAME_MOVE_BTNS.length;j++){
                flax.inputManager.addListener(me.Layer[GC.GAME_MOVE_BTNS[j]],me.btns_Events,InputType.click,me);
            }
            me.Layer[GC.GAME_MOVE_BTNS[2]]['onbtn'] = true;//菜单按钮   onbtn来区分不同的回调事件
            me.Layer[GC.GAME_MOVE_BTNS[2]]['caidanbtn'] = null;//菜单按钮
            //押注按钮

            for(var a=0;a<me.YZ_SCORE.length;a++){
                flax.inputManager.addListener(me.Layer['btn_'+me.YZ_SCORE[a]],me.btns_Events,InputType.click,me);
                me.Layer['btn_'+me.YZ_SCORE[a]].pos = me.Layer['btn_'+me.YZ_SCORE[a]].getPosition();
            }

            for(var b=0;b<GC.GAME_MOVE_CDBTNS.length;b++){
                flax.inputManager.addListener(me.Layer['caidanrq'][GC.GAME_MOVE_CDBTNS[b]],me.btns_Events,InputType.click,me);

            }

            me.Layer['caidanrq'].setVisible(false);
            if(!cc.audioEngine.isMusicPlaying()) {
                me.Layer['caidanrq']['yxsx_btn'].setVisible(false);
            }else{
                me.Layer['caidanrq']['yxsx_btn2'].setVisible(false);
            }
        }
    },
    setRouletteEnabled : function(bool){
        var me = this;
        if(bool){
            for(var i=0;i<me.LpArrs.length;i++){
                me.LpArrs[i].setMouseEnabled(true);
            }
        }else{
            for(var j=0;j<me.LpArrs.length;j++){
                me.LpArrs[j].setMouseEnabled(false);
            }
        }
    },
    //-------------------------initData
    initGameData : function(){
        var me = this;
        me.isrefreshDATA= true;
        releasethreads();
        function releasethreads(){
            X.releaseAllTime();
        }
        X.releaseAlls(GC.TOUZHU_RECORD);
        me.FAILUREindex = 0;
        me.islock = false;
        me.isGameOver = false;
        //init押注
        this.btn_yzMethods(me.YZ_SCORE[0],me,me.Layer['btn_'+this.YZ_SCORE[0]]);

        this.GameTime();


    },
    //========================btns
    btns_roulette : function(touch, event){
        var obj = event.target;

        var me = this;
        if(!me.Layer['btn_caidan']['onbtn']) {
            me.Layer['btn_caidan']['onbtn'] = true;
            me.Layer['caidanrq'].setVisible(false);
        }
        this.btn_rouletteMethods({
            yzscore:me.YzScore,
            btnobj:obj,
            type:'user',
            imgpos:me.Layer['btn_'+me.YzScore],
        })
    },
    btns_Events : function(touch, event){

        var obj = event.target;
        var me = this;
        if(event.target['name']!='img'){
            X.GameBtnEffect();
        }

        if(!me.Layer['btn_caidan']['onbtn']&&obj['name']!='btn_caidan') {
            me.Layer['btn_caidan']['onbtn'] = true;
            me.Layer['caidanrq'].setVisible(false);
        }

        //   GAME_MOVE_BTNS:['btn_add','btn_help','btn_fallback','btn_10','btn_50','btn_100'],
        switch(obj['name']){
            case 'btn_add':
                me.addChild(new chongzhi(),GC.GAME_ZORDER.on);
              //  X.Gotopup();
                break;
            case 'btn_caidan':
                if(obj['onbtn']) {
                    obj['onbtn'] = false;
                    me.Layer['caidanrq'].setVisible(true);
                }else{
                    obj['onbtn'] = true;
                    me.Layer['caidanrq'].setVisible(false);
                }
                break;
            case 'yxwf_btn':
                this.GUIZE = new guize();
                GC.SCENE['node'].addChild(this.GUIZE,GC.GAME_ZORDER.on);
                break;
            case 'yxsx_btn':
                    GC.ISMUSICPLAY = false;
                    obj.setVisible(false);
                    X.AudioManage.Getinstance().isAllpauseMusicAndEffect(false);
                    me.Layer['caidanrq']['yxsx_btn2'].setVisible(true);
                break;
            case 'yxsx_btn2':
                    GC.ISMUSICPLAY = true;
                    obj.setVisible(false);
                    X.AudioManage.Getinstance().isAllpauseMusicAndEffect(true);
                    me.Layer['caidanrq']['yxsx_btn'].setVisible(true);
                break;
            case 'btn_fallback':
                me.btn_fallbackMethods(false,obj);
                break;
            case 'btn_wangqi':
                this.addChild(X.wangqi.Getinstance(),GC.GAME_ZORDER.on);
                break;
            case 'btn_fanhui':
                flax.replaceScene('GameBegin');
                break;
            case 'btn_'+this.YZ_SCORE[0]:
                me.btn_yzMethods(this.YZ_SCORE[0],me,obj);
                break;
            case 'btn_'+this.YZ_SCORE[1]:
                me.btn_yzMethods(this.YZ_SCORE[1],me,obj);
                break;
            case 'btn_'+this.YZ_SCORE[2]:
                me.btn_yzMethods(this.YZ_SCORE[2],me,obj);
                break;
            case 'tzjl_btn':
                X.touzhujilu.Getinstance().show();
                break;
            default :
                break;
        }
    },
    // 轮盘item
    btn_rouletteMethods : function(attributes){
        var me = this;
        var yzscore = attributes.yzscore;
        var obj = attributes.btnobj;
        var imgpos = attributes.imgpos;
        var type = attributes.type;
        if(!obj['btnon']&&type=='user'){return}
        if(this.islock){
            if(type=='user'){
                X.tip_NB.show({
                    str:LNG.KJZ
                });
            }

            return;
        }

        if(type=='user'&&GC.USER_DATA.DATA['points']<yzscore){
            X.tip_NB.show({
                str:LNG.YEBZ
            });
            return;
        }

        obj['btnon'] = false;
        if(isflowMaxScore()){
            if(type=='user'){
                X.tip_NB.show({
                    str:X.stringFormat(LNG.ZDXE,obj['linessize'])
                });
            }
            obj['btnon'] = true;
            return;
        }

        var spriteFrame = cc.spriteFrameCache.getSpriteFrame('yz_'+yzscore+'.png');
        var sprite = new cc.Sprite(spriteFrame);
        var spritePos = imgpos.parent.convertToWorldSpace(imgpos.getPosition());
        var lablecolor;
        sprite.x=spritePos.x;
        sprite.y=spritePos.y;
        sprite.setScale(0.7);
        me.addChild(sprite);


        //动作
        var UserPosObj = me.Layer['rouletteIndex'][obj['name']+'_utxt'];
        var AIPosObj = me.Layer['rouletteIndex'][obj['name']+'_aitxt'];
        var PosObj = type==='ai'?AIPosObj:UserPosObj;

        var ObjWorldPos = PosObj.parent.convertToWorldSpace(PosObj.getPosition());
        var pos_Sleep =Math.sqrt(Math.pow(Math.abs(sprite.x-ObjWorldPos.x),2))+Math.sqrt(Math.pow(Math.abs(sprite.y-ObjWorldPos.y),2));
        sprite.runAction(cc.sequence(new cc.MoveTo(pos_Sleep/GC.ACTION_INFO['YZ_Sleep'],ObjWorldPos.x,ObjWorldPos.y),new cc.CallFunc(function(){
            this.removeFromParent();
            addyzscore();
        },sprite)));

        function addyzscore(){
            var icon = type==='ai'?icon = obj['iconai']:icon = obj['icon'];
            switch (type){
                case 'ai':
                    lablecolor = '#d6d6d6'
                    setScore();
                    break;
                case 'user':
                    lablecolor = '#fff583'
                    http_user();
                    break;

            }

            function http_user(){
                var big,style,num;
                switch(obj['type']){
                    case 'big':
                        big = obj['readid'];
                        break;
                    case 'style':
                        style = obj['readid'];
                        break;
                    case 'num':
                        num =  obj['id'];
                        break;
                }
                $.ajax({
                    type: "GET",
                    url: GC.HTTPDATA.pokerbuy,
                    dataType: GC.HTTPDATA.DATA_TYPE,
                    async:'false',
                    cache:true,
                    data: {
                        uid: GC.USER_DATA.uid,
                        issue: GC.USER_DATA.DATA['nowissue'],
                        token: GC.USER_DATA.token,
                        big: big || 0,
                        style: style || 0,
                        place:GC.YZ_ID['readid']||1,
                        num: num || 0,
                        value : yzscore//押注
                    },
                    success: function (returndata) {
                        if(returndata.code == 200){
                            var tempdata = returndata.data;

                            GC.TOUZHU_RECORD.push({'big':big,'style':style,'num':num});

                            GC.HTTPDATA.boltagainindex = 1;
                            me.refreshUserData({
                                points:tempdata['usermoney']
                            });
                            setScore();
                        }else if(returndata.code == GC.HTTPDATA.STAY_LOTTERY){
                            X.tip_NB.show({
                                str:LNG.KJZ
                            });
                        }else if(returndata.code == GC.HTTPDATA.FAILURE){
                            obj['btnon'] = true;
                            X.tip_NB.show({
                                str:LNG.SXSJ
                            });
                            X.boltagain(function(){
                                me.GameState('GameStart');
                            });
                        }else if(returndata.code == GC.HTTPDATA.MONEY_DONT){
                            obj['btnon'] = true;
                            X.tip_NB.show({
                                str:LNG.YEBZ
                            });
                        }else if(returndata.code == GC.HTTPDATA.GLJDZ){
                            var tempdata = returndata.data;
                            me.refreshUserData({
                                points:tempdata['usermoney']
                            });

                            X.activity.Getinstance({
                                titleimg:2,
                                txt: X.stringFormat(LNG.QLGDZ,50)
                            });
                            obj['btnon'] = true;
                        }else{
                            X.boltagain(function(){
                                me.GameState('GameStart');
                            });
                        }
                    },
                    error: function (err) {
                        X.Promptbox.Getinstance({
                            btnsType: 3,
                            txt: LNG.WLYCTC,
                            callback: function () {
                                X.closeWebPage();
                            },
                            ispauseGame: true
                        });
                    }
                });
            }
            function setScore(){
                if(!icon){
                    icon = PosObj;

                    icon.txt = new cc.LabelTTF(yzscore+'',"微软黑体",18);
                    icon.txt.x=ObjWorldPos.x;
                    icon.txt.y=ObjWorldPos.y;
                    icon.txt.setColor(cc.color('#0000'));
                    me.addChild(icon.txt);

                    if(type==='ai'){
                        icon.setTexture('res/GameMove/IMG/'+GC.YZ_ID['aiimg']);

                        obj['iconai'] = icon;
                        obj['iconai'].txt = icon.txt;
                        obj['iconai'].txt.len=icon.txt.getString().length;
                    }else{
                        icon.setTexture('res/GameMove/IMG/'+GC.YZ_ID['userimg']);
                        obj['icon'] = icon;
                        obj['icon'].txt = icon.txt;
                        obj['icon'].txt.len=icon.txt.getString().length;
                    }
                    icon.setVisible(true);
                    seticonSizeAndColor(icon,{
                        'addWidth':8,
                        'color':'#00000'
                    });

                }else {

                    var score = parseInt(icon.txt.getString());
                    var V = score+=yzscore;

                    X.DataMger.Getinstance({
                        'attributes':{'txt':V},
                        'node':icon
                    });
                    if(icon.txt.len&&icon.txt.len<icon.txt.getString().length){

                        seticonSizeAndColor(icon,{
                            'addWidth':8,
                            'color':'#00000'
                        });

                        icon.txt.len = icon.txt.getString().length;
                    }
                }

                obj['btnon'] = true;
            }
            //设置字背景
            function seticonSizeAndColor(obj,attribute){
                obj.setScaleX((obj.txt.getContentSize().width+attribute.addWidth)/(obj.getContentSize().width));
              //  obj.setScaleY(1.3);
               // obj.setColor(cc.color(attribute.color));
            }
        }
        function isflowMaxScore(){
            var userscore = obj['icon']?parseInt(obj['icon'].txt.getString()):0;
            var aiscore = obj['iconai']?parseInt(obj['iconai'].txt.getString()):0;
            var totalScore = (userscore+aiscore)+yzscore;
            if(totalScore>obj['linessize']){
                return true;
            }
            return false;
        }
    },
    //押注
    btn_yzMethods :  function(score,me,obj){
        var me = this;
        if(me.YzScore==score&&me.GAMESTATE!='GameStart')return;
        var btns = [];
        for(var btn=0;btn<this.YZ_SCORE.length;btn++){
            btns.push('btn_'+this.YZ_SCORE[btn]);
        }
        for(var i=0;i<btns.length;i++){
            if(obj['name']===btns[i]){
                obj.setPosition(me.Layer[btns[i]].pos);
                obj.runAction(new cc.moveTo(0.1,obj.x,obj.y+25));
                flax.inputManager.removeListener(obj,me.btns_Events,InputType.click);
            }else{
                me.Layer[btns[i]].runAction(new cc.moveTo(0.1,me.Layer[btns[i]].pos));
                flax.inputManager.addListener(me.Layer[btns[i]],me.btns_Events,InputType.click,me);
            }
        }
        me.YzScore = score;
    },
    //撤销
    btn_fallbackMethods : function(isremoveAll,obj){
        var me = this;

        if(isremoveAll){
            Method();
            return;
        }

        if(this.islock){
            X.tip_NB.show({
                str:LNG.KJZ
            });
            return;
        }

       // Method();
        seadhttp();

       function seadhttp(){
            $.ajax({
                type: "GET",
                url: GC.HTTPDATA.cancel,
                dataType: GC.HTTPDATA.DATA_TYPE,

                data: {
                    uid: GC.USER_DATA.uid,
                    token: GC.USER_DATA.token,
                    issue: GC.USER_DATA.DATA['nowissue']
                },
                success: function (returndata) {
                    if(returndata.code == 200){
                        var tempdata = returndata.data;

                        GC.HTTPDATA.boltagainindex = 1;
                        me.refreshUserData({
                            points:tempdata['usermoney']
                        });
                        Method();
                    }else if(returndata.code ==  GC.HTTPDATA.FAILURE){
                        X.boltagain(function(){
                            me.GameState('GameStart')
                        });
                    }else if(returndata.code ==  GC.HTTPDATA.STAY_LOTTERY){
                        X.tip_NB.show({
                            str:LNG.KJZ
                        });
                    }else{
                        X.tip_NB.show({
                            str:LNG.CXSB
                        });
                    }
                },
                error: function () {
                    X.Promptbox.Getinstance({
                        btnsType: 3,
                        txt: LNG.WLYCTC,
                        callback: function () {
                            X.closeWebPage();
                        },
                        ispauseGame: true
                    });
                }

            });
        }
       function Method(){

            for(var i=0;i<me.LpArrs.length;i++){
                if(me.LpArrs[i]['icon']){
                    removeiconObj(me.LpArrs[i],'icon');
                }
                if(isremoveAll&&me.LpArrs[i]['iconai']){
                    removeiconObj(me.LpArrs[i],'iconai');
                }
            }
            function removeiconObj(obj,key){
                obj[key].setVisible(false);
                obj[key]['txt'].removeFromParent();
                obj[key] = null;
            }
        }

    },
    //----------------------GameTime
    GameTime  : function(){
        var me = this;
      //  this.MoveLayer['EnergyBar']['bar'].percentage = 30 * 100 / 30;
        var barindex = null;
        getHttpsData();

        function getHttpsData(){
            $.ajax({
                type: "get",
                url: GC.HTTPDATA.remaintime,
                dataType: GC.HTTPDATA.DATA_TYPE,
                cache:true,
                data: {
                    uid: GC.USER_DATA.uid,
                    token: GC.USER_DATA.token,
                },
                success: function (returndata) {
                    if(returndata.code == 200){
                        var tempdata = returndata.data;
                        GC.HTTPDATA.boltagainindex = 1;
                        GC.USER_DATA.DATA['oldlotterys'] = tempdata['oldlotterys'];
                        GC.USER_DATA.DATA['remain_buy_seconds'] = tempdata['remain_buy_seconds'];
                        GC.USER_DATA.DATA['remain_seconds'] = tempdata['remain_seconds'];
                        GC.USER_DATA.DATA['nowissue'] = tempdata['nowissue'];

                        barindex = GC.USER_DATA.DATA['remain_buy_seconds'];

                        refreshOnRecord();

                        X.DataMger.Getinstance({
                            'attributes': {'EnergyBartxt': barindex || 0},
                            'node': me.Layer
                        });
                        if(barindex==2){//等待开奖中
                            X.tip_NB.show({
                                str:LNG.TZXZ,
                                isSpecialshow:true
                            });
                            me.islock = true;
                            X.AINodes.Getinstance().releasethreads();
                        }

                        if(barindex<=0){
                            me.GameState('GameOver');
                            barindex=0;
                            return;
                        }else{
                            var time = setInterval(function () {
                                if (me.isrefreshDATA) {

                                    me.isrefreshDATA = false;
                                    me.setRouletteEnabled(true);
                                    me.getAINode().runGame();


                                }
                                if (barindex == 2) {//等待开奖中
                                    X.tip_NB.show({
                                        str:LNG.TZXZ,
                                        isSpecialshow:true
                                    });
                                    me.islock = true;
                                    X.AINodes.Getinstance().releasethreads();
                                }

                                X.DataMger.Getinstance({
                                    'attributes': {'EnergyBartxt': barindex || 0},
                                    'node': me.Layer
                                });
                                if (barindex <= 0) {
                                    clearTimeout(time);
                                    me.GameState('GameOver');
                                    barindex = 0;
                                    return;
                                }

                                barindex--;
                            }, 1000);

                            GC.GAME_TIMEEVENTS.push(time);
                        }
                    }else{
                        X.Promptbox.Getinstance({
                            btnsType: 3,
                            txt: LNG.WLYCTC,
                            callback: function () {
                                X.closeWebPage();
                            },
                            ispauseGame: true
                        });
                    }
                },
                error: function () {
                    X.Promptbox.Getinstance({
                        btnsType: 3,
                        txt: LNG.WLYCTC,
                        callback: function () {
                            X.closeWebPage();
                        },
                        ispauseGame: true
                    });
                }

            });
            //刷新上一期记录
            function refreshOnRecord(){
                var userPParr = {}, PCobj = null;
                for (var i = 0; i < GC.PC.length; i++) {

                    PCobj = GC.PC[i];

                    for (var j = 0; j < GC.LPTYPE.length; j++) {
                        if (PCobj.Type == GC.LPTYPE[j] && PCobj.readid == GC.USER_DATA.DATA['oldlotterys'][0][GC.LPTYPE[j]] && PCobj.txt) {
                            userPParr[GC.LPTYPE[j]] = PCobj.txt;
                        }
                    }
                }

                if(userPParr['style']=='♥'||userPParr['style']=='♦'){
                    me.Layer['styletxt'].setColor(cc.color(GC.COLOR[5]));//红色
                }else{
                    me.Layer['styletxt'].setColor(cc.color(GC.COLOR[4]));//黑色
                }
                X.DataMger.Getinstance({
                    'attributes': {
                        'bigtxt': userPParr['big'],
                        'styletxt': userPParr['style'],
                        'numtxt': userPParr['num'],
                    },
                    'node': me.Layer
                });
            }
        }
    },
    //-----------------------Over

    GameOver  : function(){
        var me = this;

        //本地测试
/*        Method({"num":13,"style":1,"big":1});
        return;*/
        getHttpsData();

        function getHttpsData(){
            $.ajax({
                type: "get",
                url: GC.HTTPDATA.pokeropen,
                dataType: GC.HTTPDATA.DATA_TYPE,
                data: {
                    uid: GC.USER_DATA.uid,
                    token: GC.USER_DATA.token,
                    issue: GC.USER_DATA.DATA['nowissue']
                },
                success: function (returndata) {
                    if(returndata.code == 200){
                        var tempdata = returndata.data;
                        Method({
                            "num":tempdata['num'],"style":tempdata['style'],"big":tempdata['big'],
                            'tempdata':tempdata
                        });

                        GC.USER_DATA.DATA['levelsign'] = tempdata['levelsign'];
                    }
                    else if(returndata.code ==  GC.HTTPDATA.FAILURE) {
                        X.boltagain(function(){
                            me.GameState('GameStart')
                        });
                    }
                    else if(returndata.code ==  GC.HTTPDATA.TOKEN){
                        X.boltagain(function(){
                            me.GameState('GameStart')
                        });
                    }
                    else{
                        X.boltagain(function(){
                            me.GameState('GameStart')
                        });
                    }
                },
                error: function () {
                    X.Promptbox.Getinstance({
                        btnsType: 3,
                        txt: LNG.WLYCTC,
                        callback: function () {
                            X.closeWebPage();
                        },
                        ispauseGame: true
                    });
                }
            });
        }
        function Method(data){
            X.GameEnd.Getinstance(data);
        }

    },
    GameOverData : function(data){

        var me = this;
        var obj;
        var LPdatas = GC.LPTYPE;
        var byidfind



        for(var i=0;i<GC.PC.length;i++){
            obj = GC.PC[i];
            for(var j=0;j<LPdatas.length;j++){
                //num 特殊处理
                byidfind = LPdatas[j]==LPdatas[0]?obj['id']:obj['readid'];
                if(data[LPdatas[j]]&&obj['Type']==LPdatas[j]&&data[LPdatas[j]]==byidfind){
                    setVisibleAndColor(me.Layer['rouletteIndex']['$_'+obj['flaxres']+'_bj']);
                }
            }
        }
        function setVisibleAndColor(obj){
            obj.setVisible(true);
            obj.runAction(cc.sequence(
                cc.blink(2,5),
                cc.delayTime(2),
                cc.callFunc(function(){this.setVisible(false)},obj)
            ));
          //  obj.setColor(cc.color(GC.COLOR[0]));
        }
        me.refreshGameoverData(data);

        me.scheduleOnce(function(){
            GC.SCENE['node'].GameState('replay');
        },5);
    },
    refreshGameoverData : function(data){
        var me = this;
        var tempdata = data['tempdata'];
        //增加一条往期数据
        //X.wangqi.Getinstance({
        //    num:GC.PC[tempdata['num']-1]['readid'],
        //    style:tempdata['style'],
        //    big:tempdata['big'],
        //    points:tempdata['points'],
        //    issue:tempdata['issue']
        //});

        //结算后豆动画!!!
        me.scheduleOnce(function(){
            function createBean(){
                var spriteFrame = cc.spriteFrameCache.getSpriteFrame("dou.png");
                var obj,byidfind,Roulette,Rouletteobj,PosObj,ToObj,random_posx,rotate_pos;
                for(var i=0;i<GC.PC.length;i++){
                    obj = GC.PC[i];
                    for(var j = 0;j<data.winRouletteids.length;j++){
                        Roulette = data.winRouletteids[j];
                        for(var a in Roulette) {
                            //num 特殊处理
                            byidfind = a=='num'?obj['id']:obj['readid'];
                            if(Roulette[a]&&obj.Type==a&&Roulette[a]==byidfind){
                                Rouletteobj = me.Layer['rouletteIndex']['$_'+obj['flaxres']+'_bj'];
                                PosObj = Rouletteobj.parent.convertToWorldSpace(Rouletteobj.getPosition());
                                ToObj = me.Layer['btn_add'].parent.convertToWorldSpace(me.Layer['btn_add'].getPosition());
                                var index = 0;
                                for(var bean=0;bean<10;bean++){
                                    index+=0.1;
                                    var sp = new cc.Sprite(spriteFrame);
                                    sp.x =PosObj.x;
                                    sp.y =PosObj.y;

                                    rotate_pos =  Math.random()*360;
                                    if(Math.floor(Math.random()*2)){
                                        random_posx = Math.random()*200-200;
                                    }else{
                                        random_posx = Math.random()*200+200;
                                    }
                                    sp.runAction(cc.sequence(
                                        cc.rotateTo(0.01,rotate_pos),cc.jumpBy(Math.random()*1.3,cc.p(random_posx,150),70,1)
                                        ,cc.moveTo(index,ToObj),new  cc.CallFunc(function(){
                                            me.Layer['btn_add'].runAction(cc.sequence(
                                                cc.scaleTo(0.1, 1.5, 1.5),
                                                cc.scaleTo(0.1, 1, 1)
                                            ));
                                            X.AudioManage.Getinstance().playEffect(res_music.bean);
                                            this.removeFromParent();
                                        },sp)
                                    ));
                                    GC.SCENE['node'].addChild(sp);
                                }
                            }
                        }
                    }
                }
            }
            createBean();

            var points = Math.abs(GC.USER_DATA.DATA['points']-tempdata['points'])||0;
            var pointindex = 0;

            function refreshUserbean(){

                if(pointindex>points){me.unschedule(refreshUserbean);return;}
                me.Layer['addendbean'].text = '(+'+pointindex+')';
                pointindex++;
            }
            if(points) {
                if(GC.TOUZHU_RECORD.length>0) {
                    me.schedule(refreshUserbean, 0.01);
                }
                me.scheduleOnce(function(){
                    if(GC.TOUZHU_RECORD.length>0){
                        me.Layer['addendbean'].text = '(+'+points+')';
                        me.Layer['addendbean'].runAction(cc.repeatForever(cc.sequence(cc.fadeIn(0.2),cc.fadeOut(0.2))));
                        me.unschedule(refreshUserbean);
                    }

                    me.scheduleOnce(function(){
                        if(GC.TOUZHU_RECORD.length>0) {
                            me.Layer['addendbean'].text = '';
                            me.Layer['addendbean'].stopAllActions();
                            me.Layer['addendbean'].runAction(cc.fadeIn(0.1));
                        }

                        me.refreshUserData({
                            points:tempdata['points'],
                            newissue:tempdata['newissue']
                        });
                    },1.5);
                },2);
            }

        },1);
    },
    //刷新玩家金钱数据
    refreshUserData : function(data){
        if(data.points){
            GC.USER_DATA.DATA['points'] = data.points;
            var me = this;
            X.DataMger.Getinstance({
                'attributes':{
                    'userbean':GC.USER_DATA.DATA['points']
                },
                'node':me.Layer
            });
        }

        if(data.newissue){
            GC.USER_DATA.DATA['nowissue'] = data.newissue
            GC.USER_DATA.DATA['remain_buy_seconds'] = GC.USER_DATA.DATA['all_seconds'];
        }
    },
    getAINode : function(){
       return X.AINodes.Getinstance();
    },
    onExit:function() {
        var me = this;
        if(me.Layer[GC.GAME_MOVE_BTNS[2]]['caidanbtn']!=null){
            me.Layer[GC.GAME_MOVE_BTNS[2]]['caidanbtn'].removeFromParent();
        }
        X.releaseAllTime();
        GC.HTTPDATA.boltagainindex = 1;

        X.releaseAlls(X.tip_NB.Getinstance().objarr);

        X.releaseSceneNodes();

        if(this.WinSize){
            delete this.WinSize;
            this.WinSize = null;
        }
        if(this.Layer){
            delete this.Layer;
            this.Layer = null;
        }
        if(this.YzScore){
            delete this.YzScore;
            this.YzScore = null;
        }
        if(this.LpArrs){
            this.LpArrs.splice(0,this.LpArrs.length);
            delete this.LpArrs;
            this.LpArrs = [];
        }
        if(this.isGameOver){
            delete this.isGameOver;
            this.isGameOver = null;
        }
        if(this.GAMESTATE){
            delete this.GAMESTATE;
            this.GAMESTATE = null;
        }
        if(this.YZ_SCORE){
            this.LpArrs.splice(0,this.YZ_SCORE.length);
            delete this.YZ_SCORE;
            this.YZ_SCORE = [];
        }
        if(this.islock){
            delete this.islock;
            this.islock = null;
        }
        if(this.isrefreshDATA){
            delete this.isrefreshDATA;
            this.isrefreshDATA = null;
        }
        if(this.GUIZE){
            delete this.GUIZE;
            this.GUIZE = null;
        }
        if(this.FAILURE){
            delete this.FAILURE;
            this.FAILURE = null;
        }


    }
});
