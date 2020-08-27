// test if mobile device

var isMobile = false; //initiate as false

// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
    isMobile = true;
}

// Firebase config
var config = {
  apiKey: "AIzaSyD6ebHtW_RPFdr3C9swZJ7Km85FwYsRenk",
  authDomain: "biomefeedback.firebaseapp.com",
  databaseURL: "https://biomefeedback.firebaseio.com",
  projectId: "biomefeedback"
};

var baseURL = "http://jctwizard.github.io/biomefeedback/"
//var baseURL = "file:///C:/Users/James/Documents/Projects/biomefeedback/"
var editURLExtension = "edit/index.html?survey=";
var answerURLExtension = "answer/index.html?survey=";
var visualiseURLExtension = "visualise/index.html?survey=";

var surveys = {};

var activeSurveyIndex = 0;
var activeQuestionIndex = 0;
var activeButtons = [];

var buttonCount = 4;
var defaultButtonColours = ["fbb14b", "527db5", "734f8d", "61bf91"];
var buttonColours = ["fbb14b", "527db5", "734f8d", "61bf91"];

var online = false;
var runningSurvey = false;
var displayingWelcomeMessage = false;
var displayingEndMessage = false;

var defaultWelcomeMessage = "Take a moment to answer some questions for us? Click to continue.";
var defaultEndMessage = "Thank you for answering some questions! You can now close this window.";
var defaultContinueMessageEnd = "You can now close this window!";
var defaultContinueMessage = "Click a button!";

var transitionTime = 0.5 * 1000;

if (isMobile)
{
  transitionTime = 0;
}

var buttonShrinkTime = 0.4 * 1000;

var pressSound;

function init()
{
  online = navigator.onLine;

  if (online)
  {
    console.log("online");

    // Initialize Firebase
    firebase.initializeApp(config);

    // Authenticate user
    firebase.auth().signInWithEmailAndPassword("biome@feedback.com", "videogames").catch(function(error) {
      console.log(error.code);
      console.log(error.message);
    });
      
    // Read survey data
    firebase.database().ref("surveys").once("value").then(function(data) {
      surveys = data.val();

      if (surveys == null)
      {
        surveys = {};
      }

      var surveyFound = false;

      // Check if specific survey has been included in url parameters
      var queryParameters = getQueryParameters();

      if (queryParameters.survey != undefined)
      {
        for (var surveyIndex = 0; surveyIndex < getSurveyCount(); surveyIndex++)
        {
          if (surveyNameURL(getSurveyName(surveyIndex)) == surveyNameURL(queryParameters.survey))
          {
            initSurvey(surveyIndex);

            surveyFound = true;

            break;
          }
        }

        if (surveyFound == false)
        {
          initNoSurvey();
        }
      }
      else
      {
        initNoSurvey();
      }
    });
  }
  else
  {
    console.log("offline");
    alert("Error you appear to be offline.");
  }

  pressSound = new Howl({ src: ["sounds/press.mp3"] });

  if (window.addEventListener)
  {
    window.addEventListener("online", goOnline, false);
    window.addEventListener("offline", goOffline, false);
    window.addEventListener("mousedown", handleMouseDown, false);
  }
  else
  {
    document.body.ononline = goOnline;
    document.body.onoffline = goOffline;
    document.body.mousedown = handleMouseDown;
  }
}

function syncSurvey(surveyIndex, questionIndex) {
    if (online) {
        if (surveyIndex == -1) {
            storeAllOnline();
        }
        else if (questionIndex == -1) {
            storeSurveyOnline(surveyIndex);
        }
        else {
            storeQuestionOnline(surveyIndex, questionIndex);
        }
    }
    else {
        alert("Not connected to database. Check your internet connection.");
    }
}

function storeAllOnline()
{
  firebase.database().ref('surveys').set(getSurveys());
}

function storeSurveyOnline(surveyIndex)
{
  firebase.database().ref('surveys/survey' + surveyIndex.toString()).set(getSurveys()["survey" + surveyIndex.toString()]);
}

function storeQuestionOnline(surveyIndex, questionIndex)
{
  firebase.database().ref('surveys/survey' + surveyIndex.toString() + "/questions/question" + questionIndex.toString()).set(getQuestions(surveyIndex)["question" + questionIndex.toString()]);
}

function goOnline() {
    if (online == false) {
        online = true;
    }
}

function goOffline() {
    if (online == true) {
        online = false;
    }
}

