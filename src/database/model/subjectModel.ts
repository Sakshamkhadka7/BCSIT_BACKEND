import { Table, Column, DataType, Model, ForeignKey } from "sequelize-typescript";
import Semester from "./semesterModel";

@Table({
  tableName: "subject",
  modelName: "Subject",
  timestamps: true,
})
class Subject extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare subjectId: string;

  @Column({
    type: DataType.STRING,
  })
  declare courseCode: string;

  @Column({
    type: DataType.STRING,
  })
  declare subjectName: string;

  @Column({
    type: DataType.INTEGER,
  })
  declare totalCredit: number;
   @Column({
    type:DataType.BOOLEAN,
    defaultValue:false
  })
  declare isDeleted:boolean
}

export default Subject
