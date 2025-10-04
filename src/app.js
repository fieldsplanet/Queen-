var currentQuestion = 0;
var answers = {};

function startQuiz() {
  document.getElementById("start-screen").style.display = "none";
  document.body.classList.add("quiz-mode");
  document.getElementById("quiz-container").classList.add("active");
  document.getElementById("q1").classList.add("active");
  currentQuestion = 1;
  updateProgress();
}

function goToQuestion(qNum) {
  saveAnswer();

  document
    .querySelectorAll(".question")
    .forEach((q) => q.classList.remove("active"));
  document.getElementById("q" + qNum).classList.add("active");
  currentQuestion = qNum;
  updateProgress();
  restoreAnswer();
}

function saveAnswer() {
  if (currentQuestion === 1) {
    answers.month = document.getElementById("month").value;
    answers.day = document.getElementById("day").value;
    answers.year = document.getElementById("year").value;
  } else if (currentQuestion === 2) {
    answers.cycleLength = document.getElementById("cycleLength").value || 28;
  } else if (currentQuestion === 3) {
    answers.bodyFeelings = getSelectedOptions("q3");
  } else if (currentQuestion === 4) {
    answers.mindTone = getSelectedOptions("q4");
  } else if (currentQuestion === 5) {
    answers.emotionalWeather = getSelectedOptions("q5")[0] || "";
  } else if (currentQuestion === 6) {
    answers.supportNeeds = getSelectedOptions("q6");
  } else if (currentQuestion === 7) {
    answers.loveNote = document.getElementById("loveNote").value;
  }
}

function restoreAnswer() {
  if (currentQuestion === 1) {
    if (answers.month) document.getElementById("month").value = answers.month;
    if (answers.day) document.getElementById("day").value = answers.day;
    if (answers.year) document.getElementById("year").value = answers.year;
  } else if (currentQuestion === 2) {
    if (answers.cycleLength)
      document.getElementById("cycleLength").value = answers.cycleLength;
  } else if (currentQuestion === 3) {
    restoreSelectedOptions("q3", answers.bodyFeelings);
  } else if (currentQuestion === 4) {
    restoreSelectedOptions("q4", answers.mindTone);
  } else if (currentQuestion === 5) {
    restoreSelectedOptions("q5", [answers.emotionalWeather]);
  } else if (currentQuestion === 6) {
    restoreSelectedOptions("q6", answers.supportNeeds);
  } else if (currentQuestion === 7) {
    if (answers.loveNote)
      document.getElementById("loveNote").value = answers.loveNote;
  }
}

function getSelectedOptions(questionId) {
  var options = document.querySelectorAll(
    "#" + questionId + " .option.selected"
  );
  var values = [];
  for (var i = 0; i < options.length; i++) {
    values.push(options[i].getAttribute("data-value"));
  }
  return values;
}

function restoreSelectedOptions(questionId, values) {
  var options = document.querySelectorAll("#" + questionId + " .option");
  for (var i = 0; i < options.length; i++) {
    options[i].classList.remove("selected");
  }
  if (values) {
    for (var j = 0; j < values.length; j++) {
      var option = document.querySelector(
        "#" + questionId + ' .option[data-value="' + values[j] + '"]'
      );
      if (option) option.classList.add("selected");
    }
  }
}

function toggleOption(element) {
  element.classList.toggle("selected");
}

function selectSingleOption(element) {
  var parent = element.parentNode;
  var options = parent.querySelectorAll(".option");
  for (var i = 0; i < options.length; i++) {
    options[i].classList.remove("selected");
  }
  element.classList.add("selected");
}

function updateProgress() {
  var progress = (currentQuestion / 7) * 100;
  document.getElementById("progressFill").style.width = progress + "%";
}

