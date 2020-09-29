function initSurvey(surveyIndex)
{
  editSurvey(surveyIndex);
}

function initNoSurvey()
{
  displaySurveys();
}

function displaySurveys()
{
  var editorPanel = document.getElementById("editorPanel");

  editorPanel.innerHTML = "";

  document.body.style.cursor = "default";
    
  var surveyPanel = makeElement(editorPanel, "div", "", "surveyPanel", "");
  
  var editorPanelHeader = makeElement(surveyPanel, "div", "Kwali", "editorPanelHeader", "");

  var editorPanelSubheader = makeElement(surveyPanel, "div", "Audience Insights survey editor", "editorPanelSubheader", "");
  
  var surveyPanelHeader = makeElement(surveyPanel, "div", "Surveys", "surveyPanelHeader", "");

  var addSurveyButton = makeElement(surveyPanel, "button", "add", "addSurveyButton", "");
  addSurveyButton.setAttribute("onclick", "addSurvey()");

  var saveSurveysButton = makeElement(surveyPanel, "button", "save", "saveSurveysButton", "");
  saveSurveysButton.setAttribute("onclick", "saveAll()");

  for (var surveyIndex = 0; surveyIndex < getSurveyCount(); surveyIndex++)
  {
    var surveyRow = makeElement(surveyPanel, "div", "", "surveyRow", surveyIndex.toString());

    var surveyTitle = makeElement(surveyRow, "div", getSurveyName(surveyIndex), "surveyTitle", surveyIndex.toString());

    var surveyEditButton = makeElement(surveyRow, "button", "edit", "surveyEditButton", surveyIndex.toString());
    surveyEditButton.setAttribute("onclick", "goToEditLink(" + surveyIndex.toString() + ")");

    var surveyDuplicateButton = makeElement(surveyRow, "button", "duplicate", "surveyDuplicateButton", surveyIndex.toString());
    surveyDuplicateButton.setAttribute("onclick", "duplicateSurvey(" + surveyIndex.toString() + ")");

    var surveyRemoveButton = makeElement(surveyRow, "button", "remove", "surveyRemoveButton", surveyIndex.toString());
    surveyRemoveButton.setAttribute("onclick", "removeSurvey(" + surveyIndex.toString() + ")");
    
    var surveyLinkButton = makeElement(surveyRow, "button", "links...", "surveyLinkButton", surveyIndex.toString());
    surveyLinkButton.setAttribute("onclick", "copyLinks(" + surveyIndex.toString() + ")");
    
    makeElement(surveyRow, "br", "", "break", "");

    var surveyRunButton = makeElement(surveyRow, "button", "run", "surveyRunButton", surveyIndex.toString());
    surveyRunButton.setAttribute("onclick", "goToSurveyLink(" + surveyIndex.toString() + ")");

    var surveyResultsButton = makeElement(surveyRow, "button", "view results", "surveyResultsButton", surveyIndex.toString());
    surveyResultsButton.setAttribute("onclick", "goToViewResultsLink(" + surveyIndex.toString() + ")");
    
    var surveyVisualiseButton = makeElement(surveyRow, "button", "visualise", "surveyVisualiseButton", surveyIndex.toString());
    surveyVisualiseButton.setAttribute("onclick", "goToVisualiseLink(" + surveyIndex.toString() + ")");
  }
}

function goToEditLink(surveyIndex)
{
  var editURL = baseURL + editURLExtension + surveyNameURL(getSurveyName(surveyIndex));

  window.location.href = editURL;
}

function goToSurveyLink(surveyIndex)
{
  var surveyURL = baseURL + answerURLExtension + surveyNameURL(getSurveyName(surveyIndex));
  
  window.location.href = surveyURL;
}

function goToViewResultsLink(surveyIndex)
{
  var viewResultsURL = baseURL + viewResultsURLExtension + surveyNameURL(getSurveyName(surveyIndex));
  
  window.location.href = viewResultsURL;
}

