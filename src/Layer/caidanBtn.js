
 var caidanBtn = cc.Layer.extend({
        btnon_off : null,
        ctor : function(btn) {
            this._super(btn);
            this.btnon_off = btn;
            this.MoveLayer = flax.assetsManager.createDisplay(res.caidanBtn, "caidanrq", {
                parent: this,
            });
            this.MoveLayer.setAnchorPoint(0.5,0.5);

            this.initLayer();
        },
        initLayer : function(){
            var btns = ['yxwf_btn','yxsx_btn','yxsx_btn2'];
            for(var j=0;j<btns.length;j++){
                flax.inputManager.addListener(this.MoveLayer[btns[j]],this.btns_Events,InputType.click,this);
            }
            if(GC.GAME_MUSIC_STATE){
                this.MoveLayer['yxsx_btn'].setVisible(false);
            }else{
                this.MoveLayer['yxsx_btn2'].setVisible(false);
            }

        },
        btns_Events : function(touch, event){
            var obj = event.target;
            var me = this;
            switch(obj['name']){
                case 'yxwf_btn'://游戏玩法
                    GC.SCENE['node'].addChild(new guize(),GC.GAME_ZORDER.on);
                    this.removeFromParent();
                    break;
                case 'yxsx_btn'://游戏声效 启动
                    GC.GAME_MUSIC_STATE = 1;
                    if(!cc.audioEngine.isMusicPlaying()) {
                        cc.audioEngine.resumeAllEffects();
                        cc.audioEngine.resumeMusic();
                        me.MoveLayer['yxsx_btn2'].setVisible(true);
                        obj.setVisible(false);
                    }else{
                        cc.log('sadasdas');
                    }
                    break;
                case 'yxsx_btn2'://游戏声效 禁用
                    if(cc.audioEngine.isMusicPlaying()) {
                        GC.GAME_MUSIC_STATE = 0;
                        cc.audioEngine.pauseAllEffects();
                        cc.audioEngine.pauseMusic();
                        me.MoveLayer['yxsx_btn'].setVisible(true);
                        obj.setVisible(false);
                    }
                    break;
            }
            this.btnon_off['onbtn'] = true;
            this.removeFromParent();
        }
    });