function calculatePhase() {
  if (!answers.month || !answers.day || !answers.year) {
    return {
      phase: "Unknown",
      description: "Please enter your period date for accurate results.",
      message:
        "I see you taking time to understand yourself better. That intention alone is beautiful.",
      whatYouFeel: "",
      whyItsOkay: "",
      selfCare: "",
    };
  }

  var today = new Date();
  var lastPeriod = new Date(answers.year, answers.month - 1, answers.day);
  var daysDiff = Math.ceil((today - lastPeriod) / (1000 * 60 * 60 * 24));
  var cycleLength = parseInt(answers.cycleLength) || 28;
  var cycleDay = ((daysDiff - 1) % cycleLength) + 1;

  var phaseData = {
    menstrual: {
      range: [1, 5],
      phase: "Menstrual",
      description:
        "You're in your sacred release phase. This is a time for deep rest, gentle movement, and emotional tenderness. You may feel inward that's okay. Trust the letting go.",
      whatYouFeel:
        "Emotionally sensitive, withdrawn, or easily overwhelmed<br>Tired or foggy-brained<br>Wanting quiet, space, and comfort<br>Like you're falling apart. But you're actually resetting",
      whyItsOkay:
        "This isn't you being lazy or antisocial. Your brain and body are in deep repair mode. The inner lining of your uterus is shedding, your hormones are at rock bottom, and your nervous system is asking for pause.",
      selfCare:
        "Do less & Feel more. Wrap yourself in warmth.<br>Cancel what you can.<br>Eat warm, iron-rich foods (soup, congee, eggs, greens).<br>Rest. And don't feel guilty about it.<br>Rest is powerful.",
    },
    follicular: {
      range: [6, 13],
      phase: "Follicular",
      description:
        "You're in your rising energy phase. Ideas are blooming, and your motivation may return. Try new things. Stretch. Socialize. This is a rebirth window.",
      whatYouFeel:
        "Optimistic, motivated, or playful<br>Inspired by new ideas or projects<br>Socially curious or flirty<br>A little impulsive. Which is okay.",
      whyItsOkay:
        "Estrogen is climbing. This boosts dopamine (motivation) and serotonin (happiness). Your brain is literally getting a chemical spring-cleaning. If you feel a sudden rush of 'I want to do ALL the things,' that's valid. Just don't overbook yourself for next week (when hormones shift again).",
      selfCare:
        "Use this phase to plant seeds. But don't forget to breathe.<br>Start new ideas, move your body, try something bold.<br>Just don't overpromise. Leave room for shifts in your next phase.",
    },
    ovulation: {
      range: [14, 16],
      phase: "Ovulation",
      description:
        "You're magnetic. Your body is at its peak. You may feel extroverted, clear, and bold. This is a great time to communicate and initiate.",
      whatYouFeel:
        "Confident, expressive, or radiant<br>Craving connection or intimacy<br>Productive and powerful<br>Sensitive to rejection (even if hidden)",
      whyItsOkay:
        "You're literally built to shine and attract during ovulation. Your estrogen and testosterone peak here, boosting charisma, libido, and verbal fluency. But this energy can also bring up perfectionism, pressure, or people-pleasing. If you overextend to stay 'likable.'",
      selfCare:
        "Express freely, but stay rooted in your truth.<br>Speak your truth. Create. Lead.<br>But also, pause to ask,<br>'Do I want to give this much right now?'",
    },
    luteal: {
      range: [17, 35],
      phase: "Luteal",
      description:
        "You're in the truth-telling phase. Boundaries matter. Emotional waves may rise. Let them clarify what needs to shift. Go slow, rest deep, and trust your fire.",
      whatYouFeel:
        "Irritable, weepy, or angry<br>Overstimulated by noise, people, or clutter<br>Craving alone time, carbs, or control<br>Like everything's 'too much'. And that's fine and real.",
      whyItsOkay:
        "This phase is not a flaw. It's a filter. Progesterone rises (to protect a potential pregnancy) and then drops sharply if you're not pregnant. That hormonal crash affects GABA (your calming brain chemical), which is why you feel anxious or emotionally raw.<br><br>What comes up here is usually something you've been tolerating too long.",
      selfCare:
        "Let your fire guide you. Not burn you.<br>Set boundaries. Speak gently but clearly.<br>Use your emotional clarity to notice what's no longer working.<br>Take magnesium.<br>Do warm baths. Avoid over-explaining yourself.",
    },
  };

  var currentPhase = "follicular";
  for (var p in phaseData) {
    if (
      cycleDay >= phaseData[p].range[0] &&
      cycleDay <= phaseData[p].range[1]
    ) {
      currentPhase = p;
      break;
    }
  }

  var messages = {
    menstrual: [
      "You're safe to rest here. Everything doesn't need to make sense today.",
      "Your softness is your strength. Don't ever let anyone convince you otherwise.",
    ],
    follicular: [
      "The love you've been looking for? It's already within you. I see it.",
      "You are more resilient than you realize.",
    ],
    ovulation: [
      "Thank you for sharing your heart. Your feelings are valid, and you're safe here.",
      "Nothing about this moment defines your worth. You've always been enough.",
    ],
    luteal: [
      "Your emotions make sense. You don't need to fix or change them right now.",
      "Breathe. Whatever this storm is, it will pass, and you will still be here—stronger, softer, wiser.",
    ],
  };

  var randomMessage =
    messages[currentPhase][
      Math.floor(Math.random() * messages[currentPhase].length)
    ];

  return {
    phase: phaseData[currentPhase].phase,
    description: phaseData[currentPhase].description,
    whatYouFeel: phaseData[currentPhase].whatYouFeel,
    whyItsOkay: phaseData[currentPhase].whyItsOkay,
    selfCare: phaseData[currentPhase].selfCare,
    message: randomMessage,
    days:
      "Days " +
      phaseData[currentPhase].range[0] +
      "–" +
      phaseData[currentPhase].range[1],
  };
}

