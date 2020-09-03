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
 
  var questionCount = getQuestionCount(surveyIndex);
  var segmentSize = Math.PI * 2 / questionCount;

  for (var questionIndex = 0; questionIndex < questionCount; questionIndex++)
  {
    var questionPosition = randomInSegment(centerX, centerY, segmentSize * questionIndex, segmentSize * (questionIndex + 1), radius * 2.5, radius * 3.5);
    var questionX = questionPosition.x;
    var questionY = questionPosition.y;

    var questionRadius = radius / 2;
    
    drawLine(context, questionX, questionY, questionRadius, centerX, centerY, radius);

    if (getQuestionType(surveyIndex, questionIndex) == "button")
    {
      var answerCount = getAnswerCount(surveyIndex, questionIndex);
      var answerSegmentSize = Math.PI * 2 / answerCount

      for (var answerIndex = 0; answerIndex < answerCount; answerIndex++)
      {
        var answerPosition = randomInSegment(questionX, questionY, answerSegmentSize * answerIndex, answerSegmentSize * (answerIndex + 1), radius, radius * 1.5);
        var answerX = answerPosition.x;
        var answerY = answerPosition.y;
        var answerRadius = radius / 4 + (getAnswerResponses(surveyIndex, questionIndex, answerIndex) * radius / 15);
        answerRadius = answerRadius > radius / 2 ? radius / 2 : answerRadius;
        
        drawLine(context, questionX, questionY, questionRadius, answerX, answerY, answerRadius);
      
        drawBubble(context, answerRadius, getAnswerName(surveyIndex, questionIndex, answerIndex), answerX, answerY, "aquamarine");
      }
    }
    else if (getQuestionType(surveyIndex, questionIndex) == "input")
    {
      var answerCount = getTextAnswerCount(surveyIndex, questionIndex);
      var answerSegmentSize = Math.PI * 2 / answerCount

      for (var textAnswerIndex = 0; textAnswerIndex < answerCount; textAnswerIndex++)
      {
        var answerPosition = randomInSegment(questionX, questionY, answerSegmentSize * textAnswerIndex, answerSegmentSize * (textAnswerIndex + 1), radius, radius * 1.5);
        var answerX = answerPosition.x;
        var answerY = answerPosition.y;
        var answerRadius = radius / 4;
        
        drawLine(context, questionX, questionY, questionRadius, answerX, answerY, answerRadius);

        drawBubble(context, answerRadius, getTextAnswer(surveyIndex, questionIndex, textAnswerIndex), answerX, answerY, "springgreen");
      }
    }
    
    drawBubble(context, questionRadius, getQuestionName(surveyIndex, questionIndex), questionX, questionY, "coral");
  }
  
  drawBubble(context, radius, getSurveyName(surveyIndex), centerX, centerY, "gold");
}

function randomInSegment(x, y, startAngle, endAngle, minRadius, maxRadius)
{
  var position = {};

  var randomAngle = Math.random() * (endAngle - startAngle) + startAngle;
  var randomRadius = Math.random() * (maxRadius - minRadius) + minRadius;

  position.x = x + randomRadius * Math.cos(randomAngle);
  position.y = y + randomRadius * Math.sin(randomAngle);

  return position;
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
  
  context.font = (radius / 3).toString() + "px arialRounded";
  context.fillStyle = "black";
  context.textAlign = "center"; 

  wrapText(context, text, x, y, radius * 2, radius / 3);
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

    context.fillText(lines[lineIndex], x, lineY);
  }
}