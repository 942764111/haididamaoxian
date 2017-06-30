var chongzhitishi= cc.Layer.extend({
    beanid : null,
    ctor: function(beanid){
        this._super(beanid);
        this.bean = GC.USER_DATA.DATA['change_list'][beanid];
        this.initTouch();

        var Layer = flax.assetsManager.createDisplay(res.chongzhitishi, "layer", {
            parent: this,
            x: cc.winSize.width/2-35,
            y: cc.winSize.height/2+70});
        Layer.setAnchorPoint(0.5,0.5);
        Layer['beanimg'].setTexture('res/GameMove/IMG/'+GC.CZITEM[this.bean['points']]);
        X.DataMger.Getinstance({
            'attributes':{
                'beantxt': X.stringFormat(LNG.BEAN,this.bean['points']),
                'qiantxt':X.stringFormat(LNG.ZFQ,(this.bean['value']))
            },
            'node':Layer
        });

        flax.inputManager.addListener(Layer['confirmBtn'],this.btns_Events,InputType.click,this);
        flax.inputManager.addListener(Layer['cancelBtn'],this.btns_Events,InputType.click,this);

    },
    initTouch : function(){
        this.addChild(new pointTouchLayer());
    },
    btns_Events : function(touch, event){
        var obj = event.target,me = this;
        switch(obj['name']){
            case 'cancelBtn':
                this.removeFromParent();
                break;
            case 'confirmBtn':
                itembtns();
                this.removeFromParent();
                break;
        }

        function itembtns(){
            $.ajax({
                type: "get",
                url: GC.HTTPDATA.exchange,
                dataType: GC.HTTPDATA.DATA_TYPE,
                async:'false',
                data: {
                    uid: GC.USER_DATA.uid,
                    token: GC.USER_DATA.token,
                    point: me.bean['points']
                },
                success: function (returndata) {
                    if(returndata.code==GC.HTTPDATA.TG){
                        var data = returndata.data;
                        //兑换成功
                        X.tip_NB.show({
                            str:LNG.THCG
                        });
                        GC.USER_DATA.DATA['points'] = data['usermoney'];
                        X.DataMger.Getinstance({
                            'attributes':{
                                'userbean':GC.USER_DATA.DATA['points']
                            },
                            'node':GC.SCENE['node'].Layer
                        });
                    }else if(returndata.code==GC.HTTPDATA.MONEY_DONT){
                        //余额不足
                        X.tip_NB.show({
                            str:LNG.YEBZ
                        });

                    }else if(returndata.code==GC.HTTPDATA.FAILURE){
                        X.boltagain(function(){
                            itembtns();
                        });

                    }else{
                        //兑换失败
                        X.tip_NB.show({
                            str:LNG.WLCW
                        });
                    }
                },
                error: function (err) {
                    //兑换失败
                    X.tip_NB.show({
                        str:LNG.WLCW
                    });
                }
            });
        }
    }
});
