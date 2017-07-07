
(function(){
    var tip_NB = cc.Class.extend({
        str     :   null,
        objarr  :   [],
        isSpecialshow : false,
        ctor: function() {
        },
        createItem : function(){
            var me = this;
            var ishasSamestr = false;
            if(this.objarr){
                for(var i=0;i<this.objarr.length;i++){
                        if(this.objarr[i]['txt'].getString()==this.str){
                            ishasSamestr = true;
                            break;
                        }
                }
            }
            if(ishasSamestr)return;
            var spriteFrame = cc.spriteFrameCache.getSpriteFrame("tishiimg.png");
            var img = new cc.Sprite(spriteFrame);

            if(this.isSpecialshow){
                img.setScale(1.5);
            }

            if(this.objarr.length>0){
                img.setPosition(this.objarr[this.objarr.length-1].getPosition());
                img.runAction(cc.moveTo(0.1,cc.winSize.width/2,(this.objarr[this.objarr.length-1].y-this.objarr[this.objarr.length-1].getContentSize().height)-10))
                img.index = this.objarr.length;
            }else{
                img.index = this.objarr.length;
                img.setPosition(cc.winSize.width/2,cc.winSize.height/2);
            }
            img.txt = new cc.LabelTTF(this.str,"Arial",30);
            img.txt.x=img.getContentSize().width/2;
            img.txt.y=img.getContentSize().height/2;

            img.addChild(img.txt);
            GC.SCENE['node'].addChild(img,99999);
            this.objarr.push(img);

            var time = setTimeout(function(){
                    clearTimeout(time);
                    if(img.txt){
                        img.txt.runAction(cc.sequence(cc.fadeOut(1.5)));
                    }
                    img.runAction(cc.sequence(cc.fadeOut(1.5),new cc.callFunc(function(){
                        this.removeFromParent();
                        X.releaseAlls(me.objarr);
                    },img)));
            },1500);
        }
    });

    X.tip_NB = {
        _instance: null,
        show: function(parameters){
            if (!this._instance){
                this._instance = new tip_NB();
            }
            /**
             * str//显示的文字
             * isSpecialshow//是否特显  bool
             */
            this._instance.str = parameters.str;
            this._instance.isSpecialshow = parameters.isSpecialshow;
            this._instance.createItem();
        }
        ,Getinstance: function(){
            if(!this._instance){
                this._instance = new tip_NB();
            }
            return this._instance;
        }
    };
})();