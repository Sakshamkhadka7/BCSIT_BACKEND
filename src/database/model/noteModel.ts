import { Table, Column, DataType, Model } from "sequelize-typescript";

@Table({
  tableName: "note",
  modelName: "Note",
  timestamps: true,
})
class Note extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare noteId: string;

  @Column({
    type: DataType.STRING,
  })
  declare topic: string;

  @Column({
    type: DataType.TEXT,
  })
  declare subTopics: string;

  @Column({
    type: DataType.STRING,
  })
  declare noteFile: string;

   @Column({
    type:DataType.BOOLEAN,
    defaultValue:false
  })
  declare isDeleted:boolean
}

export default Note