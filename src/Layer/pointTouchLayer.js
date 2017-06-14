/**
 * Created by jon on 2017/5/23.
 */
    var pointTouchLayer = cc.Layer.extend({
        ctor: function (isblack) {
            this._super(isblack);
            this.init(isblack);
        },
        init : function(isblack){
            var size = cc.winSize;
            var color = isblack?cc.color(0, 0, 0, 0):cc.color(0, 0, 0, GC.TOUCHLAYER_TY);
            var layer = new cc.LayerColor(color, size.width, size.height);
            layer.setAnchorPoint(0,0);
            layer.setPosition(0,0);
            this.addChild(layer);

            var touchListener = {
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: this.onTouchBegan
            };
            cc.eventManager.addListener(touchListener, this);
        },
        onTouchBegan: function () {
            return true;
        }
    });