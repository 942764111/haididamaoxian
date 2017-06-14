/**
 * Created by YanJun on 9/12/14.
 */
(function(){
    var _GMoveUserNode= cc.Node.extend({
        node : null,
        ctor: function(){
            this._super();
        },
        setUIdata :  function(attributes){
            var me = this;
            setimgData();

            function setimgData(){
                if(attributes.key&&attributes.key.trim()!=""){
                    var hasstr = attributes.key.substring(0,4);
                    if('img_'===hasstr){
                        attributes.key = attributes.key.slice(4);
                        if(isKey(attributes.key)){
                            setData('img');
                        }
                    }else{
                        if(isKey(attributes.key)){
                            setData('str');
                        }
                    }
                }
            }
            function setData(type){
                switch (type){
                    case 'str':
                        me.node[attributes.key].setString(attributes.V);
                        break;
                    case 'img':
                        //me.node[attributes.key].setTexture(attributes.V);
                        X.loadUrlImage(attributes.V,me.node[attributes.key]);
                        break;
                }

            }
            function isKey(){
                if(me.node[attributes.key]) {

                    return true;
                }else{
                    console.log(attributes.key+"not find!!!");
                    return false;
                }
            }
        }
    });

    X.GMoveUserNode= {
        _instance: null
        ,Getinstance: function(UserLayer){
            var me = this;
            if(!this._instance){
                this._instance = new _GMoveUserNode();
            }
            this._instance.node = UserLayer;
            return this._instance;
        }
    };

})();