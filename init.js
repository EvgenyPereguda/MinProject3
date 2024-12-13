

const Models = require("./models");



const initData = () => {


    Models.Place.delete(2);

    
    Models.Place.update(3, {"Number":"10"});
    
    Models.Place.read();

    Models.Place.read(1);

    Models.Place.read(2);

    Models.Place.read(3);

    Models.Place.read(4);

    Models.Place.read("count");


    Models.Place.read(4 , ["Number"]);
    

}


module.exports = {
    initData
};