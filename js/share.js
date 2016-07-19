/**
 * Created by qhao on 2016/3/28.
 */
$(function(){
  var circleRadius = 150;//圆环大小

  var steps=true;
  var sleep=true;
  var running=true;
  var status=true;

  initData(steps,sleep,status,running);
  function initData(steps,sleep,status,running){
    if(steps){
      //计步数据
      var todayStepData = {
        title:"步数",
        desStepNum:10000,//目标步数
        curStepNum:7896,//当前步数
        mileage:6.4,
        icon:'./images/drawable-xhdpi/steps.png',
        unit:'公里',
        circleUnit:'步',
        circleUnit1:'',
        rightTitle:'里程',
        tips:'可添适当运动量，下班去跑步吧！',
        fontColor:'stepColor'
      };
      drawCircle('steps',todayStepData,'step-canvas','#38BA9B','#38BA9B');
    }
    if(sleep){
      var todaySleepData = {
        title:"睡眠",
        desStepNum:480,//目标步数
        curStepNum:375,//当前步数
        mileage:83,
        icon:'./images/drawable-xhdpi/sleep.png',
        unit:'',
        circleUnit:'小时',
        circleUnit1:'分钟',
        rightTitle:'评分',
        tips:'充足的睡眠有助于提高工作效率！',
        fontColor:'sleepColor'
      };

      drawCircle('sleep',todaySleepData,'sleep-canvas','#00A1D9','#00A1D9');
    }
    if(running){
      var todayRunningData = {
        title:"跑步",
        desStepNum:20,
        curStepNum:5.7,
        mileage:6 +"'"+15+'"',
        icon:'./images/drawable-xhdpi/run.png',
        unit:'',
        circleUnit:'公里',
        circleUnit1:'',
        rightTitle:'配速',
        tips:'生命在于运动，继续加油吧！',
        fontColor:'runningColor'
      };
      drawCircle('running',todayRunningData,'running-canvas','#7FCc33','#7FCc33');
    }
    if(status){
      var todayStatusData = {
        title:"状态",
        desStepNum:100,
        curStepNum:78,
        mileage:"活跃",
        icon:'./images/drawable-xhdpi/state.png',
        unit:'',
        circleUnit:'',
        circleUnit1:'',
        rightTitle:'等级',
        tips:'了解自己的状态，合理安排工作',
        fontColor:'statusColorActive'
      };

      drawCircle('status',todayStatusData,'status-canvas','#60C8AF','#F8B726');
    }
  }

  function drawCircle(title,Data,canvasId,color1,color2){
    var shareContentHTML = '<div class="share-circle-wrap">' +
      '<ul> ' +
      '<li class="share-data-icon"> ' +
      '<img src="' + Data.icon + '"> ' +
      '<div class="share-data-icon-title">' + Data.title +'</div> ' +
      '</li> ' +
      '<li class="share-data-circle"> ' +
      '<div class="share-data-canvas" id="'+ canvasId + '"> ';

      if(title == 'sleep'){
        shareContentHTML += '<div class="share-circle-data">'+ parseInt(Data.curStepNum/60) +
        '<div class="unit_circle">' + Data.circleUnit +'</div>' + Data.curStepNum%60 +
        '<div class="unit_circle">' + Data.circleUnit1 +'</div>'+
        '</div> ' +
        '</div> ';
      }
      else{
        shareContentHTML += '<div class="share-circle-data">'+ Data.curStepNum +
        '<div class="unit_circle">' + Data.circleUnit +'</div>' +
        '</div> ' +
        '</div> ';
      }

    shareContentHTML +='</li> ' +
      '<li class="share-data-detail"> ' +
      '<div class="share-data-detail-steps ' + Data.fontColor + '">' + Data.mileage + '<span class="share-unit">' +Data.unit+'</span></div> ' +
      '<div class="share-data-detail-label">'+Data.rightTitle+'</div> ' +
      '</li> ' +
      '</ul> ' +
      '<div class="clear share-tips"> ' +
      '<span>Tips:'+Data.tips +'</span> ' +
      '</div> ' +
      '</div>';

    $(".share-content-wrap").append(shareContentHTML);

    $('#'+canvasId).circleProgress({
      startAngle:-Math.PI / 2 * 1,
      value: Data.curStepNum/Data.desStepNum,
      size: circleRadius,
      thickness: 4,
      lineCap:'round',
      emptyFill:'rgba(0, 0, 0, .1)',
      fill: { gradient: [color1,color2] }
    }).on('circle-animation-progress', function(event, progress) {
    });
  }


  $('#knowMore').click(function(){
    console.log("了解更多");
  })
});
