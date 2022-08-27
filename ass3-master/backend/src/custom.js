/*
 For a given data structure of a question, produce another
 object that doesn't contain any important meta data (e.g. the answer)
 to return to a "player"
*/
export const quizQuestionPublicReturn = question => {
  console.log('See question: ', question);
  const questionContent = {
    questionId: question.questionid,
    timeLimit: question.timeLimit,
    attachmentType: question.attachmentType,
    attachmentImg: question.attachmentImg,
    attachmentVideo: question.attachmentVideo,
    question: question.question,
    questionType: question.questionType,
    point: question.point,
    answers: question.answers
  }
  return questionContent;
};

/*
 For a given data structure of a question, get the IDs of
 the correct answers (minimum 1).
*/
export const quizQuestionGetCorrectAnswers = question => {
  const correct = []
  for (let i = 0; i < question.correctAnswer.length; i++) {
    correct.push(parseInt(question.correctAnswer[i]))
  }
  return correct; // For a single answer
};

/*
 For a given data structure of a question, get the IDs of
 all of the answers, correct or incorrect.
*/
export const quizQuestionGetAnswers = question => {
  const answers = []
  for (let i = 0; i < question.answers.length; i++) {
    if (question.answers[i] !== '') {
      answers.push(i)
    }
  }
  return answers; // For a single answer
};

/*
 For a given data structure of a question, get the duration
 of the question once it starts. (Seconds)
*/
export const quizQuestionGetDuration = question => {
  return parseInt(question.timeLimit);
};
