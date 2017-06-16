/**
 * Created by jon on 2017/5/16.
 */


var GC = {
    COLOR:[
        '#33FF99',
        '#d6d6d6',
        '#fff583',
        '#ece3ff',
        '#151515',//黑
        '#FF0000'//红
    ],
    COLOROBJ : {
        'Deeppurple':'#c3a8ff',//文字通用深紫
        'Lightpurple':'#ece3ff'//文字通用白紫
    },
    /**
     * PC : 扑克牌配置
     * Type:类型与后台同步
     * flaxres:flax中的对应资源名称
     * readid:对应的readid向后台交互的数据
     * res:res中的图片资源名称
     * txt:对应的显示文本♠♥♦♣
     */
    PC:[
        {'id':'1','Type':'num','flaxres':'A','readid':'A','res':null,'txt':'A'},
        {'id':'2','Type':'num','flaxres':'2','readid':'2','res':null,'txt':'2'},
        {'id':'3','Type':'num','flaxres':'3','readid':'3','res':null,'txt':'3'},
        {'id':'4','Type':'num','flaxres':'4','readid':'4','res':null,'txt':'4'},
        {'id':'5','Type':'num','flaxres':'5','readid':'5','res':null,'txt':'5'},
        {'id':'6','Type':'num','flaxres':'6','readid':'6','res':null,'txt':'6'},
        {'id':'7','Type':'num','flaxres':'7','readid':'7','res':null,'txt':'7'},
        {'id':'8','Type':'num','flaxres':'8','readid':'8','res':null,'txt':'8'},
        {'id':'9','Type':'num','flaxres':'9','readid':'9','res':null,'txt':'9'},
        {'id':'10','Type':'num','flaxres':'10','readid':'10','res':null,'txt':'10'},
        {'id':'11','Type':'num','flaxres':'J','readid':'J','res':null,'txt':'J'},
        {'id':'12','Type':'num','flaxres':'Q','readid':'Q','res':null,'txt':'Q'},
        {'id':'13','Type':'num','flaxres':'K','readid':'K','res':null,'txt':'K'},
        {'id':'14','Type':'style','flaxres':'r','readid':'2','res':'hong','txt':'♥'},
        {'id':'15','Type':'style','flaxres':'sds','readid':'1','res':'hei','txt':'♠'},
        {'id':'16','Type':'style','flaxres':'pb','readid':'3','res':'hua','txt':'♣'},
        {'id':'17','Type':'style','flaxres':'sq','readid':'4','res':'kuai','txt':'♦'},
        {'id':'18','Type':'big','flaxres':'max','readid':'3','res':null,'txt':'大'},
        {'id':'19','Type':'big','flaxres':'min','readid':'1','res':null,'txt':'小'},
        {'id':'20','Type':'big','flaxres':'7','readid':'2','res':null,'txt':'中'}
    ],
    LPTYPE : ['num','style','big'],

    LINES_SIZE:{
        'num':5000,//最外层 5000
        'style':12500,//中间层 12500
        'big':50000//里层 50000
    },
    //本地的
    CZITEM: {
        1000:'chongzhi_1.png',
        2000:'chongzhi_2.png',
        5000:'chongzhi_3.png',
        10000:'chongzhi_4.png',
        50000:'chongzhi_5.png'
    },
    //用户的属性
    USER_DATA:{
        DATA:{},
        token:TOKEN,
        uid:UID||0
    },

    //场景中的按钮Key
    GAME_BEGIN_BTNS:['btn_bean','btn_fh','btn_th','btn_mrfl','btn_xsc','btn_jjc','btn_gsc','btn_sz','img','tzjl_btn'],
    GAME_MOVE_BTNS:['btn_fallback','btn_fanhui','btn_caidan','btn_add','btn_wangqi','img'],
    GAME_MOVE_CDBTNS:['yxwf_btn','yxsx_btn','yxsx_btn2','tzjl_btn'],
    //提示框layer按钮
    GAME_PROMPTBOX:['btn_remove','btn_qr'],

    //提示框按钮配置
    PROMPTBOX_BTNS:{
        '1':'qdbtn',//确定
        '2':'qxbtn',//取消
        '3':'tcbtn',//退出
        '4':'sxbtn',//刷新
        '5':'qssbtn'//去试试
    },
    //提示框标题配置
    PROMPTBOX_TITLES:{
        '1':'qdcg',//签到成功
        '2':'jrgljdz',//今日鼓励金已到账
    },
    //Nodes
    //游戏关卡配置
    YZ_SCORE:{
        'XS_SCORE':{
            'score':[10,50,100],
            'userimg':'yzimguser.png',
            'aiimg':'yzimgai.png',
            'res':res.xinshouc,
            'id':'XS_SCORE',
            'readid':1,
            'txtid':'low_place'
        },
        'JJ_SCORE':{
            'score':[100,300,500],
            'userimg':'yzimguser.png',
            'aiimg':'yzimgai.png',
            'res':res.jinjiec,
            'id':'JJ_SCORE',
            'readid':2,
            'txtid':'middle_place'
        },
        'GS_SCORE':{
            'score':[500,1000,2500],
            'userimg':'yzimguser.png',
            'aiimg':'yzimgai.png',
            'res':res.gaoshouc,
            'id':'GS_SCORE',
            'readid':3,
            'txtid':'high_place'
        }
    },
    ACTION_INFO:{
        'YZ_Sleep':2000 //玩家和AI的投注的路程时间 V越大越快
    },
    TASK:{
        '1':{'title':'签到','content':'领取<font color=#ece3ff>80</font>趣乐豆','iscomplete':0},
        '2':{'title':'鼓励金<font size=22 color=#c3a8ff>(参与游戏且趣乐豆小于20)</font>','content':'领取<font color=#ece3ff>50</font>趣乐豆','iscomplete':0}
    }
};

