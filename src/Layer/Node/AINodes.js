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
            var sizeindex = 1;
            var readTime = Math.floor(Math.random()*1500+1000);
            var time = setInterval(function(){
                readTime = Math.floor(Math.random()*1500+1000);
                if(me.isGameOver){
                    clearTimeout(time);
                }
                rouletteMethod();
            },readTime);
            this.TimeEvents.push(time);
            function rouletteMethod(){
                sizeindex++;
                var rscore = parseInt(GC.YZ_ID['score'][Math.floor(Math.random()*3)]);
                var allbtn = [];
                var num = [];
                var style = [];
                var big = [];
                for(var i=0;i<GC.PC.length-1;i++){
                    allbtn.push(GC.PC[i].flaxres);
                    if(GC.PC[i].Type=='num'){
                        num.push(i);
                    }
                    if(GC.PC[i].Type=='style'){
                        style.push(i);
                    }
                    if(GC.PC[i].Type=='big'){
                        big.push(i);
                    }
                }
                var rbtnobj,randrbtnnum;

                if(sizeindex%2==0){
                    randrbtnnum = big[Math.floor(Math.random()*big.length)];
                  //  cc.log('sizeindex:'+sizeindex+','+'big');
                }
                else if(sizeindex%5==0){
                    randrbtnnum = num[Math.floor(Math.random()*num.length)];
                //    cc.log('sizeindex:'+sizeindex+','+'num');
                }
                else if(sizeindex%3==0||sizeindex%7==0){
                    randrbtnnum = style[Math.floor(Math.random()*style.length)];
                  //  cc.log('sizeindex:'+sizeindex+','+'style');

                }else{
                    randrbtnnum = big[Math.floor(Math.random()*big.length)];
                  //  cc.log('sizeindex:'+sizeindex+','+'big');
                }
            //    cc.log('sizeindex:'+randrbtnnum+','+'num');
                rbtnobj = allbtn[randrbtnnum];
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