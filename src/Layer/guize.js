var guize= cc.Layer.extend({

    ctor: function(){
        this._super();
        this.initTouch();
        var json = ccs.load(res.yxsm).node;
        json.setAnchorPoint(0.5,0.5);
        json.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.addChild(json);
        var list = ccui.helper.seekWidgetByName(json,"ListView");
        var Layout = new ccui.Layout();

        var richText = new X.bRichText({
            size:30
            ,maxWidth:list.width-20
            ,lineHeight:31
            ,color:'#FFFFFF'
        });
        richText.text(LNG.GGZ);
        Layout.setContentSize(list.width,richText.trueHeight()+30);
        richText.setPosition(20,Layout.height-15);
        Layout.addChild(richText);
        list.pushBackCustomItem(Layout);

        var removebtn = ccui.helper.seekWidgetByName(json, "remove_btn");
        removebtn.addTouchEventListener(this.btns_Events,this);   var json = ccs.load(res.yxsm).node;
        json.setAnchorPoint(0.5,0.5);
        json.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.addChild(json);
        var list = ccui.helper.seekWidgetByName(json,"ListView");
        var Layout = new ccui.Layout();

        var richText = new X.bRichText({
            size:30
            ,maxWidth:list.width-20
            ,lineHeight:31
            ,color:'#FFFFFF'
        });
        richText.text(LNG.GGZ);
        Layout.setContentSize(list.width,richText.trueHeight()+30);
        richText.setPosition(20,Layout.height-15);
        Layout.addChild(richText);
        list.pushBackCustomItem(Layout);

        var removebtn = ccui.helper.seekWidgetByName(json, "remove_btn");
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
                X.GameBtnEffect();
                this.removeFromParent();
                break;
            case ccui.Widget.TOUCH_CANCELED:
                break;
            default:
                break;
        }
    }

});
