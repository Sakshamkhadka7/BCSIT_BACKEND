import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
  tableName: "chapter",
  modelName: "Chapter",
  timestamps: true,
})
class Content extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare contentId: string;

  @Column({
    type: DataType.INTEGER,
  })
  declare chapterNumber: number;

  @Column({
    type: DataType.STRING,
  })
  declare chapterName: string;

     @Column({
    type:DataType.BOOLEAN,
    defaultValue:false
  })
  declare isDeleted:boolean
}

export default Content;
