import {  Sequelize } from "sequelize-typescript";
import { envConfig } from "../config/envConfig";
import User from "./model/userModel";
import Syllabus from "./model/syllabusModel";
import Subject from "./model/subjectModel";
import Semester from "./model/semesterModel";
import Question from "./model/questionModel";
import Note from "./model/noteModel";
import QuizAttempt from "./model/quizAttemptModel";
import QuizQueston from "./model/quizQuestionModel";
import Quiz from "./model/quizModel";
import Content from "./model/contentModel";
import Subcontent from "./model/subContentModel";
import SavedNote from "./model/savedNoteModel";

const sequelize = new Sequelize(envConfig.databaseUrl as string, {
  models: [
    User,
    Syllabus,
    Subject,
    Semester,
    Question,
    Note,
    QuizAttempt,
    QuizQueston,
    Quiz,
    Content,
    Subcontent,
    SavedNote,
  ],
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Authenticated successfully");
  })
  .catch((error) => {
    console.log("Database connection error", error);
  });

sequelize
  .sync({ force: false, alter:  false})
  .then(async () => {
    console.log("Database is synced");

    // Allow notes to exist without a subContentId (subcontent is optional)
    await sequelize
      .query(`ALTER TABLE note ALTER COLUMN "subContentId" DROP NOT NULL`)
      .catch(() => {});

    // Widen subTopics from VARCHAR to TEXT for long content
    await sequelize
      .query(`ALTER TABLE note ALTER COLUMN "subTopics" TYPE TEXT`)
      .catch(() => {});

    // Ensure creditHours and unit columns exist in syllabus table
    await sequelize
      .query(`ALTER TABLE syllabus ADD COLUMN IF NOT EXISTS "creditHours" INTEGER`)
      .catch(() => {});
    await sequelize
      .query(`ALTER TABLE syllabus ADD COLUMN IF NOT EXISTS unit INTEGER`)
      .catch(() => {});

    // Add profilePhoto column to users table for student profile pictures
    await sequelize
      .query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS "profilePhoto" VARCHAR(255)`)
      .catch(() => {});
  })
  .catch((error) => {
    console.log("Error occured at database synced", error);
  });

// relation
Semester.hasMany(Subject, { foreignKey: "semesterId" });
Subject.belongsTo(Semester, { foreignKey: "semesterId" });


Subject.hasMany(Content, { foreignKey: "subjectId" });
Content.belongsTo(Subject, { foreignKey: "subjectId" });


Content.hasMany(Note,{foreignKey:"contentId"});
Note.belongsTo(Content,{foreignKey:"contentId"});

Content.hasMany(Subcontent,{foreignKey:"contentId"})
Subcontent.belongsTo(Content,{foreignKey:"contentId"})

Subject.hasOne(Syllabus, { foreignKey: "subjectId" });
Syllabus.belongsTo(Subject, { foreignKey: "subjectId" });

User.hasMany(QuizAttempt, { foreignKey: "userId" });
QuizAttempt.belongsTo(User, { foreignKey: "userId" });

Subject.hasMany(Quiz, { foreignKey: "subjectId" });
Quiz.belongsTo(Subject, { foreignKey: "subjectId" });

Quiz.hasMany(QuizQueston, { foreignKey: "quizId" });
QuizQueston.belongsTo(Quiz, { foreignKey: "quizId" });

Subject.hasMany(Question, { foreignKey: "subjectId" });
Question.belongsTo(Subject, { foreignKey: "subjectId" });

User.hasMany(SavedNote, { foreignKey: "userId" });
SavedNote.belongsTo(User, { foreignKey: "userId" });

Note.hasMany(SavedNote, { foreignKey: "noteId" });
SavedNote.belongsTo(Note, { foreignKey: "noteId" });
