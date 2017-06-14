var chongzhi= cc.Layer.extend({

    ctor: function(){
        this._super();

        this.initTouch();

        var Layer = flax.assetsManager.createDisplay(res.chongzhi, "layer", {
            parent: this,
            x: cc.winSize.width/2,
            y: cc.winSize.height/2});

        flax.inputManager.addListener(Layer['btn'],this.btns_Events,InputType.click,this);

        this.inititem(Layer);
    },
    initTouch : function(){
        this.addChild(new pointTouchLayer());
    },
    inititem :function(obj) {
        var me = this;
        obj['itemimg'].setVisible(false);
        var item, objpos,iteminfo;
        objpos = obj['itemimg'].parent.convertToWorldSpace(obj['itemimg'].getPosition());

        iteminfo  = GC.USER_DATA.DATA['change_list'];
        for(var i=0;i<iteminfo.length;i++){
            item = flax.assetsManager.createDisplay(res.chongzhiitem, "item", {parent: this});
            item.x = objpos.x;
            item.y = objpos.y - i * (obj['itemimg'].getContentSize().height + 15);
            item['beanimg'].setTexture('res/GameMove/IMG/chongzhi_'+(i+1)+'.png');
            item['txt'].text = iteminfo[i]['points']+' 豆';
            item['btntxt'].text = iteminfo[i]['value']+' 金币';

            item['btn'].beanid = i;
            flax.inputManager.addListener(item['btn'],itembtns,InputType.click,this);
        }

        function itembtns(touch, event){
            var obj = event.target;
            this.removeFromParent();
            GC.SCENE['node'].addChild(new chongzhitishi(obj['beanid']),GC.GAME_ZORDER.on);
        }
    },
    btns_Events : function(){
        this.removeFromParent();
    }

});
