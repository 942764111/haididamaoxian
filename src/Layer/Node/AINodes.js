/**
 * Created by YanJun on 9/12/14.
 */
(function(){
    var _AINodes= cc.Node.extend({
        me : null,
        TimeEvents : [],
        ctor: function(){
        },
        initData : function(){
            var me = this.me;
            var objsize = me.Layer['ai_1']['img'].getContentSize();

            var aidata = GC.USER_DATA.DATA['random_users'];
            for(var i=0;i<aidata.length;i++){
                var obj = me.Layer['ai_'+(i+1)];

                X.DataMger.Getinstance({
                    //'img_img':'http://192.168.1.73/yyl/test.png'
                    'attributes':{'txt':aidata[i]['nickname'],'img_img':aidata[i]['headpic']},
                    'node':obj
                });
                obj['img'].setScaleX(objsize.width/obj['img'].getContentSize().width);
                obj['img'].setScaleY(objsize.height/obj['img'].getContentSize().height);
            }
        },
        runGame : function() {
            var me = this.me;

            var time = setInterval(function(){
                if(me.isGameOver){
                    clearTimeout(time);
                }
                rouletteMethod();
            },1000);
            this.TimeEvents.push(time);
            function rouletteMethod(){
                var rscore = parseInt(GC.YZ_ID['score'][Math.floor(Math.random()*3)]);
                var rbtn = [];
                for(var i=0;i<GC.PC.length-1;i++){
                    rbtn.push(GC.PC[i].flaxres);
                }
                var rbtnobj;
                var randrbtnnum = Math.floor(Math.random()*rbtn.length);
                rbtnobj = rbtn[randrbtnnum];
                var readai = Math.floor(Math.random()*GC.AI_COUNT+1);
                me.btn_rouletteMethods({
                    yzscore:rscore,
                    btnobj:me.Layer['rouletteIndex']['$_'+rbtnobj],
                    type:'ai',
                    imgpos:me.Layer['ai_'+readai]['img']
                })
            }

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

    X.AINodes= {
        _instance: null
        ,Getinstance: function(node){
            var me = this;
            if(!this._instance){
                this._instance = new _AINodes();
            }
            this._instance.me = node;
            return this._instance;
        }
    };

})();