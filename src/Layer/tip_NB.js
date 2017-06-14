/**
 * Created by YanJun on 9/5/14.
 */
(function(){
    var tip_NB = cc.Class.extend({
        str     :   null,
        objarr  :   [],
        ctor: function() {
        },
        createItem : function(btn){
            var me = this;
            var spriteFrame = cc.spriteFrameCache.getSpriteFrame("tishiimg.png");
            var img = new cc.Sprite(spriteFrame);
            if(btn){
                img.btn = btn;
                img.btn.setMouseEnabled(false);
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
                    img.removeFromParent();
                    X.tip_NB._instance = null;

                    if(btn) {
                        img.btn.setMouseEnabled(true);
                    }
                    me.objarr.splice(0,1);
            },1500);
        }
    });
    X.tip_NB = {
        _instance: null,
        show: function(str,btn){
            if (!this._instance){
                this._instance = new tip_NB();
            }
            this._instance.str = str;
            this._instance.createItem(btn);
        }
    };
})();