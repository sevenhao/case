/**
 * Created by qhao on 2016/5/6.
 */
$(function(){
  var tScale  = window.devicePixelRatio;
  if(window.innerWidth>=768){
    tWidth = 640;
  }
  else{
    var tWidth  = window.innerWidth-10;
  }
  var tHeight = $(".runningRecord-barChart-wrap").height()
    - $(".runningRecord-barChart-time").height()
    - $(".runningRecord-lengend li").height()*3;;

  var averagestep = 0;
  var paceData = [//当前跑的每公里配速数据
    {time:1, walk:320},
    {time:2, walk:293},
    {time:3, walk:340},
    {time:4, walk:390},
    {time:5, walk:420},
    {time:6, walk:465}

  ];
  for(var i=0;i<paceData.length;i++){
    averagestep += paceData[i].walk;
  }
  averagestep = parseInt(averagestep/paceData.length);
  initData();
  function initData(){
    paceBarChart(9);//画图
  }


  function paceBarChart(index){
    /*
     *@param0: canvas 的id
     *@param1: json 数据
     *@param2: 颜色1
     *@param3: 颜色2
     */
    //先定义数据线的名字，再绘制数据

    var config = {
      canvasId:"detailChart",//canvas id
      type:"bar",
      width:tWidth,
      height:tHeight,
      tScale:tScale,
      totLabelsOnYAxis:5,//总的纵坐标刻度
      cMargin:15* tScale,//左边边距
      cSpace: 30 * tScale,//最大文本宽度
      bMargin:4* tScale,//柱之间的距离
      maxDataValue: 0,
      minDataValue:100000,
      maxOriangel:0,
      maxIndex:0,
      minIndex:0,
      arrVisitors:paceData,//配速数据
      averagestep:averagestep,//平均配速
      destination:10000,//no
      totalBars:12,
      realLength:paceData.length,
      rectcolorA:'rgba(56,186,155,1)',//常规颜色
      rectcolorB:'rgba(135,209,55,1)',//最小值颜色
      rectcolorC:'rgba(248,183,38,1)',//最大值颜色
      unit:"K",
      innal:1000,
      index:index
    };
    config.cHeight = config.height - config.cMargin - config.cSpace - 5*config.tScale;//绘图区的高度
    config.cell_height = config.cHeight/config.totLabelsOnYAxis;
    config.cWidth = config.width - 2 * config.cMargin;//柱状图区的宽度
    config.cMarginSpace = config.cMargin;//左边距
    config.cMarginHeight = config.cMargin + config.cHeight + 10*config.tScale;//绘图区的高度
    config.bWidth = (config.cWidth / config.totalBars) - config.bMargin;//柱宽
    config.xWidth = config.cWidth /5;//柱宽

    $.hongdian.yigerCanvas(config);
  }

  $('#knowMore').click(function(){
    console.log("了解更多");
  })
});