function goToVisualiseLink(surveyIndex)
{
  var visualiseURL = baseURL + visualiseURLExtension + surveyNameURL(getSurveyName(surveyIndex));
  
  window.location.href = visualiseURL;
}

function copyLinks(surveyIndex)
{
  var urlList = "EDIT:\t\t\t" + baseURL + editURLExtension + surveyNameURL(getSurveyName(surveyIndex)) + "\n\n" + "ANSWER:\t\t" + baseURL + answerURLExtension + surveyNameURL(getSurveyName(surveyIndex)) + "\n\n" + "RESULTS:\t\t" + baseURL + viewResultsURLExtension + surveyNameURL(getSurveyName(surveyIndex)) + "\n\n" + "VISUALISE:\t\t" + baseURL + visualiseURLExtension + surveyNameURL(getSurveyName(surveyIndex));

  copyToClipboard(urlList);
}

function copyEditLink(surveyIndex)
{
  var editURL = baseURL + editURLExtension + surveyNameURL(getSurveyName(surveyIndex));

  copyToClipboard(editURL);
}

function copyAnswerLink(surveyIndex)
{
  var surveyURL = baseURL + answerURLExtension + surveyNameURL(getSurveyName(surveyIndex));

  copyToClipboard(surveyURL);
}

function copyVisualiseLink(surveyIndex)
{
  var visualiseURL = baseURL + visualiseURLExtension + surveyNameURL(getSurveyName(surveyIndex));

  copyToClipboard(visualiseURL);
}

