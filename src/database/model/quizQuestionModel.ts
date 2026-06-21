import { Table, Column, DataType, Model } from "sequelize-typescript";
@Table({
  tableName: "quizQuestion",
  modelName: "QuizQuestion",
  timestamps: true,
})
class QuizQueston extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare quizQuestionId: string;

  @Column({
    type: DataType.STRING,
  })
  declare question: string;

  @Column({
    type:DataType.STRING
  })
  declare quizquesFile:string

  @Column({
    type: DataType.STRING,
  })
  declare answer: string;

  @Column({
    type: DataType.STRING,
  })
  declare optionA: string;

  @Column({
    type: DataType.STRING,
  })
  declare optionB: string;

  @Column({
    type: DataType.STRING,
  })
  declare optionC: string;
  
   @Column({
    type:DataType.BOOLEAN,
    defaultValue:false
  })
  declare isDeleted:boolean

}

export default QuizQueston
