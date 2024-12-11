
const Connection = require("../dbConnect");

const DataTypes = Object.freeze({
    STRING:         Symbol("STRING"),
    LONGSTRING:     Symbol("LONGSTRING"),
    INTEGER:        Symbol("INTEGER"),
    DECIMAL:        Symbol("DECIMAL")
});

class Model {

    #columnsSQL;

    #columns;

    init(columns){

        this.columns = columns;

        this.columnsSQL = "";

        for(let item in columns){

            let column = columns[item];

            this.columnsSQL += `, ${item}`;

            for(let item1 in column){

                if(item1 == "type"){

                    if( column[item1] == DataTypes.STRING){
                        this.columnsSQL += ` VARCHAR(50)`;
                    }   
                    else  if( column[item1] == DataTypes.LONGSTRING){
                        this.columnsSQL += ` VARCHAR(200)`;
                    } 
                    else  if(column[item1] == DataTypes.INTEGER){
                        this.columnsSQL += ` INT`;
                    }      
                    else  if(column[item1] == DataTypes.DECIMAL){
                        this.columnsSQL += ` DECIMAL`;
                    } 

                }   
                else if(item1 == "allowNull" && column[item1] == false){
                    this.columnsSQL += ` NOT NULL`;
                }  
                
            }
        }

        this.columnsSQL = this.columnsSQL.substring(2);
    }
    
    async sync(){

        try {
       
             await Connection.connection.promise().query({
                sql: `CREATE TABLE IF NOT EXISTS ${this.constructor.name} (${this.constructor.name}ID INT NOT NULL, ${this.columnsSQL}, PRIMARY KEY(${this.constructor.name}ID));`
              });    
        
        } catch (error) {
          console.error(`Unable to init table ${this.constructor.name}: `, error);
          process.exit(1);
        }

    }

    async hasMany(model){
        console.log(`${this.constructor.name}.hasMany(${model.constructor.name})`);


        try {

            const[results, fields] = await Connection.connection.promise().query({
                sql: `SELECT * FROM ${model.constructor.name};`
              });   

              let lIsDoAlter = true;

            fields.forEach((item, index, arr)=> {
                if(item.name == `${this.constructor.name}ID`)
                    lIsDoAlter = false;                 
            });


            if(lIsDoAlter == true){

                await Connection.connection.promise().query({
                   sql: `ALTER TABLE ${model.constructor.name} ADD ${this.constructor.name}ID INT;`
                 });   
           
                await Connection.connection.promise().query({
                   sql: `ALTER TABLE ${model.constructor.name} ADD FOREIGN KEY (${this.constructor.name}ID) REFERENCES ${this.constructor.name}(${this.constructor.name}ID);`
                 });   
            } 
       
       } catch (error) {
         console.error(`Unable to hasMany table ${this.constructor.name}: `, error);
         process.exit(1);
       }

    //   ALTER TABLE Orders ADD FOREIGN KEY (PersonID) REFERENCES Persons(PersonID);`

    }
    
    do(){
        console.log(`${this.constructor.name}.do()`);
    }
}


module.exports = {
    Model,
    DataTypes
  };