function editSurvey(surveyIndex)
{
  activeSurveyIndex = surveyIndex;

  var editorPanel = document.getElementById("editorPanel");
  editorPanel.innerHTML = "";
  
  var questionPanel = makeElement(editorPanel, "div", "", "questionPanel", "")

  //makeElement(questionPanel, "div", "Survey Name:", "fieldHeader", "");
  var surveyHeader = makeElement(questionPanel, "input", getSurveyName(surveyIndex), "surveyHeader", surveyIndex.toString());
  surveyHeader.setAttribute("onchange", "setSurveyName('" + surveyHeader.id + "', " + surveyIndex.toString() + ")");
  surveyHeader.focus();
  surveyHeader.select();
  
  makeElement(questionPanel, "br", "", "break", "");

  makeElement(questionPanel, "span", "", "fieldHeader", "");
  var surveyDate = makeElement(questionPanel, "input", getSurvey(surveyIndex).date, "surveyDate", surveyIndex.toString());
  surveyDate.setAttribute("onchange", "setSurveyDate('" + surveyDate.id + "', " + surveyIndex.toString() + ")");

  makeElement(questionPanel, "span", "", "fieldHeader", "");
  var surveyLocation = makeElement(questionPanel, "input", getSurvey(surveyIndex).location, "surveyLocation", surveyIndex.toString());
  surveyLocation.setAttribute("onchange", "setSurveyLocation('" + surveyLocation.id + "', " + surveyIndex.toString() + ")");

  //makeElement(questionPanel, "hr", "", "break", "");

  //makeElement(questionPanel, "div", "Questions:", "fieldHeader", "");

  for (var questionIndex = 0; questionIndex < getQuestionCount(surveyIndex); questionIndex++)
  {
    var questionRow = makeElement(questionPanel, "div", "", "questionRow", questionIndex.toString());

    var questionTitle = makeElement(questionRow, "div", (questionIndex + 1).toString() + ". " + getQuestionName(surveyIndex, questionIndex), "questionTitle", questionIndex.toString());

    var questionOffset = makeElement(questionRow, "span", (questionIndex + 1).toString() + ". ", "questionTitle", questionIndex.toString());
    questionOffset.style.color = "#ebebeb";

    var questionType = makeElement(questionRow, "select", "", "questionType", questionIndex.toString());
    questionType.setAttribute("onchange", "setQuestionType('questionType" + questionIndex.toString() + "', " + surveyIndex.toString() + ", " + questionIndex.toString() + ")");
    
    var questionTypeButton = makeElement(questionType, "option", "button", "questionTypeButton", questionIndex.toString());
    questionTypeButton.setAttribute("value", "button");
    
    var questionTypeInput = makeElement(questionType, "option", "input", "questionTypeInput", questionIndex.toString());
    questionTypeInput.setAttribute("value", "input");
    
    if (getQuestionType(surveyIndex, questionIndex) == "input")
    {
      questionType.selectedIndex = 1;
    }

    var questionEditButton = makeElement(questionRow, "button", "edit", "questionEditButton", questionIndex.toString());
    questionEditButton.setAttribute("onclick", "editQuestion(" + surveyIndex.toString() + ", " + questionIndex.toString() + ")");

    var questionDuplicateButton = makeElement(questionRow, "button", "duplicate", "questionDuplicateButton", questionIndex.toString());
    questionDuplicateButton.setAttribute("onclick", "duplicateQuestion(" + surveyIndex.toString() + ", " + questionIndex.toString() + ")");

    var questionRemoveButton = makeElement(questionRow, "button", "remove", "questionRemoveButton", questionIndex.toString());
    questionRemoveButton.setAttribute("onclick", "removeQuestion(" + surveyIndex.toString() + ", " + questionIndex.toString() + ")");

    var questionShiftUpButton = makeElement(questionRow, "button", "up", "questionShiftUpButton", questionIndex.toString());
    questionShiftUpButton.setAttribute("onclick", "shiftQuestionUp(" + surveyIndex.toString() + ", " + questionIndex.toString() + ")");

    var questionShiftDownButton = makeElement(questionRow, "button", "down", "questionShiftDownButton", questionIndex.toString());
    questionShiftDownButton.setAttribute("onclick", "shiftQuestionDown(" + surveyIndex.toString() + ", " + questionIndex.toString() + ")");
    
    makeElement(questionPanel, "hr", "", "break", "");
  }

  makeElement(questionPanel, "br", "", "break", "");

  var addQuestionButton = makeElement(questionPanel, "button", "add", "addQuestionButton", "");
  addQuestionButton.setAttribute("onclick", "addQuestion(" + surveyIndex.toString() + ")");

  makeElement(questionPanel, "br", "", "break", "");
  makeElement(questionPanel, "br", "", "break", "");

  makeElement(questionPanel, "span", "Show Welcome Message?:", "fieldHeader", surveyIndex.toString());
  var surveyShowWelcomeMessage = makeElement(questionPanel, "input", "", "surveyShowWelcomeMessage", surveyIndex.toString());
  surveyShowWelcomeMessage.setAttribute("type", "checkbox");
  surveyShowWelcomeMessage.checked = getSurvey(surveyIndex).showWelcomeMessage;
  surveyShowWelcomeMessage.setAttribute("onchange", "setShowWelcomeMessage('" + surveyShowWelcomeMessage.id + "', " + surveyIndex.toString() + ")");
  
  makeElement(questionPanel, "br", "", "break", "");
  makeElement(questionPanel, "br", "", "break", "");

  makeElement(questionPanel, "span", "Welcome Message:", "fieldHeader", surveyIndex.toString());
  var surveyWelcomeMessage = makeElement(questionPanel, "input", getSurvey(surveyIndex).welcomeMessage, "surveyWelcomeMessage", surveyIndex.toString());
  surveyWelcomeMessage.setAttribute("onchange", "setSurveyWelcomeMessage('" + surveyWelcomeMessage.id + "', " + surveyIndex.toString() + ")");
  
  makeElement(questionPanel, "br", "", "break", "");
  makeElement(questionPanel, "br", "", "break", "");

  makeElement(questionPanel, "span", "Show Welcome Image?:", "fieldHeader", surveyIndex.toString());
  var surveyShowWelcomeImage = makeElement(questionPanel, "input", "", "surveyShowWelcomeImage", surveyIndex.toString());
  surveyShowWelcomeImage.setAttribute("type", "checkbox");
  surveyShowWelcomeImage.checked = getSurvey(surveyIndex).showWelcomeImage;
  surveyShowWelcomeImage.setAttribute("onchange", "setShowWelcomeImage('" + surveyShowWelcomeImage.id + "', " + surveyIndex.toString() + ")");
  
  makeElement(questionPanel, "br", "", "break", "");
  makeElement(questionPanel, "br", "", "break", "");

  makeElement(questionPanel, "span", "Welcome Image URL:", "fieldHeader", surveyIndex.toString());
  var surveyWelcomeImage = makeElement(questionPanel, "input", getSurvey(surveyIndex).welcomeImage, "surveyWelcomeImage", surveyIndex.toString());
  surveyWelcomeImage.setAttribute("onchange", "setSurveyWelcomeImage('" + surveyWelcomeImage.id + "', " + surveyIndex.toString() + ")");
  
  makeElement(questionPanel, "br", "", "break", "");
  makeElement(questionPanel, "br", "", "break", "");

  makeElement(questionPanel, "span", "End Message:", "fieldHeader", surveyIndex.toString());
  var surveyEndMessage = makeElement(questionPanel, "input", getSurvey(surveyIndex).endMessage, "surveyEndMessage", surveyIndex.toString());
  surveyEndMessage.setAttribute("onchange", "setSurveyEndMessage('" + surveyEndMessage.id + "', " + surveyIndex.toString() + ")");
  
  makeElement(questionPanel, "br", "", "break", "");
  makeElement(questionPanel, "br", "", "break", "");

  makeElement(questionPanel, "span", "Button colours:", "fieldHeader", surveyIndex.toString());

  for (var buttonIndex = 0; buttonIndex < buttonCount; buttonIndex++)
  {
    var buttonColour = makeElement(questionPanel, "input", "", "buttonColour" + buttonIndex.toString(), surveyIndex.toString());
    buttonColour.setAttribute("type", "color");
    
    var buttonColourValue = getSurvey(surveyIndex).buttonColours["button" + buttonIndex];
      
    if (buttonColourValue.includes("#") == false)
    {
      buttonColourValue = "#" + buttonColourValue.toString();
    }
  
    buttonColour.value = buttonColourValue;
    buttonColour.style.backgroundColor = buttonColourValue;

    console.log("set button colour: " + buttonColourValue);

    buttonColour.setAttribute("onchange", "setButtonColour('" + buttonColour.id + "', " + buttonIndex + ", " + surveyIndex.toString() + ")");
  }

  makeElement(questionPanel, "br", "", "break", "");
  makeElement(questionPanel, "br", "", "break", "");

  var surveySaveButton = makeElement(questionPanel, "button", "save survey", "surveySaveButton", surveyIndex.toString());
  surveySaveButton.setAttribute("onclick", "saveSurvey(" + surveyIndex.toString() + ")");
}

