

const Models = require("./models");



const initData = () => {


    Models.Place.delete({"PlaceID":"2"});

    
    Models.Place.update({"PlaceID":"3", "Number":"10"});
    
    Models.Place.read();

    Models.Place.read({"PlaceID":"1"});

    Models.Place.read({"PlaceID":"2"});

    Models.Place.read({"PlaceID":"3"});

    Models.Place.read({"PlaceID":"4"});

    Models.Place.read("count");


    Models.Place.read({"PlaceID":"4"}, ["Number"]);
    

}


module.exports = {
    initData
};