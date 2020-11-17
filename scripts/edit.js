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
    
  var surveyPanel = makeElement(editorPanel, "div", "", "mainPanel", "");
  
  var editorPanelHeader = makeElement(surveyPanel, "div", "KWALI", "largeHeader", "");

  var editorPanelSubheader = makeElement(surveyPanel, "div", "Audience Insights Surveys", "regularHeader", "");
  
  makeElement(surveyPanel, "div", "", "break", "");

  var surveyPanelHeader = makeElement(surveyPanel, "div", "MAKE A NEW KWALI", "smallHeader", "");

  var newSurveyButtonPanel = makeElement(surveyPanel, "div", "", "buttonPanel", "");

  var addSurveyButton = makeButton(newSurveyButtonPanel, "addSurvey", null, "Make a new Kwali", "addButton", "");
  
  var helpSurveyButton = makeButton(newSurveyButtonPanel, "surveyHelp", null, "Help", "helpButton", "");
  
  makeElement(surveyPanel, "div", "", "break", "");
  
  var surveyPanelHeader = makeElement(surveyPanel, "div", "OPEN A RECENT KWALI", "smallHeader", "");
  
  var recentSurveyButtonPanel = makeElement(surveyPanel, "div", "", "buttonPanel", "");

  for (var surveyIndex = 0; surveyIndex < getSurveyCount(); surveyIndex++)
  {
    var editSurveyButton = null;

    var questionType = "button";

    if (getQuestionCount(surveyIndex) > 0)
    {
      questionType = getQuestionType(surveyIndex, 0);
    }
    
    console.log(questionType);

    if (questionType == "button")
    {
      editSurveyButton = makeButton(recentSurveyButtonPanel, "goToEditLink", surveyIndex, getSurveyName(surveyIndex).toString(), "buttonQuestionButton", surveyIndex);
    }
    else if (questionType == "input")
    {
      editSurveyButton = makeButton(recentSurveyButtonPanel, "goToEditLink", surveyIndex, getSurveyName(surveyIndex).toString(), "textQuestionButton", surveyIndex);
    }
    else if (questionType == "imageQuestionAndAnswer")
    {
      editSurveyButton = makeButton(recentSurveyButtonPanel, "goToEditLink", surveyIndex, getSurveyName(surveyIndex).toString(), "imageQuestionAndAnswerButton", surveyIndex);
    }
    else if (questionType == "imageQuestion")
    {
      editSurveyButton = makeButton(recentSurveyButtonPanel, "goToEditLink", surveyIndex, getSurveyName(surveyIndex).toString(), "imageQuestionButton", surveyIndex);
    }
    else if (questionType == "imageAnswer")
    {
      editSurveyButton = makeButton(recentSurveyButtonPanel, "goToEditLink", surveyIndex, getSurveyName(surveyIndex).toString(), "imageAnswerButton", surveyIndex);
    }
    else
    {
      editSurveyButton = makeButton(recentSurveyButtonPanel, "goToEditLink", surveyIndex, getSurveyName(surveyIndex).toString(), "buttonQuestionButton", surveyIndex);
    }

    var innerSurveyButtonPanel = makeElement(editSurveyButton, "div", "", "innerButtonPanel", surveyIndex);

    // make inner button panel appear when mouse hovers over survey button
    editSurveyButton.setAttribute("onmouseenter", "showElement(this," + innerSurveyButtonPanel.id + ")");
    editSurveyButton.setAttribute("onmouseleave", "hideElement(this," + innerSurveyButtonPanel.id + ")");
    
    var deleteSurveyButton = makeInnerButton(innerSurveyButtonPanel, "removeSurvey", surveyIndex, "", "deleteButton", surveyIndex);
    var shareSurveyButton = makeInnerButton(innerSurveyButtonPanel, "copyLinks", surveyIndex, "", "shareButton", surveyIndex);
    var playSurveyButton = makeInnerButton(innerSurveyButtonPanel, "goToSurveyLink", surveyIndex, "", "runButton", surveyIndex);

    /*
    var surveyDuplicateButton = makeElement(surveyRow, "button", "duplicate", "surveyDuplicateButton", surveyIndex.toString());
    surveyDuplicateButton.setAttribute("onclick", "duplicateSurvey(" + surveyIndex.toString() + ")");
    
    var surveyResultsButton = makeElement(surveyRow, "button", "view results", "surveyResultsButton", surveyIndex.toString());
    surveyResultsButton.setAttribute("onclick", "goToViewResultsLink(" + surveyIndex.toString() + ")");
    
    var surveyVisualiseButton = makeElement(surveyRow, "button", "visualise", "surveyVisualiseButton", surveyIndex.toString());
    surveyVisualiseButton.setAttribute("onclick", "goToVisualiseLink(" + surveyIndex.toString() + ")");*/
  }
}