function editQuestion(surveyIndex, questionIndex, highlightIndex)
{
    activeQuestionIndex = questionIndex;

    var editorPanel = document.getElementById("editorPanel");

    editorPanel.innerHTML = "";
    
    var answerPanel = makeElement(editorPanel, "div", "", "answerPanel", "")

    //makeElement(answerPanel, "div", "Question Name:", "fieldHeader", "");
    var questionHeader = makeElement(answerPanel, "input", getQuestionName(surveyIndex, questionIndex), "questionHeader", questionIndex.toString());
    questionHeader.setAttribute("onchange", "setQuestionName('" + questionHeader.id + "', " + surveyIndex.toString() + ", " + questionIndex.toString() + ")");

    if (highlightIndex == undefined)
    {
      questionHeader.focus();
      questionHeader.select();
    }
    
    // input question create text box
    if (getQuestionType(surveyIndex, questionIndex) == "input")
    {
      makeElement(answerPanel, "div", "Initial input text", "fieldHeader", "");
      
      var inputDiv = makeElement(answerPanel, "div", "", "", "");

      var questionInitialInput = makeElement(inputDiv, "input", "", "questionInitialInput", questionIndex.toString());
      questionInitialInput.setAttribute("onchange", "setQuestionInitialInput('" + questionInitialInput.id + "', " + surveyIndex.toString() + ", " + questionIndex.toString() + ")");
      questionInitialInput.value = getQuestionInitialInput(surveyIndex, questionIndex).toString();
    }

    // button question create buttons
    if (getQuestionType(surveyIndex, questionIndex) == "button")
    {
     // makeElement(answerPanel, "div", "Answers (number of responses):", "fieldHeader", "");

      for (var answerIndex = 0; answerIndex < getAnswerCount(surveyIndex, questionIndex); answerIndex++)
      {
        var answerRow = makeElement(answerPanel, "div", "", "answerRow", answerIndex.toString());
        
        makeElement(answerRow, "span", (answerIndex + 1).toString() + ".", "answerTitle", "");

        var answerTitle = makeElement(answerRow, "input", getAnswerName(surveyIndex, questionIndex, answerIndex), "answerTitle", answerIndex.toString());
        answerTitle.setAttribute("onchange", "setAnswerName('" + answerTitle.id.toString() + "', " + surveyIndex.toString() + ", " + questionIndex.toString() + ", " + answerIndex.toString() + ")");

        var answerResponses = makeElement(answerRow, "span", "(" + getAnswerResponses(surveyIndex, questionIndex, answerIndex) + " responses)", "answerResponses", answerIndex.toString());

        makeElement(answerRow, "br", "", "", "");
        
        var buttonOffset = makeElement(answerRow, "span",  (answerIndex + 1).toString() + ".", "answerTitle", "");
        buttonOffset.style.color = "#ebebeb";

        var answerRemoveButton = makeElement(answerRow, "button", "remove", "answerRemoveButton", answerIndex.toString());
        answerRemoveButton.setAttribute("onclick", "removeAnswer(" + surveyIndex.toString() + ", " + questionIndex.toString() + ", " + answerIndex.toString() + ")");

        var answerShiftUpButton = makeElement(answerRow, "button", "up", "answerShiftUpButton", answerIndex.toString());
        answerShiftUpButton.setAttribute("onclick", "shiftAnswerUp(" + surveyIndex.toString() + ", " + questionIndex.toString() + ", " + answerIndex.toString() + ")");

        var answerShiftDownButton = makeElement(answerRow, "button", "down", "answerShiftDownButton", answerIndex.toString());
        answerShiftDownButton.setAttribute("onclick", "shiftAnswerDown(" + surveyIndex.toString() + ", " + questionIndex.toString() + ", " + answerIndex.toString() + ")");

        if (highlightIndex == answerIndex)
        {
          answerTitle.focus();
          answerTitle.select();
        }

        makeElement(answerPanel, "hr", "", "break", "");
      }
      
      makeElement(answerPanel, "br", "", "break", "");

      var addAnswerButton = makeElement(answerPanel, "button", "add", "addAnswerButton", "");
      addAnswerButton.setAttribute("onclick", "addAnswer(" + surveyIndex.toString() + ", " + questionIndex.toString() + ")");
    }

    var questionSaveButton = makeElement(answerPanel, "button", "save", "questionSaveButton", questionIndex.toString());
    questionSaveButton.setAttribute("onclick", "saveQuestion(" + surveyIndex.toString() + ", " + questionIndex.toString() + ")");
}

