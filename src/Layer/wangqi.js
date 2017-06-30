(function(){
    var _wangqi= cc.Layer.extend({
        json:null,
    ctor: function(){
        this._super();

        this.initTouch();
        this.json = ccs.load(res.wangqi).node;
        this.json.setAnchorPoint(0.5,0.5);
        this.json.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.addChild(this.json);

        this.additem(GC.USER_DATA.DATA['oldlotterys']);
        var removebtn = ccui.helper.seekWidgetByName(this.json, "remove_btn");
        removebtn.addTouchEventListener(this.btns_Events,this);
    },
    additem : function(Data){
        var list = ccui.helper.seekWidgetByName(this.json,"ListView");
        list.removeAllItems();
        var arrobj = Data,numtxt,styletxt,bigtxt,i= 0,me = this;

        for(i=0;i<8;i++){
            pushItem();
        }
        if(i==8){
            me.schedule(function(){
                if(i==arrobj.length-1){
                    me.unscheduleAllCallbacks();
                }
                pushItem();
                i++;
            },0.1);
        }

        function pushItem(){
            var item = ccs.load(res.wangqiitem).node;
            var qishu = ccui.helper.seekWidgetByName(item,"qishu");
            numtxt = ccui.helper.seekWidgetByName(item,"numtxt");
            styletxt = ccui.helper.seekWidgetByName(item,"styletxt");
            bigtxt = ccui.helper.seekWidgetByName(item,"bigtxt");
            Iteminfo(arrobj[i]);
            qishu.setString(X.stringFormat(LNG.ISSUE,arrobj[i]['issue']));
            qishu.setColor(cc.color(GC.COLOROBJ.Lightpurple));
            list.pushBackCustomItem(item);
        }
        function Iteminfo(PCreadid){
            for(var a = 0;a<GC.PC.length;a++){
                if(GC.PC[a].Type=='big'&& GC.PC[a].readid==PCreadid['big']){
                    numtxt.setString(GC.PC[a].txt);
                    numtxt.setColor(cc.color(GC.COLOROBJ.Lightpurple));
                }
                if(GC.PC[a].Type=='style'&& GC.PC[a].readid==PCreadid['style']){
                    if(GC.PC[a].txt=='♥'||GC.PC[a].txt=='♦'){
                        styletxt.setColor(cc.color(GC.COLOR[5]));//红色
                    }else{
                        styletxt.setColor(cc.color(GC.COLOR[4]));//黑色
                    }

                    styletxt.setString(GC.PC[a].txt);
                }
                if(GC.PC[a].Type=='num'&& GC.PC[a].readid==PCreadid['num']){
                    bigtxt.setString(GC.PC[a].txt);
                    bigtxt.setColor(cc.color(GC.COLOROBJ.Lightpurple));
                }
            }
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
               this.removeFromParent();
                X.wangqi._instance = null;
                break;
            case ccui.Widget.TOUCH_CANCELED:
                break;
            default:
                break;
        }
    }

});

    X.wangqi= {
        _instance: null
        ,Getinstance: function(Data){
            var me = this;
            if(Data){
                GC.USER_DATA.DATA['oldlotterys'].splice(0, 0, Data);
                GC.USER_DATA.DATA['oldlotterys'].splice(GC.USER_DATA.DATA['oldlotterys'].length-1,1);
            }
            if(!this._instance){
                this._instance = new _wangqi();
            }else{
                this._instance.additem(GC.USER_DATA.DATA['oldlotterys']);
            }
            return this._instance;
        }
    };

})();
