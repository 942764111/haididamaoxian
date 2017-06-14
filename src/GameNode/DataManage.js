/**
 * Created by YanJun on 9/12/14.
 */
(function(){
    var _datamaer = cc.Class.extend({
        ctor: function(){
        },
        setUIdata :  function(key,V,node){
            var userLayer = X.GMoveUserNode.Getinstance(node)
            userLayer.setUIdata({'key':key,'V':V});
        }

    });

    X.DataMger= {
        _instance: null
        ,isSet: null
        ,Getinstance: function(obj){
            var me = this;
            if(!this._instance){
                this._instance = new _datamaer();
            }
            set(obj.attributes,obj.node);

            function set(attributes,node){
                for(var key in attributes){
                    var V = attributes[key];
                     me._instance.setUIdata(key,V,node);
                }
            }
            return this;
        }
    };

})();