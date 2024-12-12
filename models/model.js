
const Connection = require("../dbConnect");

const DataTypes = Object.freeze({
    STRING:         Symbol("STRING"),
    LONGSTRING:     Symbol("LONGSTRING"),
    INTEGER:        Symbol("INTEGER"),
    DECIMAL:        Symbol("DECIMAL")
});

function isEmptyOrSpaces(str){
    return str === null;
}

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
                sql: `CREATE TABLE IF NOT EXISTS ${this.constructor.name} (${this.constructor.name}ID INT NOT NULL AUTO_INCREMENT, ${this.columnsSQL}, PRIMARY KEY(${this.constructor.name}ID));`
              });    
        
        } catch (error) {
          console.error(`Unable to init table ${this.constructor.name}: `, error);
          process.exit(1);
        }

    }

    async hasMany(model){
        console.log(`${this.constructor.name}.hasMany(${model.constructor.name})`);

        model.columns[`${this.constructor.name}ID`] = {
            type: DataTypes.INTEGER,
            allowNull: false
          };


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
    
    async create(json){        

        let insertColumnsSQL = "";

        let insertValuesSQL = "";

        
        console.log(json)

        for(let item in this.columns){

            let column = this.columns[item];

            for(let item1 in column){
                
                if(item1 == "allowNull" && column[item1] == false){
                    {
                        insertColumnsSQL += `, ${item}`;   
                        
                        insertValuesSQL += ", '" + json[`${item}`] + "'";   
                    }

                }
                
            }
        }

            
        insertColumnsSQL = insertColumnsSQL.substring(2);
        
        insertValuesSQL = insertValuesSQL.substring(2);
        
        try {
        
            const[result, fields] = await Connection.connection.promise().query({
                sql: `INSERT INTO ${this.constructor.name} (${insertColumnsSQL}) VALUES (${insertValuesSQL});`
            });    
            
            const promise = new Promise((resolve, reject) => {
                resolve(result);
              });

            return promise;
        
        } catch (error) {
            console.error(`Unable to init table ${this.constructor.name}: `, error);
            process.exit(1);
        }

    }

    async read(condition = null, fieldsList = null){      
        
        let conditionSQL = "";
        
        let fieldsSQL = "*";

        if(!isEmptyOrSpaces(condition)){
            
            let readColumnsSQL = "";
            
            if(condition.hasOwnProperty(`${this.constructor.name}ID`)){         
                readColumnsSQL = `, ${this.constructor.name}ID = ` + condition[`${this.constructor.name}ID`];
            }


            for(let item in this.columns){

                if(condition.hasOwnProperty(`${item}`)){         
                        readColumnsSQL += `, ${item} = ` + "'" + condition[`${item}`] + "'";   
                }
            }

            readColumnsSQL = readColumnsSQL.substring(2);

            conditionSQL = ` WHERE ${readColumnsSQL}`;
        }

        if(Array.isArray(fieldsList)){

            let lfields = "";

            for(let field of fieldsList)
                lfields += `, ${field}`; 

            lfields = lfields.substring(2);
                
            fieldsSQL = lfields;  
        }

        if(condition == "count"){
        
            try {
            
                const[result, fields] = await Connection.connection.promise().query({
                    sql: `SELECT COUNT(${this.constructor.name}ID) AS NumberOf${this.constructor.name}s FROM  ${this.constructor.name};`
                });    

                const promise = new Promise((resolve, reject) => {
                    resolve(result);
                  });
    
                return promise;
            
            } catch (error) {
                console.error(`Unable to init table ${this.constructor.name}: `, error);
                process.exit(1);
            }
        }
        else{
        
            try {
            
                const[result, fields] = await Connection.connection.promise().query({
                    sql: `SELECT ${fieldsSQL} FROM ${this.constructor.name}${conditionSQL};`
                });    
    
                return result;
            
            } catch (error) {
                console.error(`Unable to init table ${this.constructor.name}: `, error);
                process.exit(1);
            }

        }

    }

    async delete(json){   
        
        let id = -1;

        if(!json.hasOwnProperty(`${this.constructor.name}ID`)){

            return;
        }
        else{
            
            id = json[`${this.constructor.name}ID`];  
        }

        try {
            
            await Connection.connection.promise().query({
                sql: `DELETE FROM ${this.constructor.name} WHERE ${this.constructor.name}ID='${id}';`
            });     
        
        } catch (error) {
            console.error(`Unable to init table ${this.constructor.name}: `, error);
            process.exit(1);
        }
    }

    async update(json){       
        
        let id = -1;

        if(!json.hasOwnProperty(`${this.constructor.name}ID`)){

            return;
        }
        else{
            
            id = json[`${this.constructor.name}ID`];  
        }
        


        let insertColumnsSQL = "";

        for(let item in this.columns){

            let column = this.columns[item];

            for(let item1 in column){

                if(item1 == "allowNull" && column[item1] == false){
                    if(json.hasOwnProperty(`${item}`))
                    {         
                        insertColumnsSQL += `, ${item} = ` + "'" + json[`${item}`] + "'";   
                    }
                    else
                    {
                        return;
                    }

                }
                
            }
        }
            
        insertColumnsSQL = insertColumnsSQL.substring(2);
            
        try {
        
            await Connection.connection.promise().query({
                sql: `UPDATE ${this.constructor.name} SET ${insertColumnsSQL} WHERE ${this.constructor.name}ID='${id}';`
            });    
        
        } catch (error) {
            console.error(`Unable to init table ${this.constructor.name}: `, error);
            process.exit(1);
        }
    }
}


module.exports = {
    Model,
    DataTypes
  };

