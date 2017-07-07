/**
 * Created by YanJun on 9/12/14.
 */
(function(){
    var _AINodes= cc.Node.extend({
        TimeEvents : [],
        AI_COUNT : 0,
        ctor: function(){
        },
        initData : function(){

            var scenenode = GC.SCENE['node'],me = this,objsize;
            me.AI_COUNT = 0;
            objsize = scenenode.Layer['ai_1']['img'].getContentSize();

            var aidata = GC.USER_DATA.DATA['random_users'];
            for(var i=0;i<GC.AI_MAXCOUNT;i++){
                var obj = scenenode.Layer['ai_'+(i+1)];
                obj.setVisible(false);
                if(aidata[i]) {
                    obj.setVisible(true);
                    me.AI_COUNT+=1;
                    X.DataMger.Getinstance({
                        //'img_img':'http://192.168.1.73/yyl/test.png'
                        'attributes': {'txt': aidata[i]['nickname'], 'img_img': aidata[i]['headpic']},
                        'node': obj
                    });
                    obj['img'].setScaleX(objsize.width / obj['img'].getContentSize().width);
                    obj['img'].setScaleY(objsize.height / obj['img'].getContentSize().height);
                }else{
                    obj.setVisible(false);
                }
            }
        },
        /**
         * AI投注接口
         */
        runGame : function() {
            this.releasethreads();
            var scenenode =  GC.SCENE['node'];
            if(scenenode.isGameOver)return;
            var sizeindex = 1;
            var readTime = Math.floor(Math.random()*1500+1000);
            var time = setInterval(function(){
                readTime = Math.floor(Math.random()*1500+1000);
                if(scenenode.isGameOver){
                    clearTimeout(time);
                }
                rouletteMethod();
            },readTime);
            this.TimeEvents.push(time);
            function rouletteMethod(){
                sizeindex++;
                var rscore = parseInt(GC.YZ_ID['score'][Math.floor(Math.random()*3)]);
                var allbtn = [];
                var num = [];
                var style = [];
                var big = [];
                for(var i=0;i<GC.PC.length-1;i++){
                    allbtn.push(GC.PC[i].flaxres);
                    if(GC.PC[i].Type=='num'){
                        num.push(i);
                    }
                    if(GC.PC[i].Type=='style'){
                        style.push(i);
                    }
                    if(GC.PC[i].Type=='big'){
                        big.push(i);
                    }
                }
                var rbtnobj,randrbtnnum;

                if(sizeindex%2==0){
                    randrbtnnum = big[Math.floor(Math.random()*big.length)];
                  //  cc.log('sizeindex:'+sizeindex+','+'big');
                }
                else if(sizeindex%5==0){
                    randrbtnnum = num[Math.floor(Math.random()*num.length)];
                //    cc.log('sizeindex:'+sizeindex+','+'num');
                }
                else if(sizeindex%3==0||sizeindex%7==0){
                    randrbtnnum = style[Math.floor(Math.random()*style.length)];
                  //  cc.log('sizeindex:'+sizeindex+','+'style');

                }else{
                    randrbtnnum = big[Math.floor(Math.random()*big.length)];
                  //  cc.log('sizeindex:'+sizeindex+','+'big');
                }
            //    cc.log('sizeindex:'+randrbtnnum+','+'num');
                rbtnobj = allbtn[randrbtnnum];
                var readai = Math.ceil(Math.random()*GC.AI_MAXCOUNT);
                if(GC.USER_DATA.DATA['random_users'][readai-1]){
                    scenenode.btn_rouletteMethods({
                        yzscore: rscore,
                        btnobj: scenenode.Layer['rouletteIndex']['$_' + rbtnobj],
                        type: 'ai',
                        imgpos: scenenode.Layer['ai_' + readai]['img']
                    })
                }
            }

        },
        /**
         * 游戏中控制AI数量管理接口
         * @constructor
         */
        GMoveAiCountManage : function(){
            var scenenode =  GC.SCENE['node'],me = this,randTime = Math.random()*25+5,aidata=GC.USER_DATA.DATA['random_users'];
            function GetData(){
                function add(){
                    var randnum = Math.floor(Math.random()*(GC.AI_MAXCOUNT - me.AI_COUNT));
                    $.ajax({
                        type: 'GET',
                        url: GC.HTTPDATA.randpersion,
                        dataType: GC.HTTPDATA.DATA_TYPE,
                        async:true,
                        cache:true,
                        data: {
                            num:randnum,
                        },
                        success: function (returndata) {
                            if(returndata.code == 200){
                                var tempdata = returndata.data;
                                var randAIindex;
                                for(var i = 0;i<tempdata.length;i++){
                                    randAIindex =Math.floor(Math.random()*GC.AI_MAXCOUNT);
                                        if(aidata[randAIindex]==false){
                                            GC.USER_DATA.DATA['random_users'].splice(randAIindex,1,tempdata[i]);
                                            tempdata.splice(i,1);
                                            break;
                                        }
                                }
                                me.initData();
                                me.runGame();
                            }else{
                                X.Promptbox.Getinstance({
                                    btnsType:3,
                                    txt:LNG.WLYCTC,
                                    callback:function(){
                                        X.closeWebPage();
                                    }
                                });
                            }
                        },
                        error: function (err) {
                            X.Promptbox.Getinstance({
                                btnsType:3,
                                txt:LNG.WLYCTC,
                                callback:function(){
                                    X.closeWebPage();
                                }
                            });
                        }
                    });
                }
                function remove(){
                    var randnum = Math.floor(Math.random()*GC.AI_MAXCOUNT);
                    GC.USER_DATA.DATA['random_users'].splice(randnum,1,false);
                    me.initData();
                    me.runGame();
                }

                var final_AICountControl = 2;
                if(me.AI_COUNT<=final_AICountControl){
                    add();
                }else if(me.AI_COUNT>=final_AICountControl+1){
                    var rand = Math.floor(Math.random()*2);
                    if(rand){
                        remove();
                    }else if(!rand&&me.AI_COUNT<GC.AI_MAXCOUNT){
                        add();
                    }
                }
            }


            scenenode.schedule(function(){
                cc.log(randTime);
                randTime = Math.random()*25+5;
                GetData();
            },randTime)

        },
        releasethreads : function(){
            var me = this;
            for(var i=0;i<me.TimeEvents.length;i++){
                clearTimeout(me.TimeEvents[i]);
                me.TimeEvents.splice(i, 1);
            }
            me.TimeEvents = [];
        }
    });

    X.AINodes= {
        _instance: null
        ,Getinstance: function(){
            if(!this._instance){
                this._instance = new _AINodes();
            }
            return this._instance;
        }
    };

})();