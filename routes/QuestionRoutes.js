var express = require("express"); // uvozi Express framework
var router = express.Router(); // ustvari router (za definiranje URL poti)
var QuestionModel = require("../models/QuestionModel"); // model za vprašanja (MongoDB)
var AnswerModel = require("../models/AnswerModel"); // model za odgovore

router.get("/", async function (req, res) {
  try {
    // pridobi vsa vprašanja iz baze
    var questions = await QuestionModel.find()
      .populate("user") // vrne celoten user object
      .sort({ date: -1 }); // sortira -> najnovejša so prva

    // formatiranje datuma za prikaz (da ni raw Date objekt)
    questions = questions.map(function (q) {
      return {
        ...q._doc, // vsi podatki iz dokumenta
        formattedDate: new Date(q.date).toLocaleString("sl-SI", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    });

    // rendera view in pošlje vprašanja
    res.render("questions/index", { questions: questions });
  } catch (err) {
    res.send(err);
  }
});

router.get("/new", function (req, res) {
  res.render("questions/new"); // forma za ustvarjanje vprašanja
});

router.post("/create", async function (req, res) {
  try {
    // ustvari novo vprašanje
    var question = new QuestionModel({
      title: req.body.title, // naslov iz forme
      description: req.body.description, // opis iz forme
      date: new Date(), // trenutni čas
      user: req.session.user._id, // ID prijavljenega uporabnika
      views: 0, // začetno število ogledov
      activity: 0, // začetna aktivnost
    });

    await question.save(); // shrani v bazo
    res.redirect("/questions"); // preusmeri nazaj na seznam
  } catch (err) {
    res.send(err);
  }
});

router.get("/hot", async function (req, res) {
  try {
    var questions = await QuestionModel.find(); // dobi vsa vprašanja
    var hotQuestions = [];

    for (var i = 0; i < questions.length; i++) {
      var question = questions[i];

      // prešteje odgovore za vprašanje
      var answerCount = await AnswerModel.countDocuments({
        question: question._id,
      });

      var hoursOld = (new Date() - new Date(question.date)) / (1000 * 60 * 60); // format za ure

      // če je manj kot 1 ura staro, nastavi na 1 (da ne deli z 0)
      if (hoursOld < 1) hoursOld = 1;

      // aktivnost / čas
      var scorePerHour = (question.activity || 0) / hoursOld;

      // sestavi nov objekt z dodatnimi podatki
      hotQuestions.push({
        ...question._doc,
        answerCount: answerCount,
        activity: question.activity || 0,
        hotScore: scorePerHour.toFixed(2), // score (2 decimalki)
        formattedDate: new Date(question.date).toLocaleString("sl-SI", {
          // format datuma
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    }

    // filtrira vprašanja z dovolj visokim score-om
    // sortira po score-u (padajoče)
    // vzame top 5
    hotQuestions = hotQuestions
      .filter((q) => parseFloat(q.hotScore) > 3)
      .sort((a, b) => b.hotScore - a.hotScore)
      .slice(0, 5);

    // rendera view
    res.render("questions/hot", {
      questions: hotQuestions,
    });
  } catch (err) {
    res.send(err);
  }
});

// Prikaz posameznega vprašanja + odgovori
router.get("/:id", async function (req, res) {
  try {
    // poveča število ogledov in aktivnost za 1
    await QuestionModel.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1, activity: 1 },
    });

    // pridobi vprašanje + user podatke
    var question = await QuestionModel.findById(req.params.id).populate("user");

    // pridobi vse odgovore za to vprašanje
    var answers = await AnswerModel.find({ question: req.params.id })
      .populate("user")
      .sort({ accepted: -1, date: -1 });

    // formatira datum za vsak odgovor
    answers = answers.map(function (a) {
      return {
        ...a._doc,
        formattedDate: new Date(a.date).toLocaleString("sl-SI", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    });

    var isOwner =
      question.user._id.toString() === req.session.user._id.toString();

    // rendera view
    res.render("questions/show", {
      question: question,
      answers: answers,
      isOwner: isOwner, // pomembno za UI (delete/edit gumbi)
    });
  } catch (err) {
    res.send(err);
  }
});

// izvozi router
module.exports = router;
