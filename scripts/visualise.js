function initSurvey(surveyIndex)
{
  //viewSurveyResults(surveyIndex);
  visualiseSurveyResults(surveyIndex);
}

function initNoSurvey()
{
  displaySurveys();
}

function visualiseSurveyResults(surveyIndex)
{
  var canvas = document.getElementById("resultsCanvas");

  canvas.style.visibility = "visible";
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  var context = canvas.getContext('2d');

  var width = canvas.width;
  var height = canvas.height;
  var centerX = canvas.width / 2;
  var centerY = canvas.height / 2;

  var radius = (width < height ? width : height) / 4;

  context.beginPath();
  context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
  context.fillStyle = 'yellow';
  context.fill();
  context.lineWidth = 5;
  context.strokeStyle = '#003300';
  context.stroke();
  
  context.font = (radius / 2).toString() + "px arialRounded";
  context.fillStyle = 'black';
  context.textAlign = "center"; 
  context.fillText(getSurveyName(surveyIndex), centerX, centerY); 
}