function setSurveyName(elementId, surveyIndex)
{
  surveys["survey" + surveyIndex.toString()].surveyName = document.getElementById(elementId).value;
}

function setSurveyDate(elementId, surveyIndex)
{
  surveys["survey" + surveyIndex.toString()].date = document.getElementById(elementId).value;
}

function setSurveyLocation(elementId, surveyIndex)
{
  surveys["survey" + surveyIndex.toString()].location = document.getElementById(elementId).value;
}

function setShowWelcomeMessage(elementId, surveyIndex)
{
  surveys["survey" + surveyIndex.toString()].showWelcomeMessage = document.getElementById(elementId).checked;
}

function setSurveyWelcomeMessage(elementId, surveyIndex)
{
  surveys["survey" + surveyIndex.toString()].welcomeMessage = document.getElementById(elementId).value;
}

function setShowWelcomeImage(elementId, surveyIndex)
{
  surveys["survey" + surveyIndex.toString()].showWelcomeImage = document.getElementById(elementId).checked;
}

function setSurveyWelcomeImage(elementId, surveyIndex)
{
  surveys["survey" + surveyIndex.toString()].welcomeImage = document.getElementById(elementId).value;
}

function setSurveyEndMessage(elementId, surveyIndex)
{
  surveys["survey" + surveyIndex.toString()].endMessage = document.getElementById(elementId).value;
}