function validateAllAnswers() {
  var required = {
    q1: answers.month && answers.day && answers.year,
    q2: answers.cycleLength,
    q3: answers.bodyFeelings && answers.bodyFeelings.length > 0,
    q4: answers.mindTone && answers.mindTone.length > 0,
    q5: answers.emotionalWeather,
    q6: answers.supportNeeds && answers.supportNeeds.length > 0,
  };

  var missingQuestions = [];
  for (var q in required) {
    if (!required[q]) {
      missingQuestions.push(q);
    }
  }

  return missingQuestions;
}

function showIncompleteResults() {
  document
    .querySelectorAll(".question")
    .forEach((q) => q.classList.remove("active"));
  document.getElementById("results").classList.add("active");

  document.getElementById("phaseTitle").textContent = "Almost There, Queen";
  document.getElementById("phaseDescription").innerHTML =
    "We need a few more minutes for you to answer everything for the best result for you. Your journey to understanding your cycle deserves complete attention.";

  // Hide all detailed sections for incomplete results
  document.getElementById("disclaimer").style.display = "none";
  document.getElementById("feelingsSection").style.display = "none";
  document.getElementById("selfCareSection").style.display = "none";
  document.getElementById("supportSection").style.display = "none";
  document.getElementById("wombMessageSection").style.display = "none";
  document.getElementById("loveNoteDisplay").style.display = "none";

  // Change the restart button text and add more margin
  var restartBtn = document.querySelector("#results .btn-secondary");
  if (restartBtn) {
    restartBtn.textContent = "Complete Your Answers";
    restartBtn.style.marginTop = "60px";
  }

  currentQuestion = 7;
  updateProgress();
}

