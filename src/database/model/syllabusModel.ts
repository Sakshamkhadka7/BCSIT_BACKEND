import { Table, Column, DataType, Model } from "sequelize-typescript";

@Table({
  tableName: "syllabus",
  modelName: "Syllabus",
  timestamps: true,
})
class Syllabus extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare syallabusId: string;

  @Column({
    type: DataType.STRING,
  })
  declare syllabusName: string;
  
  @Column({
    type:DataType.INTEGER
  })
  declare creditHours:number

  @Column({
    type:DataType.INTEGER
  })
  declare unit:number


  @Column({
    type: DataType.STRING,
  })
  declare syllabusFile: string;
  
   @Column({
    type:DataType.BOOLEAN,
    defaultValue:false
  })
  declare isDeleted:boolean

}


export default Syllabus
