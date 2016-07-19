/**
 * Created by qhao on 2016/3/31.
 * jquery-canvas-progress - jQuery Plugin to draw stem and curse
 * Version: 1.0.0
 */

(function ($) {
  $.hongdian = {};
  /*
   * config:
   *       devicePixelRatio:tscale
   *       type:stem/curse
   *       data
   *       padding:23
   *       Ypadding:5
   *       width:window.innerWidth
   *       height:canvasHeight
   *       canvasId
   *       isBg//是否画横格线
   *       isMultiData//是否多条线
   *       linecolor
   *       dotColor
   *       index同一页图的id
   *       count：点数
   * */
  $.hongdian.yigerCanvas = function (config) {
    //console.log(config);
    window.document.getElementById(config.canvasId).style.display = "none";
    if (config.type == "stem") {
      StemChart.setData(
        config.canvasId,
        config.data,
        config.padding * config.tScale,
        config.Ypadding,
        config.linecolor,
        config.dotColor,
        config.isBg,
        config.isMultiData, config);
    }
    else if (config.type == "curse") {
      config.padding = config.padding * config.tScale;
      CurveChart.setData(config);
    }
    else if (config.type == 'bar') {
      //console.log(config);
      BarChart.setData(config.canvasId, config.arrVisitors, config);
      //console.log(config.bWidth);
    }
    else if (config.type == "line") {
      config.padding = config.padding * config.tScale;
      LineChart.setData(config);
    }
    window.document.getElementById(config.canvasId).style.display = "block";
  }

  var BarChart = {
    canvas: undefined,
    context: undefined,
    setData: function (canId, data, config) {
      this.canvas = document.getElementById(canId);
      this.canvas.style.width = config.width + "px";
      this.canvas.style.height = config.height + "px";
      this.canvas.width = config.width * config.tScale;
      this.canvas.height = config.height * config.tScale;
      if (this.canvas && this.canvas.getContext) {
        this.context = this.canvas.getContext("2d");
      }
      this.context.save();
      this.context.setTransform(1, 0, 0, 1, 0, 0, 0);
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.chartSettings(this.canvas.width, this.canvas.height, config);
      this.drawAxisLabelMarkers(config);
      this.drawChartWithAnimation(config);
      this.context.restore();
    },
    // initialize the chart and bar values
    chartSettings: function (w, h, config) {
      // chart properties
      console.log("chartSettings");

      config.cHeight = h - config.cMargin - config.cSpace - 5 * config.tScale;//绘图区的高度
      config.cell_height = config.cHeight / config.totLabelsOnYAxis;
      config.cWidth = w - 2 * config.cMargin;//柱状图区的宽度
      config.cMarginSpace = config.cMargin;//左边距
      config.cMarginHeight = config.cMargin + config.cHeight + 10 * config.tScale;//绘图区的高度
      config.bWidth = ((config.cWidth-20* config.tScale) / config.totalBars) - config.bMargin;//柱宽
      config.xWidth = config.cWidth / 5;//柱宽

      // find maximum value to plot on chart
      //config.maxDataValue = 0;

      if(config.index == 9){
        //for (var i = 0; i < config.realLength; i++) {
        //  var barVal = config.arrVisitors[i].walk;
        //  //console.log(barVal);
        //  if (barVal < config.minDataValue && barVal != 0) {
        //    config.minDataValue = barVal;
        //    config.minIndex = i;
        //    //console.log(config.maxDataValue);
        //  }
        //}
        //for (var i = 0; i < config.realLength; i++) {
        //  var barVal = config.arrVisitors[i].walk;
        //  //console.log(barVal);
        //  if (barVal > config.maxOriangel) {
        //    config.maxDataValue = barVal;
        //    config.maxIndex = i;
        //    config.maxOriangel = barVal;
        //    config.maxDataValue = this.getScaleRange(config, config.maxDataValue);
        //    //console.log(config.maxDataValue);
        //  }
        //}

        for (var i = 0; i < config.allData.length; i++) {
          var barVal = config.allData[i].walk;
          //console.log(barVal);
          if (barVal < config.minDataValue && barVal != 0) {
            config.minDataValue = barVal;
            config.minIndex = i;
            //console.log(config.maxDataValue);
          }
        }
        for (var i = 0; i < config.allData.length; i++) {
          var barVal = config.allData[i].walk;
          //console.log(barVal);
          if (barVal > config.maxOriangel) {
            config.maxDataValue = barVal;
            config.maxIndex = i;
            config.maxOriangel = barVal;
            config.maxDataValue = this.getScaleRange(config, config.maxDataValue);
            //console.log(config.maxDataValue);
          }
        }
      }
      else{
        for (var i = 0; i < config.totalBars; i++) {
          var barVal = config.arrVisitors[i].walk;
          //console.log(barVal);
          if (barVal > config.maxOriangel) {
            config.maxDataValue = barVal;
            config.maxIndex = i;
            config.maxOriangel = barVal;
            config.maxDataValue = this.getScaleRange(config, config.maxDataValue);
            //console.log(config.maxDataValue);
          }
        }
      }

      this.context.font = "10pt Garamond";
    },
    getScaleRange: function (config, value) {
      if (config.index == 1) {
        if (value >= 1000) {
          value = (parseInt(value * 1.2 / 1000) + 1) * 1000;
        }
        else if (value) {
          value = 3000;
        }
      }
      else if (config.index == 2) {
        console.log(value);
        if (value > 60) {
          value = (parseInt(value * 1.2 / 60)) * 60;
        }
        else {
          value = 180;
        }
      }
      return value;
    },
    // draw chart axis, labels and markers
    drawAxisLabelMarkers: function (config) {
      this.context.lineWidth = "1.0";
      this.drawHAxis(config);
      if(config.index!=9){
        this.drawDashline(config);
      }
      this.drawMarkers(config);
    },
    // draw X and Y axis
    drawAxis: function (x, y, X, Y) {
      this.context.beginPath();//起始一条路径，或重置当前路径
      this.context.moveTo(x, y);//把路径移动到画布中的指定点，不创建线条,起点
      this.context.lineTo(X, Y);//添加一个新点，然后在画布中创建从该点到最后指定点的线条，终点
      this.context.strokeStyle = "rgba(0,0,0,0.3)";
      this.context.closePath();//创建从当前点回到起始点的路径
      this.context.stroke();//绘制已定义的路径
    },
    //画虚线
    drawDashline:function (config) {
      this.context.lineWidth = 1;
      //this.context.strokeStyle = "#cdcdcd";
      this.context.strokeStyle = "#D1D1D1";
      this.context.beginPath();//起始一条路径，或重置当前路径
      //分段长度
      var dashLen = 10;
      var bVal =config.averagestep;
      var bHt = (bVal * config.cHeight / config.maxDataValue);
      var bY = config.cMarginHeight - bHt;//柱形左上角的 y坐标
      //虚线总长度
      var lineLength = this.canvas.width-config.cMarginSpace;
      //分段数
      var numDashes = Math.floor(lineLength/dashLen);
      var startX = config.cMarginSpace/2;
      var endX = this.canvas.width - config.cMarginSpace/2;
      for(var i=0;i<numDashes;i++){
        if(i % 2 === 0){
          this.context.moveTo(startX+dashLen*i,bY);
        }else {
          this.context.lineTo(startX+dashLen*i,bY);
        }
      }
      this.context.closePath();//创建从当前点回到起始点的路径
      this.context.stroke();
    },
    //画基线
    drawHAxis:function(config){
      //for(var row = 0; row <= config.totLabelsOnYAxis; row++){
      //  var y = row * config.cell_height;
      //  this.context.moveTo(config.cMargin+config.cSpace,y+config.cMargin);
      //  this.context.lineTo(this.canvas.width * config.tScale-(2*config.cMargin+config.cSpace), y+config.cMargin);
      //}
      this.context.lineWidth = 2;
      //this.context.strokeStyle = "#cdcdcd";
      this.context.strokeStyle = "#D1D1D1";
      this.context.beginPath();//起始一条路径，或重置当前路径
      var bVal =config.averagestep;
      var bHt = (bVal * config.cHeight / config.maxDataValue);
      //var bY = config.cMarginHeight - bHt;//柱形左上角的 y坐标
      var bY = config.cMarginHeight;
      this.context.moveTo(config.cMarginSpace/2,bY);
      this.context.lineTo(this.canvas.width-config.cMarginSpace/2,bY);

      //this.context.moveTo(0,5*config.tScale);
      //this.context.lineTo(this.canvas.width-config.cMarginSpace/2,5*config.tScale);
      this.context.closePath();//创建从当前点回到起始点的路径
      this.context.stroke();
    },
    // draw chart markers on X and Y Axis绘制轴和Y轴坐标
    drawMarkers: function (config) {
      //console.log("drawMarkers");
      //var numMarkers = parseInt(config.maxDataValue / config.totLabelsOnYAxis);//每个刻度的平均值
      var numMarkers = config.maxDataValue / config.totLabelsOnYAxis;//每个刻度的平均值
      this.context.font = 10 * config.tScale + "px Arial";
      this.context.fillStyle = "#808080";

      //Y Axis
      if(config.index == 9){
        var bVal = config.allData[config.maxIndex].walk;
        var bHt = (bVal * config.cHeight / config.maxDataValue);
        var bY = config.cMarginHeight - bHt;//柱形左上角的 y坐标
        var hours = parseInt(bVal / 60);
        var minutes = parseInt(bVal % 60);
        if (minutes) {
          minutes = minutes + '"';
          var time = hours + "'" + minutes;
        }
        else {
          minutes = '';
          var time = hours + "'" + minutes;
        }

        this.context.font = 10 * config.tScale + "px Arial";
        this.context.fillStyle = "#D1D1D1";
        this.context.lineWidth = 1;
        this.context.strokeStyle = "#D1D1D1";
        this.context.fillText(time,
          this.canvas.width-config.cMarginSpace*1.5,
          bY + 5 * config.tScale, config.xWidth);

        this.context.beginPath();//起始一条路径，或重置当前路径
        this.context.moveTo(config.cMarginSpace/2,bY);
        this.context.lineTo(this.canvas.width-config.cMarginSpace*2,bY);
        this.context.closePath();//起始一条路径，或重置当前路径
        this.context.stroke();

        var hours1 = parseInt(bVal/3/60);
        var minutes1 = parseInt(bVal/3%60);
        if (minutes1) {
          minutes1 = minutes1 + '"';
          var time1 = hours1 + "'" + minutes1;
        }
        else {
          minutes1 = '';
          var time1 = hours1 + "'" + minutes1;
        }

        var Label1 = config.cMarginHeight -bHt/3;
        this.context.fillText(time1,
          this.canvas.width-config.cMarginSpace*1.5,
          Label1 + 5 * config.tScale, config.xWidth);

        this.context.beginPath();//起始一条路径，或重置当前路径
        this.context.moveTo(config.cMarginSpace/2,Label1);
        this.context.lineTo(this.canvas.width-config.cMarginSpace*2,Label1);
        this.context.closePath();//起始一条路径，或重置当前路径
        this.context.stroke();

        var hours2 = parseInt(bVal/3*2/60);
        var minutes2 = parseInt(bVal/3*2%60);
        if (minutes2) {
          minutes2 = minutes2 + '"';
          var time2 = hours2 + "'" + minutes2;
        }
        else {
          minutes2 = '';
          var time2 = hours2 + "'" + minutes2;
        }

        var Label2 = config.cMarginHeight -bHt/3*2;
        this.context.fillText(time2,
          this.canvas.width-config.cMarginSpace*1.5,
          Label2 + 5 * config.tScale, config.xWidth);

        this.context.beginPath();//起始一条路径，或重置当前路径
        this.context.moveTo(config.cMarginSpace/2,Label2);
        this.context.lineTo(this.canvas.width-config.cMarginSpace*2,Label2);
        this.context.closePath();//起始一条路径，或重置当前路径
        this.context.stroke();


      }


      // Y Axis
      //for (var i = 0; i <= config.totLabelsOnYAxis; i++) {
      //  var markerVal = i * numMarkers;
      //  //console.log(markerVal);
      //  var markerValHt = i * numMarkers * config.cHeight;//每一刻度高度的总值
      //  var xMarkers = config.cMarginSpace - 5 * config.tScale;//Y坐标离Y轴距离
      //  var yMarkers = config.cMarginHeight - (markerValHt / config.maxDataValue);//y坐标离X轴的距离
      //  //context.fillText(markerVal/tScale, xMarkers, yMarkers, config.cSpace);//在画布上绘制“被填充的”文本
      //  this.context.fillText(markerVal, xMarkers, yMarkers, config.cSpace);//在画布上绘制“被填充的”文本
      //  //markerVal-规定在画布上输出的文本。
      //  //xMarkers-开始绘制文本的 x 坐标位置（相对于画布）。
      //  //yMarkers-开始绘制文本的 y 坐标位置（相对于画布）
      //  //config.cSpace-可选。允许的最大文本宽度，以像素计。
      //}


      // X Axis
      this.context.textAlign = 'center';
      if(config.index == 9){
        for (var i = 0; i < config.realLength; i++) {
          var name = config.arrVisitors[i].time;
          if(config.index == 9){//如果index=9,则代表画的是记录详情
            if(i < config.realLength){
              var markerXPos = config.cMarginSpace + (i * (config.bWidth + config.bMargin)) + 3*config.bMargin;
              var markerYPos = config.cMarginHeight + 16 * config.tScale;
              //markerYPos = config.cMarginHeight;
              this.context.fillText(name, markerXPos, markerYPos, config.xWidth);
              if(i == 0){
                this.context.fillText("公里",this.canvas.width-config.cMarginSpace, markerYPos, config.xWidth);
              }
            }
          }
          else{
            if (i == 0) {
              var markerXPos = config.cMarginSpace + config.bMargin + config.bWidth / 2 + 5 * config.tScale;
              var markerYPos = config.cMarginHeight + 16 * config.tScale;
              //markerYPos = config.cMarginHeight;
              this.context.fillText(name, markerXPos, markerYPos, config.xWidth);
            }
            else if (/*(i + 1) % 7 == 0*/i%7 == 3 && i != 3) {
              var markerXPos = config.cMarginSpace + ((i + 3) / 7 * (config.xWidth));
              var markerYPos = config.cMarginHeight + 16 * config.tScale;
              //markerYPos = config.cMarginHeight;
              this.context.fillText(name, markerXPos, markerYPos, config.xWidth);
            }
            else if (i == config.totalBars - 1) {
              this.context.fillStyle = config.rectcolorA;
              var markerXPos = config.cWidth - config.cMarginSpace / 2 + config.bWidth * 2;
              var markerYPos = config.cMarginHeight + 16 * config.tScale;
              this.context.fillText(name, markerXPos, markerYPos, config.xWidth);
            }
          }
        }
      }
      else{
        for (var i = 0; i < config.totalBars; i++) {
          var name = config.arrVisitors[i].time;
          if(config.index == 9){//如果index=9,则代表画的是记录详情
            if(i < config.realLength){
              var markerXPos = config.cMarginSpace + (i * (config.bWidth + config.bMargin)) + 3*config.bMargin;
              var markerYPos = config.cMarginHeight + 16 * config.tScale;
              //markerYPos = config.cMarginHeight;
              this.context.fillText(name, markerXPos, markerYPos, config.xWidth);
              if(i == 0){
                this.context.fillText("公里",this.canvas.width-config.cMarginSpace + 1 * config.tScale, markerYPos, config.xWidth);
              }
            }
          }
          else{
            if (i == 0) {
              var markerXPos = config.cMarginSpace + config.bMargin + config.bWidth / 2 + 5 * config.tScale;
              var markerYPos = config.cMarginHeight + 16 * config.tScale;
              //markerYPos = config.cMarginHeight;
              this.context.fillText(name, markerXPos, markerYPos, config.xWidth);
            }
            else if (/*(i + 1) % 7 == 0*/i%7 == 3 && i != 3) {
              var markerXPos = config.cMarginSpace + ((i + 3) / 7 * (config.xWidth));
              var markerYPos = config.cMarginHeight + 16 * config.tScale;
              //markerYPos = config.cMarginHeight;
              this.context.fillText(name, markerXPos, markerYPos, config.xWidth);
            }
            else if (i == config.totalBars - 1) {
              this.context.fillStyle = config.rectcolorA;
              var markerXPos = config.cWidth - config.cMarginSpace / 2 + config.bWidth * 2;
              var markerYPos = config.cMarginHeight + 16 * config.tScale;
              this.context.fillText(name, markerXPos, markerYPos, config.xWidth);
            }
          }
        }
      }

      this.context.save();//保存当前环境的状态
    },
    drawChartWithAnimation: function (config) {//画柱形图
      // Loop through the total bars and draw
      //console.log(config.maxDataValue);
      this.context.textAlign = "right";
      this.context.font = 10 * config.tScale + "px Arial";
      this.context.fillStyle = "#D1D1D1";
      if(config.index != 9){
        var param = parseInt(config.maxDataValue/config.innal)+config.unit;
        if(config.maxDataValue == 0 && config.unit == 'h'){
          param = 8+config.unit;
        }else if(config.maxDataValue == 0 && config.unit == "K"){
          param = parseInt(config.destination/config.innal) + config.unit;
        }
        this.context.fillText(param, this.canvas.width - config.cMarginSpace, 10 * config.tScale, config.xWidth);
      }


      if(config.index == 9){
        for (var i = 0; i < config.realLength; i++) {
          var bVal = config.arrVisitors[i].walk;
          var bHt = (bVal * config.cHeight / config.maxDataValue);
          var bX = config.cMarginSpace + (i * (config.bWidth + config.bMargin));//柱形左上角的 x 坐标
          var bY = config.cMarginHeight - bHt;//柱形左上角的 y坐标
          //if (bVal < config.destination) {
          //  BarChart.drawRectangle(bX, bY, config.bWidth, bHt, true, config.rectcolorB);
          //}
          //else {
          //  BarChart.drawRectangle(bX, bY, config.bWidth, bHt, true, config.rectcolorA);
          //}
          if(config.index == 9){//记录详情柱状图
            if (config.arrVisitors[i].walk == config.maxOriangel) {
              BarChart.drawRectangle(bX, bY, config.bWidth, bHt, true, config.rectcolorC);
            }
            else if(config.arrVisitors[i].walk == config.minDataValue){
              BarChart.drawRectangle(bX, bY, config.bWidth, bHt, true, config.rectcolorB);
              //this.context.font = 10 * config.tScale + "px Arial";
              //this.context.fillStyle = "#808080";
              //this.context.lineWidth = 2;
              //this.context.strokeStyle = "#D1D1D1";
              //this.context.fillText(time,
              //  this.canvas.width-config.cMarginSpace,
              //  bY + 10 * config.tScale, config.xWidth);
              //
              //this.context.beginPath();//起始一条路径，或重置当前路径
              //this.context.moveTo(config.cMarginSpace/2,bY);
              //this.context.lineTo(this.canvas.width-config.cMarginSpace/2,bY);
              //this.context.closePath();//起始一条路径，或重置当前路径
              //this.context.stroke();
            }
            else{
              BarChart.drawRectangle(bX, bY, config.bWidth, bHt, true, config.rectcolorA);
            }
          }
          else{//非记录详情柱状图

            if (bVal < config.destination) {
              BarChart.drawRectangle(bX, bY, config.bWidth, bHt, true, config.rectcolorB);
            }
            else {
              BarChart.drawRectangle(bX, bY, config.bWidth, bHt, true, config.rectcolorA);
            }

            if (i == config.maxIndex) {
              this.context.font = 10 * config.tScale + "px Arial";
              this.context.fillStyle = "#808080";
              if (config.index == 2) {
                var hours = parseInt(bVal / 60);
                var minutes = bVal % 60;
                if (minutes) {
                  minutes = minutes + '分钟';
                  var time = hours + "小时" + minutes;
                  if (i == config.totalBars - 1) {
                    this.context.fillText(time,
                      config.cMarginSpace + ((i + 1) * (config.bWidth + config.bMargin)) + config.bMargin + 2 * config.tScale,
                      bY - 2 * config.tScale, config.xWidth);
                  }
                  else if (i == 0) {
                    this.context.fillText(time,
                      config.cMarginSpace + ((i + 1) * (config.bWidth + config.bMargin)) + config.bMargin + 32 * config.tScale,
                      bY - 2 * config.tScale, config.xWidth);
                  }
                  else {
                    this.context.fillText(time,
                      config.cMarginSpace + ((i + 1) * (config.bWidth + config.bMargin)) + config.bMargin + 20 * config.tScale,
                      bY - 2 * config.tScale, config.xWidth);
                  }
                }
                else {
                  minutes = '';
                  var time = hours + "小时" + minutes;
                  this.context.fillText(time,
                    config.cMarginSpace + ((i + 1) * (config.bWidth + config.bMargin)) + config.bMargin * 2,
                    bY - 2 * config.tScale, config.xWidth);
                }

              }
              else if (config.index == 1) {
                this.context.fillText(bVal + '步',
                  config.cMarginSpace + ((i + 1) * (config.bWidth + config.bMargin)) + config.bMargin + 10 * config.tScale,
                  bY - 2 * config.tScale, config.xWidth);
              }
            }
          }
        }
      }
      else{
        for (var i = 0; i < config.totalBars; i++) {
          var bVal = config.arrVisitors[i].walk;
          var bHt = (bVal * config.cHeight / config.maxDataValue);
          var bX = config.cMarginSpace + (i * (config.bWidth + config.bMargin)) + config.bMargin / 2;//柱形左上角的 x 坐标
          var bY = config.cMarginHeight - bHt;//柱形左上角的 y坐标
          //if (bVal < config.destination) {
          //  BarChart.drawRectangle(bX, bY, config.bWidth, bHt, true, config.rectcolorB);
          //}
          //else {
          //  BarChart.drawRectangle(bX, bY, config.bWidth, bHt, true, config.rectcolorA);
          //}
          if(config.index == 9){//记录详情柱状图
            var hours = parseInt(bVal / 60);
            var minutes = bVal % 60;
            if (minutes) {
              minutes = minutes + '"';
              var time = hours + "'" + minutes;
            }
            else {
              minutes = '';
              var time = hours + "'" + minutes;
            }
            if (i == config.maxIndex) {
              BarChart.drawRectangle(bX, bY, config.bWidth, bHt, true, config.rectcolorC);
              this.context.font = 10 * config.tScale + "px Arial";
              this.context.fillStyle = "#808080";
              this.context.lineWidth = 2;
              this.context.strokeStyle = "#D1D1D1";
              this.context.fillText(time,
                this.canvas.width-config.cMarginSpace,
                bY + 10 * config.tScale, config.xWidth);

              this.context.beginPath();//起始一条路径，或重置当前路径
              this.context.moveTo(config.cMarginSpace/2,bY);
              this.context.lineTo(this.canvas.width-config.cMarginSpace/2,bY);
              this.context.closePath();//起始一条路径，或重置当前路径
              this.context.stroke();
            }
            else if(i == config.minIndex){
              BarChart.drawRectangle(bX, bY, config.bWidth, bHt, true, config.rectcolorB);
              this.context.font = 10 * config.tScale + "px Arial";
              this.context.fillStyle = "#808080";
              this.context.lineWidth = 2;
              this.context.strokeStyle = "#D1D1D1";
              this.context.fillText(time,
                this.canvas.width-config.cMarginSpace,
                bY + 10 * config.tScale, config.xWidth);

              this.context.beginPath();//起始一条路径，或重置当前路径
              this.context.moveTo(config.cMarginSpace/2,bY);
              this.context.lineTo(this.canvas.width-config.cMarginSpace/2,bY);
              this.context.closePath();//起始一条路径，或重置当前路径
              this.context.stroke();
            }
            else{
              BarChart.drawRectangle(bX, bY, config.bWidth, bHt, true, config.rectcolorA);
            }
          }
          else{//非记录详情柱状图

            if (bVal < config.destination) {
              BarChart.drawRectangle(bX, bY, config.bWidth, bHt, true, config.rectcolorB);
            }
            else {
              BarChart.drawRectangle(bX, bY, config.bWidth, bHt, true, config.rectcolorA);
            }

            if (i == config.maxIndex) {
              this.context.font = 10 * config.tScale + "px Arial";
              this.context.fillStyle = "#808080";
              if (config.index == 2) {
                var hours = parseInt(bVal / 60);
                var minutes = bVal % 60;
                if (minutes) {
                  minutes = minutes + '分钟';
                  var time = hours + "小时" + minutes;
                  if (i == config.totalBars - 1) {
                    this.context.fillText(time,
                      config.cMarginSpace + ((i + 1) * (config.bWidth + config.bMargin)) + config.bMargin + 2 * config.tScale,
                      bY - 2 * config.tScale, config.xWidth);
                  }
                  else if (i == 0) {
                    this.context.fillText(time,
                      config.cMarginSpace + ((i + 1) * (config.bWidth + config.bMargin)) + config.bMargin + 32 * config.tScale,
                      bY - 2 * config.tScale, config.xWidth);
                  }
                  else {
                    this.context.fillText(time,
                      config.cMarginSpace + ((i + 1) * (config.bWidth + config.bMargin)) + config.bMargin + 20 * config.tScale,
                      bY - 2 * config.tScale, config.xWidth);
                  }
                }
                else {
                  minutes = '';
                  var time = hours + "小时" + minutes;
                  this.context.fillText(time,
                    config.cMarginSpace + ((i + 1) * (config.bWidth + config.bMargin)) + config.bMargin * 2,
                    bY - 2 * config.tScale, config.xWidth);
                }

              }
              else if (config.index == 1) {
                this.context.fillText(bVal + '步',
                  config.cMarginSpace + ((i + 1) * (config.bWidth + config.bMargin)) + config.bMargin + 10 * config.tScale,
                  bY - 2 * config.tScale, config.xWidth);
              }
            }
          }
        }
      }

    },
    drawRectangle: function (x, y, w, h, fill, color) {//画矩形图
      this.context.beginPath();
      this.context.rect(x, y, w, h);//创建矩形，x——矩形左上角的 x 坐标，y——矩形左上角的 y 坐标，w——矩形的宽度，以像素计，h——矩形的高度，以像素计
      this.context.closePath();
      this.context.stroke();
      if (fill) {
        var gradient = this.context.createLinearGradient(0, 0, 0, 300);
        //gradient.addColorStop(0, 'rgba(102,203,184,1)');
        //gradient.addColorStop(1, 'rgba(102,203,184,1)');
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, color);
        this.context.fillStyle = gradient;
        this.context.strokeStyle = "rgba(0,0,0,0)";
        this.context.fill();
      }
      this.context.save();
    },
    clearCanvas: function () {
      console.log("clear");
      this.context.fillStyle = "ffffff";
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.beginPath();
    }
  };

  //杆状图函数
  var StemChart = {
    can: undefined,
    ctx: undefined,
    width: undefined,
    lineColor: undefined,
    dotColor: undefined,
    isBg: false,
    isMultiData: false,
    setData: function (canId, data, padding, Ypadding, lineColor, dotColor, isBg, isMultiData, config) {
      this.lineColor = lineColor;
      this.dotColor = dotColor;
      this.can = document.getElementById(canId);
      this.ctx = this.can.getContext("2d");
      this.can.style.width = config.width + "px";
      this.can.style.height = config.height + "px";
      this.can.width = config.width * config.tScale;
      this.can.height = config.height * config.tScale;
      this.isBg = isBg;
      this.isMultiData = isMultiData;
      this.ctx.save();
      this.ctx.setTransform(1, 0, 0, 1, 0, 0, 0);
      this.ctx.clearRect(0, 0, this.can.width, this.can.height);
      this.drawXY(data, 0, padding, Ypadding, this.can, config.index, config);
      this.ctx.restore();
    },

    isMultiData: function (data) {
      if (data.values.length > 1) {
        this.isMultiData = true;
      }
    },//是否是多条数据线
    drawXY: function (data, key, padding, Ypadding, can, index, config) {
      var tScale = config.tScale;
      this.ctx.lineWidth = "2";
      this.ctx.strokeStyle = "black";
      this.ctx.fillStyle = "black";//坐标轴坐标颜色
      this.ctx.font = 10 * tScale + "px Arial";

      var maxY = this.getMax(data, 0, this.isMultiData);//获得Y轴上的最大值
      var minY = this.getMin(data, 0, this.isMultiData);//获得Y轴上的最小值
      var perwidth = this.getStemPixel(data, key, can.width, padding, tScale, config.count);//x 轴每一个数据占据的宽度
      var ymincount = this.getYminCount(minY, can.height, padding).ycount;
      var ycount = this.getYPixel(maxY, can.height, Ypadding, ymincount).ycount;
      var yPixel = this.getYPixel(maxY, can.height, Ypadding * 2, ymincount).pixel;
      console.log("Y轴最大值：" + ycount + "；Y轴最小值：" + ymincount + "间隔：" + yPixel);
      var space = (ycount - ymincount) / 5;
      //绘制X轴
      //for (var i = 0, ptindex; i < 48; i++) {
      //  ptindex = i + 1;
      //  //var x_x = this.getCoordX(padding, perwidth, ptindex, tScale);
      //  var x_x = this.getCoordX(config.padding * config.tScale, perwidth, ptindex, config.tScale);
      //  //var x_y = can.height-Ypadding+40;
      //  var x_y = can.height - Ypadding * 0.3;
      //  if (i == 0) {
      //    this.ctx.fillText("0:00", x_x-perwidth, x_y, perwidth * 8);
      //  }
      //  if (i == 21) {
      //    this.ctx.fillText("12:00", x_x+5*tScale, x_y, perwidth * 9);
      //  }
      //  if (i == 45) {
      //    //console.log(x_x-20);
      //    this.ctx.fillText("24:00", x_x+2*tScale, x_y, perwidth * 9);
      //  }
      //  if ((i+2)%12 == 0&&i != 46&&i != 22) {
      //    this.ctx.fillText((i+2)/2 + ":00", x_x+1*tScale, x_y, perwidth * 9);
      //  }
      //}

      for (var i = 0, ptindex; i <  config.count; i++) {
        ptindex = i + 1;
        var x_x = this.getCoordX(config.padding * config.tScale, perwidth, ptindex, config.tScale);
        var x_y = can.height - Ypadding * 0.3;

        this.ctx.save();
        this.ctx.strokeStyle = "#4D4D4D";
        this.ctx.lineWidth = "2";
        this.ctx.beginPath();//起始一条路径，或重置当前路径
        this.ctx.moveTo(x_x,x_y-perwidth-1*config.tScale);
        this.ctx.lineTo(x_x,x_y-perwidth+2*config.tScale);
        this.ctx.closePath();//创建从当前点回到起始点的路径
        this.ctx.stroke();
        this.ctx.restore();

        if (i == 0) {
          this.ctx.fillText("0:00", x_x-perwidth, x_y, perwidth * 8);
        }
        else if((i+1)%6 == 0 && (i+1 <10)){
          this.ctx.fillText(i+1, x_x-perwidth/4, x_y, perwidth * 8);
        }
        else if((i+1)%6 == 0 && (i+1 >= 10)){
          this.ctx.fillText(i+1, x_x-perwidth/2, x_y, perwidth * 8);
        }
      }

      //绘制Y轴
      for (var i = 0; i <= 5; i++) {

        this.ctx.textAlign = "right"//y轴文字靠右写
        this.ctx.textBaseline = "middle";//文字的中心线的调整
        var x_x = this.getCoordX(padding, perwidth, 1, tScale);
        var yspace = 5 * tScale;
        var xspace = 20;
        if (i == 0) {
          if (i * space + ymincount, x_x + yspace > 100) {
            xspace = 30;
          }
          this.ctx.fillText(i * space + ymincount, padding - yspace, ((ycount - ymincount) / space - i) * space * yPixel + Ypadding * 0.3 - 25, perwidth * xspace);
        }
        if (i == 5) {
          if (i * space + ymincount, x_x + yspace > 100) {
            xspace = 30;
          }
          this.ctx.fillText(i * space + ymincount, padding - yspace, ((ycount - ymincount) / space - i) * space * yPixel + 25 + Ypadding * 0.3, perwidth * xspace);
        }
      }

      if (this.isBg) {
        var xspace = 5;
        for (var i = 0; i <= 5; i++) {
          var y = ((ycount - ymincount) / space - i) * space * yPixel + Ypadding * 0.3;
          if (!(i >= 0 && i < 5) || i == 2) {
            this.ctx.lineWidth = "1";
            this.ctx.strokeStyle = "#e2e2e2";
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(can.width, y);
            this.ctx.closePath();
            this.ctx.stroke();
            this.ctx.restore();
          }
        }
      }//选择绘制背景线
      if (data.values[0].value0.length == 0) {
        console.log(data);
        return;
      }
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = "#4D4D4D";

      this.ctx.save();
      this.ctx.beginPath();//起始一条路径，或重置当前路径
      this.ctx.moveTo(0,(ycount - ymincount)* yPixel + Ypadding* 0.3);
      this.ctx.lineTo(can.width,(ycount - ymincount)* yPixel + Ypadding * 0.3);
      this.ctx.closePath();//创建从当前点回到起始点的路径
      this.ctx.stroke();
      this.ctx.restore();

      this.drawData(config, 0, perwidth, yPixel, this.isMultiData, ymincount, ycount);
    },//绘制XY坐标 线 以及点
    drawData: function (config, key, perwidth, yPixel, isMultiData, ymincount, ycount) {
      if (!isMultiData) {
        var keystr = "value" + key;
        this.ctx.lineWidth = "2";
        if (arguments[6]) {
          this.ctx.strokeStyle = config.lineColor;
        } else {
          this.ctx.strokeStyle = this.lineColor;
        }

        this.ctx.strokeStyle = config.data.lineColor;
        this.ctx.fillStyle = this.dotColor;

        for (var i = 0; i < config.data.values[key][keystr].length; i++) {
          var ii = config.data.values[key][keystr][i].x;
          var result = this.changeStringToTime(ii, "00:00");
          var resultTime = parseInt(result / 120000 / 30)
          var x = this.getCoordX(config.padding * config.tScale, perwidth, resultTime, config.tScale);
          var y = this.getCoordY(config.Ypadding, yPixel, config.data.values[key][keystr][i].y - ymincount);
          var ymin = this.getCoordY(config.Ypadding, yPixel, config.data.values[key][keystr][i].min - ymincount);

          //console.log("stem chart getCoordX" + config.padding + "," + config.tScale + ","+ perwidth + ","+ resultTime);
          //console.log("stem chart  X:" + x + " Y:" + y);

          var dotspace = ((config.data.values[key][keystr][i].y - config.data.values[key][keystr][i].min) * config.height / (ycount - ymincount)) - 6;

          //画最大值
          this.ctx.beginPath();
          this.ctx.arc(x - config.tScale, y - 6 * config.tScale, 2 * config.tScale, 0, Math.PI * 2, false);//绘制数据线上的点
          //console.log("x:"+ (x-20 )+"Y: "+y+10);
          this.ctx.fill();
          this.ctx.stroke();
          this.ctx.closePath();
          if (dotspace > 5) {
            //画最小值
            this.ctx.beginPath();
            this.ctx.arc(x - config.tScale, ymin - 6 * config.tScale, 2 * config.tScale, 0, Math.PI * 2, false);//绘制数据线上的点
            //console.log("x:"+ (x-20 )+"Y: "+ymin+10);
            this.ctx.fill();
            this.ctx.stroke();
            this.ctx.closePath();

            //画竖线
            this.ctx.beginPath();
            this.ctx.lineWidth = "3";
            this.ctx.moveTo(x - config.tScale, ymin - 8 * config.tScale);
            this.ctx.lineTo(x - config.tScale, y - 3 * config.tScale);//画竖线
            this.ctx.stroke();
            this.ctx.closePath();
          }
        }
        this.ctx.closePath();

      } else {//如果是多条数据线
        for (var i = 0; i < config.data.values.length; i++) {
          var color = config.data.lineColor[i];
          StemChart.drawData(config, i, perwidth, yPixel, false, ymincount, ycount);
        }
      }
    },//绘制数据线和数据点
    getPixel: function (data, key, width, padding) {
      var count = data.values[key]["value" + key].length;
      return (width - 20 - padding) / (count + (count - 1) * 1.5);
    },//宽度
    getCurPixel: function (data, key, width, padding, tScale,count) {
      var count = 24;
      //return (width-20-padding)/(count+(count-1)*1.5);
      return (width - 20 * tScale - padding * 2) / count;
    },//曲线宽度
    getStemPixel: function (data, key, width, padding, tScale, count) {
      //var count = 48;
      console.log(count);
      //return (width-20-padding)/(count+(count-1)*1.5);
      return (width - 20 * tScale - padding * 2) / count;
    },//宽度
    getCoordX: function (padding, perwidth, ptindex, tScale) {//下标从1开始 不是从0开始
      //console.log(ptindex);
      var x = perwidth * ptindex + padding + 10 * tScale;
      return x;
    },//横坐标X 随ptindex 获得
    getCoordY: function (padding, yPixel, value) {
      var y = yPixel * value;
      return this.can.height - padding - y;
    },//纵坐标X 随ptindex 获得(注意 纵坐标的算法是倒着的因为原点在最上面)
    getYPixel: function (maxY, height, padding, ymincount) {
      var ycount = (parseInt(maxY / 10)) * 10 + 20;//y轴最大值
      return {pixel: (height - padding) / (ycount - ymincount), ycount: ycount};
    },//y轴的单位长度
    getYminCount: function (maxY, height, padding) {
      var ycount = (parseInt(maxY / 10)) * 10 - 10;//y轴最小值
      return {pixel: (height - padding) / ycount, ycount: ycount};
    },//y轴最小值
    getMax: function (data, key, isMultiData) {
      if (data.values[0].value0.length == 0) {
        maxY = 80;
      }
      else {
        var maxY = data.values[key]["value" + key][0].y;
        var length = data.values[key]["value" + key].length;
        var keystr = "value" + key;
        for (var i = 1; i < length; i++) {
          if (maxY < data.values[key][keystr][i].y) maxY = data.values[key][keystr][i].y;
        }
        for (var i = 0; i < length; i++) {
          if (maxY < data.values[key][keystr][i].min) maxY = data.values[key][keystr][i].min;
        }
      }
      return maxY;//返回最大值 如果不是多数据
    },
    getMin: function (data, key, isMultiData) {
      if (data.values[0].value0.length == 0) {
        maxY = 50;
      }
      else {
        var maxY = data.values[key]["value" + key][0].y;
        var length = data.values[key]["value" + key].length;
        var keystr = "value" + key;
        for (var i = 1; i < length; i++) {
          if (maxY > data.values[key][keystr][i].y) maxY = data.values[key][keystr][i].y;
        }
        for (var i = 0; i < length; i++) {
          if (maxY > data.values[key][keystr][i].min) maxY = data.values[key][keystr][i].min;
        }
      }
      return maxY;//返回最大值 如果不是多数据
    },
    changeStringToTime: function (start, end) {
      var reg = /\:/g;

      var sDate = new Date;
      sDate.setHours(0, 0, 0, 0);
      var s = start.split(reg);
      sDate.setHours(s[0]);
      sDate.setMinutes(s[1]);

      var eDate = new Date;
      eDate.setHours(0, 0, 0, 0);
      var e = end.split(reg);
      eDate.setHours(e[0]);
      eDate.setMinutes(e[1]);

      return sDate - eDate;
    },
    clearCanvas: function () {
      console.log("clear");
      this.ctx.clearRect(0, 0, this.can.width, this.can.height);
      this.ctx.beginPath();
    }
  };

  //曲线图
  var CurveChart = {
    keynames: [],//数据信息数组
    can: undefined,
    ctx: undefined,
    width: undefined,
    lineColor: undefined,
    dotColor: undefined,
    isBg: false,
    isMultiData: false,
    setData: function (config) {
      this.lineColor = config.lineColor;
      this.dotColor = config.dotColor;
      this.can = document.getElementById(config.canvasId);
      this.ctx = this.can.getContext("2d");
      this.can.style.width = config.width + "px";
      this.can.style.height = config.height + "px";
      this.can.width = config.width * config.tScale;
      this.can.height = config.height * config.tScale;
      this.isBg = config.isBg;
      this.isMultiData = config.isMultiData;
      this.ctx.save();
      this.ctx.setTransform(1, 0, 0, 1, 0, 0, 0);
      this.ctx.clearRect(0, 0, this.can.width, this.can.height);
      this.drawXY(config, 0, this.can);
      this.ctx.restore();
    },

    isMultiData: function (data) {
      if (data.values.length > 1) {
        this.isMultiData = true;
      }
    },//是否是多条数据线
    drawXY: function (config, key, can) {
      this.ctx.lineWidth = "2";
      this.ctx.strokeStyle = "black";
      this.ctx.fillStyle = "black";//坐标轴坐标颜色
      this.ctx.font = 10 * config.tScale + "px Arial";

      var maxY = this.getMax(config.data, 0, this.isMultiData);//获得Y轴上的最大值
      var perwidth = this.getStemPixel(config.data, key, can.width, config.padding, config.tScale,config.count);//x 轴每一个数据占据的宽度
      var XfontWidth = this.getCurPixel(config.data, key, can.width, config.padding, config.tScale,config.count);//x轴坐标宽度
      var ymincount = 0;
      var ycount = 15;
      var yPixel = this.getYPixel(maxY, can.height, config.Ypadding * 2, ymincount).pixel;
      console.log("Y轴最大值：" + ycount + "；Y轴最小值：" + ymincount + "间隔：" + yPixel);
      var space = (ycount - ymincount) / 5;
      //console.log(space);
      //绘制X轴
      //for (var i = 0, ptindex; i < 48; i++) {
      //  ptindex = i + 1;
      //  var x_x = this.getCoordX(config.padding, XfontWidth, ptindex, config.tScale);
      //  //var x_y = can.height-Ypadding+40;
      //  var x_y = can.height - config.Ypadding * 0.3;
      //  if (i == 0) {
      //    this.ctx.fillText("0时", x_x - XfontWidth, x_y, XfontWidth * 8);
      //  }
      //  if (i == 21) {
      //    this.ctx.fillText("12", x_x+5*config.tScale, x_y, XfontWidth * 9);
      //  }
      //  if (i == 45) {
      //    this.ctx.fillText("24时", x_x, x_y, XfontWidth * 9);
      //  }
      //  if ((i+1)%6 == 0&&i != 47&&i != 23) {
      //    this.ctx.fillText((i+1)/2, x_x, x_y, perwidth * 9);
      //  }
      //}

      for (var i = 0, ptindex; i <  config.count; i++) {
        ptindex = i + 1;
        //var x_x = this.getCoordX(padding, perwidth, ptindex, tScale);
        var x_x = this.getCoordX(config.padding, XfontWidth, ptindex, config.tScale);
        //var x_y = can.height-Ypadding+40;
        var x_y = can.height - config.Ypadding * 0.3;

        this.ctx.save();
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = "#4D4D4D";
        this.ctx.beginPath();//起始一条路径，或重置当前路径
        this.ctx.moveTo(x_x,x_y-perwidth-1*config.tScale);
        this.ctx.lineTo(x_x,x_y-perwidth+2*config.tScale);
        this.ctx.closePath();//创建从当前点回到起始点的路径
        this.ctx.stroke();
        this.ctx.restore();

        if (i == 0) {
          this.ctx.fillText("0:00", x_x-perwidth, x_y, XfontWidth * 8);
        }
        else if((i+1)%6 == 0 && (i+1 <10)){
          this.ctx.fillText(i+1, x_x-perwidth/4, x_y, XfontWidth * 8);
        }
        else if((i+1)%6 == 0 && (i+1 >= 10)){
          this.ctx.fillText(i+1, x_x-perwidth/2, x_y, XfontWidth * 8);
        }
      }

      //绘制Y轴
      var yspace = 2 * config.tScale;
      var xspace = 20;
      for (var i = 0; i <= 5; i++) {
        this.ctx.textAlign = "right"//y轴文字靠右写
        this.ctx.textBaseline = "middle";//文字的中心线的调整
        var x_x = this.getCoordX(config.padding, XfontWidth, 1);
        if (i == 0) {
          this.ctx.fillText("平静", config.padding - yspace, ((ycount - ymincount) / space - i) * space * yPixel + config.Ypadding * 0.3 - 25, perwidth * xspace);
          //console.log(perwidth*20);
        }
        if (i == 3) {
          this.ctx.fillText("活跃", config.padding - yspace, ((ycount - ymincount) / space - i) * space * yPixel + config.Ypadding * 0.3 - 25, perwidth * xspace);
        }
        if (i == 5) {
          this.ctx.fillText("兴奋", config.padding - yspace, ((ycount - ymincount) / space - i) * space * yPixel + 25 + config.Ypadding * 0.3, perwidth * xspace);
        }
      }

      if (this.isBg) {
        for (var i = 0; i <= 5; i++) {
          var y = ((ycount - ymincount) / space - i) * space * yPixel + config.Ypadding * 0.3;
          if (!(i >= 0 && i < 5) || i == 3) {
            this.ctx.save();
            this.ctx.lineWidth = "1";
            this.ctx.strokeStyle = "#e6e6e6";
            this.ctx.beginPath();
            //this.ctx.moveTo(x,y+13);
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(can.width, y);
            this.ctx.closePath();
            this.ctx.stroke();
            this.ctx.restore();
          }
        }
      }//选择绘制背景线

      if (config.data.values[0].value0.length == 0) {
        console.log(config.data);
        return;
      }

      this.ctx.save();
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = "#4D4D4D";
      this.ctx.beginPath();//起始一条路径，或重置当前路径
      this.ctx.moveTo(0,(ycount - ymincount)* yPixel + config.Ypadding * 0.3);
      this.ctx.lineTo(can.width,(ycount - ymincount)* yPixel + config.Ypadding * 0.3);
      this.ctx.closePath();//创建从当前点回到起始点的路径
      this.ctx.stroke();
      this.ctx.restore();

      this.drawData(config, 0, perwidth, yPixel, this.isMultiData);
    },//绘制XY坐标 线 以及点

    drawData: function (config, key, perwidth, yPixel, isMultiData) {
      var keystr = "value" + key;
      this.ctx.lineWidth = 4;
      if (arguments[6]) {
        this.ctx.strokeStyle = config.lineColor;
      } else {
        this.ctx.strokeStyle = this.lineColor;
      }

      //this.ctx.strokeStyle=data.lineColor;
      var gradient = this.ctx.createLinearGradient(0, 70, 340, 0);
      gradient.addColorStop("0", "#60C8AF");
      gradient.addColorStop("0.7", "#F2D740");
      gradient.addColorStop("1", "#F2821E");

      // 用渐变进行填充
      this.ctx.strokeStyle = gradient;
      this.ctx.fillStyle=gradient;

      this.ctx.save();
      this.ctx.beginPath();
      var r = 0;
      var r0 = 2*config.tScale;
      for (var i = 1; i <= config.data.values[key][keystr].length; i++) {
        var i0 = config.data.values[key][keystr][i - 1].x;
        var result0 = this.changeStringToTime(i0, "00:00");
        var resultTime0 = parseInt(result0 / 3600000);
        var x0 = this.getCoordX(config.padding, perwidth, resultTime0, config.tScale);
        if(i==1){
          x0 = x0-1*config.tScale;
        }
        var y0 = this.getCoordY(config.padding, yPixel, config.data.values[key][keystr][i - 1].y);
        if(i==config.data.values[key][keystr].length){
          var x = x0;
          var y = y0;
        }
        else{
          var ii = config.data.values[key][keystr][i].x;
          var result = this.changeStringToTime(ii, "00:00");
          var resultTime = parseInt(result / 3600000);
          var x = this.getCoordX(config.padding, perwidth, resultTime, config.tScale);
          var y = this.getCoordY(config.padding, yPixel, config.data.values[key][keystr][i].y);
          if(config.data.values[key][keystr][i-1].y==0){
            //r = 2*config.tScale;
            r = r0;
            console.log("y=======================0")
          }
          else{
            r = parseInt(Math.abs(x-x0)/2);
          }

        }

        //this.ctx.arcTo(x0 - config.tScale, y0 + 5 * config.tScale, x - config.tScale, y + 5 * config.tScale, 2 * config.tScale);
        this.ctx.arcTo(x0, y0, x, y,  r);
        this.ctx.save();
      }
      this.ctx.stroke();
      this.ctx.closePath();
      this.ctx.restore();
      //var data = [];
      //for (var i = 0; i < config.data.values[key][keystr].length; i++) {
      //  var ii = config.data.values[key][keystr][i].x;
      //  var result = this.changeStringToTime(ii, "00:00");
      //  var resultTime = parseInt(result / 3600000);
      //  var x = this.getCoordX(config.padding, perwidth, resultTime, config.tScale);
      //  var y = this.getCoordY(config.padding, yPixel, config.data.values[key][keystr][i].y);
      //  data.push({x:x,y:y});
      //}
      //console.log(data);
      //this.createCurve(data,data.length);

    },//绘制数据线和数据点
    createCurve:function (originPoint,originCount,ctx){
      //控制点收缩系数 ，经调试0.6较好，CvPoint是opencv的，可自行定义结构体(x,y)
      var scale = 0.5;
      var midpoints = [];
      this.ctx.beginPath();
      this.ctx.moveTo(originPoint[0].x,originPoint[0].y);
      //生成中点
      for(var i = 0 ;i < originCount ; i++){
        var nexti = (i + 1) % originCount;
        var mid = {};
        mid.x = (originPoint[i].x + originPoint[nexti].x)/2.0;
        mid.y = (originPoint[i].y + originPoint[nexti].y)/2.0;
        midpoints[i] = mid;
      }

      //平移中点
      var extrapoints = [];
      for(var i = 0 ;i < originCount ; i++){
        var nexti = (i + 1) % originCount;
        var backi = (i + originCount - 1) % originCount;
        var midinmid = {};
        midinmid.x = (midpoints[i].x + midpoints[backi].x)/2.0;
        midinmid.y = (midpoints[i].y + midpoints[backi].y)/2.0;
        var offsetx = originPoint[i].x - midinmid.x;
        var offsety = originPoint[i].y - midinmid.y;
        var extraindex = 2 * i;
        var extra = {};
        extra.x = midpoints[backi].x + offsetx;
        extra.y = midpoints[backi].y + offsety;
        extrapoints[extraindex] = extra;
        //朝 originPoint[i]方向收缩
        var addx = (extrapoints[extraindex].x - originPoint[i].x) * scale;
        var addy = (extrapoints[extraindex].y - originPoint[i].y) * scale;
        extrapoints[extraindex].x = originPoint[i].x + addx;
        extrapoints[extraindex].y = originPoint[i].y + addy;

        var extranexti = (extraindex + 1)%(2 * originCount);
        var extrap = {};
        extrap.x = midpoints[i].x + offsetx;
        extrap.y = midpoints[i].y + offsety;
        extrapoints[extranexti] = extrap;
        //朝 originPoint[i]方向收缩
        addx = (extrapoints[extranexti].x - originPoint[i].x) * scale;
        addy = (extrapoints[extranexti].y - originPoint[i].y) * scale;
        extrapoints[extranexti].x = originPoint[i].x + addx;
        extrapoints[extranexti].y = originPoint[i].y + addy;

      }

      var controlPoint = [];
      //生成4控制点，产生贝塞尔曲线
      for(var  i = 0 ;i < originCount-1 ; i++){
        controlPoint[0] = originPoint[i];
        var extraindex = 2 * i;
        controlPoint[1] = extrapoints[extraindex + 1];
        var extranexti = (extraindex + 2) % (2 * originCount);
        controlPoint[2] = extrapoints[extranexti];
        var nexti = (i + 1) % originCount;
        controlPoint[3] = originPoint[nexti];
        var u = 1;
        //while(u >= 0){
        //  var px = bezier3funcX(u,controlPoint);
        //  var py = bezier3funcY(u,controlPoint);
        //  //u的步长决定曲线的疏密
        //  u -= 0.01;
        //  var tempP = {x:px,y:py};
        //  //存入曲线点
        //  //curvePoint.push(tempP);
        //  this.ctx.bezierCurveTo(originPoint[1].x,originPoint[1].y,tempP.x,tempP.y,controlPoint[3].x,controlPoint[3].y);
        //  //this.ctx.bezierCurveTo(controlPoint[1].x,controlPoint[1].y,tempP.x,tempP.y,controlPoint[3].x,controlPoint[3].y);
        //}
        this.ctx.bezierCurveTo(controlPoint[1].x,controlPoint[1].y,controlPoint[2].x,controlPoint[2].y,controlPoint[3].x,controlPoint[3].y);
      }
      this.ctx.stroke();
      this.ctx.beginPath();

      //三次贝塞尔曲线
      function bezier3funcX(uu,controlP){
        var part0 = controlP[0].x * uu * uu * uu;
        var part1 = 3 * controlP[1].x * uu * uu * (1 - uu);
        var part2 = 3 * controlP[2].x * uu * (1 - uu) * (1 - uu);
        var part3 = controlP[3].x * (1 - uu) * (1 - uu) * (1 - uu);
        return part0 + part1 + part2 + part3;
      }
      function bezier3funcY(uu,controlP){
        var part0 = controlP[0].y * uu * uu * uu;
        var part1 = 3 * controlP[1].y * uu * uu * (1 - uu);
        var part2 = 3 * controlP[2].y * uu * (1 - uu) * (1 - uu);
        var part3 = controlP[3].y * (1 - uu) * (1 - uu) * (1 - uu);
        return part0 + part1 + part2 + part3;
      }
    },
    getPixel: function (data, key, width, padding) {
      var count = data.values[key]["value" + key].length;
      return (width - 20 - padding) / (count + (count - 1) * 1.5);
    },//宽度
    getStemPixel: function (data, key, width, padding, tScale,count) {
      //return (width-20-padding)/(count+(count-1)*1.5);
      return (width - 20 * tScale - padding * 2) / count;
    },//宽度
    getCurPixel: function (data, key, width, padding, tScale,count) {
      //return (width-20-padding)/(count+(count-1)*1.5);
      return (width - 20 * tScale - padding * 2) / count;
    },//宽度
    getCoordX: function (padding, perwidth, ptindex, tScale) {//下标从1开始 不是从0开始
      //return 2.5*perwidth*ptindex+padding+10-2*perwidth;
      return perwidth * ptindex + padding + 10 * tScale;
    },//横坐标X 随ptindex 获得
    getCoordY: function (padding, yPixel, value) {
      var y = yPixel * value;
      //return this.can.height-padding-y;
      return this.can.height - padding*4/5 - y;
    },//纵坐标X 随ptindex 获得(注意 纵坐标的算法是倒着的因为原点在最上面)
    getYPixel: function (maxY, height, padding, ymincount) {
      console.log(maxY);
      var ycount = 15;//y轴最大值
      //console.log(ymincount);
      return {pixel: (height - padding) / (ycount - ymincount), ycount: ycount};
    },//y轴的单位长度
    getMax: function (data, key, isMultiData) {
      if (data.values[0].value0.length == 0) {
        maxY = 0;
      }
      else {
        var maxY = data.values[key]["value" + key][0].y;
        var length = data.values[key]["value" + key].length;
        var keystr = "value" + key;
        for (var i = 1; i < length; i++) {
          if (maxY < data.values[key][keystr][i].y) maxY = data.values[key][keystr][i].y;
        }
        for (var i = 0; i < length; i++) {
          if (maxY < data.values[key][keystr][i].min) maxY = data.values[key][keystr][i].min;
        }
      }
      return maxY;//返回最大值 如果不是多数据
    },
    changeStringToTime: function (start, end) {
      var reg = /\:/g;

      var sDate = new Date;
      sDate.setHours(0, 0, 0, 0);
      var s = start.split(reg);
      sDate.setHours(s[0]);
      sDate.setMinutes(s[1]);

      var eDate = new Date;
      eDate.setHours(0, 0, 0, 0);
      var e = end.split(reg);
      eDate.setHours(e[0]);
      eDate.setMinutes(e[1]);

      return sDate - eDate;
    },
    clearCanvas: function () {
      console.log("clear");
      this.ctx.clearRect(0, 0, this.can.width, this.can.height);
      this.ctx.beginPath();
    }
  };

  //拆线图
  var LineChart = {
    keynames: [],//数据信息数组
    can: undefined,
    ctx: undefined,
    width: undefined,
    lineColor: undefined,
    dotColor: undefined,
    isBg: false,
    isMultiData: false,
    setData: function (config) {
      this.lineColor = config.lineColor;
      this.dotColor = config.dotColor;
      this.can = document.getElementById(config.canvasId);
      this.ctx = this.can.getContext("2d");
      this.can.style.width = config.width + "px";
      this.can.style.height = config.height + "px";
      this.can.width = config.width * config.tScale;
      this.can.height = config.height * config.tScale;
      this.isBg = config.isBg;
      this.isMultiData = config.isMultiData;
      this.ctx.save();
      this.ctx.setTransform(1, 0, 0, 1, 0, 0, 0);
      this.ctx.clearRect(0, 0, this.can.width, this.can.height);
      this.drawXY(config, 0, this.can);
      this.ctx.restore();
    },

    isMultiData: function (data) {
      if (data.values.length > 1) {
        this.isMultiData = true;
      }
    },//是否是多条数据线
    drawXY: function (config, key, can) {
      this.ctx.lineWidth = "2";
      this.ctx.strokeStyle = "black";
      this.ctx.fillStyle = "black";//坐标轴坐标颜色
      this.ctx.font = 10 * config.tScale + "px Arial";

      var maxY = this.getMax(config.data, 0, this.isMultiData);//获得Y轴上的最大值
      var minY = this.getMin(config.data, 0, this.isMultiData);//获得Y轴上的最小值
      var perwidth = this.getPixel(config.data, key, can.width, config.padding,config.tScale);//x 轴每一个数据占据的宽度
      console.log(perwidth);
      var XfontWidth = this.getCurPixel(config.data, key, can.width, config.padding, config.tScale,config.count);//y轴坐标宽度
      console.log(XfontWidth);
      var ymincount = 0;
      var ycount = config.maxrate;
      var yPixel = this.getYPixel(maxY, can.height, config.Ypadding * 2, ycount*0.4,ycount).pixel;
      console.log("Y轴最大值：" + ycount + "；Y轴最小值：" + ymincount + "间隔：" + yPixel);
      var space = (ycount - ymincount) / 10;

      for (var i = 0, ptindex; i < config.count; i++) {
        ptindex = i + 1;
        var x_x = this.getCoordX(config.padding, XfontWidth, ptindex, config.tScale);
        var x_y = can.height - config.Ypadding*0.4;

        if(config.count<=5){
          if (i == 0) {
            this.ctx.fillText("0分钟", x_x-perwidth, x_y, XfontWidth * 8);
          }
          else{
            //this.ctx.fillText(i, x_x-perwidth-2*config.tScale, x_y, XfontWidth * 8);
            var xa = this.getCoordX(config.padding,perwidth,i, config.tScale);
            this.ctx.fillText(i, xa-perwidth, x_y, XfontWidth * 8);
          }
        }
        else if(config.count >5 && config.count<= 20){
          if (i == 0) {
            this.ctx.fillText("0分钟", x_x-perwidth, x_y, XfontWidth * 8);
          }
          else if(i%5 == 0){
            //this.ctx.fillText(i, x_x-perwidth-2*config.tScale, x_y, XfontWidth * 8);
            var xa = this.getCoordX(config.padding,perwidth,i, config.tScale);
            this.ctx.fillText(i, xa-perwidth, x_y, XfontWidth * 8);
          }
          else if(i%5 != 0 && (i== config.count-1)){
            //this.ctx.fillText(i, x_x-perwidth, x_y, XfontWidth * 8);
            var xa = this.getCoordX(config.padding,perwidth,i, config.tScale);
            this.ctx.fillText(i, xa-perwidth, x_y, XfontWidth * 8);
          }
        }
        else if(config.count >20){
          if (i == 0) {
            this.ctx.fillText("0分钟", x_x-perwidth, x_y, XfontWidth * 8);
          }
          else if(i%10 == 0){
            var xa = this.getCoordX(config.padding,perwidth,i, config.tScale);
            this.ctx.fillText(i, xa-perwidth, x_y, XfontWidth * 8);
          }
          else if(i%10 != 0 && (i== config.count-1)){
            //this.ctx.fillText(i, x_x-perwidth, x_y, XfontWidth * 8);
            var xa = this.getCoordX(config.padding,perwidth,i, config.tScale);
            this.ctx.fillText(i, xa-perwidth, x_y, XfontWidth * 8);
          }
        }
      }

      //绘制Y轴
      var xspace = 2* config.tScale;
      for (var i = 4; i < 10; i++) {
        this.ctx.textAlign = "right"//y轴文字靠右写
        this.ctx.textBaseline = "middle";//文字的中心线的调整
        //var x_x = this.getCoordX(config.padding, XfontWidth, 1);
        var x_x = this.getCoordX(config.padding,perwidth,0, config.tScale);
        var yy = this.getCoordY(config.padding, yPixel, parseInt(ycount/10*(i-4)),config.tScale);
        //this.ctx.fillText(parseInt(ycount/4*i), config.padding - xspace,
        //  ((ycount - ymincount) / space - i) * space * yPixel,
        //  perwidth * xspace);
        if(i>=6){
          //this.ctx.fillText(parseInt(ycount/10*i), config.padding - xspace, yy, perwidth * xspace);
          this.ctx.fillText(parseInt(ycount/10*i), can.width-20*config.tScale, yy, perwidth * xspace);
          switch(i){
            case 6:
              this.ctx.fillText('燃脂', config.padding+4* config.tScale, yy, XfontWidth * 8);
              break;
            case 7:
              this.ctx.fillText('有氧', config.padding+4* config.tScale, yy, XfontWidth * 8);
              break;
            case 8:
              this.ctx.fillText('无氧', config.padding+4* config.tScale, yy, XfontWidth * 8);
              break;
            case 9:
              this.ctx.fillText('预警', config.padding+4* config.tScale, yy, XfontWidth * 8);
              break;
          }
        }
      }

      if (this.isBg) {
        for (var i = 4; i < 10; i++) {
          var y = ((ycount - ymincount) / space - i) * space * yPixel ;
          var yy = this.getCoordY(config.padding, yPixel, parseInt(ycount/10*(i-4)),config.tScale);
          this.ctx.save();
          this.ctx.lineWidth = "1";
          this.ctx.strokeStyle = "#e6e6e6";
          if(i>=6){
            this.ctx.beginPath();
            //this.ctx.moveTo(x,y+13);
            this.ctx.moveTo(x_x, yy);
            this.ctx.lineTo(can.width-40*config.tScale, yy);
            this.ctx.closePath();
            this.ctx.stroke();
            this.ctx.restore();
          }
          else if(i==4){
            this.ctx.beginPath();
            //this.ctx.moveTo(x,y+13);
            this.ctx.moveTo(config.padding-15*config.tScale, yy);
            this.ctx.lineTo(can.width-15*config.tScale, yy);
            this.ctx.closePath();
            this.ctx.stroke();
            this.ctx.restore();
          }
        }

        //最小值线
        if(minY<ycount/10*6){
         // minY = 20;
          var y6 = ycount/10*6;
          var y4 = ycount/10*4;
          var setY = y4+minY*0.5/y6*(y6-y4);
         // console.log(setY);
          var ymin = this.getCoordY(config.padding, yPixel, setY-parseInt(ycount/10*4),config.tScale);

          this.ctx.save();
          this.ctx.lineWidth = "1";
          this.ctx.strokeStyle = "#e6e6e6";
          this.ctx.beginPath();
          //this.ctx.moveTo(x,y+13);
          this.ctx.moveTo(x_x, ymin);
          this.ctx.lineTo(can.width-40*config.tScale, ymin);
          this.ctx.fillText(minY, can.width-20*config.tScale, ymin, perwidth * xspace);
          this.ctx.closePath();
          this.ctx.stroke();
          this.ctx.restore();
        }
      }//选择绘制背景线

      if (config.data.values[0].value0.length == 0) {
        console.log(config.data);
        return;
      }

      this.drawData(config, 0, perwidth, yPixel, this.isMultiData,y6,y4);
    },//绘制XY坐标 线 以及点

    drawData: function (config, key, perwidth, yPixel, isMultiData,y6,y4) {
      var keystr = "value" + key;
      if (arguments[6]) {
        this.ctx.strokeStyle = config.lineColor;
      } else {
        this.ctx.strokeStyle = this.lineColor;
      }
      this.ctx.lineWidth = 2*config.tScale;
      //this.ctx.strokeStyle=data.lineColor;

      //var gradient = this.ctx.createLinearGradient(50, 0, 0, 240);
      //gradient.addColorStop("0", "#F2821E");
      //gradient.addColorStop("0.5", "#F2D740");
      //gradient.addColorStop("1", "#60C8AF");

      if(config.tScale<2.5){
        var gradient=this.ctx.createLinearGradient(0,0,0,220);
        gradient.addColorStop("0", "#F2821E");
        gradient.addColorStop("0.5", "#F2821E");
        gradient.addColorStop("0.7", "#F8B726");
        gradient.addColorStop("1", "#38BA9B");
        //this.ctx.lineWidth = 4;
      }
      else{
        var gradient=this.ctx.createLinearGradient(0,0,0,330);
        gradient.addColorStop("0", "#F2821E");
        gradient.addColorStop("0.5", "#F2821E");
        gradient.addColorStop("0.7", "#F8B726");
        gradient.addColorStop("1", "#38BA9B");
        //this.ctx.lineWidth = 6;
      }

      // 用渐变进行填充
      this.ctx.strokeStyle = gradient;
      this.ctx.fillStyle=gradient;

      this.ctx.save();
      this.ctx.beginPath();
      for (var i = 0; i < config.data.values[key][keystr].length; i++) {
        if(!i){
          var x = this.getCoordX(config.padding,perwidth,i, config.tScale);
          if(config.data.values[key][keystr][i+1].y<y6){
            var setY = y4+config.data.values[key][keystr][i+1].y*0.5/y6*(y6-y4);
            var y = this.getCoordY(config.padding, yPixel, setY-y4,config.tScale);
          }
          else{
            y = this.getCoordY(config.padding, yPixel, config.data.values[key][keystr][i+1].y-parseInt(config.maxrate/10*4),config.tScale);
          }
        }
        else{
          var x = this.getCoordX(config.padding,perwidth,i, config.tScale);
          if(config.data.values[key][keystr][i].y < y6){
            var setY = y4+config.data.values[key][keystr][i].y*0.5/y6*(y6-y4);
            //var y = this.getCoordY(config.padding, yPixel, setY-y4,config.tScale);
            var y= this.getCoordY(config.padding, yPixel, setY-parseInt(config.maxrate/10*4),config.tScale);
          }
          else{
            var y = this.getCoordY(config.padding, yPixel, config.data.values[key][keystr][i].y-parseInt(config.maxrate/10*4),config.tScale);
          }}
        this.ctx.lineTo(x,y);
      }
      this.ctx.stroke();
      this.ctx.closePath();
      this.ctx.restore();
    },//绘制数据线和数据点
    getPixel: function (data, key, width, padding,tScale) {
      var count = data.values[key]["value" + key].length;
      return (width - 28* tScale - padding * 2) /count;
    },//宽度
    getStemPixel: function (data, key, width, padding, tScale,count) {
      //return (width-20-padding)/(count+(count-1)*1.5);
      return (width - 10 * tScale - padding * 2) / count;
    },//宽度
    getCurPixel: function (data, key, width, padding, tScale,count) {
      //return (width-20-padding)/(count+(count-1)*1.5);
      return (width - 20 * tScale - padding * 2) / count;
    },//宽度
    getCoordX: function (padding, perwidth, ptindex, tScale) {//下标从1开始 不是从0开始
      return perwidth * ptindex + padding+8*tScale;
      //return perwidth*ptindex + padding + 8 * tScale;
    },//横坐标X 随ptindex 获得
    getCoordY: function (padding, yPixel, value,tScale) {
      var y = yPixel * value;
      return this.can.height - y - 15*tScale;
    },//纵坐标X 随ptindex 获得(注意 纵坐标的算法是倒着的因为原点在最上面)
    getYPixel: function (maxY, height, padding, ymincount,ycount) {
      return {pixel: (height - padding) / (ycount - ymincount), ycount: ycount};
    },//y轴的单位长度
    getMax: function (data, key, isMultiData) {
      if (data.values[0].value0.length == 0) {
        maxY = 0;
      }
      else {
        var maxY = data.values[key]["value" + key][0].y;
        var length = data.values[key]["value" + key].length;
        var keystr = "value" + key;
        for (var i = 1; i < length; i++) {
          if (maxY < data.values[key][keystr][i].y) maxY = data.values[key][keystr][i].y;
        }
      }
      return maxY;//返回最大值 如果不是多数据
    },
    getMin: function (data, key, isMultiData) {
      if (data.values[0].value0.length == 0) {
        maxY = 50;
      }
      else {
        var maxY = data.values[key]["value" + key][0].y;
        var length = data.values[key]["value" + key].length;
        var keystr = "value" + key;
        for (var i = 1; i < length; i++) {
          if (maxY > data.values[key][keystr][i].y) maxY = data.values[key][keystr][i].y;
        }
      }
      return maxY;//返回最大值 如果不是多数据
    },
    changeStringToTime: function (start, end) {
      var reg = /\:/g;

      var sDate = new Date;
      sDate.setHours(0, 0, 0, 0);
      var s = start.split(reg);
      sDate.setHours(s[0]);
      sDate.setMinutes(s[1]);

      var eDate = new Date;
      eDate.setHours(0, 0, 0, 0);
      var e = end.split(reg);
      eDate.setHours(e[0]);
      eDate.setMinutes(e[1]);

      return sDate - eDate;
    },
    clearCanvas: function () {
      console.log("clear");
      this.ctx.clearRect(0, 0, this.can.width, this.can.height);
      this.ctx.beginPath();
    }
  };

  var LineChart0={
    keynames:[],//数据信息数组
    can:undefined,
    ctx:undefined,
    width:undefined,
    lineColor:undefined,
    dotColor:undefined,
    isBg:false,
    isMultiData:false,
    setData:function(config,canId,data,padding,lineColor,dotColor,isBg,isMultiData){
      this.lineColor = lineColor;
      this.dotColor = dotColor;
      this.can = document.getElementById(canId);
      this.ctx = this.can.getContext("2d");
      this.isBg = isBg;
      this.isMultiData = isMultiData;
      this.drawXY(data,0,padding,this.can);

    },
    isMultiData:function(data){
      if(data.values.length>1){
        this.isMultiData = true;
      }
    },//是否是多条数据线

    drawXY:function(data,key,padding,can){
      this.ctx.lineWidth="4";
      this.ctx.strokeStyle="black";
      this.ctx.font = '15px sans-serif';
      var perwidth = this.getPixel(data,key,can.width,padding);//x 轴每一个数据占据的宽度
      var maxY =  this.getMax(data,0,this.isMultiData);//获得Y轴上的最大值
      var yPixel = this.getYPixel(maxY,can.height,padding).pixel;
      var ycount = this.getYPixel(maxY,can.height,padding).ycount;
      for( var i=0,ptindex;i< data.values[key]["value"+key].length;i++ ){
        ptindex = i+1;
        var x_x = this.getCoordX(padding,perwidth,ptindex);
        var x_y = can.height-padding+20;
        this.ctx.fillText(data.values[key]["value"+key][i].x,x_x,x_y,perwidth);
      }
      this.ctx.textAlign = "right"//y轴文字靠右写
      this.ctx.textBaseline = "middle";//文字的中心线的调整
      for(var i=0;i< ycount/50;i++){
        this.ctx.fillText(i*50,padding-10,(ycount/50-i)*50*yPixel,perwidth);
      }
      if(this.isBg){
        var x =  padding;
        this.ctx.lineWidth="1";
        this.ctx.strokeStyle="#e8e8e8";
        for( var i=0;i< ycount/50;i++ ){
          var y = (ycount/50-i)*50*yPixel;
          this.ctx.moveTo(x,y);
          this.ctx.lineTo(can.width,y);
          this.ctx.stroke();
        }
      }//选择绘制背景线
      this.ctx.closePath();
      this.drawData(data,0,padding,perwidth,yPixel,this.isMultiData);
    },//绘制XY坐标 线 以及点

    drawData:function(data,key,padding,perwidth,yPixel,isMultiData,lineColor){
      if(!isMultiData){
        var keystr = "value"+key;
        this.ctx.beginPath();
        this.ctx.lineWidth="2";
        if(arguments[6]){
          this.ctx.strokeStyle=lineColor;
        }else{
          this.ctx.strokeStyle=this.lineColor;
        }
        var startX = this.getCoordX(padding,perwidth,0);
        var startY = this.getCoordY(padding,yPixel,data.values[key][keystr][0].y);
        this.ctx.beginPath();
        this.ctx.lineWidth="2";
        for( var i=0;i< data.values[key][keystr].length;i++ ){
          var x = this.getCoordX(padding,perwidth,i+1);
          var y = this.getCoordY(padding,yPixel,data.values[key][keystr][i].y);
          this.ctx.lineTo(x,y);
        }
        this.ctx.stroke();
        this.ctx.closePath();
        /*下面绘制数据线上的点*/
        this.ctx.beginPath();
        this.ctx.fillStyle=this.dotColor;
        for( var i=0;i< data.values[key][keystr].length;i++ ){
          var x = this.getCoordX(padding,perwidth,i+1);
          var y = this.getCoordY(padding,yPixel,data.values[key][keystr][i].y);
          this.ctx.moveTo(x,y);
          this.ctx.arc(x,y,3,0,Math.PI*2,true);//绘制数据线上的点
          this.ctx.fill();
        }
        this.ctx.closePath();
      }else{//如果是多条数据线
        for( var i=0;i< data.values.length;i++ ){
          var color = "#ff0000";
          LineChart.drawData(data,i,padding,perwidth,yPixel,false,color);
          LineChart.drawKey(color,this.keynames[i],padding,i);
        }
      }
    },//绘制数据线和数据点
    getPixel:function(data,key,width,padding){
      var count = data.values[key]["value"+key].length;
      return (width-20-padding)/(count+(count-1)*1.5);
    },//宽度
    getCoordX:function(padding,perwidth,ptindex){//下标从1开始 不是从0开始
      return 2.5*perwidth*ptindex+padding+10-2*perwidth;
    },//横坐标X 随ptindex 获得
    getCoordY:function(padding,yPixel,value){
      var y = yPixel*value;
      return this.can.height-padding-y;
    },//纵坐标X 随ptindex 获得(注意 纵坐标的算法是倒着的因为原点在最上面)
    getYPixel:function(maxY,height,padding){
      var ycount = (parseInt(maxY/10)+1)*10+10;//y轴最大值
      return {pixel:(height-padding)/ycount,ycount:ycount};
    },//y轴的单位长度

    getMax:function(data,key,isMultiData){
      if(!isMultiData){
        var maxY = data.values[key]["value"+key][0].y;
        var length = data.values[key]["value"+key].length;
        var keystr = "value"+key;
        for( var i=1;i< length;i++ ){
          if(maxY< data.values[key][keystr][i].y) maxY=data.values[key][keystr][i].y;
        }
        return maxY;//返回最大值 如果不是多数据
      }else{
        var maxarr=[];
        var count = data.values.length;//多条数据的数据长度
        for(var i=0;i< count;i++){
          maxarr.push(LineChart.getMax(data,i,false));
        }
        var maxvalue = maxarr[0];
        for(var i=1;i< maxarr.length;i++){
          maxvalue = (maxvalue< maxarr[i])?maxarr[i]:maxvalue;
        }
        return maxvalue;
      }//如果是多数据
    },

    setKey:function(keynames){//keynames 是数组
      for(var i=0;i< keynames.length;i++){
        this.keynames.push(keynames[i]);//存入数组中
      }
    },

    drawKey:function(color,keyname,padding,lineindex){
      var x = padding+10;
      var y = this.can.height - padding+20+13*(lineindex+1);
      this.ctx.beginPath();
      this.ctx.strokeStyle = color;
      this.ctx.font="10px";
      this.ctx.moveTo(x,y);
      this.ctx.lineTo(x+50,y);
      this.ctx.fillText(":"+keyname,x+80,y,30);
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }

})(jQuery)
