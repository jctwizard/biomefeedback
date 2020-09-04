function initSurvey(surveyIndex)
{
  editSurvey(surveyIndex);
}

function initNoSurvey()
{
  displaySurveys();
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

function goToVisualiseLink(surveyIndex)
{
  var visualiseURL = baseURL + visualiseURLExtension + surveyNameURL(getSurveyName(surveyIndex));
  
  window.location.href = visualiseURL;
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

  makeElement(editorPanel, "div", "Survey Name:", "fieldHeader", "");
  var surveyHeader = makeElement(editorPanel, "input", getSurveyName(surveyIndex), "surveyHeader", surveyIndex.toString());
  surveyHeader.setAttribute("onchange", "setSurveyName('" + surveyHeader.id + "', " + surveyIndex.toString() + ")");
  surveyHeader.focus();
  surveyHeader.select();

  makeElement(editorPanel, "hr", "", "break", "");

  makeElement(editorPanel, "div", "Questions:", "fieldHeader", "");
  var questionPanel = makeElement(editorPanel, "div", "", "questionPanel", "")

  for (var questionIndex = 0; questionIndex < getQuestionCount(surveyIndex); questionIndex++)
  {
    var questionRow = makeElement(questionPanel, "div", "", "questionRow", questionIndex.toString());

    var questionTitle = makeElement(questionRow, "div", getQuestionName(surveyIndex, questionIndex), "questionTitle", questionIndex.toString());
    
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

    var questionEditButton = makeElement(questionRow, "button", "edit question", "questionEditButton", questionIndex.toString());
    questionEditButton.setAttribute("onclick", "editQuestion(" + surveyIndex.toString() + ", " + questionIndex.toString() + ")");

    var questionDuplicateButton = makeElement(questionRow, "button", "duplicate question", "questionDuplicateButton", questionIndex.toString());
    questionDuplicateButton.setAttribute("onclick", "duplicateQuestion(" + surveyIndex.toString() + ", " + questionIndex.toString() + ")");

    var questionRemoveButton = makeElement(questionRow, "button", "remove question", "questionRemoveButton", questionIndex.toString());
    questionRemoveButton.setAttribute("onclick", "removeQuestion(" + surveyIndex.toString() + ", " + questionIndex.toString() + ")");

    var questionShiftUpButton = makeElement(questionRow, "button", "shift up", "questionShiftUpButton", questionIndex.toString());
    questionShiftUpButton.setAttribute("onclick", "shiftQuestionUp(" + surveyIndex.toString() + ", " + questionIndex.toString() + ")");

    var questionShiftDownButton = makeElement(questionRow, "button", "shift down", "questionShiftDownButton", questionIndex.toString());
    questionShiftDownButton.setAttribute("onclick", "shiftQuestionDown(" + surveyIndex.toString() + ", " + questionIndex.toString() + ")");
  }

  makeElement(editorPanel, "hr", "", "break", "");

  var addQuestionButton = makeElement(editorPanel, "button", "add question", "addQuestionButton", "");
  addQuestionButton.setAttribute("onclick", "addQuestion(" + surveyIndex.toString() + ")");

  makeElement(editorPanel, "hr", "", "break", "");

  makeElement(editorPanel, "div", "Survey Date:", "fieldHeader", "");
  var surveyDate = makeElement(editorPanel, "input", getSurvey(surveyIndex).date, "surveyDate", surveyIndex.toString());
  surveyDate.setAttribute("onchange", "setSurveyDate('" + surveyDate.id + "', " + surveyIndex.toString() + ")");

  makeElement(editorPanel, "div", "Survey Location:", "fieldHeader", "");
  var surveyLocation = makeElement(editorPanel, "input", getSurvey(surveyIndex).location, "surveyLocation", surveyIndex.toString());
  surveyLocation.setAttribute("onchange", "setSurveyLocation('" + surveyLocation.id + "', " + surveyIndex.toString() + ")");

  makeElement(editorPanel, "div", "Show Welcome Message?:", "fieldHeader", surveyIndex.toString());
  var surveyShowWelcomeMessage = makeElement(editorPanel, "input", "", "surveyShowWelcomeMessage", surveyIndex.toString());
  surveyShowWelcomeMessage.setAttribute("type", "checkbox");
  surveyShowWelcomeMessage.checked = getSurvey(surveyIndex).showWelcomeMessage;
  surveyShowWelcomeMessage.setAttribute("onchange", "setShowWelcomeMessage('" + surveyShowWelcomeMessage.id + "', " + surveyIndex.toString() + ")");

  makeElement(editorPanel, "div", "Welcome Message:", "fieldHeader", surveyIndex.toString());
  var surveyWelcomeMessage = makeElement(editorPanel, "input", getSurvey(surveyIndex).welcomeMessage, "surveyWelcomeMessage", surveyIndex.toString());
  surveyWelcomeMessage.setAttribute("onchange", "setSurveyWelcomeMessage('" + surveyWelcomeMessage.id + "', " + surveyIndex.toString() + ")");

  makeElement(editorPanel, "div", "Show Welcome Image?:", "fieldHeader", surveyIndex.toString());
  var surveyShowWelcomeImage = makeElement(editorPanel, "input", "", "surveyShowWelcomeImage", surveyIndex.toString());
  surveyShowWelcomeImage.setAttribute("type", "checkbox");
  surveyShowWelcomeImage.checked = getSurvey(surveyIndex).showWelcomeImage;
  surveyShowWelcomeImage.setAttribute("onchange", "setShowWelcomeImage('" + surveyShowWelcomeImage.id + "', " + surveyIndex.toString() + ")");

  makeElement(editorPanel, "div", "Welcome Image URL:", "fieldHeader", surveyIndex.toString());
  var surveyWelcomeImage = makeElement(editorPanel, "input", getSurvey(surveyIndex).welcomeImage, "surveyWelcomeImage", surveyIndex.toString());
  surveyWelcomeImage.setAttribute("onchange", "setSurveyWelcomeImage('" + surveyWelcomeImage.id + "', " + surveyIndex.toString() + ")");

  makeElement(editorPanel, "div", "End Message:", "fieldHeader", surveyIndex.toString());
  var surveyEndMessage = makeElement(editorPanel, "input", getSurvey(surveyIndex).endMessage, "surveyEndMessage", surveyIndex.toString());
  surveyEndMessage.setAttribute("onchange", "setSurveyEndMessage('" + surveyEndMessage.id + "', " + surveyIndex.toString() + ")");

  makeElement(editorPanel, "div", "Button colours:", "fieldHeader", surveyIndex.toString());

  for (var buttonIndex = 0; buttonIndex < buttonCount; buttonIndex++)
  {
    var buttonColour = makeElement(editorPanel, "input", "", "buttonColour" + buttonIndex.toString(), surveyIndex.toString());
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

  makeElement(editorPanel, "hr", "", "break", "");

  var surveySaveButton = makeElement(editorPanel, "button", "save survey", "surveySaveButton", surveyIndex.toString());
  surveySaveButton.setAttribute("onclick", "saveSurvey(" + surveyIndex.toString() + ")");
}

function editQuestion(surveyIndex, questionIndex, highlightIndex)
{
    activeQuestionIndex = questionIndex;

    var editorPanel = document.getElementById("editorPanel");

    editorPanel.innerHTML = "";

    makeElement(editorPanel, "div", "Question Name:", "fieldHeader", "");
    var questionHeader = makeElement(editorPanel, "input", getQuestionName(surveyIndex, questionIndex), "questionHeader", questionIndex.toString());
    questionHeader.setAttribute("onchange", "setQuestionName('" + questionHeader.id + "', " + surveyIndex.toString() + ", " + questionIndex.toString() + ")");

    if (highlightIndex == undefined)
    {
      questionHeader.focus();
      questionHeader.select();
    }
    
    // input question create text box
    if (getQuestionType(surveyIndex, questionIndex) == "input")
    {
      makeElement(editorPanel, "div", "Initial input text", "fieldHeader", "");
      
      var inputDiv = makeElement(editorPanel, "div", "", "", "");

      var questionInitialInput = makeElement(inputDiv, "input", "", "questionInitialInput", questionIndex.toString());
      questionInitialInput.setAttribute("onchange", "setQuestionInitialInput('" + questionInitialInput.id + "', " + surveyIndex.toString() + ", " + questionIndex.toString() + ")");
      questionInitialInput.value = getQuestionInitialInput(surveyIndex, questionIndex).toString();
    }

    // button question create buttons
    if (getQuestionType(surveyIndex, questionIndex) == "button")
    {
      makeElement(editorPanel, "div", "Answers (number of responses):", "fieldHeader", "");
      var answerPanel = makeElement(editorPanel, "div", "", "answerPanel", "")

      for (var answerIndex = 0; answerIndex < getAnswerCount(surveyIndex, questionIndex); answerIndex++)
      {
        var answerRow = makeElement(answerPanel, "div", "", "answerRow", answerIndex.toString());

        var answerTitle = makeElement(answerRow, "input", getAnswerName(surveyIndex, questionIndex, answerIndex), "answerTitle", answerIndex.toString());
        answerTitle.setAttribute("onchange", "setAnswerName('" + answerTitle.id.toString() + "', " + surveyIndex.toString() + ", " + questionIndex.toString() + ", " + answerIndex.toString() + ")");

        var answerResponses = makeElement(answerRow, "span", "(" + getAnswerResponses(surveyIndex, questionIndex, answerIndex) + ")", "answerResponses", answerIndex.toString());

        makeElement(answerRow, "br", "", "", "");

        var answerRemoveButton = makeElement(answerRow, "button", "remove answer", "answerRemoveButton", answerIndex.toString());
        answerRemoveButton.setAttribute("onclick", "removeAnswer(" + surveyIndex.toString() + ", " + questionIndex.toString() + ", " + answerIndex.toString() + ")");

        var answerShiftUpButton = makeElement(answerRow, "button", "shift up", "answerShiftUpButton", answerIndex.toString());
        answerShiftUpButton.setAttribute("onclick", "shiftAnswerUp(" + surveyIndex.toString() + ", " + questionIndex.toString() + ", " + answerIndex.toString() + ")");

        var answerShiftDownButton = makeElement(answerRow, "button", "shift down", "answerShiftDownButton", answerIndex.toString());
        answerShiftDownButton.setAttribute("onclick", "shiftAnswerDown(" + surveyIndex.toString() + ", " + questionIndex.toString() + ", " + answerIndex.toString() + ")");

        if (highlightIndex == answerIndex)
        {
          answerTitle.focus();
          answerTitle.select();
        }
      }

      makeElement(editorPanel, "hr", "", "break", "");

      var addAnswerButton = makeElement(editorPanel, "button", "add answer", "addAnswerButton", "");
      addAnswerButton.setAttribute("onclick", "addAnswer(" + surveyIndex.toString() + ", " + questionIndex.toString() + ")");
    }

    var questionSaveButton = makeElement(editorPanel, "button", "save question", "questionSaveButton", questionIndex.toString());
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