function isJsonString(str)
{
    try
    {
        JSON.parse(str);
    }
    catch (e)
    {
        return false;
    }

    return true;
}

function makeElement(parent, type, content, name, suffix)
{
  var newElement = document.createElement(type);

  newElement.id = name + suffix;
  newElement.className = name;
  newElement.innerHTML = content;
  newElement.value = content;

  parent.appendChild(newElement);

  return newElement;
}

function getSurveyCount()
{
  return Object.keys(surveys).length;
}

function getQuestionCount(surveyIndex)
{
  return Object.keys(surveys["survey" + surveyIndex.toString()].questions).length;
}

function getAnswerCount(surveyIndex, questionIndex)
{
  return Object.keys(surveys["survey" + surveyIndex.toString()].questions["question" + questionIndex.toString()].answers).length;
}

function getSurveyName(surveyIndex)
{
  return surveys["survey" + surveyIndex.toString()].surveyName;
}

function getQuestionName(surveyIndex, questionIndex)
{
  return surveys["survey" + surveyIndex.toString()].questions["question" + questionIndex.toString()].questionName;
}

function getQuestionType(surveyIndex, questionIndex)
{
  return surveys["survey" + surveyIndex.toString()].questions["question" + questionIndex.toString()].questionType;
}

function getQuestionInitialInput(surveyIndex, questionIndex)
{
  return surveys["survey" + surveyIndex.toString()].questions["question" + questionIndex.toString()].questionInitialInput;
}

function getAnswerName(surveyIndex, questionIndex, answerIndex)
{
  return surveys["survey" + surveyIndex.toString()].questions["question" + questionIndex.toString()].answers["answer" + answerIndex.toString()].answerName;
}

function getSurvey(surveyIndex)
{
  return surveys["survey" + surveyIndex.toString()];
}

function getSurveys()
{
  return surveys;
}

function getQuestions(surveyIndex)
{
  return surveys["survey" + surveyIndex.toString()].questions;
}

function getAnswers(surveyIndex, questionIndex)
{
  return surveys["survey" + surveyIndex.toString()].questions["question" + questionIndex.toString()].answers;
}

function getAnswerResponses(surveyIndex, questionIndex, answerIndex)
{
  return surveys["survey" + surveyIndex.toString()].questions["question" + questionIndex.toString()].answers["answer" + answerIndex.toString()].responses;
}

function getTextAnswerResponses(surveyIndex, questionIndex, answerKey)
{
  return surveys["survey" + surveyIndex.toString()].questions["question" + questionIndex.toString()].textAnswers[answerKey];
}

function getTextAnswers(surveyIndex, questionIndex)
{
  return surveys["survey" + surveyIndex.toString()].questions["question" + questionIndex.toString()].textAnswers;
}

function getTotalResponses(surveyIndex)
{
  var responses = 0;

  for (var answerIndex = 0; answerIndex < getAnswerCount(surveyIndex, 0); answerIndex++)
  {
    responses += getAnswerResponses(surveyIndex, 0, answerIndex);
  }

  return responses;
}

