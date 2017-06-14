
(function(){
    var _shezhi = cc.Layer.extend({
        sceneNode : null,
        Layer   :   null,
        ctor : function() {
            this._super();
            this.initTouch();
            var WinSize = cc.winSize;
            this.initLayer();
        },
        initLayer : function(){
            var me = this;
            this.Layer = flax.assetsManager.createDisplay(res.shezhi, "Promptbox", {
                parent: this,
                x: cc.winSize.width/2,
                y: cc.winSize.height/2
            });

            var btns = ['yxwf_btn','yxsx_btn','yxsx_btn2','remove_btn'];
            for(var j=0;j<btns.length;j++){
                flax.inputManager.addListener(this.Layer[btns[j]],this.btns_Events,InputType.click,this);
            }

            if(!cc.audioEngine.isMusicPlaying()) {
                me.Layer['yxsx_btn'].setVisible(false);
            }else{
                me.Layer['yxsx_btn2'].setVisible(false);
            }

        },
        btns_Events : function(touch, event){
            var obj = event.target;
            var me = this;
            switch(obj['name']){
                case 'remove_btn':
                    this.removeFromParent();
                    X.shezhi._instance=null;
                    break;
                case 'yxsx_btn2':
                    obj.setVisible(false);
                    cc.audioEngine.resumeAllEffects();
                    cc.audioEngine.resumeMusic();
                    me.Layer['yxsx_btn'].setVisible(true);
                    break;
                case 'yxsx_btn':
                    obj.setVisible(false);
                    cc.audioEngine.pauseAllEffects();
                    cc.audioEngine.pauseMusic();
                    me.Layer['yxsx_btn2'].setVisible(true);
                    break;
                case 'yxwf_btn':
                    GC.SCENE['node'].addChild(new guize(),GC.GAME_ZORDER.on);
                    break;

            }
        },
        initTouch : function(){
            this.addChild(new pointTouchLayer());
        }
    });

    X.shezhi={
        _instance: null
        ,Getinstance: function(){
            var me = this;
            if(!this._instance){
                this._instance = new _shezhi();
            }
            return this._instance;
        }
    }
})();