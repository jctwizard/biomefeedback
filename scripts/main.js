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
  storageBucket: "gs://biomefeedback.appspot.com",
  projectId: "biomefeedback"
};

var baseURL = "http://jctwizard.github.io/biomefeedback/"
//var baseURL = "file:///C:/Users/James/Documents/Projects/biomefeedback/"
var editURLExtension = "edit/index.html?survey=";
var answerURLExtension = "answer/index.html?survey=";
var viewResultsURLExtension = "results/index.html?survey=";
var visualiseURLExtension = "visualise/index.html?survey=";

var storage;
var storageRef;

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
      
    storage = firebase.storage();
    storageRef = storage.ref();

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

function makeButton(parent, functionToCall, parameter, content, name, suffix)
{
  var newElement = makeElement(parent, "button", "", name, suffix);

  var buttonText = makeElement(newElement, "div", content, "buttonText", suffix);

  newElement.classList.add("regularButton");
  
  newElement.setAttribute("onclick", "clickButton(this," + functionToCall + "," + parameter + ")");

  return newElement;
}

function clickButton(element, functionToCall, parameter)
{
  element.classList.remove('buttonClick');
  void element.offsetWidth;
  element.classList.add('buttonClick');

  console.log(functionToCall);

  if (functionToCall != null)
  {
    if (parameter == null)
    {    
      element.addEventListener("animationend", () => { functionToCall(); }, false);
    }
    else
    {
      element.addEventListener("animationend", () => { functionToCall(parameter); }, false);
    }
  }
}

function showElement(element, elementToShow)
{
  document.getElementById(elementToShow.id).style.display = "block";
}

function hideElement(element, elementToHide)
{
  document.getElementById(elementToHide.id).style.display = "none";
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

function getTextAnswerCount(surveyIndex, questionIndex)
{
  return Object.keys(surveys["survey" + surveyIndex.toString()].questions["question" + questionIndex.toString()].textAnswers).length;
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

function getQuestionImageUrl(surveyIndex, questionIndex)
{
  return surveys["survey" + surveyIndex.toString()].questions["question" + questionIndex.toString()].imageUrl;
}

function getQuestionInitialInput(surveyIndex, questionIndex)
{
  return surveys["survey" + surveyIndex.toString()].questions["question" + questionIndex.toString()].questionInitialInput;
}

function getAnswerName(surveyIndex, questionIndex, answerIndex)
{
  return surveys["survey" + surveyIndex.toString()].questions["question" + questionIndex.toString()].answers["answer" + answerIndex.toString()].answerName;
}

function getAnswerImageUrl(surveyIndex, questionIndex, answerIndex)
{
  return surveys["survey" + surveyIndex.toString()].questions["question" + questionIndex.toString()].answers["answer" + answerIndex.toString()].imageUrl;
}

function getTextAnswer(surveyIndex, questionIndex, answerIndex)
{
  return surveys["survey" + surveyIndex.toString()].questions["question" + questionIndex.toString()].textAnswers["textAnswer" + answerIndex.toString()];
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
  
  for (var questionIndex = 0; questionIndex < getQuestionCount(surveyIndex); questionIndex++)
  {
    if (getQuestionType(surveyIndex, questionIndex) == "button" || getQuestionType(surveyIndex, questionIndex) == "image")
    {
      for (var answerIndex = 0; answerIndex < getAnswerCount(surveyIndex, questionIndex); answerIndex++)
      {
        responses += getAnswerResponses(surveyIndex, questionIndex, answerIndex);
      }
    }
    else if (getQuestionType(surveyIndex, questionIndex) == "input")
    {
      responses += getTextAnswerCount(surveyIndex, questionIndex);
    }
  }

  return responses;
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
  window.alert("Copy link below: \n\n" + text);
}