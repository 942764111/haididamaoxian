
var gulijindaozhang = cc.Layer.extend({
        ctor : function() {
            this._super();
            this.initTouch();
            var json = ccs.load(res.gljdz).node;
            json.setAnchorPoint(0.5,0.5);
            json.setPosition(cc.winSize.width/2,cc.winSize.height/2);
            this.addChild(json);

            var removebtn = ccui.helper.seekWidgetByName(json, "btn_qd");
            var txt = ccui.helper.seekWidgetByName(json, "txt");
            txt.setString(X.stringFormat(LNG.QLGDZ,50));
            txt.setColor(cc.color(GC.COLOR[3]));
            removebtn.addTouchEventListener(this.btns_Events,this);
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
                    this.removeFromParent();
                    break;
                case ccui.Widget.TOUCH_CANCELED:
                    break;
                default:
                    break;
            }
        }
    });