function displaySurveys()
{
  var editorPanel = document.getElementById("editorPanel");

  editorPanel.innerHTML = "";

  document.body.style.cursor = "default";
    
  var surveyPanel = makeElement(editorPanel, "div", "", "surveyPanel", "");
  
  var surveyHeader = makeElement(surveyPanel, "div", "Audience Insights Survey Editor", "fieldHeader", "");

  makeElement(surveyPanel, "hr", "", "break", "");
  
  var surveyPanelHeader = makeElement(surveyPanel, "div", "Surveys:", "questionTitle", "");

  for (var surveyIndex = 0; surveyIndex < getSurveyCount(); surveyIndex++)
  {
    var surveyRow = makeElement(surveyPanel, "div", "", "surveyRow", surveyIndex.toString());

    var surveyTitle = makeElement(surveyRow, "div", getSurveyName(surveyIndex), "surveyTitle", surveyIndex.toString());

    var surveyEditButton = makeElement(surveyRow, "button", "edit survey", "surveyEditButton", surveyIndex.toString());
    surveyEditButton.setAttribute("onclick", "goToEditLink(" + surveyIndex.toString() + ")");

    var surveyDuplicateButton = makeElement(surveyRow, "button", "duplicate survey", "surveyDuplicateButton", surveyIndex.toString());
    surveyDuplicateButton.setAttribute("onclick", "duplicateSurvey(" + surveyIndex.toString() + ")");

    var surveyRemoveButton = makeElement(surveyRow, "button", "remove survey", "surveyRemoveButton", surveyIndex.toString());
    surveyRemoveButton.setAttribute("onclick", "removeSurvey(" + surveyIndex.toString() + ")");

    var surveyRunButton = makeElement(surveyRow, "button", "run survey", "surveyRunButton", surveyIndex.toString());
    surveyRunButton.setAttribute("onclick", "goToSurveyLink(" + surveyIndex.toString() + ")");

    var surveyResultsButton = makeElement(surveyRow, "button", "view results", "surveyResultsButton", surveyIndex.toString());
    surveyResultsButton.setAttribute("onclick", "goToVisualiseLink(" + surveyIndex.toString() + ")");
    
    var surveyLinkButton = makeElement(surveyRow, "button", "survey link", "surveyLinkButton", surveyIndex.toString());
    surveyLinkButton.setAttribute("onclick", "copyAnswerLink(" + surveyIndex.toString() + ")");
    
    var editLinkButton = makeElement(surveyRow, "button", "edit link", "editLinkButton", surveyIndex.toString());
    editLinkButton.setAttribute("onclick", "copyEditLink(" + surveyIndex.toString() + ")");
    
    var visualiseLinkButton = makeElement(surveyRow, "button", "visualise link", "visualiseLinkButton", surveyIndex.toString());
    visualiseLinkButton.setAttribute("onclick", "copyVisualiseLink(" + surveyIndex.toString() + ")");
  }

  makeElement(editorPanel, "hr", "", "break", "");

  var addSurveyButton = makeElement(editorPanel, "button", "add survey", "addSurveyButton", "");
  addSurveyButton.setAttribute("onclick", "addSurvey()");

  var saveSurveysButton = makeElement(editorPanel, "button", "save changes", "saveSurveysButton", "");
  saveSurveysButton.setAttribute("onclick", "saveAll()");
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
    buttonColour.value = getSurvey(surveyIndex).buttonColours["button" + buttonIndex];
    buttonColour.style.backgroundColor = "#" + buttonColour.value;
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
  document.getElementById(elementId).style.backgroundColor = "#" + document.getElementById(elementId).value;
  surveys["survey" + surveyIndex.toString()].buttonColours["button" + buttonIndex.toString()] = document.getElementById(elementId).value;
}

function addSurvey()
{
  console.log(surveys);

  surveys["survey" + getSurveyCount().toString()] = { "surveyName":"new survey", "date":"0/0/0", "location":"Scotland", "buttonColours":{"button0":defaultButtonColours[0], "button1":defaultButtonColours[1], "button2":defaultButtonColours[2], "button3":defaultButtonColours[3]}, "welcomeMessage":defaultWelcomeMessage, "showWelcomeMessage":false, "welcomeImage":"images/default-background.jpg", "showWelcomeImage":false, "endMessage":defaultEndMessage, "questions": {"question0":{"questionName":"new question", "questionType":"button", "questionInitialInput":"enter answer", "answers":{"answer0":{"answerName":"new answer", "responses":0}}, "textAnswers":{"empty":0}}}};

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
  }

  displaySurveys();
}

function addQuestion(surveyIndex)
{
  surveys["survey" + surveyIndex.toString()].questions["question" + getQuestionCount(surveyIndex).toString()] = { "questionName":"new question", "questionType":"button", "questionInitialInput":"enter answer", "answers":{"answer0":{"answerName":"new answer", "responses":0}}, "textAnswers":{"empty":0}};

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

  if (getQuestionType(surveyIndex, questionIndex) == "button")
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
        answerSelectButton.style.backgroundColor = "#" + buttonColours[buttonIndex];
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
    surveys["survey" + activeSurveyIndex.toString()].questions["question" + activeQuestionIndex.toString()].textAnswers = { "empty": 0 };
  }

  var textAnswer = document.getElementById(elementId).value;

  if (surveys["survey" + activeSurveyIndex.toString()].questions["question" + activeQuestionIndex.toString()].textAnswers[textAnswer] == undefined)
  {
    surveys["survey" + activeSurveyIndex.toString()].questions["question" + activeQuestionIndex.toString()].textAnswers[textAnswer] = 0;
  }

  surveys["survey" + activeSurveyIndex.toString()].questions["question" + activeQuestionIndex.toString()].textAnswers[textAnswer] += 1;

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

