import { Table, Column, DataType, Model } from "sequelize-typescript";

@Table({
  tableName: "question",
  modelName: "Question",
  timestamps: true,
})
class Question extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare questionId: string;

  @Column({
    type: DataType.STRING,
  })
  declare subjectQuestion: string;

  @Column({
    type: DataType.STRING,
  })
  declare questionFile: string;

  @Column({
    type:DataType.INTEGER
  })
  declare questionYear:number

  @Column({
    type: DataType.ENUM("easy", "meduim", "hard"),
    defaultValue: "easy",
  })
  declare questionLevel: string;

   @Column({
    type:DataType.BOOLEAN,
    defaultValue:false
  })
  declare isDeleted:boolean
}

export default Question;
