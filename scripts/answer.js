function initSurvey(surveyIndex)
{
  runSurvey(surveyIndex);
}

function initNoSurvey()
{
  alert("the given survey could not be found");
}

function transitionSurveyRightToCenter()
{
  if (isMobile)
  {
    return;
  }

  document.getElementById("activePanel").classList.remove("moveCenterLeft");
  document.getElementById("activePanel").classList.add("moveRightCenter");
}

function transitionSurveyCenterToLeft()
{
  if (isMobile)
  {
    return;
  }

  document.getElementById("activePanel").classList.remove("moveRightCenter");
  document.getElementById("activePanel").classList.add("moveCenterLeft");
}

function shrinkButtons(answerIndex, textResponse = false)
{
  if (textResponse == true)
  {
    activeButtons[answerIndex].classList.add("grow");
  }
  else
  {
    for (var buttonIndex = 0; buttonIndex < buttonCount; buttonIndex++)
    {
      if (buttonIndex == answerIndex)
      {
        activeButtons[buttonIndex].classList.add("grow");
      }
      else
      {
        activeButtons[buttonIndex].classList.add("shrink");
      }
    }
  }
}

function runSurvey(surveyIndex)
{
  document.getElementById("editorPanel").innerHTML = "";
  document.getElementById("editorPanel").style.visibility = "hidden";
  document.getElementById("activePanel").style.visibility = "visible";
  
  runningSurvey = true;
  
  document.body.style.overflow = "hidden";

  activeSurveyIndex = surveyIndex;
  activeQuestionIndex = 0;

  for (var buttonIndex = 0; buttonIndex < buttonCount; buttonIndex++)
  {
    buttonColours[buttonIndex] = getSurvey(surveyIndex).buttonColours["button" + buttonIndex.toString()];
  }
   
  if (getSurvey(activeSurveyIndex).showWelcomeMessage == true)
  {
    displayWelcomeMessage();
  }
  else
  {
    displayActiveQuestion();
  }
}

function displayActiveQuestion()
{
  var surveyIndex = activeSurveyIndex;
  var questionIndex = activeQuestionIndex;

  var activePanel = document.getElementById("activePanel");
  activePanel.innerHTML = "";
  
  if (getQuestionType(surveyIndex, questionIndex) == "image")
  {
    var questionImage = makeElement(activePanel, "img", "loading image", "activeQuestionImage", questionIndex.toString());
    questionImage.src = getQuestionImageUrl(surveyIndex, questionIndex);
  }

  var questionHeader = makeElement(activePanel, "div", getQuestionName(surveyIndex, questionIndex), "activeQuestionHeader", questionIndex.toString());

  if (getQuestionType(surveyIndex, questionIndex) == "input")
  {
    var textAnswerPanel = makeElement(activePanel, "div", "", "activeTextAnswerPanel", "")
  
    activeButtons = [];

    var answerTextInput = makeElement(textAnswerPanel, "textarea", "", "answerTextInput", "0");
    answerTextInput.value = getQuestionInitialInput(surveyIndex, questionIndex).toString();

    var answerSubmitButton = makeElement(textAnswerPanel, "button", "submit", "answerSubmitButton", "0");
    answerSubmitButton.setAttribute("onclick", "saveTextResponse('" + answerTextInput.id + "')");
      
    activeButtons.push(answerSubmitButton);
  }

  if (getQuestionType(surveyIndex, questionIndex) == "button" || getQuestionType(surveyIndex, questionIndex) == "image")
  {
    var answerPanel = makeElement(activePanel, "div", "", "activeAnswerPanel", "")
  
    activeButtons = [];

    for (var buttonIndex = 0; buttonIndex < buttonCount; buttonIndex++)
    {
      var answerSelectButton;

      if (buttonIndex < getAnswerCount(surveyIndex, questionIndex))
      {
        answerSelectButton = makeElement(answerPanel, "button", getAnswerName(surveyIndex, questionIndex, buttonIndex), "answerSelectButton", buttonIndex.toString());
        answerSelectButton.setAttribute("onclick", "saveResponse(" + buttonIndex.toString() + ")");
        
        if (getQuestionType(surveyIndex, questionIndex) == "image")
        {
          answerSelectButton.style.backgroundImage = "url(" + getAnswerImageUrl(surveyIndex, questionIndex, buttonIndex) + ")";
          answerSelectButton.style
        }

        var buttonColour = buttonColours[buttonIndex];

        if (buttonColour.includes("#") == false)
        {
          buttonColour = "#" + buttonColour.toString();
        }
  
        answerSelectButton.style.backgroundColor = buttonColour;
      }
      else
      {
        answerSelectButton = makeElement(answerPanel, "button", "", "inactiveAnswerSelectButton", buttonIndex.toString());
      }

      activeButtons.push(answerSelectButton);
    }
  }

  transitionSurveyRightToCenter();
}

