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

  var centerX = canvas.width / 2;
  var centerY = canvas.height / 2;

  var radius = 70;

  context.beginPath();
  context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
  context.fillStyle = 'green';
  context.fill();
  context.lineWidth = 5;
  context.strokeStyle = '#003300';
  context.stroke();
  
  context.font = "30px arialRounded";
  context.fillText(getSurveyName(surveyIndex), centerX, centerY); 
}