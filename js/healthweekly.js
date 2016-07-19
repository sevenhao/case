/**
 * Created by qhao on 2016/6/29.
 */
$(function(){
  var weekStartTime = '';
  var weekEndTime = '';
  var myWeeklyInfo = {};

  generateUI();

  //获取周时间
  function getWeekTime(){
    weekStartTime = '06.20';
    weekEndTime = '06.26';
  }

  //获取周报数据
  function initData(){
    getWeekTime();
    myWeeklyInfo = {
      user: {
        time: weekStartTime + "-" + weekEndTime,
        portrait:'./images/healthweekly/drawable-xhdpi/icon_match@2x.png',
        nickname:'我是小逸小逸小逸'
      },
      stepInfo:{
        steps:72118,//本周步数
        most:19362,//本周最高步数
        most_time:'周六',//本周最高步数时间
        meleage:39.2,//总距离
        calorie:3289,//累积消耗
        lastweek:66505//上周步数
      },
      running:{
        meleage:15.6,//本周跑步里程
        times:3,//本周次数
        totalTime:150,//累积时长
        burningTime:108,//燃脂心率时长
        lastweek:13.3//上周跑步里程
      },
      sleep:{
        average:435,//本周平均睡眠时长
        averageEvaluate:85,//平均睡眠评分
        lowest:73,//最低评分
        lowest_Time:'周二',//最低评分时间
        highest:94,//最高评分
        highest_Time:'周六',//最高评分时间
        sleepTime:"23:16",//平均入睡时间
        getUpTime:"07:15",//平均起床时间
        deepSleep:75,//平均深睡眠时长
        lastweek:448//上周平均睡眠时长
      },
      runningTips:"持之以恒的运动可以使人体长运不衰，提高免疫功能，减少被各种疾病困扰的几率。",
      sleepTips:"有规律的进行体育锻炼可以促进睡眠，帮你更快的入睡并且睡个好觉，但是不要在靠近休息时间去锻炼。"
    };
  }

  function generateTitle(){
    $("#healthweekly-mine-portrait").html('<img class="healthweekly-mine-portrait" src="'
    + myWeeklyInfo.user.portrait +'">');//添加头像

    var myInfoHtml = '<div class="healthweekly-mine-info-nickname">' + myWeeklyInfo.user.nickname + '</div> ' +
      '<div class="healthweekly-mine-info-time">' + myWeeklyInfo.user.time + '</div>';
    $("#healthweekly-mine-info").html(myInfoHtml);//添加昵称和时间
  }

  function generateMedal(){
    var mymedal = '<li>' +
      '<div class="healthweekly-mine-medal ' +
      (myWeeklyInfo.stepInfo.steps >= 6000 ? "healthweekly-medal-step-active":"healthweekly-medal-step") +'">' +
      '</div> ' +
      '<div>步数≥60000步</div> ' +
      '</li> ' +
      '<li>' +
      '<div class="healthweekly-mine-medal ' +
      (myWeeklyInfo.running.meleage >= 20 ? "healthweekly-medal-running-active" : "healthweekly-medal-running") + '">' +
      '</div> ' +
      '<div>跑步≥20公里</div> ' +
      '</li> ' +
      '<li> ' +
      '<div class="healthweekly-mine-medal ' +
      (myWeeklyInfo.sleep.averageEvaluate >= 85 ? "healthweekly-medal-sleep-active" :  "healthweekly-medal-sleep")+ '">' +
      '</div>' +
      '<div>平均睡眠评分≥85</div>' +
      '</li>';
    $("#healthweekly-mine-medal").html(mymedal);
  }

  function generateSteps(){
    $("#healthweekly-mine-steps").text(myWeeklyInfo.stepInfo.steps);

    var myStepsCompared = '比上周 ' +
      '<i class="healthweekly-mine-steps-icon ' +
      ( (myWeeklyInfo.stepInfo.steps - myWeeklyInfo.stepInfo.lastweek >0) ?
        "healthweekly-mine-steps-up" :"healthweekly-mine-steps-down") + '"> ' +
      '</i> ' +
      '<div class="healthweekly-mine-steps-thisweek-stepnum">'+
      Math.abs(myWeeklyInfo.stepInfo.steps - myWeeklyInfo.stepInfo.lastweek)+
      '<div class="healthweekly-_unit">步</div> ' +
      '</div>';
    $("#healthweekly-mine-steps-compared").html(myStepsCompared);//步数比上周多或少

    $("#myWeeklyInfo-stepInfo-most").html(myWeeklyInfo.stepInfo.most +
    '<span class="healthweekly-mine-steps-detail-time">'
    + myWeeklyInfo.stepInfo.most_time
    + '</span>');

    $("#myWeeklyInfo-stepInfo-meleage").html(myWeeklyInfo.stepInfo.meleage
    + '<div class="healthweekly-_unit_10">公里</div>');

    $("#myWeeklyInfo-stepInfo-calorie").html(myWeeklyInfo.stepInfo.calorie
    + '<div class="healthweekly-_unit_10">大卡</div>');
  }

  function generateRunning(){
    $("#myWeeklyInfo-running-meleage").text(myWeeklyInfo.running.meleage);

    var myRunningCompared = '比上周 ' +
      '<i class="healthweekly-mine-steps-icon ' +
      ((myWeeklyInfo.running.meleage - myWeeklyInfo.running.lastweek >0) ?
        "healthweekly-mine-runing-up" :"healthweekly-mine-runing-down") + '">' +
      '</i>' +
      '<div class="healthweekly-mine-steps-thisweek-stepnum healthweekly-mine-running-color">'+
      Math.abs((myWeeklyInfo.running.meleage - myWeeklyInfo.running.lastweek).toFixed(1)) +
      '<div class="healthweekly-_unit">公里</div> ' +
      '</div>';
    $("#healthweekly-mine-running-compared").html(myRunningCompared);

    $("#myWeeklyInfo-running-times").html(myWeeklyInfo.running.times + '<div class="healthweekly-_unit_10">次</div>');

    var myRunningtotalTime = (parseInt(myWeeklyInfo.running.totalTime/60)?
      (parseInt(myWeeklyInfo.running.totalTime/60)
      + '<div class="healthweekly-_unit_10">小时</div>') :'') +
      ((myWeeklyInfo.running.totalTime%60)?(myWeeklyInfo.running.totalTime%60 +
      '<div class="healthweekly-_unit_10">分</div>'):'');
    $("#myWeeklyInfo-running-totalTime").html(myRunningtotalTime);

    var myRunningBurningTime = (parseInt(myWeeklyInfo.running.burningTime/60)?
        (parseInt(myWeeklyInfo.running.burningTime/60)
        + '<div class="healthweekly-_unit_10">小时</div>') :'') +
      ((myWeeklyInfo.running.burningTime%60)?(myWeeklyInfo.running.burningTime%60 +
      '<div class="healthweekly-_unit_10">分</div>'):'');
    $("#myWeeklyInfo-running-burningTime").html(myRunningBurningTime);

    $("#myWeeklyInfo-runningTips").text(myWeeklyInfo.runningTips);
  };

  function generateSleep(){
    var sleepAverage = '平均睡眠时长' +
      '<div class="healthweekly-mine-steps-thisweek-stepnum healthweekly-mine-sleep-color">' +
      ((myWeeklyInfo.sleep.average/60)?('<div class="healthweekly-mine-sleep-num">' +
      parseInt(myWeeklyInfo.sleep.average/60) +
      '<div class="healthweekly-_unit_10 healthweekly-mine-sleep-text-color">小时</div>'):'')+
      ((myWeeklyInfo.sleep.average%60)?('<div class="healthweekly-mine-sleep-num">' +
      myWeeklyInfo.sleep.average%60 +
      '<div class="healthweekly-_unit_10 healthweekly-mine-sleep-text-color">分</div>'):'') +
      '</div>';
    $("#myWeeklyInfo-sleep-average").html(sleepAverage);

    var sleepCompared = '比上周 ' +
      '<i class="healthweekly-mine-steps-icon ' +
      ((myWeeklyInfo.sleep.average - myWeeklyInfo.sleep.lastweek >0) ?
        "healthweekly-mine-sleep-up" :"healthweekly-mine-sleep-down") + '"> ' +
      '</i> ' +
      (parseInt((myWeeklyInfo.sleep.average - myWeeklyInfo.sleep.lastweek)/60)?(
      '<div class="healthweekly-mine-steps-thisweek-stepnum healthweekly-mine-sleep-color">' +
      parseInt(Math.abs(myWeeklyInfo.sleep.average - myWeeklyInfo.sleep.lastweek)/60) +
      '<div class="healthweekly-_unit healthweekly-mine-sleep-text-color">小时</div> ' +
      '</div>'):'') +
      (Math.abs(myWeeklyInfo.sleep.average - myWeeklyInfo.sleep.lastweek)%60 ? ('<div class="healthweekly-mine-steps-thisweek-stepnum healthweekly-mine-sleep-color">' +
      Math.abs(myWeeklyInfo.sleep.average - myWeeklyInfo.sleep.lastweek)%60 +
      '<div class="healthweekly-_unit healthweekly-mine-sleep-text-color">分</div> ' +
      '</div>'):'');
    $("#healthweekly-sleep-compared").html(sleepCompared);

    $("#myWeeklyInfo-sleep-averageEvaluate").text(myWeeklyInfo.sleep.averageEvaluate);
    $("#myWeeklyInfo-sleep-lowest").html(myWeeklyInfo.sleep.lowest
    +'<span class="healthweekly-mine-steps-detail-time">'
    +myWeeklyInfo.sleep.lowest_Time+'</span>');
    $("#myWeeklyInfo-sleep-highest").html(myWeeklyInfo.sleep.highest +
    '<span class="healthweekly-mine-steps-detail-time">'+
    myWeeklyInfo.sleep.highest_Time+'</span>');
    $('#myWeeklyInfo-sleep-sleepTime').text(myWeeklyInfo.sleep.sleepTime);
    $("#myWeeklyInfo-sleep-getUpTime").text(myWeeklyInfo.sleep.getUpTime);

    var deepSleepTime = (parseInt(myWeeklyInfo.sleep.deepSleep/60)?(parseInt(myWeeklyInfo.sleep.deepSleep/60) +
    '<div class="healthweekly-_unit_10 healthweekly-mine-sleep-text-color">小时</div>'):'') +
      (myWeeklyInfo.sleep.deepSleep%60 ? (myWeeklyInfo.sleep.deepSleep%60 +
      '<div class="healthweekly-_unit_10 healthweekly-mine-sleep-text-color">分</div>'):'');
    $("#myWeeklyInfo-sleep-deepSleep").html(deepSleepTime);

    $("#myWeeklyInfo-sleepTips").text(myWeeklyInfo.sleepTips);

  }

  function generateUI(){
    initData();

    generateTitle();

    generateMedal();

    generateSteps();

    generateRunning();

    generateSleep();
  }


});
