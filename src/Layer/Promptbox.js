(function(){
    var _Promptbox= cc.Layer.extend({
        Layer : null,
        callback : null,
        btnsType : null,
        TXT : null,
        isShowRemoveBtn : false,
        ispauseGame : false,
    ctor: function(){
        this._super();
        this.initTouch();

        this.Layer = flax.assetsManager.createDisplay(res.Promptbox, "layer", {
            parent: this,
            x: cc.winSize.width/2-35,
            y: cc.winSize.height/2+70});
        this.Layer['qss_img'].setVisible(false);
        this.Layer['btn_img'].setVisible(false);
        this.Layer.setAnchorPoint(0.5,0.5);
        flax.inputManager.addListener(this.Layer['btn_qd'],this.btns_Events,InputType.click,this);
        flax.inputManager.addListener(this.Layer['btn_remove'],this.btns_Events,InputType.click,this);

    },
    getByTypeBtn : function(){
        return this.Layer['btn_qd'];
    },
    showPromptboxinfo : function(parameters){
        var me = this;
        this.btnsType = parameters.btnsType;
        this.TXT = parameters.txt;
        this.callback = parameters.callback;
        this.isShowRemoveBtn = parameters.isShowRemoveBtn;
        this.ispauseGame = parameters.ispauseGame;

        if(this.ispauseGame){
            cc.Director.sharedDirector.pause();
            X.releaseAllTime();
        }

        //if(parameters.btnsType==5){
        //    this.Layer['btn_img'].x-=20;
        //}


        if(parameters.btnsType==5){
            this.Layer['qss_img'].setVisible(true);
            this.Layer['btn_img'].setVisible(false);
            X.DataMger.Getinstance({
                'attributes':{
                    'txt':me.TXT
                },
                'node':this.Layer
            });
        }else{
            this.Layer['qss_img'].setVisible(false);
            this.Layer['btn_img'].setVisible(true);
            X.DataMger.Getinstance({
                'attributes':{
                    'txt':me.TXT,'img_btn_img':res_txtimg[GC.PROMPTBOX_BTNS[parameters.btnsType]]
                },
                'node':this.Layer
            });
        }

        if(!this.isShowRemoveBtn){
            this.Layer['btn_remove'].setVisible(false);
        }
    },
    initTouch : function(){
        this.addChild(new pointTouchLayer());
    },
    btns_Events : function(touch, event){
        var obj = event.target,me = this;
        switch(obj['name']){
            case 'btn_qd':
                this.removeFromParent();
                this.callback & this.callback();
                X.Promptbox._instance = null;
                break;
            case 'btn_remove':
                this.removeFromParent();
                X.Promptbox._instance = null;
                break;
        }
    }
});

    X.Promptbox= {
        _instance: null
        ,Getinstance: function(parameters){
            var me = this;
           // this.remove();
            if(!this._instance){
                this._instance = new _Promptbox();
                GC.SCENE['node'].addChild(this._instance,GC.GAME_ZORDER.on);
            }
            this._instance.showPromptboxinfo(parameters);
            return this._instance;
        }
        ,remove : function(){
            if(this._instance){
                this._instance.removeFromParent();
                this._instance = null;
            }
        }
    };

})();