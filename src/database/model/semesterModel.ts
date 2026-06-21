import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
  tableName: "semester",
  timestamps: true,
})
class Semester extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare semesterId: string;

  @Column({
    type: DataType.INTEGER,
  })
  declare semesterNumber: number;

   @Column({
    type:DataType.BOOLEAN,
    defaultValue:false
  })
  declare isDeleted:boolean
}

export default Semester
