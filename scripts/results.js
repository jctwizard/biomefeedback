function initSurvey(surveyIndex)
{
  viewSurveyResults(surveyIndex);
}

function initNoSurvey()
{
  alert("the given survey could not be found");
}

function viewSurveyResults(surveyIndex)
{
  var editorPanel = document.getElementById("editorPanel");
  editorPanel.innerHTML = "";
  
  var questionPanel = makeElement(editorPanel, "div", "", "questionPanel", "")

  var surveyHeader = makeElement(questionPanel, "div", getSurveyName(surveyIndex), "surveyResultsHeader", surveyIndex.toString());
  var surveyDate = makeElement(questionPanel, "div", getSurvey(surveyIndex).date, "surveyResultsDate", surveyIndex.toString());
  var surveyLocation = makeElement(questionPanel, "div", getSurvey(surveyIndex).location, "surveyResultsLocation", surveyIndex.toString());
  
  for (var questionIndex = 0; questionIndex < getQuestionCount(surveyIndex); questionIndex++)
  {
    var questionRow = makeElement(questionPanel, "div", "", "questionRow", questionIndex.toString());

    var questionTitle = makeElement(questionRow, "div", getQuestionName(surveyIndex, questionIndex), "questionResultsTitle", questionIndex.toString());

    makeElement(questionPanel, "hr", "", "break", "");

    var answerPanel = makeElement(questionRow, "div", "", "answerPanel", questionIndex.toString())

    if (getQuestionType(surveyIndex, questionIndex) == "button" || getQuestionType(surveyIndex, questionIndex) == "image")
    {
      for (var answerIndex = 0; answerIndex < getAnswerCount(surveyIndex, questionIndex); answerIndex++)
      {
        var answerRow = makeElement(answerPanel, "div", "", "answerRow", answerIndex.toString());

        var answerTitle = makeElement(answerRow, "span", getAnswerName(surveyIndex, questionIndex, answerIndex), "answerResultsTitle", answerIndex.toString());

        var answerResponses = makeElement(answerRow, "span", getAnswerResponses(surveyIndex, questionIndex, answerIndex), "answerResultsResponses", answerIndex.toString());
      }
    }
    else if (getQuestionType(surveyIndex, questionIndex) == "input")
    {
      var textAnswers = getTextAnswers(surveyIndex, questionIndex);

      for (var textAnswerIndex = 0; textAnswerIndex < getTextAnswerCount(surveyIndex, questionIndex); textAnswerIndex++)
      {
        var textAnswerRow = makeElement(answerPanel, "div", "", "answerRow", textAnswerIndex.toString());

        var textAnswerTitle = makeElement(textAnswerRow, "div", getTextAnswer(surveyIndex, questionIndex, textAnswerIndex), "textAnswerResultsTitle", textAnswerIndex.toString());
      }
    }
  }

  makeElement(questionPanel, "span", "Total Responses", "totalResultsResponsesHeader", "");
  var totalResponses = makeElement(questionPanel, "span", getTotalResponses(surveyIndex), "totalResultsResponses", questionIndex.toString());

  makeElement(questionPanel, "hr", "", "break", "");

  var exportLink = makeElement(questionPanel, "a", "export", "exportLink", surveyIndex.toString());
  var blob = new Blob(["\ufeff", constructCsv(surveyIndex)]);
  var url = URL.createObjectURL(blob);
  exportLink.href = url;
  exportLink.download = "results.csv";
}

function constructCsv(surveyIndex)
{
    var str = "";

    str += "Survey Name," + getSurveyName(surveyIndex) + "\n";

    str += "Survey Data," + getSurvey(surveyIndex).date + "\n";

    str += "Survey Location," + getSurvey(surveyIndex).location + "\n";

    str += "\n";

    str += "Question,Answer,Responses\n";

    for (var questionIndex = 0; questionIndex < getQuestionCount(surveyIndex); questionIndex++)
    {
        if (getQuestionType(surveyIndex, questionIndex) == "button" || getQuestionType(surveyIndex, questionIndex) == "image")
        {
          for (var answerIndex = 0; answerIndex < getAnswerCount(surveyIndex, questionIndex); answerIndex++)
          {
            var line = "";

            if (answerIndex == 0)
            {
              line += '"' + getQuestionName(surveyIndex, questionIndex) + '",';
            }
            else
            {
              line += ",";
            }

            line += '"' + getAnswerName(surveyIndex, questionIndex, answerIndex) + '",' + getAnswerResponses(surveyIndex, questionIndex, answerIndex);

            str += line + "\n";
          }
        }
        else if (getQuestionType(surveyIndex, questionIndex) == "input")
        {
          for (var textAnswerIndex = 0; textAnswerIndex < getTextAnswerCount(surveyIndex, questionIndex); textAnswerIndex++)
          {
            var line = "";

            if (textAnswerIndex == 0)
            {
              line += '"' + getQuestionName(surveyIndex, questionIndex) + '",';
            }
            else
            {
              line += ",";
            }

            line += '"' + getTextAnswer(surveyIndex, questionIndex, textAnswerIndex) + '"';

            str += line + "\n";
          }
        }
    }

    str += "\nTotal Responses," + getTotalResponses(surveyIndex) + "\n";

    return str;
}