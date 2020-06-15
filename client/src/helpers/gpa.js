const averageGrades = (arr) => {
  // initialize variables
  const homeworkWeight = 0.25;
  const quizWeight = 0.3;
  const examWeight = 0.45;
  let weightedAverage, homeworkAverage, quizAverage, examAverage;
  let homeworkCount = 0;
  let quizCount = 0;
  let examCount = 0;
  let homeworkTotal = 0;
  let quizTotal = 0;
  let examTotal = 0;

  arr.map((doc) => {
    switch (doc.assignment.kind) {
      case "homework":
        homeworkCount += 1;
        homeworkTotal += parseInt(doc.assignment.grade);
        break;
      case "quiz":
        quizCount += 1;
        quizTotal += parseInt(doc.assignment.grade);
        break;
      case "exam":
        examCount += 1;
        examTotal += parseInt(doc.assignment.grade);
        break;
      default:
        weightedAverage = "No average to check";
        break;
    }
  });
  if (weightedAverage !== "No average to check") {
    homeworkAverage = (homeworkTotal / homeworkCount) * homeworkWeight;

    quizAverage = (quizTotal / quizCount) * quizWeight;

    examAverage = (examTotal / examCount) * examWeight;

    weightedAverage = homeworkAverage + quizAverage + examAverage;
  }
  return weightedAverage;
};

export default averageGrades;
