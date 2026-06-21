import { Table, Column, DataType, Model } from "sequelize-typescript";
@Table({
  tableName: "quizAttempt",
  modelName: "QuizAttempt",
  timestamps: true,
})
class QuizAttempt extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare attemptId: string;

  @Column({
    type: DataType.INTEGER,
  })
  declare score: number;

  @Column({
    type: DataType.INTEGER,
  })
  declare totalMarks: number;
   @Column({
    type:DataType.BOOLEAN,
    defaultValue:false
  })
  declare isDeleted:boolean
}
export default QuizAttempt;
