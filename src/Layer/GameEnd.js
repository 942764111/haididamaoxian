
(function(){
    var _GameEnd = cc.Layer.extend({
        TimeEvents : [],
        time    :   0,
        ctor : function(data) {
            this._super(data);
            var WinSize = cc.winSize;
            var me = this;

            this.initTouch();
            var MoveLayer = flax.assetsManager.createDisplay(res.GameEnd, "layer", {
                parent: this,
                x: cc.winSize.width/2,
                y: cc.winSize.height/2
            });

            var Stars = [],starobj = null;
            for(var i=1;i<=23;i++){
                starobj = MoveLayer['xin_'+i];
                Stars.push(starobj);
            }
            X.ActionNodes.Getinstance(this).haloAndStarAnimation(MoveLayer['halo'],Stars);
            this.time = GC.USER_DATA.DATA['remain_seconds'] - GC.USER_DATA.DATA['remain_buy_seconds'];

            var xipaiat = flax.assetsManager.createDisplay(res.animation, "xipai", {
                parent: this,
                x: cc.winSize.width/2,
                y: cc.winSize.height/2+100});
            xipaiat.setAnchorPoint(0.5,0.5);
            xipaiat.autoStopWhenOver = true;
            xipaiat.play();

            me.scheduleOnce(function(){
                Draw();
            },5);

            function Draw(){
                var PCobj;
                var pcstyleres;
                for(var i=0;i<GC.PC.length;i++){
                    PCobj = GC.PC[i];
                    for(var j=0;j<GC.LPTYPE.length;j++){
                        if(PCobj.Type==GC.LPTYPE[j]&&PCobj.readid==data['style']&&PCobj.res){
                            pcstyleres=PCobj.res;
                        }
                    }
                }

                var acarrs = [];

                var numresobj;
                for(var i = 0;i<GC.PC.length;i++){
                    if(GC.PC[i]['id']==data['num']){
                        numresobj = GC.PC[i]['flaxres'];
                    }
                }
                var obj = new cc.Sprite('res/GameMove/pc/'+pcstyleres+numresobj+'.png');
                obj.x = cc.winSize.width/2;
                obj.y = cc.winSize.height/2;
                me.addChild(obj,10);
                var beipai = new cc.Sprite('res/GameMove/pc/beipai.png');
                beipai.x = cc.winSize.width/2;
                beipai.y = cc.winSize.height/2;
                me.addChild(beipai,10);
                acarrs.push(beipai);
                acarrs.push(obj);
                    X.ActionNodes.Getinstance().FlipCARDS(acarrs,function(){
                        var winRouletteids = [];//用户最终赢得轮盘id;
                        me.scheduleOnce(function(){
                            var recordobj = null;
                            /**
                             * state 0:输  1:赢   2:本次未参与
                             * @returns {number}
                             */
                            function iswin(){
                                var state = 0;
                                if(GC.TOUZHU_RECORD.length<1){
                                    return 2;
                                }
                                for(var i = 0;i<GC.TOUZHU_RECORD.length;i++){
                                    recordobj = GC.TOUZHU_RECORD[i];
                                    for(var a in recordobj){
                                        if(recordobj[a]&&(data[a]+'')==recordobj[a]){
                                            state = 1;
                                            winRouletteids.push(recordobj);
                                        }
                                    }
                                }
                                return state;
                            }

                            if(iswin()==1){
                                X.AudioManage.Getinstance().playEffect(res_music.win2);
                                X.AudioManage.Getinstance().ispauseMusic(false);
                            }else if(iswin()==0){
                                //X.AudioManage.Getinstance().playEffect(res_music.failure);
                                //X.AudioManage.Getinstance().ispauseMusic(false);
                            }
                        },1)


                        me.scheduleOnce(function(){
                            X.AudioManage.Getinstance().ispauseMusic(true);
                            me.removeFromParent();
                            X.GameEnd._instance = null;
                            if(GC.SCENE['id']=='GameMoveScene'){
                                GC.SCENE['node'].GameOverData({
                                    'num':data['num'],
                                    'style':data['style'],
                                    'big':data['big'],
                                    'points':data['points'],
                                    'tempdata':data['tempdata'],
                                    'winRouletteids':winRouletteids
                                });
                            }
                        },4)
                    });
            }

        },
        initTouch : function(){
            this.addChild(new pointTouchLayer());
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

    X.GameEnd= {
        _instance: null
        ,Getinstance: function(Data){
            if(!this._instance){
                this._instance = new _GameEnd(Data);
                GC.SCENE['node'].addChild(this._instance,GC.GAME_ZORDER.In);

            }
            return this._instance;
        }
    };
})();