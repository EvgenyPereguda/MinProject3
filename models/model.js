
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

    #joinList;

    init(columns){

        this.columns = columns;

        this.columnsSQL = ",";

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

        if(this.columnsSQL != ",")
        {
            this.columnsSQL = this.columnsSQL.substring(1);
            this.columnsSQL = this.columnsSQL + ",";
        }
    }
    
    async sync(){

        this.joinList = new Array();

        try {
       
             await Connection.connection.promise().query({
                sql: `CREATE TABLE IF NOT EXISTS ${this.constructor.name} (${this.constructor.name}ID INT NOT NULL AUTO_INCREMENT ${this.columnsSQL} PRIMARY KEY(${this.constructor.name}ID));`
              });    
        
        } catch (error) {
          console.error(`Unable to init table ${this.constructor.name}: `, error);
          process.exit(1);
        }

    }

    async hasMany(model){

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

    }

    async belongTo(model){

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

            let joinList = new Array();

            joinList.push(`${this.constructor.name}`);

            model.joinList = [...model.joinList, joinList];            
       
       } catch (error) {
         console.error(`Unable to hasMany table ${this.constructor.name}: `, error);
         process.exit(1);
       }

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

    async read(id = null, condition = null, fieldsList = null){    
        
                
        let conditionSQL = "";
        
        let fieldsSQL = "*";
        
        let readColumnsSQL = "";

        if(!isEmptyOrSpaces(id)){
            readColumnsSQL = `, ${this.constructor.name}ID = ${id}`;
        }


        if(!isEmptyOrSpaces(condition)){            
            
            for(let item in this.columns){

                if(condition.hasOwnProperty(`${item}`)){         
                        readColumnsSQL += `, ${item} = ` + "'" + condition[`${item}`] + "'";   
                }
            }
        }

        if(readColumnsSQL != ""){

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

        if(condition == "count" || id == "count"){
        
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
        else if(condition == "join" || id == "join"){

            let lJoinString = "";

            if(id != "join"){
                conditionSQL = ` WHERE ${this.constructor.name}.${this.constructor.name}ID = ${id}`;
            }


            this.joinList.forEach((item) =>{
                lJoinString += `JOIN ${item} ON ${this.constructor.name}.${item}ID = ${item}.${item}ID `
            })
            
            try {
            
                const[result, fields] = await Connection.connection.promise().query({
                    sql: `SELECT * FROM ${this.constructor.name} ${lJoinString} ${conditionSQL};`
                });    

                const promise = new Promise((resolve, reject) => {
                    resolve(result);
                  });
    
                return promise;
            
            } catch (error) {
                console.error(`Unable to init table ${this.constructor.name}: `, error);
                process.exit(1);
            }

            // SELECT 
            //     Students.StudentName, 
            //     Courses.CourseName 
            // FROM 
            //     StudentCourses
            // JOIN Students ON StudentCourses.StudentID = Students.StudentID
            // JOIN Courses ON StudentCourses.CourseID = Courses.CourseID;
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

    async readChildren(parent, parentID, condition = null, fieldsList = null){      
        
        let conditionSQL = "";
        
        let fieldsSQL = "*";
        
        let readColumnsSQL = `${parent.constructor.name}ID = ${parentID}`;

        if(readColumnsSQL != ""){
    
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

    async delete(id){   
        
        try {
            
            await Connection.connection.promise().query({
                sql: `DELETE FROM ${this.constructor.name} WHERE ${this.constructor.name}ID='${id}';`
            });     
        
        } catch (error) {
            console.error(`Unable to init table ${this.constructor.name}: `, error);
            process.exit(1);
        }
    }

    async update(id, json){       
              


        let insertColumnsSQL = "";

        for(let item in this.columns){

            let column = this.columns[item];

            for(let item1 in column){

                if(item1 == "allowNull" && column[item1] == false){
                
                    if(json.hasOwnProperty(`${item}`))
                    {         
                        insertColumnsSQL += `, ${item} = ` + "'" + json[`${item}`] + "'";   
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

