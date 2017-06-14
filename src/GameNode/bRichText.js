(function(){
    X.bRichText = cc.Node.extend({
	  ctor: function(conf){
		this._super();
		//X.bObject.call(this);

		this.conf = conf;

		this.offSetX = 0;
		this.offSetY = 0;

		this._line = [];
		this._preLineMaxHeight = 0; //上一行最高的元素的值
		this._lineMaxHeight = 0; //本行最高的元素的值

		this._trueWidth = 0;
	  }
	  ,initData: function(args){
		this.args = args;
		for(var key in args){
		    var fun = key;
		    this[fun] && typeof this[fun] == 'function' && this[fun](args[key]);
		}
		return this;
	  }
	  //获取富文本框的真实尺寸
	  ,trueWidth : function(){
		return this._trueWidth;
	  }
	  ,trueHeight: function(){
		return this._trueHeight;
	  }
	  ,text: function(c){
		if(typeof(c)=='string'){
		    c = this._fmtString(c);
		}
		for(var i=0;i<c.length;i++){
		    var v = c[i];
		    if(typeof(v)=='string'){
			  v = {'size':this.conf.size,'family':this.conf.family || '微软雅黑', 'color': this.conf.color,'content':v};
		    }
		    this._addMsg(v);
		}
		this._drawLine();
		return this;
	  }
	  //格式化字符串
	  ,_fmtString : function(str){
		var _arr = str.split(/(<font.*?>)(.*?)<\/font>/g);
		var _res = [],_tmp={},_tmpLock=false;
		for(var i=0;i<_arr.length;i++){
		    if(_arr[i].substr(0,5)=='<font'){
			  _arr[i] = _arr[i].replace('>',' >');
			  var _re = /(.*?)=(.*?) /g;
			  while(_re.exec(_arr[i])!=null){
				_tmpLock = true;
				_tmp[RegExp.$1.replace('<font ','')] = RegExp.$2;
			  }
		    }else{
			  if(_tmpLock){
				_tmp['content'] = _arr[i];
				_res.push(_tmp);
				_tmpLock = false;
				_tmp={}
			  }else{
				_res.push(_arr[i]);
			  }
		    }
		}

		var __res=[];
		for(var j=0;j<_res.length;j++){
		    if(typeof(_res[j])=='string'){
			  var x = _res[j].split('<br>');
			  if(x.length>1){
				for(var _xx=0;_xx<x.length;_xx++){
				    __res.push(x[_xx]);
				    if(_xx<x.length-1)__res.push("<br>");
				}
			  }else{
				__res.push(_res[j]);
			  }
		    }else{
			  __res.push(_res[j]);
		    }
		}

		//解析图片(表情)
		var _res_ = [],_tmp_={},_tmpLock_=false;
		for(var i=0;i<__res.length;i++){
		    if(typeof(__res[i])=='string'){
			  var _arr_tamp = __res[i].split('#');
			  var _arr_ = [];
			  if (_arr_tamp.length>1) {
				for(var k=0;k<_arr_tamp.length;k++){
				    _arr_.push(_arr_tamp[k]);
				    if (k<_arr_tamp.length-1) {
					  _arr_.push('#');
				    }
				}
			  }
			  else
			  {
				_arr_.push(__res[i]);
			  }

			  for (var j = 0; j < _arr_.length; j++) {
				if (_arr_[j] == '#') {
				    _tmpLock_ = true;
				}
				else
				{
				    if(_tmpLock_){
					  var ico = _arr_[j].substr(0,2);
					  if (ico*1 >=1 && ico*1 <= GC.SMILY_COUNT) {
						_tmp_['imge'] = '#'+ico;
						_res_.push(_tmp_);
					  }
					  else
					  {
						_res_.push('#'+ico);
					  }

					  var str = _arr_[j].substr(2);
					  if (str && str != '') {
						_res_.push(str);
					  }
					  _tmpLock_ = false;
					  _tmp_={}
				    }else{
					  _res_.push(_arr_[j]);
				    }
				}
			  }
		    }else{
			  _res_.push(__res[i]);
		    }
		}

		return _res_;
	  }
	  ,_addMsg : function(v,drawNow){
		var _size=null;
		this._forTimers = this._forTimers || 1;
		//防止某些未知情况出现死循环
		//if(this._forTimers>50)return;
		this._forTimers++;

		if(v.content=='<br>'){
		    v.content='';
		    _size = {height:0,width:this.conf.maxWidth-1};
		}
		if (v.imge) {
		    v.content='';
		    _size = {height:32,width:32};
		}
		v.content = v.content.toString();
		var _node = null;
		if (v.imge) {
		    _node = new ccui.ImageView();
		    _node.isImge = true;
		    _node.setSize(_size);
		    _node.loadTexture('res/expression/'+GC.SMILY[v.imge+'']);
		}
		else
		{
		    var _defaultFamily = ("微软雅黑");
		    _node = new cc.LabelTTF(v.content||' ', this.conf.family ||_defaultFamily , v.size || this.conf.size);
		    _node.setColor(cc.color(v.color));
		    _node.setAnchorPoint(0, 0.5);
		    if(_size==null)_size = _node.getContentSize();
		}

		if(_size.height > this._lineMaxHeight)this._lineMaxHeight=_size.height;
		if(_size.width + this.offSetX <= this.conf.maxWidth){
		    //当前行可以放下
		    this._line.push([_node,this.offSetX]);
		    this.offSetX += _size.width;
		    if(drawNow)this._drawLine();
		    return;
		}else{
		    //放不下时 平均每个字宽
		    var _avgWidth = _size.width/v.content.length;
		    var _leftStringLen = (this.conf.maxWidth - this.offSetX) / _avgWidth;

		    if(_leftStringLen>=1){
			  var _copy = JSON.parse(JSON.stringify(v));
			  _copy.content = _copy.content.substr(0,_leftStringLen);

			  this._addMsg(_copy,true);

			  v.content = v.content.substr(_leftStringLen,v.content.length);
			  this._addMsg(v);
		    }else{
			  this._drawLine();
			  this._addMsg(v);
		    }
		}
	  }
	  ,_drawLine : function(){
		if(this._line.length==0)return;

		if(this.offSetX>this._trueWidth)this._trueWidth=this.offSetX;

		var offsetY  = 0;
		if(this._preLineMaxHeight > 0){
		    offsetY = parseInt(Math.max.apply(null,[this._preLineMaxHeight*.5 + this._lineMaxHeight*.5 ,this.conf.lineHeight]),10);
		}
		this.offSetY -= offsetY;
		this.offSetX = 0;

		for(var i=0;i<this._line.length;i++){
		    var _node = this._line[i][0];
		    if (_node.isImge) {
			  _node.setPosition(cc.p(this._line[i][1] + _node.getSize().width/2, this.offSetY-_node.getSize().height/4));
		    }
		    else
		    {
			  _node.setPosition(cc.p(this._line[i][1] , this.offSetY));
		    }
		    this.addChild(_node);
		}

		this._line = [];
		this._preLineMaxHeight = this._lineMaxHeight;
		this._trueHeight = Math.abs(this.offSetY - this._preLineMaxHeight);

		//this.setContentSize(cc.size(this._trueWidth,this._trueHeight));

		this._lineMaxHeight = 0;
	  }
    });
})();