function setQuestionName(elementId, surveyIndex, questionIndex)
{
  surveys["survey" + surveyIndex.toString()].questions["question" + questionIndex.toString()].questionName = document.getElementById(elementId).value;
}

function setQuestionType(elementId, surveyIndex, questionIndex)
{
  surveys["survey" + surveyIndex.toString()].questions["question" + questionIndex.toString()].questionType = document.getElementById(elementId).value.toString();
}

function setQuestionInitialInput(elementId, surveyIndex, questionIndex)
{
console.log("initial input: " + document.getElementById(elementId).value.toString());
  surveys["survey" + surveyIndex.toString()].questions["question" + questionIndex.toString()].questionInitialInput = document.getElementById(elementId).value.toString();
}

function setAnswerName(elementId, surveyIndex, questionIndex, answerIndex)
{
  surveys["survey" + surveyIndex.toString()].questions["question" + questionIndex.toString()].answers["answer" + answerIndex.toString()].answerName = document.getElementById(elementId).value;
}

function setButtonColour(elementId, buttonIndex, surveyIndex)
{
  var buttonColour = document.getElementById(elementId).value.toString();

  if (buttonColour.includes("#") == false)
  {
    buttonColour = "#" + buttonColour.toString();
  }
  
  document.getElementById(elementId).style.backgroundColor = buttonColour;
  
  surveys["survey" + surveyIndex.toString()].buttonColours["button" + buttonIndex.toString()] = buttonColour;
}

function addSurvey()
{
  console.log(surveys);

  surveys["survey" + getSurveyCount().toString()] = { "surveyName":"new survey", "date":"0/0/0", "location":"Scotland", "buttonColours":{"button0":defaultButtonColours[0], "button1":defaultButtonColours[1], "button2":defaultButtonColours[2], "button3":defaultButtonColours[3]}, "welcomeMessage":defaultWelcomeMessage, "showWelcomeMessage":false, "welcomeImage":"images/default-background.jpg", "showWelcomeImage":false, "endMessage":defaultEndMessage, "questions": {"question0":{"questionName":"new question", "questionType":"button", "questionInitialInput":"enter answer", "answers":{"answer0":{"answerName":"new answer", "responses":0}}, "textAnswers":{"textAnswer0":""}}}};

  saveAll();

  displaySurveys();
}

function duplicateSurvey(surveyIndex)
{
  var newSurveyIndex = getSurveyCount();
  surveys["survey" + newSurveyIndex.toString()] = $.extend(true, {}, surveys["survey" + surveyIndex.toString()]);

  for (var questionIndex = 0; questionIndex < getQuestionCount(newSurveyIndex); questionIndex++)
  {
    for (var answerIndex = 0; answerIndex < getAnswerCount(newSurveyIndex, questionIndex); answerIndex++)
    {
      surveys["survey" + newSurveyIndex.toString()].questions["question" + questionIndex].answers["answer" + answerIndex].responses = 0;
    }
    
    surveys["survey" + newSurveyIndex.toString()].questions["question" + questionIndex].textAnswers = {"textAnswer0":""};
  }

  displaySurveys();
}