GC.YZ_ID = [];
/**
 * 场景ID
 * @type {null}
 */
GC.SCENE = {
    node : null,
    id : null,
    layerid : []
};

GC.ISOVER = false;
/**
 * TOUCHLAYER_TY 单点触摸层透明度
 * @type {null}
 */
GC.TOUCHLAYER_TY = 70;

/**
 * AI 数量
 * @type {number}
 */
GC.AI_COUNT = 4;

/**
 * 初始化判断是否签到
 * @type {number}
 */
GC.IS_SIGN = 0;


//TimeEvents
GC.GAME_TIMEEVENTS = [];


GC.SMILY_COUNT = 24;        //聊天表情数量
GC.SMILY = {
    "#01":"expression1.png",
    "#02":"expression2.png",
    "#03":"expression3.png",
    "#04":"expression4.png",
    "#05":"expression5.png",
    "#06":"expression6.png",
    "#07":"expression7.png",
    "#08":"expression8.png",
    "#09":"expression9.png",
    "#10":"expression10.png",
    "#11":"expression11.png",
    "#12":"expression12.png",
    "#13":"expression13.png",
    "#14":"expression14.png",
    "#15":"expression15.png",
    "#16":"expression16.png",
    "#17":"expression17.png",
    "#18":"expression18.png",
    "#19":"expression19.png",
    "#20":"expression20.png",
    "#21":"expression21.png",
    "#22":"expression22.png",
    "#23":"expression23.png",
    "#24":"expression24.png"
};

GC.HTTPDATA={
    'DATA_TYPE':'JSONP',
    'pokerinfo':'http://api.qlbuy.cc/h5/user/pokerinfo',
    'pokerbuy':'http://api.qlbuy.cc/h5/poker/buy',
    'cancel':'http://api.qlbuy.cc/h5/poker/cancel',//撤销
    'pokeropen':'http://api.qlbuy.cc/h5/poker/open',//扑克牌历史开奖结果 TEST
    'exchange':'http://api.qlbuy.cc/h5/poker/exchange',
    'encourage':'http://api.qlbuy.cc/h5/poker/encourage',//鼓励金
    'remaintime':'http://api.qlbuy.cc/h5/poker/remaintime',//开奖时间间隔信息
    'pokerlog':'http://api.qlbuy.cc/h5/poker/log',//投注记录
    'pokerlogtail':'http://api.qlbuy.cc/h5/poker/logtail',//投注记录详情
    'qulebuybacktopay':'http://api.qlbuy.cc/h5/poker/qulebuybacktopay',//返回APP界面
    'qulebuypay':'http://api.qlbuy.cc/h5/poker/static/qulebuypay',//返回充值界面
    //状态码:
    'FAILURE':700,//与服务器失去通讯
    'STAY_LOTTERY':600,//等待开奖中
    'TG':200,
    'MONEY_DONT':425,//余额不足
    'GLJDZ':800,//提示鼓励金到账
    'TOKEN':410,//token 过期
    'boltagainindex':1,//当前断线重连次数
    'Maxboltagainindex':5,//最大断线重连次数
};

//game  ZOrder
GC.GAME_ZORDER={
    'Under':1,
    'In':2,
    'on':3
}