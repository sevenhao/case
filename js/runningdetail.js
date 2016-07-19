/**
 * Created by qhao on 2016/5/6.
 */
$(function(){
  var distinguishData = {
    burning:0,
    aerobic:0,
    anaerobi:0
  };
  var age = 30;//年龄
  var rateData = [];

  var tScale  = window.devicePixelRatio;
  if(window.innerWidth>=768){
    tWidth = 620;
  }
  else{
    var tWidth  = window.innerWidth-10;
  }
  var tHeight = $(".runningRecord-barChart-wrap").height()
    - $(".runningRecord-barChart-time").height()
    - $(".runningRecord-lengend li").height()*3;
  var Ypadding = 8*tScale;

  var averagestep = 0;
  var paceData = [//当前跑的每公里配速数据
    //{time:1, walk:320},
    //{time:2, walk:293},
    //{time:3, walk:340},
    //{time:4, walk:390},
    //{time:5, walk:420},
    //{time:6, walk:465}

  ];
  var generatePaceData = function(){
    for(var i=0;i<28;i++){
      var stepdata = {};
      stepdata.time = i+1;
      if(i<5){
        if(i==1){
          stepdata.walk = 293;
        }
        else{
          stepdata.walk = selectfrom (293,450,5);
        }
      }
      else if(i==5){
        stepdata.walk = 465;
      }
      else{
        stepdata.walk = selectfrom (293,450,5);
      }
      paceData.push(stepdata);
    }
  }
  for(var i=0;i<paceData.length;i++){
    averagestep += paceData[i].walk;
  }
  averagestep = parseInt(averagestep/paceData.length);
  initData();
  function initData(){
    paceBarChart(9);//画图
    rateLineChart(1);
  }

  function selectfrom (lowValue,highValue,s){
    var choice=highValue-lowValue+s;
    return Math.floor(Math.random()*choice+lowValue);
  }

  //生成曲线数据
  function generateRateData() {
    rateData = {
      values: [
        {
          value0: [
            /*{x: "00:30", min: 0, y: 0},
             {x: "01:30", min: 0, y: 0}*/
          ]
        }
      ],
      lineColor: "#37B99B"
    };
    for(var i=0;i<=45;i++){
      var rate = {};
      rate.x = i+1;
      if(i==0){
        rate.y = 100;
      }
      else if(i==1){
        rate.y = 100;
      }
      else{
        rate.y = selectfrom ((220-age)*0.6,(220-age)*0.9,1);
      }
      console.log(rate.y);
      if(i){
        if((rate.y/(220-age)>=0.6) && (rate.y/(220-age)<=0.7)){
          console.log(rate.y/(220-age));
          distinguishData.burning ++;
        }
        else if((rate.y/(220-age)>0.70)&&(rate.y/(220-age)<=0.80)){
          console.log(rate.y/(220-age));
          distinguishData.aerobic ++;
        }
        else if((rate.y/(220-age)>0.80)&&(rate.y/(220-age)<=0.90)){
          console.log(rate.y/(220-age));
          distinguishData.anaerobi ++;
        }
      }

      rateData.values[0].value0.push(rate);
    }
  }

  function paceBarChart(index){
    /*
     *@param0: canvas 的id
     *@param1: json 数据
     *@param2: 颜色1
     *@param3: 颜色2
     */
    //先定义数据线的名字，再绘制数据

    generatePaceData();

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
      arrVisitors:paceData.length>12?paceData.slice(0,12):paceData,//31天步数数据
      allData:paceData,
      averagestep:averagestep,//平均配速
      destination:10000,//no
      totalBars:12,
      realLength:paceData.length>12?12:paceData.length,
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

    swipEvent();
  }

  function rateLineChart(){
    /*
     *@param0: canvas 的id
     *@param1: json 数据
     *@param2: 坐标距离画布的间隙padding
     *@param3: 如果只有一条数据时数据的颜色，多条数据颜色随机
     *@param4: 点的颜色
     *@param5: 是否绘制背景线
     *@param6: 是否是多条数据
     */
    //先定义数据线的名字，再绘制数据
    generateRateData();
    console.log(distinguishData);

    $("#distinguishData-burning").html(distinguishData.burning
    + '<span class="runningRecord-rate-canvas-unit">分钟</span>');

    $("#distinguishData-aerobic").html(distinguishData.aerobic
    + '<span class="runningRecord-rate-canvas-unit">分钟</span>');

    $("#distinguishData-anaerobi").html(distinguishData.anaerobi
    + '<span class="runningRecord-rate-canvas-unit">分钟</span>')

    var lineChartHeight = 180;
    var padding = 20;

    var config={
      tScale:tScale,
      type:"line",
      data:rateData,
      padding:padding,
      Ypadding:Ypadding,
      width:tWidth,
      height:lineChartHeight,
      maxrate:220-age,
      canvasId:"runningRate",
      isBg:true,//是否画横格线
      isMultiData:false,//是否多条线
      linecolor:"red",
      dotColor:"#fff",
      index:1,
      count:rateData.values[0].value0.length
    };
    console.log(rateData);

    config.cHeight = config.height - config.cMargin - config.cSpace - 5*config.tScale;//绘图区的高度
    config.cell_height = config.cHeight/config.totLabelsOnYAxis;
    config.cWidth = config.width - 2 * config.cMargin;//柱状图区的宽度
    config.cMarginSpace = config.cMargin;//左边距
    config.cMarginHeight = config.cMargin + config.cHeight + 10*config.tScale;//绘图区的高度
    config.bWidth = (config.cWidth / config.totalBars) - config.bMargin;//柱宽
    config.xWidth = config.cWidth /5;//柱宽
    $.hongdian.yigerCanvas(config);
  }

  function swipEvent(){
    var startX, startY, endX, endY;
    var showADID = 1;
    document.getElementById("detailChart").addEventListener("touchstart", touchStart, false);
    document.getElementById("detailChart").addEventListener("touchmove", touchMove, false);
    document.getElementById("detailChart").addEventListener("touchend", touchEnd, false);
    function touchStart(event) {
      var touch = event.touches[0];
      startY = touch.pageY;
      startX = touch.pageX;
    }
    function touchMove(event) {
      var touch = event.touches[0];
      //endY = (startY - touch.pageY);
      endX = touch.pageX;
    }
    function touchEnd(event) {
      //$("#img0" + showADID).hide();
      showADID++;
      if (showADID > 4) {
        showADID = 1;
      }
      if ((startX - endX) > 100) {
        //$("#img0" + showADID).show();
        swipeLeft();
      }
      else if(startX-endX < -100){
        swipeRight();
      }
      console.log("X轴移动大小：" + (startX - endX));
    }
  }

  var swipIndex = 0;
  function swipeLeft(){
    console.log("左滑");
    if(paceData.length-12*swipIndex >=12){
      swipIndex++;
      console.log(swipIndex);
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
        arrVisitors:paceData.length-12*swipIndex >12?paceData.slice(12*swipIndex,12*(swipIndex+1)):paceData.slice(12*swipIndex,paceData.length),//31天步数数据
        allData:paceData,
        averagestep:averagestep,//平均步数
        destination:10000,//步数目标
        totalBars:12,
        realLength:paceData.length-12*swipIndex >12?12:paceData.length-12*swipIndex,
        rectcolorA:'rgba(56,186,155,1)',//常规颜色
        rectcolorB:'rgba(135,209,55,1)',//最小值颜色
        rectcolorC:'rgba(248,183,38,1)',//最大值颜色
        unit:"K",
        innal:1000,
        index:9
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
  }

  function swipeRight(){
    console.log("右滑");
    if(paceData.length-(paceData.length-12*swipIndex) >=12){
      swipIndex--;
      console.log(swipIndex);
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
        arrVisitors:paceData.length-12*swipIndex >12?paceData.slice(12*swipIndex,12*(swipIndex+1)):paceData.slice(12*$scope.swipIndex,paceData.length),//31天步数数据
        allData:paceData,
        averagestep:averagestep,//平均步数
        destination:10000,//步数目标
        totalBars:12,
        realLength:paceData.length-12*swipIndex >12?12:paceData.length-12*swipIndex,
        rectcolorA:'rgba(56,186,155,1)',//常规颜色
        rectcolorB:'rgba(135,209,55,1)',//最小值颜色
        rectcolorC:'rgba(248,183,38,1)',//最大值颜色
        unit:"K",
        innal:1000,
        index:9
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
  }

  $('#knowMore').click(function(){
    console.log("了解更多");
  })
});
