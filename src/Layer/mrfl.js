
(function(){
    var _GamePromptbox = cc.Layer.extend({
        ctor : function() {
            this._super();
            this.initTouch();
            var json = ccs.load(res.mrfl).node;
            json.setAnchorPoint(0.5,0.5);
            json.setPosition(cc.winSize.width/2,cc.winSize.height/2);
            this.addChild(json);
            var List = ccui.helper.seekWidgetByName(json, "ListView");

            GC.TASK[1]['iscomplete'] = GC.USER_DATA.DATA['issign'];
            GC.TASK[2]['iscomplete'] = GC.USER_DATA.DATA['encourage'];
            for(var i in GC.TASK){
                var item = ccs.load(res.mrflitem).node;
                var titletxt = ccui.helper.seekWidgetByName(item, "titletxt");
                var mstxt = ccui.helper.seekWidgetByName(item, "mstxt");
                var ylq = ccui.helper.seekWidgetByName(item, "ylq");
                var wdb = ccui.helper.seekWidgetByName(item, "wdb");
                var btn = ccui.helper.seekWidgetByName(item, "btn");
                btn.addTouchEventListener(Event,this);
                btn.setVisible(false);
                if(GC.TASK[i]['iscomplete']){
                    wdb.setVisible(false);
                }else{
                    ylq.setVisible(false);
                }

                var richText = new X.bRichText({
                    size:64
                    ,maxWidth:500
                    ,lineHeight:64
                    ,color:'#ece3ff'
                });
                richText.text(GC.TASK[i]['title']);
                richText.setAnchorPoint(0,0.5);
                richText.y+=30;
              //  richText.x-=40;
                titletxt.addChild(richText);

                var richText2 = new X.bRichText({
                    size:40
                    ,maxWidth:500
                    ,lineHeight:40
                    ,color:'#c3a8ff'
                });
                richText2.text(GC.TASK[i]['content']);
                richText2.y+=20;
                richText2.setAnchorPoint(0,0.5);
                mstxt.addChild(richText2);

                function Event(sender,type){
                    switch (type) {
                        case ccui.Widget.TOUCH_BEGAN:
                            break;
                        case ccui.Widget.TOUCH_MOVED:
                            break;
                        case ccui.Widget.TOUCH_ENDED:
                            $.ajax({
                                type: "get",
                                url: GC.HTTPDATA.encourage,
                                dataType: GC.HTTPDATA.DATA_TYPE,
                                async:'false',
                                data: {
                                    uid: GC.USER_DATA.uid,
                                    token: GC.USER_DATA.token,
                                },
                                success: function (returndata) {
                                    if(returndata.code==GC.HTTPDATA.TG){
                                        var data = returndata.data;
                                        //兑换成功
                                        X.tip_NB.show(data['note']);
                                        GC.USER_DATA.DATA['points'] = data['usermoney'];

                                        X.DataMger.Getinstance({
                                            'attributes':{
                                                'userbean':GC.USER_DATA.DATA['points']
                                            },
                                            'node':GC.SCENE['node'].Layer
                                        });

                                    }else if(returndata.code==GC.HTTPDATA.FAILURE){

                                        X.Promptbox.Getinstance({
                                            btnsType:4,
                                            txt:LNG.WLYC,
                                            callback:function(){
                                                history.go(0);
                                            }
                                        });

                                    }else{
                                        //兑换失败
                                        X.tip_NB.show(returndata['message']);
                                    }
                                },
                                error: function (err) {
                                    X.tip_NB.show(LNG.WLCW);
                                }
                            });
                            this.removeFromParent();
                            X.GamePromptbox._instance = null;
                            break;
                        case ccui.Widget.TOUCH_CANCELED:
                            break;
                        default:
                            break;
                    }
                }

                List.pushBackCustomItem(item);
            }

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
                    this.removeFromParent();
                    X.GamePromptbox._instance = null;
                    break;
                case ccui.Widget.TOUCH_CANCELED:
                    break;
                default:
                    break;
            }
        }
    });

    X.GamePromptbox={
        _instance: null
        ,Getinstance: function(){
            var me = this;
            if(!this._instance){
                this._instance = new _GamePromptbox();
                GC.SCENE['node'].addChild(this._instance,GC.GAME_ZORDER.on);
            }
            return this._instance;
        }
    }
})();