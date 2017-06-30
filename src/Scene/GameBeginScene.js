var music = false;
var GameBeginScene = cc.Scene.extend({
    arrs    :   [],
    Layer   : null,
    onEnter: function () {
        this._super();
        GC.ISOVER = false;
        GC.SCENE['node'] = this;
        GC.SCENE['id'] = 'GameBeginScene';
        if(!music){
            X.AudioManage.Getinstance().playMusic(res_music.move,true);
            music = true;
        }

        var cache = cc.spriteFrameCache;
        cache.addSpriteFrames(res.GameImg, res.GameImg_png);

        this.initMoveLayer();
    },
    initMoveLayer : function(){
        var me = this;

        this.Layer = flax.assetsManager.createDisplay(res.GameBegin, "BeginScene", {
            parent: this,
            x: cc.winSize.width/2,
            y: cc.winSize.height/2});

            this.Layer['adimn'].fps = 9;
          //  this.Layer['adimn'].autoStopWhenOver = true;
            this.Layer['adimn'].play();

        //菜单
        if(this.Layer){
            me.Layer['btn_sz'].onbtn = true;
            me.Layer['caidanrq'].setVisible(false);
            me.Layer['btn_fh'].setVisible(false);
        }


        if(!cc.audioEngine.isMusicPlaying()) {
            me.Layer['caidanrq']['yxsx_btn'].setVisible(false);
        }else{
            me.Layer['caidanrq']['yxsx_btn2'].setVisible(false);
        }

        GetHTTPSData();
      //  initBtns();
        function initBtns(){
            //判断
            if(GC.USER_DATA.DATA['issign'] && GC.USER_DATA.DATA['encourage']){
                me.Layer['hongdian'].setVisible(false);
            }else{
                me.Layer['hongdian'].setVisible(true);
            }
            for(var j=0;j<GC.GAME_BEGIN_BTNS.length;j++){
                flax.inputManager.addListener(me.Layer[GC.GAME_BEGIN_BTNS[j]],me.btns_Events,InputType.click,me);
            }

            for(var b=0;b<GC.GAME_MOVE_CDBTNS.length;b++){
                flax.inputManager.addListener(me.Layer['caidanrq'][GC.GAME_MOVE_CDBTNS[b]],me.btns_Events,InputType.click,me);
            }

        }
        function initUserData(){
            var icon = GC.USER_DATA.DATA['headpic'];
            var nickname = GC.USER_DATA.DATA['nickname'];
            var points = GC.USER_DATA.DATA['points'];
            GC.USER_DATA.bean = points;
            //初始化玩家数据
            X.DataMger.Getinstance({
                'attributes':{'username':nickname,'userbean':points,'img_userimg':icon},
                'node':me.Layer
            });
        }

        function GetHTTPSData(){
            $.ajax({
                type: 'GET',
                url: GC.HTTPDATA.pokerinfo,
                dataType: GC.HTTPDATA.DATA_TYPE,
                async:'false',
                data: {
                    uid: GC.USER_DATA.uid,
                    token: GC.USER_DATA.token
                },
                success: function (returndata) {
                    if(returndata.code == 200){
                        var tempdata = returndata.data;
                        GC.USER_DATA.DATA = tempdata;
                        initUserData();
                        initBtns();

                        if(!GC.USER_DATA.DATA['issign']){
                            GC.IS_SIGN = 1;
                            var spritePos = me.Layer['btn_mrfl'].parent.convertToWorldSpace(me.Layer['btn_mrfl'].getPosition());
                            var namepos = me.Layer['btn_bean'].parent.convertToWorldSpace(me.Layer['btn_bean'].getPosition());
                            var spriteFrame = cc.spriteFrameCache.getSpriteFrame("dou.png");
                            var index = 0;
                            for(var i=0;i<8;i++){
                                index+=0.2;
                                var sprite = new cc.Sprite(spriteFrame);
                                sprite.x = spritePos.x;
                                sprite.y = spritePos.y;
                                sprite.runAction(cc.sequence(
                                    cc.moveTo(index,namepos),new  cc.CallFunc(function(){
                                        me.Layer['btn_bean'].runAction(cc.sequence(
                                            cc.scaleTo(0.1, 1.3, 1.3),
                                            cc.scaleTo(0.1, 1, 1)
                                        ));
                                        X.AudioManage.Getinstance().playEffect(res_music.bean);
                                        this.removeFromParent();
                                    },sprite)
                                ));
                                me.addChild(sprite,20);
                            }

                            X.activity.Getinstance({
                                titleimg:1,
                                txt: X.stringFormat(LNG.QLGDZ,80)
                            });
                        }

                    }else if(returndata.code == GC.HTTPDATA.FAILURE){
                        X.Promptbox.Getinstance({
                            btnsType:3,
                            txt:LNG.WLYCTC,
                            callback:function(){
                                X.closeWebPage();
                            }
                        });
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
    },
    //========================btns
    btns_Events : function(touch, event){
        var obj = event.target,me = this;
        if(event.target['name']!='img'){
            X.GameBtnEffect();
        }

        if(!me.Layer['btn_sz']['onbtn']&&obj['name']!='btn_sz') {
            me.Layer['btn_sz']['onbtn'] = true;
            me.Layer['caidanrq'].setVisible(false);
        }

        switch(event.target['name']){
            case 'btn_bean'://充值豆子
             //this.addChild(new chongzhi(),GC.GAME_ZORDER.on);
                X.Gotopup();

                break;
            case 'btn_fh'://返回按钮
               // X.closeWebPage();

                break;
            case 'btn_th'://脱换
                self.location='http://gid=117';
                break;
            case 'btn_mrfl'://每日福利
                this.btn_mrfl();
                break;
            case 'btn_xsc'://新手场
                this.btn_xsc();
                break;
            case 'btn_jjc'://进阶场
                if(GC.USER_DATA.DATA['points']<100){
                    X.tip_NB.show({
                        str:X.stringFormat(LNG.JJC,100)
                    });
                    return;
                }
                this.btn_jjc();
                break;
            case 'btn_gsc'://高手场
                if(GC.USER_DATA.DATA['points']<100){
                    X.tip_NB.show({
                        str:X.stringFormat(LNG.JJC,100)
                    });
                    return;
                }

                if(GC.USER_DATA.DATA['points']<500){
                    X.tip_NB.show({
                        str:X.stringFormat(LNG.GSC,500)
                    });
                    return;
                }
                this.btn_gsc();
                break;
            case 'btn_sz':

                if(obj['onbtn']) {
                    obj['onbtn'] = false;
                    me.Layer['caidanrq'].setVisible(true);

                    me.Layer['caidanrq'].setLocalZOrder(222);
                }else{
                    obj['onbtn'] = true;
                    me.Layer['caidanrq'].setVisible(false);
                }

                break;
            case 'yxwf_btn':
                GC.SCENE['node'].addChild(new guize(),GC.GAME_ZORDER.on);
                break;
            case 'yxsx_btn':
                obj.setVisible(false);
                X.AudioManage.Getinstance().isAllpauseMusicAndEffect(false);
                me.Layer['caidanrq']['yxsx_btn2'].setVisible(true);
                break;
            case 'yxsx_btn2':
                obj.setVisible(false);
                X.AudioManage.Getinstance().isAllpauseMusicAndEffect(true);
                me.Layer['caidanrq']['yxsx_btn'].setVisible(true);
                break;
            case 'tzjl_btn':
                X.touzhujilu.Getinstance().show();
                break;
        }
    },
    // btns实现方法
    btn_xsc : function(){
        GC.YZ_ID = GC.YZ_SCORE['XS_SCORE'];
        flax.replaceScene('GameMove');
    },
    btn_jjc : function(){
        GC.YZ_ID = GC.YZ_SCORE['JJ_SCORE'];
        flax.replaceScene('GameMove');
    },
    btn_gsc : function(){
        GC.YZ_ID = GC.YZ_SCORE['GS_SCORE'];
        flax.replaceScene('GameMove');
    },
    btn_mrfl : function(){
        X.GamePromptbox.Getinstance();
    },
    getUserBean : function(){
        var me = this;
        return parseInt(me.Layer['userbean'].getString());
    },
    onExit:function() {
        X.releaseSceneNodes();
    }
});