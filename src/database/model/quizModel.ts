import { Table, Column, DataType, Model } from "sequelize-typescript";
@Table({
  tableName: "quiz",
  modelName: "Quiz",
  timestamps: true,
})

class Quiz extends Model{

    @Column({
        primaryKey:true,
        type:DataType.UUID,
        defaultValue:DataType.UUIDV4
    })
    declare quizId:string

    @Column({
        type:DataType.STRING
    })
    declare title:string

    @Column({
        type:DataType.INTEGER
    })
    declare totalMarks:number

    @Column({
        type:DataType.INTEGER
    })
    declare duration:number

     @Column({
    type:DataType.BOOLEAN,
    defaultValue:false
  })
  declare isDeleted:boolean

}

export default Quiz