function addQuestion(surveyIndex)
{
  surveys["survey" + surveyIndex.toString()].questions["question" + getQuestionCount(surveyIndex).toString()] = { "questionName":"new question", "questionType":"button", "questionInitialInput":"enter answer", "answers":{"answer0":{"answerName":"new answer", "responses":0}}, "textAnswers":{"textAnswer0":""}};

  editSurvey(surveyIndex);
}

function duplicateQuestion(surveyIndex, questionIndex)
{
  var newQuestionIndex = getQuestionCount(surveyIndex);
  surveys["survey" + surveyIndex.toString()].questions["question" + newQuestionIndex] = $.extend(true, {}, surveys["survey" + surveyIndex.toString()].questions["question" + questionIndex.toString()]);

  for (var answerIndex = 0; answerIndex < getAnswerCount(surveyIndex, newQuestionIndex); answerIndex++)
  {
    surveys["survey" + surveyIndex.toString()].questions["question" + newQuestionIndex].answers["answer" + answerIndex].responses = 0;
  }

  surveys["survey" + surveyIndex.toString()].questions["question" + newQuestionIndex].textAnswers = {"textAnswer0":""};

  editSurvey(surveyIndex);
}

function shiftQuestionUp(surveyIndex, questionIndex)
{
  if (questionIndex > 0)
  {
    var questionContent = surveys["survey" + surveyIndex.toString()].questions["question" + questionIndex.toString()];
    surveys["survey" + surveyIndex.toString()].questions["question" + questionIndex.toString()] = surveys["survey" + surveyIndex.toString()].questions["question" + (questionIndex - 1).toString()];
    surveys["survey" + surveyIndex.toString()].questions["question" + (questionIndex - 1).toString()] = questionContent;

    editSurvey(surveyIndex);
  }
}

function shiftQuestionDown(surveyIndex, questionIndex)
{
  if (questionIndex < getQuestionCount(surveyIndex) - 1)
  {
    var questionContent = surveys["survey" + surveyIndex.toString()].questions["question" + questionIndex.toString()];
    surveys["survey" + surveyIndex.toString()].questions["question" + questionIndex.toString()] = surveys["survey" + surveyIndex.toString()].questions["question" + (questionIndex + 1).toString()];
    surveys["survey" + surveyIndex.toString()].questions["question" + (questionIndex + 1).toString()] = questionContent;

    editSurvey(surveyIndex);
  }
}

function shiftAnswerUp(surveyIndex, questionIndex, answerIndex)
{
  if (answerIndex > 0)
  {
    var answerContent = surveys["survey" + surveyIndex.toString()].questions["question" + questionIndex.toString()].answers["answer" + answerIndex.toString()];
    surveys["survey" + surveyIndex.toString()].questions["question" + questionIndex.toString()].answers["answer" + answerIndex.toString()] = surveys["survey" + surveyIndex.toString()].questions["question" + questionIndex.toString()].answers["answer" + (answerIndex - 1).toString()];
    surveys["survey" + surveyIndex.toString()].questions["question" + questionIndex.toString()].answers["answer" + (answerIndex - 1).toString()] = answerContent;

    editQuestion(surveyIndex, questionIndex);
  }
}

function shiftAnswerDown(surveyIndex, questionIndex, answerIndex)
{
  if (answerIndex < getAnswerCount(surveyIndex, questionIndex) - 1)
  {
    var answerContent = surveys["survey" + surveyIndex.toString()].questions["question" + questionIndex.toString()].answers["answer" + answerIndex.toString()];
    surveys["survey" + surveyIndex.toString()].questions["question" + questionIndex.toString()].answers["answer" + answerIndex.toString()] = surveys["survey" + surveyIndex.toString()].questions["question" + questionIndex.toString()].answers["answer" + (answerIndex + 1).toString()];
    surveys["survey" + surveyIndex.toString()].questions["question" + questionIndex.toString()].answers["answer" + (answerIndex + 1).toString()] = answerContent;

    editQuestion(surveyIndex, questionIndex);
  }
}

