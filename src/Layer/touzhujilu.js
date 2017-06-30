(function(){
    var _touzhujilu= cc.Layer.extend({
     json:null,
     isEvent: true,
    ctor: function(){
        this._super();
        this.initTouch();
        this.json = ccs.load(res.tzjl).node;
        this.json.setAnchorPoint(0.5,0.5);
        this.json.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        ccui.helper.seekWidgetByName(this.json, "col").setVisible(false);
        this.getHTTPSData();

        var removebtn = ccui.helper.seekWidgetByName(this.json, "remove_btn");
        removebtn.addTouchEventListener(this.btns_Events,this);
    },
    getHTTPSData : function(){
        var me = this;
        $.ajax({
            type: "get",
            url: GC.HTTPDATA.pokerlog,
            dataType: GC.HTTPDATA.DATA_TYPE,
            data: {
                uid: GC.USER_DATA.uid,
                token: GC.USER_DATA.token,
            },
            success: function (returndata) {
                if(returndata.code == 200){
                    if(returndata.data.length<1){
                        ccui.helper.seekWidgetByName(me.json, "col").setVisible(true);
                    }
                    me.additem(returndata.data);
                }else{
                    X.Promptbox.Getinstance({
                        btnsType: 3,
                        txt: LNG.WLYCTC,
                        callback: function () {
                            X.closeWebPage();
                        },
                        ispauseGame: true
                    });
                }
            },
            error: function () {
                X.Promptbox.Getinstance({
                    btnsType: 3,
                    txt: LNG.WLYCTC,
                    callback: function () {
                        X.closeWebPage();
                    },
                    ispauseGame: true
                });
            }

        });
    },
    additem : function(DATA){
        var list = ccui.helper.seekWidgetByName(this.json,"ListView");
        list.removeAllItems();

        var i= 0,me = this;
        for(i=0;i<8;i++){
            pushItem();
        }
        if(i==8){
            me.schedule(function(){
                if(i==DATA.length-1){
                    me.unscheduleAllCallbacks();
                }
                pushItem();
                i++;
            },0.01);
        }

        function pushItem(){
            var item = ccs.load(res.tzjlitem).node;
            var issue = ccui.helper.seekWidgetByName(item,"qishu");
            var costpoints = ccui.helper.seekWidgetByName(item,"touzhutxt");
            var title = ccui.helper.seekWidgetByName(item,"jianglitxt");
            var datetxt = ccui.helper.seekWidgetByName(item,"datetxt");
            issue.setString(X.stringFormat(LNG.ISSUE,DATA[i]['issue']));
            datetxt.setString(X.FormatDate(DATA[i]['day'].toString()));
            title.setString(DATA[i]['title']);
            costpoints.setString(X.stringFormat(LNG.TZJE,DATA[i]['costpoints']));

            issue.setColor(cc.color(GC.COLOROBJ.Lightpurple));
            datetxt.setColor(cc.color(GC.COLOROBJ.Lightpurple));
            title.setColor(cc.color(GC.COLOROBJ.Lightpurple));
            costpoints.setColor(cc.color(GC.COLOROBJ.Lightpurple));

            var removebtn = ccui.helper.seekWidgetByName(item, "btn");
            removebtn.day = DATA[i]['day'];
            removebtn.issue = DATA[i]['issue'];
            removebtn.winpoints = DATA[i]['winpoints'];
            removebtn.costpoints = DATA[i]['costpoints'];
            removebtn.addTouchEventListener(me.btns_Item,me);
            list.pushBackCustomItem(item);
        }
    },
    show : function(){
        this.addChild(this.json);
        GC.SCENE['node'].addChild(this,GC.GAME_ZORDER.on);
    },
    initTouch : function(){
        this.addChild(new pointTouchLayer());
    },
    btns_Item : function(sender,type){
        var me = this;
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                break;
            case ccui.Widget.TOUCH_MOVED:
                break;
            case ccui.Widget.TOUCH_ENDED:
                X.GameBtnEffect();
                getHTTPSData();
                break;
            case ccui.Widget.TOUCH_CANCELED:
                break;
            default:
                break;
        }

        function getHTTPSData(){
            $.ajax({
                type: "get",
                url: GC.HTTPDATA.pokerlogtail,
                dataType: GC.HTTPDATA.DATA_TYPE,
                data: {
                    uid: GC.USER_DATA.uid,
                    issue: sender['issue'],
                    day:sender['day']
                },
                success: function (returndata) {
                    if(returndata.code == 200){
                        me.isEvent = false;
                        var data = returndata.data;
                        var datalist = returndata.data['list'];
                        var dataissueinfo = returndata.data['issueinfo'];
                        var list = ccui.helper.seekWidgetByName(me.json,"ListView");
                        var layer = ccui.helper.seekWidgetByName(me.json,"layer");
                        list.setVisible(false);
                        layer.setVisible(true);

                        function showheadData(){
                            var l_numtxt = ccui.helper.seekWidgetByName(me.json,"numtxt");
                            var l_bigtxt = ccui.helper.seekWidgetByName(me.json,"bigtxt");
                            var l_styletxt = ccui.helper.seekWidgetByName(me.json,"styletxt");
                            var l_tzjetxt = ccui.helper.seekWidgetByName(me.json,"tzjetxt");
                            var l_zjjetxt = ccui.helper.seekWidgetByName(me.json,"zjjetxt");
                            l_tzjetxt.setString(X.stringFormat(LNG.BEAN,sender['costpoints']));
                            if(sender['winpoints']!='0'){
                                l_zjjetxt.setString(X.stringFormat(LNG.BEAN,sender['winpoints']));
                            }else{
                                l_zjjetxt.setString(LNG.WZJ);
                            }

                            l_zjjetxt.setColor(cc.color(GC.COLOROBJ.Lightpurple));
                            l_tzjetxt.setColor(cc.color(GC.COLOROBJ.Lightpurple));
                            for(var pcobj=0;pcobj<GC.PC.length;pcobj++){
                                for(var a in dataissueinfo){
                                    if(a=='num'){
                                        if(a==GC.PC[pcobj].Type&&dataissueinfo[a]!=0&&GC.PC[pcobj].id+''==dataissueinfo[a]){
                                            if(GC.PC[pcobj].Type=='num') {
                                                l_numtxt.setString(GC.PC[pcobj].txt);
                                                l_numtxt.setColor(cc.color(GC.COLOROBJ.Lightpurple));
                                            }
                                            break;
                                        }
                                    }else{
                                        if(a==GC.PC[pcobj].Type&&dataissueinfo[a]!=0&&GC.PC[pcobj].readid==dataissueinfo[a]){
                                            if(GC.PC[pcobj].Type=='big'){
                                                l_bigtxt.setString(GC.PC[pcobj].txt);
                                                l_bigtxt.setColor(cc.color(GC.COLOROBJ.Lightpurple));
                                            }
                                            else if(GC.PC[pcobj].Type=='style'){
                                                if(GC.PC[pcobj].txt=='♥'||GC.PC[pcobj].txt=='♦'){
                                                    l_styletxt.setColor(cc.color(GC.COLOR[5]));//红色
                                                }else{
                                                    l_styletxt.setColor(cc.color(GC.COLOR[4]));//黑色
                                                }
                                                l_styletxt.setString(GC.PC[pcobj].txt);
                                            }
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        function showListData(){
                            var l_list = ccui.helper.seekWidgetByName(me.json,"ListView2");
                            l_list.removeAllItems();
                            for(var i =0;i<datalist.length;i++){
                                var item = ccs.load(res.touzhuneirong).node;
                                var results = ccui.helper.seekWidgetByName(item,"wdtz_txt");
                                var points = ccui.helper.seekWidgetByName(item,"tzje_txt");
                                var winpoint = ccui.helper.seekWidgetByName(item,"zjje_txt");

                                for(var pcobj=0;pcobj<GC.PC.length;pcobj++){
                                    for(var a in datalist[i]){
                                        if(a=='num'){
                                            if(a==GC.PC[pcobj].Type&&datalist[i][a]!=0&&GC.PC[pcobj].id+''==datalist[i][a]){
                                                if(GC.PC[pcobj].Type=='num') {
                                                    results.setString(GC.PC[pcobj].txt);
                                                    results.setColor(cc.color(GC.COLOROBJ.Lightpurple));
                                                }
                                                break;
                                            }
                                        }else{
                                            if(a==GC.PC[pcobj].Type&&datalist[i][a]!=0&&GC.PC[pcobj].readid==datalist[i][a]){
                                                if(GC.PC[pcobj].Type=='big'){
                                                    results.setString(GC.PC[pcobj].txt);
                                                    results.setColor(cc.color(GC.COLOROBJ.Lightpurple));
                                                }
                                                else if(GC.PC[pcobj].Type=='style'){
                                                    if(GC.PC[pcobj].txt=='♥'||GC.PC[pcobj].txt=='♦'){
                                                        results.setColor(cc.color(GC.COLOR[5]));//红色
                                                    }else{
                                                        results.setColor(cc.color(GC.COLOR[4]));//黑色
                                                    }
                                                    results.setString(GC.PC[pcobj].txt);
                                                }
                                                break;
                                            }
                                        }
                                    }
                                }

                                points.setString(X.stringFormat(LNG.BEAN,datalist[i]['points']));
                                points.setColor(cc.color(GC.COLOROBJ.Lightpurple));

                                if(datalist[i]['winpoint']!='0'){
                                    winpoint.setString(X.stringFormat(LNG.BEAN,datalist[i]['winpoint']));
                                    winpoint.setColor(cc.color(GC.COLOROBJ.Lightpurple));
                                }else{
                                    winpoint.setString(LNG.WZJ);
                                    winpoint.setColor(cc.color(GC.COLOROBJ.Lightpurple));
                                }
                                l_list.pushBackCustomItem(item);
                            }
                        }

                        showheadData();
                        showListData();
                    }else{
                        X.Promptbox.Getinstance({
                            btnsType: 3,
                            txt: LNG.WLYCTC,
                            callback: function () {
                                X.closeWebPage();
                            },
                            ispauseGame: true
                        });
                    }
                },
                error: function () {
                    X.Promptbox.Getinstance({
                        btnsType: 3,
                        txt: LNG.WLYCTC,
                        callback: function () {
                            X.closeWebPage();
                        },
                        ispauseGame: true
                    });
                }

            });
        }
    },
    btns_Events : function(sender,type){
        var me = this;
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                break;
            case ccui.Widget.TOUCH_MOVED:
                break;
            case ccui.Widget.TOUCH_ENDED:
                X.GameBtnEffect();
                if(me.isEvent){
                    this.removeFromParent();
                    X.touzhujilu._instance = null;
                }else{
                    me.isEvent = true;
                    var list = ccui.helper.seekWidgetByName(me.json,"ListView");
                    var layer = ccui.helper.seekWidgetByName(me.json,"layer");
                    list.setVisible(true);
                    layer.setVisible(false);
                }

                break;
            case ccui.Widget.TOUCH_CANCELED:
                break;
            default:
                break;
        }
    }

});

    X.touzhujilu= {
        _instance: null
        ,Getinstance: function(){
          //  this.remove();
            if(!this._instance){
                this._instance = new _touzhujilu();
            }
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
