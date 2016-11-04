
(function($){
  "use strict";

  var ScrollXiaohai = (function(){
    function ScrollXiaohai(element, options){
      var me = this;
          me.flag = true;
      this.settings = $.extend(true, $.fn.ScrollXiaohai.defaults, options||{});
      this.element = element;
      this.init();


    }

    ScrollXiaohai.prototype = {
        //初始化构造页面
        init : function(){
          var me = this;

          me.flag = true;
          me.name = this.settings.name;
          me.ul = this.element.children("ul").eq(0);

          me.li = this.ul.children('li');

          //获取总页数 和 当前页数
          me.pagesCount = me.pageCount();
          me.index = (me.settings.index >= 0 && me.settings.index < me.pagesCount) ? me.settings.index : 0;

          //判断横屏还是竖屏
          me.horizontal = me.settings.horizontal == "horizontal" ? true :false;

          //是否有分页
          if (me.settings.pageIcon){
            me._pageIcon();
          }

          // 是否有按钮
          if (me.settings.btnIcon){
            me._btnIcon();
          }

          //设置一开始页面

            me._initLayout();


          me._initEvent();

        },
        //获取li数量
        pageCount : function(){
          return this.li.length;
        },
        //设置分页Icon按钮
        _pageIcon : function(){

          var me = this,
              iconUlClass = me.settings.icon.iconUl.substring(1),
              iconLiClass = me.settings.icon.iconLi.substring(1);
          me.activeClass = me.name.active.substring(1);

          var pageHtml = "<ul class="+iconUlClass+">";
          for(var i = 0 ; i < me.pagesCount; i++){
            pageHtml += "<li class="+iconLiClass+"></li>";
          }
          pageHtml += "</ul>";
          me.element.append(pageHtml);

          me.iconUl = me.element.find(me.settings.icon.iconUl);
          me.iconItem = me.iconUl.find("li");
          var paddingLeft = "";
          if (me.settings.icon.position == 'start'){
            paddingLeft = 10
          }else if(me.settings.icon.position == 'end'){
            paddingLeft = me.horizontal ? (me.settings.width - me.settings.icon.iconWidth*me.pagesCount -  me.settings.icon.marginRight*(me.pagesCount)) :
              me.settings.height - me.settings.icon.iconWidth*me.pagesCount -  me.settings.icon.marginRight*(me.pagesCount)
          }else{
            paddingLeft = me.horizontal ? (me.settings.width - me.settings.icon.iconWidth*me.pagesCount -  me.settings.icon.marginRight*(me.pagesCount-1))/2 :
              (me.settings.height - me.settings.icon.iconWidth*me.pagesCount -  me.settings.icon.marginRight*(me.pagesCount-1))/2;
          }

          var paddingTop  = (me.settings.icon.height - me.settings.icon.iconHeight ) /2;
          // 按钮是否为原型
          var Radius = me.settings.icon.Radius ? me.settings.icon.iconWidth/2 : 0;

          //设置样式
          me.iconUl.css({
            position : "absolute",
            width : me.horizontal ? me.settings.width - paddingLeft : me.settings.icon.height - paddingTop,
            height :me.horizontal ? me.settings.icon.height - paddingTop : me.settings.height - paddingLeft,
            backgroundColor : me.settings.icon.ulColor,
            top:me.horizontal ? me.settings.height - me.settings.icon.height + me.settings.icon.top : me.settings.icon.top,
            left:me.horizontal ? me.settings.icon.left : me.settings.width - me.settings.icon.height - me.settings.icon.left,
            paddingLeft: me.horizontal ? paddingLeft : paddingTop,
            paddingTop: me.horizontal ? paddingTop : paddingLeft ,
            zIndex:10000
          });
          me.iconItem.css({
            width : me.settings.icon.iconWidth,
            height : me.settings.icon.iconHeight,
            backgroundColor : me.settings.icon.liColor,
            float: me.horizontal ? 'left' : '',
            borderRadius:Radius,
            marginRight:me.horizontal ? me.settings.icon.marginRight : 0,
            marginBottom:me.horizontal ? 0 : me.settings.icon.marginRight,
            zIndex:1000,
            cursor:"pointer"
          });

          me.iconItem.eq(me.index).addClass(me.activeClass).css({
            backgroundColor: me.name.activeColor
          });


        },
        //按钮进行布局
        _btnIcon : function(){
          var me = this;
          me.btn = me.settings.btn;
          var prevClass = me.btn.prev.substring(1);
          var nextClass = me.btn.next.substring(1);
          var nextBoxClass = me.btn.boxNext.substring(1);
          var prevBoxClass = me.btn.boxPrev.substring(1);

          me.prevBox = $('<div class='+prevBoxClass+'>').css({
            position:'absolute',
            width:me.horizontal ? me.btn.width : me.settings.width,
            height:me.horizontal ? me.settings.height : me.btn.width,
            backgroundColor: me.btn.color,
            top: 0,
            left:me.horizontal ? me.btn.left : 0,
            zIndex:1000
          });

          me.nextBox = $('<div class='+nextBoxClass+'>').css({
            position:'absolute',
            width:me.horizontal ? me.btn.width : me.settings.width,
            height:me.horizontal ? me.settings.height : me.btn.width,
            backgroundColor: me.btn.color,
            top: me.horizontal ? 0 : me.settings.height - me.btn.width,
            right:me.horizontal ? me.btn.left : 0,
            zIndex:1000
          });

           me.btnPrev = $('<span class='+prevClass+'>').css({
            width:me.btn.spanWidth,
            height:me.btn.spanHeight,
            backgroundColor: me.btn.btnColor,
            marginTop: me.horizontal ? (me.settings.height /2 - me.btn.spanHeight) : (me.btn.width - me.btn.spanHeight)/2,
            marginLeft: me.horizontal ? 0 : (me.settings.width -  me.btn.spanWidth)/2,
            cursor:"pointer",
            display:"block"
          });
          me.btnNext = $('<span class='+nextClass+'>').css({
            width:me.btn.spanWidth,
            height:me.btn.spanHeight,
            backgroundColor: me.btn.btnColor,
            marginTop: me.horizontal ? (me.settings.height /2 - me.btn.spanHeight) : (me.btn.width - me.btn.spanHeight)/2,
            marginLeft: me.horizontal ? me.btn.width - me.btn.spanWidth : (me.settings.width -  me.btn.spanWidth)/2,
            cursor:"pointer",
            display:"block"

          });

          me.element.append(me.prevBox,me.nextBox);
          me.prevBox.append(me.btnPrev);
          me.nextBox.append(me.btnNext)




        },
        //针对横屏页面进行布局
        _initLayout : function(){
          var me = this,
              ulClass = me.name.ul.substring(1),
              liClass = me.name.li.substring(1);

          //添加样式给组件
          this.element.css({
            width:this.settings.width,
            height:this.settings.height,
            position:'relative',
            overflow:"hidden"
          });
          this.ul.css({
            width: me.horizontal ? this.settings.width * (this.pagesCount + 1) : this.settings.width,
            height:me.horizontal ? this.settings.height : this.settings.height * (this.pagesCount + 1),
            position:'relative'
          }).addClass(ulClass);
          this.li.css({
            width:this.settings.width,
            height:this.settings.height,
            float:me.horizontal ? "left" : null
          }).addClass(liClass);


        },
        _next : function(){
          var me = this;
          me.index ++;
          me._scrollPage()

        },
        _prev : function(){
          var me = this;
          me.index --;
          if (me.index < 0){
            me.index = me.pagesCount-1;
          }

          me._scrollPage()
        },
        _autoPlay:function(){
            var me = this;
          me.timer = window.setInterval(function(){
            me._next();
          },me.settings.duration);
        },

        /*说明：事件触发*/
        _initEvent : function(){
          var me = this;

        //下面icon点击切换

          if (me.settings.pageIcon){

              me.element.on("click", me.settings.icon.iconUl + " li", function(){

                me.index = $(this).index();
                if (me.flag){
                  me.flag = false;
                me._scrollPage();
                }
              });

          }


          //按钮点击
          if (me.settings.btnIcon){

              me.element.on("click",me.btn.next, function(){
                if (me.flag){
                  me.flag = false;
                  me._next();
                }
              });
              me.element.on("click",me.btn.prev, function(){
                if (me.flag){
                  me.flag = false;
                  me._prev();
                }
              });
          }

          //自动播放
          if (me.settings.autoPlay){
            me._autoPlay();
            this.element.hover(function(){
              window.clearInterval(me.timer);
            },function(){
              me._autoPlay();
            })
          }

          //按钮效果
          if (!me.btn.show){
            me.btnPrev.hide();
            me.element.on("mouseover",me.btn.boxPrev, function(){

              me.btnPrev.show();
            });
            me.element.on("mouseout",me.btn.boxPrev, function(){

              me.btnPrev.hide();
            });

            me.btnNext.hide();
            me.element.on("mouseover",me.btn.boxNext, function(){

              me.btnNext.show();
            });
            me.element.on("mouseout",me.btn.boxNext, function(){

              me.btnNext.hide();
            });
          }


        },
      _iconActive : function(index){
          var me = this;
        me.iconItem.removeClass(me.activeClass).css({
          backgroundColor:me.settings.icon.liColor
        });
        me.iconItem.eq(index).addClass(me.activeClass).css({
          backgroundColor:me.name.activeColor
        });
      },


      _scrollPage : function(){
        var me = this;

        if (me.settings.pageIcon){
          me._iconActive(me.index);
        }



        //next方法
        var firstItem = me.li.eq(0).clone().addClass("xiaohai-clone");

        if (me.index == me.pagesCount-1){
          me.ul.append(firstItem);
        }

        if (me.index > me.pagesCount){
          if (me.horizontal){
            me.ul.css("left",0);
          }else{
            me.ul.css("top",0);
          }

          $('.xiaohai-clone').remove();
          me.index = 1;
          me._scrollPage()
        }

        if (me.index == me.pagesCount){

          if (me.settings.pageIcon){
            me._iconActive(0);
          }

        }


          me.ul.animate({
            left: me.horizontal ? - me.index * me.settings.width : 0,
            top : me.horizontal ? 0 :  -me.index * me.settings.height
          },me.settings.easing,function(){
            me.flag = true;
          })


      }
    };
    return ScrollXiaohai;
  })();





  $.fn.ScrollXiaohai = function(options){
    return this.each(function(){
      var me = $(this),
        instance = me.data("ScrollXiaohai");

      if(!instance){
        me.data("ScrollXiaohai", (instance = new ScrollXiaohai(me, options)));
      }

      if($.type(options) === "string") return instance[options]();
    });
  };

  $.fn.ScrollXiaohai.defaults = {

    name : {
      ul : ".scrollXiaohai-ul", //放置图片层的ul的class名字
      li : ".scrollXiaohai-li", //放置图片的li的class名字
      active : ".active", //高亮的class样式名字
      activeColor : "yellow" //高亮时的背景颜色 主要用于icon
    },
    icon :{
      iconUl : ".scrollXiaohai-iconUl", //放置icon层的class样式名字 可以自由更改
      iconLi : ".scrollXiaohai-iconLi",//放置icon的class样式名字 可以自由更改
      height:50,//放置icon层的高度
      ulColor: "rgba(0,0,0,0.5)",//放置icon层的背景颜色
      liColor: 'blue',//icon的背景颜色
      top:0, // 水平 ? bottom 0 : top:0
      left:0,// 水平 ? left 0 : right:0
      iconWidth:30, //icon宽度
      iconHeight:30, // icon高度
      Radius:true, //icon是否圆角
      position:'middle', //icon在遮罩层的位置有 start end middle
      marginRight:10 //个个icon之间的距离
    },
    btn:{
      boxPrev : '.scrollXiaohai-boxPrev', //放置按钮层的class样式名字 可以自由更改
      boxNext : '.scrollXiaohai-boxNext', //放置按钮层的class样式名字 可以自由更改
      prev : '.scrollXiaohai-prev', //按钮的class样式名字 可以自由更改  =>按钮的图片建议自己 填写上去
      next : '.scrollXiaohai-next', //按钮的class样式名字 可以自由更改
      width: 100, //  水平 ? 安置按钮层的宽度 : 安置按钮层的高度
      spanHeight:50,//按钮高度
      spanWidth:50, //按钮宽度
      left: 0,    //放置按钮层 左右靠边距离
      color: "rgba(0,0,0,0)",    //放置按钮的层颜色
      btnColor: "rgba(0,0,0,0.5)", //按钮的背景颜色
      show:false  //是否移动到放置按钮的层颜色处才显示

    },
    width:800,        //幻灯片宽度
    height:800*0.56,  //   幻灯片高度
    index : 0,		//页面开始的索引
    duration : 5000,		//自动播放时间
    easing : 500,     //切换速度
    autoPlay : true, //是否自动播放
    btnIcon:true,    //是否有按钮
    pageIcon : true,		//是否进行分页
    horizontal : "horizontal"//是什么播放模式		//滑动方向vertical,horizontal

  };


})(jQuery);