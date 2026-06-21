import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
  tableName: "users",
  modelName: "User",
  timestamps: true,
})
class User extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare userId: string;

  @Column({
    type: DataType.STRING,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
  })
  declare password: string;

  @Column({
    type: DataType.ENUM("user", "admin"),
    defaultValue: "user",
  })
  declare role: string;

  @Column({
    type: DataType.STRING,
    validate: {
      len: {
        args: [10, 10],
        msg: "Phone number must be 10 digits",
      },
    },
  })
  declare phoneNumber: string;


  @Column({
    type: DataType.STRING,
  })
  declare college: string;

  @Column({
    type: DataType.STRING,
  })
  declare otp: string;

  @Column({
    type: DataType.STRING,
  })
  declare otpGenerated: string;

  @Column({
    type:DataType.BOOLEAN,
    defaultValue:false
  })
  declare isDeleted:boolean

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare profilePhoto: string;
}

export default User;
