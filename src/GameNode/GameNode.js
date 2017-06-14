
var X = {};
(function(){

    X.toJSON = function(str){
        var _json=null;
        try{
            _json = JSON.parse(str)
        }catch(e){
            console.log('to JSON ERROR='+ str);
        }
        return _json;
    };

    X.getFileJSON = function(file){
        var str = cc.loader.load(file);
        var obj = X.toJSON(str);
        return obj;
    };

    X.loadUrlImage = function (url, node)
    {
        if (url != null && url != undefined && url != "")
        {
            cc.loader.loadImg(url, {isCrossOrigin : true}, function(err,img){
                if(err)
                {
                    cc.log(err);
                }
                else
                {
                    var texture;
                    if (cc.sys.isNative)
                    {
                        texture = img;
                    }
                    else
                    {
                        var texture2d = new cc.Texture2D();
                        texture2d.initWithElement(img);
                        texture2d.handleLoadedTexture();
                        texture = texture2d;
                    }
                    node.setTexture(texture);
                }
            });
        }
    },
    X.isstr = function(str)
    {
        if(str&&str.trim()!=""){
            var hasstr = str.substring(0,2);
            if('$_'===hasstr){
                return true;
            }
        }
    },
    /**
     * 格式化字符串
     * X.stringFormat('{1}{2}','hello','world')
      */
    X.stringFormat = function(){
        if (arguments.length < 2) return;
        var str = arguments[0];
        if (arguments.length == 2 && X.instanceOf(arguments[1],'Array')){
            var args = arguments[1];
            for(var i = 1; i <= args.length; i++){
                var regx = new RegExp('\\{' + i + '\\}','g');
                str = str.replace(regx,args[i - 1]);
            }
        }else{
            for(var i = 1; i < arguments.length; i++){
                var regx = new RegExp('\\{' + i + '\\}','g');
                str = str.replace(regx,arguments[i]);
            }
        }
        return str;
    },

    X.instanceOf = function(o,type){
        return toString.apply(o) === ('[object ' + type + ']') || typeof o === type.toLowerCase();
    }

    //释放游戏中的所有线程池
    X.releaseAllTime = function(){
        for(var i=0;i<GC.GAME_TIMEEVENTS.length;i++){
            clearTimeout(GC.GAME_TIMEEVENTS[i]);
            GC.GAME_TIMEEVENTS.splice(i, 1);
        }
        GC.GAME_TIMEEVENTS = [];

        X.AINodes.Getinstance().releasethreads();
    }

    X.closeWebPage = function(){
       // self.location=GC.HTTPDATA.qulebuybacktopay;
        cc.audioEngine.stopMusic(true);
        GC.YZ_ID = [];
        GC.YZ_SCORE.XS_SCORE['res'] = null;
        GC.YZ_SCORE.JJ_SCORE['res'] = null;
        GC.YZ_SCORE.GS_SCORE['res'] = null;
        GC.SCENE.node = null;
        GC.SCENE.id = null;
        GC.SCENE.layer = null;
        X.releaseAllTime();
        delete GC;

        self.location=GC.HTTPDATA.qulebuybacktopay;
    }
    X.Gotopup = function(){
        self.location=GC.HTTPDATA.qulebuypay;
    }
    X.boltagain = function(callback){
        var index = GC.HTTPDATA.boltagainindex;
        var Maxindex = GC.HTTPDATA.Maxboltagainindex;
        if(index>=Maxindex){
            GC.HTTPDATA.boltagainindex = 1;
            X.Promptbox.Getinstance({
                btnsType: 3,
                txt: LNG.WLYCTC,
                callback: function () {
                    X.closeWebPage();
                },
                ispauseGame: true
            });
            return;
        }else{
            GC.HTTPDATA.boltagainindex+=1;
            callback & callback();
        }
    }
})();