function addAnswer(surveyIndex, questionIndex)
{
  var newAnswerIndex = getAnswerCount(surveyIndex, questionIndex);

  if (newAnswerIndex < buttonCount)
  {
    surveys["survey" + surveyIndex.toString()].questions["question" + questionIndex.toString()].answers["answer" + newAnswerIndex.toString()] = { "answerName":"new answer", "responses":0 };

    editQuestion(surveyIndex, questionIndex, newAnswerIndex);
  }
  else
  {
    alert("You cannot have more answers than buttons!");
  }
}

function removeSurvey(surveyIndex)
{
  if (getSurveyCount() <= 1)
  {
    alert("You cannot remove the last survey!");
  }
  else if (confirm("Are you sure you wish to remove this survey? The action cannot be undone and will delete the associated data."))
  {
    for (var otherSurveyIndex = surveyIndex; otherSurveyIndex < getSurveyCount() - 1; otherSurveyIndex++)
    {
      surveys["survey" + otherSurveyIndex.toString()] = surveys["survey" + (otherSurveyIndex + 1).toString()];
    }

    delete surveys["survey" + (getSurveyCount() - 1).toString()];
  }

  displaySurveys();
}

function removeQuestion(surveyIndex, questionIndex)
{
  if (getQuestionCount(surveyIndex) <= 1)
  {
    alert("You cannot remove the last question!");
  }
  else if (confirm("Are you sure you wish to remove this question? The action cannot be undone and will delete the associated data."))
  {
    for (var otherQuestionIndex = questionIndex; otherQuestionIndex < getQuestionCount(surveyIndex) - 1; otherQuestionIndex++)
    {
      surveys["survey" + surveyIndex.toString()].questions["question" + otherQuestionIndex.toString()] = surveys["survey" + surveyIndex.toString()].questions["question" + (otherQuestionIndex + 1).toString()];
    }

    delete surveys["survey" + surveyIndex.toString()].questions["question" + (getQuestionCount(surveyIndex) - 1).toString()];
  }

  editSurvey(surveyIndex);
}

function removeAnswer(surveyIndex, questionIndex, answerIndex)
{
  if (getAnswerCount(surveyIndex, questionIndex) <= 1)
  {
    alert("You cannot remove the last answer!");
  }
  else if (confirm("Are you sure you wish to remove this answer? The action cannot be undone and will delete the associated data."))
  {
    for (var otherAnswerIndex = answerIndex; otherAnswerIndex < getAnswerCount(surveyIndex, questionIndex) - 1; otherAnswerIndex++)
    {
      surveys["survey" + surveyIndex.toString()].questions["question" + questionIndex.toString()].answers["answer" + otherAnswerIndex.toString()] = surveys["survey" + surveyIndex.toString()].questions["question" + questionIndex.toString()].answers["answer" + (otherAnswerIndex + 1).toString()];
    }

    delete surveys["survey" + surveyIndex.toString()].questions["question" + questionIndex.toString()].answers["answer" + (getAnswerCount(surveyIndex, questionIndex) - 1).toString()];
  }

  editQuestion(surveyIndex, questionIndex);
}

function saveAll()
{
  syncSurvey(-1, -1);

  displaySurveys();
}

function saveSurvey(surveyIndex)
{
  syncSurvey(surveyIndex, -1);

  window.location.href = baseURL + editURLExtension;
}

function saveQuestion(surveyIndex, questionIndex)
{
  syncSurvey(surveyIndex, questionIndex);

  editSurvey(surveyIndex);
}
