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
        var arrobj = Data;
        for(var i=0;i<arrobj.length;i++){
            var item = ccs.load(res.wangqiitem).node;
            var qishu = ccui.helper.seekWidgetByName(item,"qishu");
            var jieguo = ccui.helper.seekWidgetByName(item,"jieguo");
            var str = "";
            str = Iteminfo(arrobj[i]);
            qishu.setString(arrobj[i]['issue']);
            jieguo.setString(str);
            list.pushBackCustomItem(item);
        }
        function Iteminfo(PCreadid){
            var str = "";
            for(var a = 0;a<GC.PC.length;a++){
                if(GC.PC[a].Type=='big'&& GC.PC[a].readid==PCreadid['big']){
                    str+=GC.PC[a].txt +' | ';
                }
                if(GC.PC[a].Type=='style'&& GC.PC[a].readid==PCreadid['style']){
                    str+=GC.PC[a].txt +' | ';
                }
                if(GC.PC[a].Type=='num'&& GC.PC[a].readid==PCreadid['num']){
                    str+=GC.PC[a].txt +' | ';
                }
            }
            return str;
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
