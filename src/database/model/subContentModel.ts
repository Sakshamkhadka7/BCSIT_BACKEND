import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
  tableName: "subcontent",
  modelName: "Subcontent",
  timestamps: true,
})
class Subcontent extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare subContentId: string;

  @Column({
    type: DataType.STRING,
  })
  declare topicName: string;

  @Column({
    type: DataType.INTEGER,
  })
  declare topicOrder: number;

  @Column({
    type:DataType.BOOLEAN,
    defaultValue:false
  })
  declare isDeleted:boolean
}

export default Subcontent;