function surveyHelp()
{
  alert("there is currently no help available, please ask someone for assistance");
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
  var urlList = "copy a link below:<br /><br /><br /><strong>edit</strong>:    " + baseURL + editURLExtension + surveyNameURL(getSurveyName(surveyIndex)) + "<br /><br />" + "<strong>run</strong>:    " + baseURL + answerURLExtension + surveyNameURL(getSurveyName(surveyIndex)) + "<br /><br />" + "<strong>results</strong>:    " + baseURL + viewResultsURLExtension + surveyNameURL(getSurveyName(surveyIndex)) + "<br /><br />" + "<strong>visualise</strong>:    " + baseURL + visualiseURLExtension + surveyNameURL(getSurveyName(surveyIndex));
  
  makeModal(urlList);
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

function displaySurveyHeader(surveyPanel, surveyIndex)
{
  var editorPanelHeader = makeElement(surveyPanel, "div", "KWALI", "largeHeaderDark", "");
  
  var surveyHeader = makeElement(surveyPanel, "input", getSurveyName(surveyIndex), "editableSurveyName", surveyIndex.toString());
  surveyHeader.setAttribute("onchange", "setSurveyName('" + surveyHeader.id + "', " + surveyIndex.toString() + ")");

  // survey info
  var surveyInfoRow = makeElement(surveyPanel, "div", "", "surveyInfoRow", surveyIndex.toString());

  var surveyLocation = makeElement(surveyInfoRow, "input", getSurvey(surveyIndex).location, "editableSurveyInfo", "Location");
  surveyLocation.setAttribute("onchange", "setSurveyLocation('" + surveyLocation.id + "', " + surveyIndex.toString() + ")");
  
  var surveyDate = makeElement(surveyInfoRow, "input", getSurvey(surveyIndex).date, "editableSurveyInfo", "DateFrom");
  surveyDate.setAttribute("onchange", "setSurveyDate('" + surveyDate.id + "', " + surveyIndex.toString() + ")");
  
  var surveyDateTo = makeElement(surveyInfoRow, "input", getSurvey(surveyIndex).dateTo, "editableSurveyInfo", "DateTo");
  surveyDateTo.setAttribute("onchange", "setSurveyDateTo('" + surveyDateTo.id + "', " + surveyIndex.toString() + ")");
}

function editSurvey(surveyIndex)
{
  activeSurveyIndex = surveyIndex;

  var editorPanel = document.getElementById("editorPanel");
  editorPanel.innerHTML = "";
  
  var surveyPanel = makeElement(editorPanel, "div", "", "mainPanel", "");
  
  displaySurveyHeader(surveyPanel, surveyIndex);
  
  // survey buttons
  var surveyButtonPanel = makeElement(surveyPanel, "div", "", "buttonPanel", "");

  var setImageButton = makeButton(surveyButtonPanel, "addSurveyImage", surveyIndex, "Add Image", "addButton", "");
  
  var helpSurveyButton = makeButton(surveyButtonPanel, "surveyHelp", null, "Help", "helpButton", "");
  
  var saveSurveyButton = makeButton(surveyButtonPanel, "saveSurvey", surveyIndex, "Save and go back", "saveButton", "");
  
  makeElement(surveyButtonPanel, "span", "", "fakeButton", "");
  
  var runButton = makeButton(surveyButtonPanel, "goToSurveyLink", surveyIndex, "Run", "runButton", ""); 
  var visualiseButton = makeButton(surveyButtonPanel, "goToVisualiseLink", surveyIndex, "Visualise", "visualiseButton", "");
  var resultsButton = makeButton(surveyButtonPanel, "goToViewResultsLink", surveyIndex, "View Results", "resultsButton", "");
  var shareButton = makeButton(surveyButtonPanel, "copyLinks", surveyIndex, "Share", "shareButton", "");

  if (getQuestionCount(surveyIndex) <= 0)
  {
    runButton.setAttribute("disabled", true);
    visualiseButton.setAttribute("disabled", true);
    resultsButton.setAttribute("disabled", true);
    shareButton.setAttribute("disabled", true);
  }

  // question buttons
  makeElement(surveyPanel, "div", "", "break", "");
  
  var questionPanelHeader = makeElement(surveyPanel, "div", "QUESTIONS", "smallHeader", "");
  
  var questionButtonPanel = makeElement(surveyPanel, "div", "", "buttonPanel", "");
  
  for (var questionIndex = 0; questionIndex < getQuestionCount(surveyIndex); questionIndex++)
  {
    var questionType = getQuestionType(surveyIndex, questionIndex);

    var editQuestionButton = null;

    if (questionType == "button")
    {
      editQuestionButton = makeButton(questionButtonPanel, "editQuestion", [surveyIndex, questionIndex], getQuestionName(surveyIndex, questionIndex), "buttonQuestionButton", "");
    }
    else if (questionType == "input")
    {
      editQuestionButton = makeButton(questionButtonPanel, "editQuestion", [surveyIndex, questionIndex], getQuestionName(surveyIndex, questionIndex), "textQuestionButton", "");
    }
    else if (questionType == "imageQuestionAndAnswer")
    {
      editQuestionButton = makeButton(questionButtonPanel, "editQuestion", [surveyIndex, questionIndex], "Question " + (questionIndex + 1).toString(), "imageQuestionAndAnswerButton", "");
      var questionImage = makeElement(editQuestionButton, "img", "", "surveyImage", questionIndex.toString());
      questionImage.src = getQuestionImageUrl(surveyIndex, questionIndex);
    }
    else if (questionType == "imageQuestion")
    {
      editQuestionButton = makeButton(questionButtonPanel, "editQuestion", [surveyIndex, questionIndex], "Question " + (questionIndex + 1).toString(), "imageQuestionButton", "");
      var questionImage = makeElement(editQuestionButton, "img", "", "surveyImage", questionIndex.toString());
      questionImage.src = getQuestionImageUrl(surveyIndex, questionIndex);
    }
    else if (questionType == "imageAnswer")
    {
      editQuestionButton = makeButton(questionButtonPanel, "editQuestion", [surveyIndex, questionIndex], getQuestionName(surveyIndex, questionIndex), "imageAnswerButton", "");
    }
    
    var innerQuestionButtonPanel = makeElement(editQuestionButton, "div", "", "innerButtonPanel", questionIndex);
    
    // make inner button panel appear when mouse hovers over survey button
    editQuestionButton.setAttribute("onmouseenter", "showElement(this," + innerQuestionButtonPanel.id + ")");
    editQuestionButton.setAttribute("onmouseleave", "hideElement(this," + innerQuestionButtonPanel.id + ")");
    
    var deleteSurveyButton = makeInnerButton(innerQuestionButtonPanel, "removeQuestion", [surveyIndex, questionIndex], "", "deleteButton", surveyIndex);

    /*
    var questionDuplicateButton = makeElement(questionRow, "button", "duplicate", "questionDuplicateButton", questionIndex.toString());
    questionDuplicateButton.setAttribute("onclick", "duplicateQuestion(" + surveyIndex.toString() + ", " + questionIndex.toString() + ")");
    
    var questionShiftUpButton = makeElement(questionRow, "button", "up", "questionShiftUpButton", questionIndex.toString());
    questionShiftUpButton.setAttribute("onclick", "shiftQuestionUp(" + surveyIndex.toString() + ", " + questionIndex.toString() + ")");

    var questionShiftDownButton = makeElement(questionRow, "button", "down", "questionShiftDownButton", questionIndex.toString());
    questionShiftDownButton.setAttribute("onclick", "shiftQuestionDown(" + surveyIndex.toString() + ", " + questionIndex.toString() + ")");
    */
  }
  
  makeElement(questionButtonPanel, "div", "", "", "");

  var addQuestionButton = makeButton(questionButtonPanel, "addQuestion", surveyIndex, "Add Question", "addButton", "");
  
/*
  makeElement(surveyPanel, "span", "Show Welcome Message?:", "fieldHeader", surveyIndex.toString());
  var surveyShowWelcomeMessage = makeElement(surveyPanel, "input", "", "surveyShowWelcomeMessage", surveyIndex.toString());
  surveyShowWelcomeMessage.setAttribute("type", "checkbox");
  surveyShowWelcomeMessage.checked = getSurvey(surveyIndex).showWelcomeMessage;
  surveyShowWelcomeMessage.setAttribute("onchange", "setShowWelcomeMessage('" + surveyShowWelcomeMessage.id + "', " + surveyIndex.toString() + ")");
  
  makeElement(surveyPanel, "span", "Welcome Message:", "fieldHeader", surveyIndex.toString());
  var surveyWelcomeMessage = makeElement(surveyPanel, "input", getSurvey(surveyIndex).welcomeMessage, "surveyWelcomeMessage", surveyIndex.toString());
  surveyWelcomeMessage.setAttribute("onchange", "setSurveyWelcomeMessage('" + surveyWelcomeMessage.id + "', " + surveyIndex.toString() + ")");
  
  makeElement(surveyPanel, "span", "Show Welcome Image?:", "fieldHeader", surveyIndex.toString());
  var surveyShowWelcomeImage = makeElement(surveyPanel, "input", "", "surveyShowWelcomeImage", surveyIndex.toString());
  surveyShowWelcomeImage.setAttribute("type", "checkbox");
  surveyShowWelcomeImage.checked = getSurvey(surveyIndex).showWelcomeImage;
  surveyShowWelcomeImage.setAttribute("onchange", "setShowWelcomeImage('" + surveyShowWelcomeImage.id + "', " + surveyIndex.toString() + ")");

  makeElement(surveyPanel, "span", "Welcome Image URL:", "fieldHeader", surveyIndex.toString());
  var surveyWelcomeImage = makeElement(surveyPanel, "input", getSurvey(surveyIndex).welcomeImage, "surveyWelcomeImage", surveyIndex.toString());
  surveyWelcomeImage.setAttribute("onchange", "setSurveyWelcomeImage('" + surveyWelcomeImage.id + "', " + surveyIndex.toString() + ")");
  
  makeElement(surveyPanel, "span", "End Message:", "fieldHeader", surveyIndex.toString());
  var surveyEndMessage = makeElement(surveyPanel, "input", getSurvey(surveyIndex).endMessage, "surveyEndMessage", surveyIndex.toString());
  surveyEndMessage.setAttribute("onchange", "setSurveyEndMessage('" + surveyEndMessage.id + "', " + surveyIndex.toString() + ")");


  makeElement(surveyPanel, "span", "Button colours:", "fieldHeader", surveyIndex.toString());

  for (var buttonIndex = 0; buttonIndex < buttonCount; buttonIndex++)
  {
    var buttonColour = makeElement(surveyPanel, "input", "", "buttonColour" + buttonIndex.toString(), surveyIndex.toString());
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
*/
}

function editQuestion(surveyIndex, questionIndex, highlightIndex)
{
  activeSurveyIndex = surveyIndex;
  activeQuestionIndex = questionIndex;

  var editorPanel = document.getElementById("editorPanel");
  editorPanel.innerHTML = "";
  
  var surveyPanel = makeElement(editorPanel, "div", "", "mainPanel", "");
  
  displaySurveyHeader(surveyPanel, surveyIndex);
  
  // survey buttons
  var surveyButtonPanel = makeElement(surveyPanel, "div", "", "buttonPanel", "");
  
  // question image show upload button
  if (getQuestionType(surveyIndex, questionIndex) == "imageQuestion" || getQuestionType(surveyIndex, questionIndex) == "imageQuestionAndAnswer")
  {
    var questionImageButton = makeElement(surveyButtonPanel, "div", "", "imageButton", questionIndex.toString());
    var questionImage = makeElement(questionImageButton, "img", "", "questionImage", questionIndex.toString());
    questionImage.src = getQuestionImageUrl(surveyIndex, questionIndex);

    var questionFileButton = makeElement(surveyButtonPanel, "label", "", "uploadFileButton", questionIndex.toString());
    questionImage.src = getQuestionImageUrl(surveyIndex, questionIndex);
    
    var questionFileText = makeElement(questionFileButton, "div", "Upload image", "buttonText", questionIndex.toString());
    
    var questionFileProgress = makeElement(questionFileButton, "div", "no image selected", "questionFileProgress", questionIndex.toString());

    var questionFileInput = makeElement(surveyButtonPanel, "input", "", "questionFileInput", questionIndex.toString());
    questionFileInput.type = "file";
    questionFileInput.setAttribute("onchange", "uploadQuestionImage('" + questionFileInput.id + "', " + surveyIndex.toString() + ", " + questionIndex.toString() + ")");

    questionFileButton.setAttribute("for", questionFileInput.id.toString());
    
    makeElement(surveyButtonPanel, "span", "", "fakeButton", "");
  }
  else 
  {
    // text question
    var questionHeaderPanel = makeElement(surveyButtonPanel, "div", "", "editableQuestionPanel", questionIndex);

    var questionHeader = makeElement(questionHeaderPanel, "textarea", getQuestionName(surveyIndex, questionIndex), "editableQuestionField", questionIndex.toString());
    questionHeader.setAttribute("onchange", "setQuestionName('" + questionHeader.id + "', " + surveyIndex.toString() + ", " + questionIndex.toString() + ")");

    if (getQuestionType(surveyIndex, questionIndex) == "button")
    {
      var questionFieldIcon = makeElement(questionHeaderPanel, "div", "", "editableButtonFieldIcon", questionIndex);
    }
    else if (getQuestionType(surveyIndex, questionIndex) == "input")
    {
      var questionFieldIcon = makeElement(questionHeaderPanel, "div", "Q", "editableQuestionFieldIconLetter", questionIndex);

      var observationPanel = makeElement(surveyButtonPanel, "div", "", "editableObservationPanel", questionIndex);

      var observationFieldIcon = makeElement(observationPanel, "div", "", "editableObservationFieldIcon", questionIndex);

      var observationField = makeElement(observationPanel, "textarea", getQuestionInitialInput(surveyIndex, questionIndex), "editableObservationField", questionIndex);
      observationField.setAttribute("onchange", "setQuestionInitialInput('" + observationField.id + "', " + surveyIndex.toString() + ", " + questionIndex.toString() + ")");
    }
  }
 
  // Text answers
  if (getQuestionType(surveyIndex, questionIndex) == "button" || getQuestionType(surveyIndex, questionIndex) == "imageQuestion")
  {
    for (var answerIndex = 0; answerIndex < getAnswerCount(surveyIndex, questionIndex); answerIndex++)
    {
      // input answer create text box
      var answerFieldPanel = makeElement(surveyButtonPanel, "div", "", "editableAnswerPanel", questionIndex);

      var answerFieldIcon = makeElement(answerFieldPanel, "div", String.fromCharCode(97 + answerIndex).toUpperCase(), "editableAnswerFieldIcon", questionIndex);

      var answerField = makeElement(answerFieldPanel, "textarea", getAnswerName(surveyIndex, questionIndex, answerIndex), "editableAnswerField", answerIndex.toString());
      answerField.setAttribute("onchange", "setAnswerName('" + answerField.id + "', " + surveyIndex.toString() + ", " + questionIndex.toString() + ", " + answerIndex.toString() + ")");

      /*
      var answerShiftUpButton = makeElement(answerRow, "button", "up", "answerShiftUpButton", answerIndex.toString());
      answerShiftUpButton.setAttribute("onclick", "shiftAnswerUp(" + surveyIndex.toString() + ", " + questionIndex.toString() + ", " + answerIndex.toString() + ")");

      var answerShiftDownButton = makeElement(answerRow, "button", "down", "answerShiftDownButton", answerIndex.toString());
      answerShiftDownButton.setAttribute("onclick", "shiftAnswerDown(" + surveyIndex.toString() + ", " + questionIndex.toString() + ", " + answerIndex.toString() + ")");
      */
    }
  }
  // Image answers
  else if (getQuestionType(surveyIndex, questionIndex) == "imageAnswer" || getQuestionType(surveyIndex, questionIndex) == "imageQuestionAndAnswer")
  {
    var answerPanelHeader = makeElement(surveyButtonPanel, "div", "ANSWERS", "smallHeader", "");
  
    for (var answerIndex = 0; answerIndex < getAnswerCount(surveyIndex, questionIndex); answerIndex++)
    {
      var answerFileButton = makeElement(surveyButtonPanel, "label", "", "uploadFileButton", answerIndex.toString());

      var answerImage = makeElement(answerFileButton, "img", "", "answerImage", answerIndex.toString());
      answerImage.src = getAnswerImageUrl(surveyIndex, questionIndex, answerIndex);

      var answerFileText = makeElement(answerFileButton, "div", "Answer " + (answerIndex + 1).toString(), "buttonText", answerIndex.toString());
    
      var answerFileProgress = makeElement(answerFileButton, "div", "no image selected", "answerFileProgress", answerIndex.toString());

      var answerFileInput = makeElement(surveyButtonPanel, "input", "", "answerFileInput", answerIndex.toString());
      answerFileInput.type = "file";
      answerFileInput.setAttribute("onchange", "uploadAnswerImage('" + answerFileInput.id + "', " + surveyIndex.toString() + ", " + questionIndex.toString() + ", " + answerIndex.toString() + ")");

      answerFileButton.setAttribute("for", answerFileInput.id.toString());
    }

    var answerButtonBreak = makeElement(surveyButtonPanel, "div", "", "", "");
  }

  if (getQuestionType(surveyIndex, questionIndex) != "input")
  {
    var addAnswerButton = makeButton(surveyButtonPanel, "addAnswer", [surveyIndex, questionIndex], "Add an answer", "addButton", "");

    if (getAnswerCount(surveyIndex, questionIndex) >= 4)
    {
      addAnswerButton.setAttribute("disabled", false);
    }

    var removeAnswerButton = makeButton(surveyButtonPanel, "removeAnswer", [surveyIndex, questionIndex, getAnswerCount(surveyIndex, questionIndex) - 1], "Remove last answer", "deleteButton", "");
    
    if (getAnswerCount(surveyIndex, questionIndex) <= 1)
    {
      removeAnswerButton.setAttribute("disabled", false);
    }
  }
  
  var saveQuestionButton = makeButton(surveyButtonPanel, "saveQuestion", [surveyIndex, questionIndex], "Save and go back", "saveButton", "");
}

function setSurveyName(elementId, surveyIndex)
{
  surveys["survey" + surveyIndex.toString()].surveyName = document.getElementById(elementId).value;
}

function setSurveyDate(elementId, surveyIndex)
{
  surveys["survey" + surveyIndex.toString()].date = document.getElementById(elementId).value;
}

function setSurveyDateTo(elementId, surveyIndex)
{
  surveys["survey" + surveyIndex.toString()].dateTo = document.getElementById(elementId).value;
}

function setSurveyLocation(elementId, surveyIndex)
{
  surveys["survey" + surveyIndex.toString()].location = document.getElementById(elementId).value;
}

function setShowWelcomeMessage(showMessage, surveyIndex)
{
  surveys["survey" + surveyIndex.toString()].showWelcomeMessage = showMessage;
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

function setQuestionType(questionType, surveyIndex, questionIndex)
{
  surveys["survey" + surveyIndex.toString()].questions["question" + questionIndex.toString()].questionType = questionType;
}

// stores firebase storage url after uploading image in uploadQuestionImage()
function setQuestionImageUrl(surveyIndex, questionIndex, imageUrl)
{
  surveys["survey" + surveyIndex.toString()].questions["question" + questionIndex.toString()].imageUrl = imageUrl;
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

// stores firebase storage url after uploading image in uploadAnswerImage()
function setAnswerImageUrl(surveyIndex, questionIndex, answerIndex, imageUrl)
{
  surveys["survey" + surveyIndex.toString()].questions["question" + questionIndex.toString()].answers["answer" + answerIndex.toString()].imageUrl = imageUrl;
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

  var newSurveyIndex = getSurveyCount();

  if (newSurveyIndex == 0)
  {
    surveys = {};
  }

  surveys["survey" + newSurveyIndex.toString()] = { "surveyName":"Give me a name", "date":"A date from...", "dateTo":"A date to...", "location":"Where am I?", "buttonColours":{"button0":defaultButtonColours[0], "button1":defaultButtonColours[1], "button2":defaultButtonColours[2], "button3":defaultButtonColours[3]}, "welcomeMessage":defaultWelcomeMessage, "showWelcomeMessage":false, "welcomeImage":"images/default-background.jpg", "showWelcomeImage":false, "endMessage":defaultEndMessage, "questions":{}};

  saveAll();

  goToEditLink(newSurveyIndex);
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
  if (jQuery.isEmptyObject(surveys["survey" + surveyIndex.toString()].questions))
  {
    surveys["survey" + surveyIndex.toString()].questions = {};
  }

  var questionIndex = getQuestionCount(surveyIndex).toString();

  surveys["survey" + surveyIndex.toString()].questions["question" + questionIndex] = { "questionName":"Type in question here", "questionType":"input", "imageUrl":"", "questionInitialInput":"Type in your observation here", "answers":{"answer0":{"answerName":"Type in answer here", "responses":0, "imageUrl":""}}, "textAnswers":{"textAnswer0":""}};
  
  // show question types
  var editorPanel = document.getElementById("editorPanel");
  editorPanel.innerHTML = "";
  
  var surveyPanel = makeElement(editorPanel, "div", "", "mainPanel", "")
  
  displaySurveyHeader(surveyPanel, surveyIndex);
  
  // question type buttons
  var questionTypeHeader = makeElement(surveyPanel, "div", "QUESTION TYPE", "smallHeader", "");
  
  var questionTypeButtonPanel = makeElement(surveyPanel, "div", "", "buttonPanel", "");
  
  var textQuestionButton = makeButton(questionTypeButtonPanel, "setQuestionTypeAndEdit", [surveyIndex, questionIndex, "input"], "Text observation", "textQuestionButton", ""); 
  var buttonQuestionButton = makeButton(questionTypeButtonPanel, "setQuestionTypeAndEdit", [surveyIndex, questionIndex, "button"], "Text buttons", "buttonQuestionButton", "");
  var imageQuestionButton = makeButton(questionTypeButtonPanel, "setQuestionTypeAndEdit", [surveyIndex, questionIndex, "imageQuestionAndAnswer"], "Image question and answer", "imageQuestionAndAnswerButton", "");
  var imageQuestionButton = makeButton(questionTypeButtonPanel, "setQuestionTypeAndEdit", [surveyIndex, questionIndex, "imageQuestion"], "Image question", "imageQuestionButton", "");
  var imageAnswerButton = makeButton(questionTypeButtonPanel, "setQuestionTypeAndEdit", [surveyIndex, questionIndex, "imageAnswer"], "Image answer", "imageAnswerButton", "");
  var sensorQuestionButton = makeButton(questionTypeButtonPanel, "setQuestionTypeAndEdit", [surveyIndex, questionIndex, "sensor"], "Sensor", "sensorQuestionButton", "");
  var mapQuestionButton = makeButton(questionTypeButtonPanel, "setQuestionTypeAndEdit", [surveyIndex, questionIndex, "map"], "Map", "mapQuestionButton", "");
  
  sensorQuestionButton.setAttribute("disabled", true);
  mapQuestionButton.setAttribute("disabled", true);
}

function setQuestionTypeAndEdit(surveyIndex, questionIndex, questionType)
{
  setQuestionType(questionType, surveyIndex, questionIndex);

  editQuestion(surveyIndex, questionIndex);
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
    surveys["survey" + surveyIndex.toString()].questions["question" + questionIndex.toString()].answers["answer" + newAnswerIndex.toString()] = { "answerName":"Type in answer here", "responses":0, "imageUrl":"" };

    editQuestion(surveyIndex, questionIndex, newAnswerIndex);
  }
  else
  {
    alert("You cannot have more than four answers");
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

    saveAll();
  }

  displaySurveys();
}

function removeQuestion(surveyIndex, questionIndex)
{
  if (confirm("Are you sure you wish to remove this question? The action cannot be undone and will delete the associated data."))
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

function saveSurveyDontGoBack(surveyIndex)
{
  syncSurvey(surveyIndex, -1);
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

function uploadQuestionImage(elementId, surveyIndex, questionIndex)
{
  var fileInput = document.getElementById(elementId);
  var fileProgress = document.getElementById("questionFileProgress" + questionIndex.toString());

  var file = fileInput.files[0];
  
  var uploadTask = storageRef.child("images/survey" + surveyIndex.toString() + "/question" + questionIndex.toString() + "/question.jpg").put(file);
  
  uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function(snapshot) {
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED:
          fileProgress.innerHTML = "paused";
          break;
        case firebase.storage.TaskState.RUNNING:
          fileProgress.innerHTML = (Math.trunc(progress)).toString() + "%";
          break;
      }
    }, function(error) {
      alert(error.toString());
      fileProgress.innerHTML = "upload image";
    }, function() {
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        document.getElementById("questionImage" + questionIndex.toString()).src = downloadURL;
        fileProgress.innerHTML = "uploaded!";
        
        // store image url for displaying in survey
        setQuestionImageUrl(surveyIndex, questionIndex, downloadURL);
      });
  });
}

function uploadAnswerImage(elementId, surveyIndex, questionIndex, answerIndex)
{
  var fileInput = document.getElementById(elementId);
  var fileProgress = document.getElementById("answerFileProgress" + answerIndex.toString());

  var file = fileInput.files[0];
  
  var uploadTask = storageRef.child("images/survey" + surveyIndex.toString() + "/question" + questionIndex.toString() + "/answer" + answerIndex.toString() + "/answer.jpg").put(file);
  
  uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function(snapshot) {
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED:
          fileProgress.innerHTML = "paused";
          break;
        case firebase.storage.TaskState.RUNNING:
          fileProgress.innerHTML = (Math.trunc(progress)).toString() + "%";
          break;
      }
    }, function(error) {
      alert(error.toString());
      fileProgress.innerHTML = "upload image";
    }, function() {
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        document.getElementById("answerImage" + answerIndex.toString()).src = downloadURL;
        fileProgress.innerHTML = "uploaded!";
        
        // store image url for displaying in survey
        setAnswerImageUrl(surveyIndex, questionIndex, answerIndex, downloadURL);
      });
  });
}