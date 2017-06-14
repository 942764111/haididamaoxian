/**
 * Created by YanJun on 9/12/14.
 */
(function(){
    var _ActionNodes = cc.Class.extend({
        Node    :   null,
        ctor: function(){

        },
        //签到豆
        BeanAction : function() {
            if(this.Node!=null)
            var me = this.Node;
            var spriteFrame = cc.spriteFrameCache.getSpriteFrame("dou.png");
            Action(10,100)
            function Action(num,time){
                var index = 0;
                var timer = setInterval(function(){
                    if(index>=num){
                        clearTimeout(timer);
                    }
                    for(var i =0;i<4;i++){
                        var randPosx = Math.random()*cc.winSize.width;
                        var randScale = Math.random()*0.3+1.5;
                        var runtime = Math.random()*0.5+1;

                        var sprite = new cc.Sprite(spriteFrame);
                        sprite.x = randPosx;
                        sprite.y = cc.winSize.height;
                        sprite.setScale(randScale);
                        me.addChild(sprite,20);

                        sprite.runAction(
                            cc.spawn(
                                cc.sequence(cc.moveBy(runtime, cc.p(0, -sprite.y-100)),
                                    new cc.CallFunc(function(){
                                        this.removeFromParent()
                                    },sprite)),
                                cc.rotateBy(runtime,360,0)
                            ))
                    }

                    index++;
                },time);
                GC.GAME_TIMEEVENTS.push(timer);
            }
        },
        //洗牌
        CARDSAction : function(callback){
            if(this.Node!=null)
            var me = this.Node;
            var spriteFrame = cc.spriteFrameCache.getSpriteFrame("pukeBj.png");
            var  arrs = [];
            Action();
            function Action(){
                for(var i=0;i< 16;i++){
                    var sprite = new cc.Sprite(spriteFrame);
                    sprite.x = cc.winSize.width/2-i*3;
                    sprite.y = cc.winSize.height/2+i*3;
                    sprite.pos = sprite.getPosition();
                    me.addChild(sprite,i)
                    arrs.push(sprite);
                }

                var index = 0;
                var time = setInterval(function(){
                    if(index>=5){
                        clearTimeout(time);
                        index=0;
                        callback & callback();
                    }
                    runAction(80);
                    runAction(-80);
                    index++;
                },1000);

                GC.GAME_TIMEEVENTS.push(time);

                function runAction(reverse){
                    var index_1=0.1;
                    for(var a=0;a<4;a++){
                        var rand = Math.floor(Math.random()*arrs.length);
                        var randZOrder = Math.floor(Math.random()*10);
                   //     console.log(rand);
                        var moveby = new cc.moveBy(index_1+=0.1,reverse,0);
                        var moveTo = new cc.moveTo(index_1+=0.1,arrs[rand].pos);
                        var callFun_1 = new cc.callFunc(function(){
                         //   this.setLocalZOrder(randZOrder);
                        },arrs[rand]);
                        arrs[rand].runAction(cc.sequence(moveby,callFun_1,moveTo));
                    }
                }

            }
        },
        //翻牌效果
        // obj[0]  反面
        // obj[1]  正面
        FlipCARDS : function(arrs,callback){
            Action(arrs)
            function Action(obj){
                var orbitFront = cc.orbitCamera(0.5,1,0,90,-90,0,0);
                var orbitBack = cc.orbitCamera(0.5,1,0,0,-90,0,0);
                obj[1].setVisible(false);
                obj[0].runAction(cc.sequence(cc.show(),orbitBack,cc.hide(),
                    cc.targetedAction(obj[1],cc.sequence(cc.show(),orbitFront)),cc.callFunc(callback & callback())));
            }
        },
        onExit:function() {
            this.Node = null;
        }
    });

    X.ActionNodes= {
        _instance: null
        ,Getinstance: function(sceneNode) {
            if (!this._instance) {
                this._instance = new _ActionNodes();
            }
            this._instance.Node=sceneNode;
            return this._instance;
        }
    };
})();