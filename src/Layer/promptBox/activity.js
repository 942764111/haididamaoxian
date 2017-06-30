
(function(){
    var _activity = cc.Layer.extend({
        titleimg    :   null,
        txt         :   null,
        callback    :   null,
        json        :   null,
        ctor : function() {
            this._super();
            this.initTouch();
            this.json = ccs.load(res.activityhint).node;
            this.json.setAnchorPoint(0.5,0.5);
            this.json.setPosition(cc.winSize.width/2,cc.winSize.height/2);
            this.addChild(this.json);

            var removebtn = ccui.helper.seekWidgetByName(this.json, "btn_qd");
            removebtn.addTouchEventListener(this.btns_Events,this);
        },
        showPromptboxinfo : function(parameters){
            var me = this;
            this.titleimg = parameters.titleimg;
            this.txt = parameters.txt;
            this.callback = parameters.callback;

            var txt = ccui.helper.seekWidgetByName(me.json, "txt");
            var titleimg = ccui.helper.seekWidgetByName(me.json, "titleimg");
            if(this.titleimg){
                titleimg.loadTexture(res_title[GC.PROMPTBOX_TITLES[this.titleimg]]);
            }
            if(this.txt){
                txt.setString(this.txt);
                txt.setColor(cc.color(GC.COLOR[3]));
            }
        },
        initTouch : function(){
            this.addChild(new pointTouchLayer());
        },
        btns_Events : function(sender,type){
            switch (type) {
                case ccui.Widget.TOUCH_BEGAN:
                    break;
                case ccui.Widget.TOUCH_MOVED:
                    break;
                case ccui.Widget.TOUCH_ENDED:
                    X.GameBtnEffect();
                    if(this.callback){
                        this.callback & this.callback();
                    }
                    this.removeFromParent();
                    X.activity._instance = null;
                    break;
                case ccui.Widget.TOUCH_CANCELED:
                    break;
                default:
                    break;
            }
        }
    });


    X.activity= {
        _instance: null
        ,Getinstance: function(parameters){
            var me = this;
            if(!this._instance){
                this._instance = new _activity();
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