function showResults() {
  saveAnswer();

  var missingQuestions = validateAllAnswers();

  if (missingQuestions.length > 0) {
    showIncompleteResults();
    return;
  }

  var phaseInfo = calculatePhase();

  document
    .querySelectorAll(".question")
    .forEach((q) => q.classList.remove("active"));
  document.getElementById("results").classList.add("active");

  // Show all sections for complete results
  document.getElementById("disclaimer").style.display = "block";
  document.getElementById("feelingsSection").style.display = "block";
  document.getElementById("selfCareSection").style.display = "block";
  document.getElementById("supportSection").style.display = "block";
  document.getElementById("wombMessageSection").style.display = "block";

  // Populate all the content
  document.getElementById("phaseTitle").textContent =
    "You're in " + phaseInfo.phase + " Phase (" + phaseInfo.days + ")";
  document.getElementById("phaseDescription").innerHTML = phaseInfo.description;
  document.getElementById("whatYouFeelInfo").innerHTML = phaseInfo.whatYouFeel;
  document.getElementById("whyItsOkayInfo").innerHTML = phaseInfo.whyItsOkay;
  document.getElementById("selfCareInfo").innerHTML = phaseInfo.selfCare;
  document.getElementById("wombMessage").textContent = phaseInfo.message;

  // Handle support needs
  if (answers.supportNeeds && answers.supportNeeds.length > 0) {
    var supportText = answers.supportNeeds.join(", ").replace(/-/g, " ");
    document.getElementById("supportList").textContent = supportText;
  } else {
    document.getElementById("supportList").textContent =
      "Rest and self-compassion";
  }

  // Handle love note
  if (answers.loveNote && answers.loveNote.trim()) {
    document.getElementById("loveNoteDisplay").style.display = "block";
    document.getElementById("loveNoteText").textContent = answers.loveNote;
  }

  // Reset button styling
  var restartBtn = document.querySelector("#results .btn-secondary");
  if (restartBtn) {
    restartBtn.textContent = "Take Quiz Again";
    restartBtn.style.marginTop = "32px";
  }

  currentQuestion = 7;
  updateProgress();
}

function restartQuiz() {
  currentQuestion = 0;
  answers = {};

  document.getElementById("results").classList.remove("active");
  document.getElementById("quiz-container").classList.remove("active");
  document.body.classList.remove("quiz-mode");
  document.getElementById("start-screen").style.display = "flex";

  var allSelected = document.querySelectorAll(".option.selected");
  for (var i = 0; i < allSelected.length; i++) {
    allSelected[i].classList.remove("selected");
  }

  document.getElementById("month").value = "";
  document.getElementById("day").value = "";
  document.getElementById("year").value = "";
  document.getElementById("cycleLength").value = "";
  document.getElementById("loveNote").value = "";
  document.getElementById("loveNoteDisplay").style.display = "none";

  updateProgress();
}

function autoAdvance(currentInput, nextInputId, maxLength) {
  var value = currentInput.value;

  value = value.replace(/[^0-9]/g, "");
  currentInput.value = value;

  if (value.length >= maxLength && nextInputId) {
    var nextInput = document.getElementById(nextInputId);
    if (nextInput) {
      nextInput.focus();
    }
  }

  if (currentInput.id === "month" && value.length === 2) {
    var monthVal = parseInt(value);
    if (monthVal < 1 || monthVal > 12) {
      currentInput.value = "";
      return;
    }
  }

  if (currentInput.id === "day" && value.length === 2) {
    var dayVal = parseInt(value);
    if (dayVal < 1 || dayVal > 31) {
      currentInput.value = "";
      return;
    }
  }

  if (currentInput.id === "year" && value.length === 4) {
    var yearVal = parseInt(value);
    if (yearVal < 2020 || yearVal > 2025) {
      currentInput.value = "";
      return;
    }
  }
}

document.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();

    if (currentQuestion === 1) {
      var month = document.getElementById("month").value;
      var day = document.getElementById("day").value;
      var year = document.getElementById("year").value;

      if (month && day && year) {
        goToQuestion(2);
        return;
      }
    }

    var activeQuestion = document.querySelector(".question.active");
    if (activeQuestion) {
      var nextButton = activeQuestion.querySelector(".btn:not(.btn-secondary)");
      if (nextButton) {
        nextButton.click();
      }
    }

    if (document.getElementById("start-screen").style.display !== "none") {
      startQuiz();
    }
  }

  if (
    e.key === "Backspace" &&
    e.target.tagName !== "INPUT" &&
    e.target.tagName !== "TEXTAREA"
  ) {
    e.preventDefault();
    if (currentQuestion > 1) {
      goToQuestion(currentQuestion - 1);
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  var monthInput = document.getElementById("month");
  if (monthInput) {
    monthInput.addEventListener("focus", function () {
      this.select();
    });
  }

  var dayInput = document.getElementById("day");
  if (dayInput) {
    dayInput.addEventListener("focus", function () {
      this.select();
    });
  }

  var yearInput = document.getElementById("year");
  if (yearInput) {
    yearInput.addEventListener("focus", function () {
      this.select();
    });
  }
});
