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

  context.strokeStyle = "black";
  context.lineWidth = 2;

  var radius = (width < height ? width : height) / 4;
 
  for (var questionIndex = 0; questionIndex < getQuestionCount(surveyIndex); questionIndex++)
  {
    var questionX = Math.random() * width / 2 + width / 4;
    var questionY = Math.random() * height / 2 + height / 4;
    var questionRadius = radius / 2;
    
    drawLine(context, questionX, questionY, questionRadius, centerX, centerY, radius);

    if (getQuestionType(surveyIndex, questionIndex) == "button")
    {
      for (var answerIndex = 0; answerIndex < getAnswerCount(surveyIndex, questionIndex); answerIndex++)
      {
        var answerX = questionX + Math.random() * radius * 2 - radius;
        var answerY = questionY + Math.random() * radius * 2 - radius;
        var answerRadius = radius / 4 + getAnswerResponses(surveyIndex, questionIndex, answerIndex) * radius / 10;
        
        drawLine(context, questionX, questionY, questionRadius, answerX, answerY, answerRadius);
      
        drawBubble(context, answerRadius, getAnswerName(surveyIndex, questionIndex, answerIndex), answerX, answerY, "lightcoral");
      }
    }
    else if (getQuestionType(surveyIndex, questionIndex) == "input")
    {
      for (var textAnswerIndex = 0; textAnswerIndex < getTextAnswerCount(surveyIndex, questionIndex); textAnswerIndex++)
      {
        var answerX = questionX + Math.random() * radius * 2 - radius;
        var answerY = questionY + Math.random() * radius * 2 - radius;
        var answerRadius = radius / 4;
        
        drawLine(context, questionX, questionY, questionRadius, answerX, answerY, answerRadius);

        drawBubble(context, answerRadius, getTextAnswer(surveyIndex, questionIndex, textAnswerIndex), answerX, answerY, "lightcoral");
      }
    }
    
    drawBubble(context, questionRadius, getQuestionName(surveyIndex, questionIndex), questionX, questionY, "coral");
  }
  
  drawBubble(context, radius / 2, getSurveyName(surveyIndex), centerX, centerY, "yellow");
}

function drawLine(context, x1, y1, r1, x2, y2, r2)
{
  var vx = x2 - x1;
  var vy = y2 - y1;
  var length = Math.sqrt(vx * vx + vy * vy);

  vx /= length;
  vy /= length;

  var ax = x1 + vx * r1;
  var ay = y1 + vy * r1;

  var bx = x2 - vx * r2;
  var by = y2 - vy * r2;

  context.beginPath();
  context.moveTo(ax, ay);
  context.lineTo(bx, by);
  context.stroke(); 
}

function drawBubble(context, radius, text, x, y, colour)
{
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI, false);
  context.fillStyle = colour;
  context.fill();
  
  context.font = (radius / 2).toString() + "px arialRounded";
  context.fillStyle = "black";
  context.textAlign = "center"; 
  context.textBaseline = "middle";

  wrapText(context, text, x, y, radius * 1.5, radius / 2);
}

function wrapText(context, text, x, y, maxWidth, lineSpacing) 
{
  var words = text.split(' ');
  var lines = [];
  var line = '';

  for (var n = 0; n < words.length; n++) 
  {
    var testLine = line + words[n] + ' ';
    var metrics = context.measureText(testLine);
    var testWidth = metrics.width;

    if (testWidth > maxWidth && n > 0) 
    {
      lines.push(line);
      line = words[n] + ' ';
    }
    else 
    {
      line = testLine;
    }
  }
  
  lines.push(line);
  
  var lineCount = lines.length;

  for (var lineIndex = 0; lineIndex < lineCount; lineIndex++)
  {
    var lineY = y - (lineSpacing * lineCount) / 2 + lineSpacing * lineIndex;

    context.fillText(lines[line], x, lineY);
  }
}