function saveResponse(answerIndex)
{
  surveys["survey" + activeSurveyIndex.toString()].questions["question" + activeQuestionIndex.toString()].answers["answer" + answerIndex.toString()].responses += 1;

  displayNextQuestion(false, answerIndex);
}

function saveTextResponse(elementId)
{
  if (surveys["survey" + activeSurveyIndex.toString()].questions["question" + activeQuestionIndex.toString()].textAnswers == undefined)
  {
    surveys["survey" + activeSurveyIndex.toString()].questions["question" + activeQuestionIndex.toString()].textAnswers = { "textAnswer0": "" };
  }

  var textAnswer = document.getElementById(elementId).value;

  var textAnswerCount = getTextAnswerCount(activeSurveyIndex, activeQuestionIndex);

  if (textAnswerCount == 1 && surveys["survey" + activeSurveyIndex.toString()].questions["question" + activeQuestionIndex.toString()].textAnswers["textAnswer0"] == "")
  {
  // if the default answer is empty add new answer
    surveys["survey" + activeSurveyIndex.toString()].questions["question" + activeQuestionIndex.toString()].textAnswers["textAnswer0"] = textAnswer;
  }
  else
  {
  // otherwise add a new answer to the end of the list
    surveys["survey" + activeSurveyIndex.toString()].questions["question" + activeQuestionIndex.toString()].textAnswers["textAnswer" + textAnswerCount.toString()] = textAnswer;
  }

  displayNextQuestion(false, 0, true);
}

function displayNextQuestion(firstQuestion, answerIndex, textResponse = false)
{
  displayingWelcomeMessage = false;

  var transitionDelay = 0;

  pressSound.play();

  if (firstQuestion == false)
  {
    activeQuestionIndex += 1;
    shrinkButtons(answerIndex, textResponse);
    transitionDelay = buttonShrinkTime;
  }

  setTimeout(transitionSurveyCenterToLeft, transitionDelay);

  if (activeQuestionIndex >= getQuestionCount(activeSurveyIndex))
  {
    setTimeout(displayEndMessage, transitionTime + transitionDelay);
  }
  else
  {
    setTimeout(displayActiveQuestion, transitionTime + transitionDelay);
  }
}

function displayWelcomeMessage()
{
  displayingWelcomeMessage = true;

  var activePanel = document.getElementById("activePanel");
  activePanel.innerHTML = "";

  var welcomeMessage = makeElement(activePanel, "div", getSurvey(activeSurveyIndex).welcomeMessage, "activeWelcomeMessage", "")

  var continueMessage = makeElement(activePanel, "div", defaultContinueMessage, "continueMessage", "")

  var answerPanel = makeElement(activePanel, "div", "", "activeAnswerPanel", "")

  if (getSurvey(activeSurveyIndex).showWelcomeImage)
  {
      var imagePanel = makeElement(activePanel, "div", "", "imagePanel", "");
      imagePanel.style.backgroundImage = "url('" + getSurvey(activeSurveyIndex).welcomeImage + "')";
  }

  activeButtons = [];

  for (var buttonIndex = 0; buttonIndex < buttonCount; buttonIndex++)
  {
    var answerSelectButton = makeElement(answerPanel, "button", "", "inactiveAnswerSelectButton", buttonIndex.toString());
    answerSelectButton.setAttribute("onclick", "displayNextQuestion(true, 0)");
    answerSelectButton.style.visibility = "hidden";
    activeButtons.push(answerSelectButton);
  }

  transitionSurveyRightToCenter();
}

function displayEndMessage()
{
  displayingEndMessage = true;

  var activePanel = document.getElementById("activePanel");
  activePanel.innerHTML = "";
    
  var endMessage = makeElement(activePanel, "div", getSurvey(activeSurveyIndex).endMessage, "activeEndMessage", "")

  var continueMessage = makeElement(activePanel, "div", defaultContinueMessageEnd, "continueMessage", "")

  var answerPanel = makeElement(activePanel, "div", "", "activeAnswerPanel", "")

  activeButtons = [];

  for (var buttonIndex = 0; buttonIndex < buttonCount; buttonIndex++)
  {
    var answerSelectButton = makeElement(answerPanel, "button", "", "inactiveAnswerSelectButton", buttonIndex.toString());
    answerSelectButton.style.visibility = "hidden";

    activeButtons.push(answerSelectButton);
  }

    transitionSurveyRightToCenter();

    syncSurvey(activeSurveyIndex, -1);
}
