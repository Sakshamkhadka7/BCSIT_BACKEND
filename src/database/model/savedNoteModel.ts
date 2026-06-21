import { Table, Column, DataType, Model } from "sequelize-typescript";

@Table({ tableName: "savedNote", modelName: "SavedNote", timestamps: true })
class SavedNote extends Model {
  @Column({ primaryKey: true, type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  declare savedNoteId: string;

  @Column({ type: DataType.UUID })
  declare userId: string;

  @Column({ type: DataType.UUID })
  declare noteId: string;
}

export default SavedNote;
