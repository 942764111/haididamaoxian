
(function(){
    var _GameEnd = cc.Layer.extend({
        TimeEvents : [],
        time    :   0,
        ctor : function(data) {
            this._super(data);
            var WinSize = cc.winSize;
            var me = this;

            this.initTouch();
            var MoveLayer = flax.assetsManager.createDisplay(res.GameEnd, "layer", {
                parent: this,
                x: cc.winSize.width/2,
                y: cc.winSize.height/2
            });

            this.time = GC.USER_DATA.DATA['remain_seconds'] - GC.USER_DATA.DATA['remain_buy_seconds'];

            var xipaiat = flax.assetsManager.createDisplay(res.animation, "xipai", {
                parent: this,
                x: cc.winSize.width/2,
                y: cc.winSize.height/2+100});
            xipaiat.setAnchorPoint(0.5,0.5);
            xipaiat.autoStopWhenOver = true;
            xipaiat.play();


            setTimeout(function(){
                Draw();
            },5000);

            function Draw(){
                var PCobj;
                var pcstyleres;
                for(var i=0;i<GC.PC.length;i++){
                    PCobj = GC.PC[i];
                    for(var j=0;j<GC.LPTYPE.length;j++){
                        if(PCobj.Type==GC.LPTYPE[j]&&PCobj.readid==data['style']&&PCobj.res){
                            pcstyleres=PCobj.res;
                        }
                    }
                }

                var acarrs = [];

                var numresobj;
                for(var i = 0;i<GC.PC.length;i++){
                    if(GC.PC[i]['id']==data['num']){
                        numresobj = GC.PC[i]['flaxres'];
                    }
                }
                var obj = new cc.Sprite('res/GameMove/pc/'+pcstyleres+numresobj+'.png');
                obj.x = cc.winSize.width/2;
                obj.y = cc.winSize.height/2;
                me.addChild(obj,10);
                var beipai = new cc.Sprite('res/GameMove/pc/beipai.png');
                beipai.x = cc.winSize.width/2;
                beipai.y = cc.winSize.height/2;
                me.addChild(beipai,10);
                acarrs.push(beipai);
                acarrs.push(obj);
                    X.ActionNodes.Getinstance().FlipCARDS(acarrs,function(){

                       setTimeout(function(){
                            me.removeFromParent();
                            X.GameEnd._instance = null;
                            if(GC.SCENE['id']=='GameMoveScene'){
                                GC.SCENE['node'].GameOverData({
                                    'num':data['num'],
                                    'style':data['style'],
                                    'big':data['big'],
                                    'points':data['points'],
                                    'tempdata':data['tempdata']
                                });
                                var time2 = setTimeout(function(){
                                    GC.SCENE['node'].GameState('replay');
                                },5000)
                                me.TimeEvents.push(time2);
                            }
                        },5000);


                    });
            }

        },
        initTouch : function(){
            this.addChild(new pointTouchLayer());
        },
        releasethreads : function(){
            var me = this;
            for(var i=0;i<me.TimeEvents.length;i++){
                clearTimeout(me.TimeEvents[i]);
                me.TimeEvents.splice(i, 1);
            }
            me.TimeEvents = [];
        }
    });

    X.GameEnd= {
        _instance: null
        ,Getinstance: function(Data){
            if(!this._instance){
                this._instance = new _GameEnd(Data);
                GC.SCENE['node'].addChild(this._instance,99);

            }
            return this._instance;
        }
    };
    GC.SCENE['layerid'].push('GameEnd');
})();