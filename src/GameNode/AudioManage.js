/**
 * 音乐管理类
 */
(function(){
    var _AudioManage= cc.Class.extend({
        /**
         *  播放音乐
         * @param resmusic
         * @param loop
         */
        playMusic : function(resmusic,loop){
            if(!resmusic)return;
            X.AudioManage._ismusicplay = true;
            cc.audioEngine.playMusic(resmusic,loop);
        },
        /**
         *   播放音效
         * @param resmusic
         * @param loop
         */
        playEffect : function(resmusic,loop){
            if(!resmusic)return;
            if(!X.AudioManage._ismusicplay)return;
            cc.audioEngine.playEffect(resmusic,loop);
        },
        /**
         * 游戏中所有的音乐和音效开关
         * @param on_off  bool值   1:开  0:关
         */
        isAllpauseMusicAndEffect : function(on_off){
            if(on_off){
                X.AudioManage._ismusicplay = true;
                cc.audioEngine.resumeAllEffects();
                cc.audioEngine.resumeMusic();
            }else{
                X.AudioManage._ismusicplay = false;
                cc.audioEngine.pauseAllEffects();
                cc.audioEngine.pauseMusic();
            }
        },
        /**
         *  游戏中所有的音乐开关
         * @param on_off  bool值   1:开  0:关
         */
        ispauseMusic : function(on_off){
            if(!X.AudioManage._ismusicplay)return;
            if(on_off){
                cc.audioEngine.resumeMusic();
            }else{
                cc.audioEngine.pauseMusic();
            }
        }
    });

    X.AudioManage= {
        _instance: null
        ,_ismusicplay:false
        ,Getinstance: function(){
            var me = this;
            if(!this._instance){
                this._instance = new _AudioManage();
            }
            return this._instance;
        }
    };

})();