function viewSurveyResults(surveyIndex)
{
  var editorPanel = document.getElementById("editorPanel");
  editorPanel.innerHTML = "";

  var surveyHeader = makeElement(editorPanel, "div", getSurveyName(surveyIndex), "surveyResultsHeader", surveyIndex.toString());
  var surveyDate = makeElement(editorPanel, "div", getSurvey(surveyIndex).date, "surveyResultsDate", surveyIndex.toString());
  var surveyLocation = makeElement(editorPanel, "div", getSurvey(surveyIndex).location, "surveyResultsLocation", surveyIndex.toString());

  var questionPanel = makeElement(editorPanel, "div", "", "questionPanel", "")

  for (var questionIndex = 0; questionIndex < getQuestionCount(surveyIndex); questionIndex++)
  {
    var questionRow = makeElement(questionPanel, "div", "", "questionRow", questionIndex.toString());

    var questionTitle = makeElement(questionRow, "div", getQuestionName(surveyIndex, questionIndex), "questionResultsTitle", questionIndex.toString());

    makeElement(questionPanel, "hr", "", "break", "");

    var answerPanel = makeElement(questionRow, "div", "", "answerPanel", questionIndex.toString())

    for (var answerIndex = 0; answerIndex < getAnswerCount(surveyIndex, questionIndex); answerIndex++)
    {
      var answerRow = makeElement(answerPanel, "div", "", "answerRow", answerIndex.toString());

      var answerTitle = makeElement(answerRow, "span", getAnswerName(surveyIndex, questionIndex, answerIndex), "answerResultsTitle", answerIndex.toString());

      var answerResponses = makeElement(answerRow, "span", getAnswerResponses(surveyIndex, questionIndex, answerIndex), "answerResultsResponses", answerIndex.toString());
    }

    var textAnswers = getTextAnswers(surveyIndex, questionIndex);

    console.log("text answers: " + textAnswers.toString());

    for (var textAnswerKey in textAnswers)
    {
      var answerRow = makeElement(answerPanel, "div", "", "answerRow", answerIndex.toString());

      var answerTitle = makeElement(answerRow, "span", textAnswerKey, "textAnswerResultsTitle", answerIndex.toString());

      var answerResponses = makeElement(answerRow, "span", getTextAnswerResponses(surveyIndex, questionIndex, textAnswerKey), "textAnswerResultsResponses", answerIndex.toString());
    }
  }

  makeElement(editorPanel, "span", "Total Responses", "totalResultsResponsesHeader", "");
  var totalResponses = makeElement(editorPanel, "span", getTotalResponses(surveyIndex), "totalResultsResponses", questionIndex.toString());

  makeElement(editorPanel, "hr", "", "break", "");

  var exportLink = makeElement(editorPanel, "a", "export", "exportLink", surveyIndex.toString());
  var blob = new Blob(["\ufeff", constructCsv(surveyIndex)]);
  var url = URL.createObjectURL(blob);
  exportLink.href = url;
  exportLink.download = "results.csv";

  var backButton = makeElement(editorPanel, "button", "back", "backButton", surveyIndex.toString());
  backButton.setAttribute("onclick", "displaySurveys()");
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
        for (var answerIndex = 0; answerIndex < getAnswerCount(surveyIndex, questionIndex); answerIndex++)
        {
          var line = "";

          if (answerIndex == 0)
          {
            line += getQuestionName(surveyIndex, questionIndex) + ",";
          }
          else
          {
            line += ",";
          }

          line += getAnswerName(surveyIndex, questionIndex, answerIndex) + "," + getAnswerResponses(surveyIndex, questionIndex, answerIndex);

          str += line + "\n";
        }
    }

    str += "\nTotal Responses," + getTotalResponses(surveyIndex) + "\n";

    return str;
}

function output(msg)
{
  console.log(msg);
}

function handleMouseDown()
{
  if (runningSurvey)
  {
    if (displayingWelcomeMessage)
    {
      $(activeButtons[0]).click();
    }
  }
}

function getQueryParameters()
{
    var parameters = {};

    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
        function (m, key, value) {
            parameters[key] = value;
        });

    return parameters;
}

function surveyNameURL(surveyName)
{
  var punctuationless = surveyName.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
  var spaceless = punctuationless.replace(/\s/g, "");
  var lowercaseName = spaceless.toLowerCase();

  return lowercaseName;
}

function copyToClipboard(text) 
{
  window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
}