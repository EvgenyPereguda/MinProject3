function openTab(evt, tabName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}



function clearList(target) {
        
  const root = document.getElementById(target);

  while (root.firstChild) {
    root.removeChild(root.lastChild);
  }
}


async function loadTables(){
  
  clearList("tablesList");
  
  await fetch("http://localhost:8080/api/places/")
  .then((response) => response.json())
  .then((json) => {
    json.data.forEach((item) => {   
      placeTableItem(item.PlaceID, item.Number);
    });
  })
  .catch((response) => {      
    alert(`Response status = ${response.status}, message ${response.statusText}`);
  });

}


async function placeTableItem(PlaceID, Number) {

  var customers = [];

  // build the index

  await fetch(`http://localhost:8080/api/places/${PlaceID}?customers`)
  .then((response) => response.json())
  .then((json) => {     
      for (var x of json.data) {
        customers.push(x);
    }
  })
  .catch((response) => {      
    alert(`Response status = ${response.status}, message ${response.statusText}`);
  });

  console.log(customers);

  const template = document.querySelector("#tableItem-template").content.cloneNode(true);

  template.querySelector("#tableNumber").innerText += " " + Number;

  let lcount = 12;

  const root = template.querySelector("#customerList");

  while (root.firstChild) {
    root.removeChild(root.lastChild);
  }

  for (let index = 0; index < lcount; index++) {  
      

    
      var button = document.createElement("BUTTON");
      button.setAttribute("class", "button buttonRound");

      if(customers.length > index ){
        const customerTemplate = document.querySelector("#customer-template").content.cloneNode(true);
        button.appendChild(customerTemplate);
        button.setAttribute("onclick", `processCustomer('${customers[index].CustomerID}', '${PlaceID}')`); 
      }
      else{
        const addCustomerTemplate = document.querySelector("#addCustomer-template").content.cloneNode(true);
        button.appendChild(addCustomerTemplate);
        button.setAttribute("onclick", `addCustomer('${PlaceID}')`);
      }     

      
      template.querySelector("#customerList").appendChild(button);
    
  }
 
  document.querySelector("#tablesList").appendChild(template);

}


async function processCustomer(CustomerID, PlaceID){

  await showEditCustomerFormDIalog(CustomerID, PlaceID);
 
  console.log(`${CustomerID}, ${PlaceID}`);

  


}


async function showEditCustomerFormDIalog(CustomerID, PlaceID){


  let customer = {};
  
  await fetch(`http://localhost:8080/api/customers/${CustomerID}`)
  .then((response) => response.json())
  .then((json) => {
    customer = json.data
  })
  .catch((response) => {      
    alert(`Response status = ${response.status}, message ${response.statusText}`);
  });

  if(customer.length == 0)
    return;





  const dialog = document.querySelector("#dialog1");

  clearList("dialogContainer");

  const container = dialog.querySelector("#dialogContainer");

  const template = document.getElementById("editCustomerForm-template").content.cloneNode(true);

  template.getElementById("FirstName").innerText = customer[0].FirstName;

  template.getElementById("LastName").innerText = customer[0].LastName;

  template.getElementById("Email").innerText = customer[0].Email;
  
  template.querySelector("#deleteBtn").setAttribute("onclick", `showDeleteCustomerForm('${CustomerID}')`); 




  let button = template.querySelector("#cancelBtn");

  button.setAttribute("onclick", `document.querySelector("#dialog1").close()`);   



  button = template.querySelector("#editBtn");

  button.setAttribute("onclick", `showEditCustomerMainFormDialog('${CustomerID}')`);   


  let dishesSelect = template.querySelector("#dishesSelect");


  const option = document.createElement("option");
  
  option.value = "";
  option.innerText = "";

  dishesSelect.appendChild(option);
  
  
  await fetch("http://localhost:8080/api/dishes/")
  .then((response) => response.json())
  .then((json) => {

    json.data.forEach((item) => {   

      const option = document.createElement("option");
  
      option.value = item.DishID;
      option.innerText = item.Name;
    
      dishesSelect.appendChild(option);
    });
  })
  .catch((response) => {      
    alert(`Response status = ${response.status}, message ${response.statusText}`);
  });




  button = template.querySelector("#addDishBtn");

  button.setAttribute("onclick", `addSelectDish('${CustomerID}', '${PlaceID}')`);   

  

  

  container.appendChild(template);

  
  
  loadCustomerOrders(CustomerID);

  dialog.showModal(); 
}

async function addSelectDish(CustomerID, PlaceID) {
  
  
  let dishesSelect = document.querySelector("#dishesSelect");

  if(dishesSelect.value == "")
    return;

  let order = {"DishID":`${dishesSelect.value}`, "PlaceID":`${PlaceID}`, "CustomerID":`${CustomerID}`};

  const data = JSON.stringify(order);
  
  try {
    const response = await fetch("/api/orders/create", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: data
    });
    console.log(await response.json());
  } catch (e) {
    console.error(e);
  }

  loadOrders(); 
  
  loadCustomerOrders(CustomerID);
}

async function loadCustomerOrders(CustomerID) {
  
  clearList("customerOrdersList");
  
  await fetch("http://localhost:8080/api/orders")
  .then((response) => response.json())
  .then((json) => {
    json.data.forEach((item) => {  

      if(item.CustomerID == CustomerID){
        loadCustomerOrder(item.DishPlaceID);  
      }


    });
  })
  .catch((response) => {      
    alert(`Response status = ${response.status}, message ${response.statusText}`);
  });  

}

async function loadCustomerOrder(DishPlaceID) {

  
  await fetch(`http://localhost:8080/api/orders/${DishPlaceID}?join`)
  .then((response) => response.json())
  .then((json) => {
    json.data.forEach((item) => {   

          addCustomOrder(item.Image, item.Name);
        });
      })
      .catch((response) => {      
        alert(`Response status = ${response.status}, message ${response.statusText}`);
      });
  
}

async function addCustomOrder(Image, Name) {  
          let customerOrdersList = document.querySelector("#customerOrdersList");

          const template = document.querySelector("#customerOrderCard-template").content.cloneNode(true);

          template.querySelector("#orderDishImage").src = Image;

          template.querySelector("#orderDishName").innerText = Name;

          customerOrdersList.appendChild(template);
}

async function showEditCustomerMainFormDialog(CustomerID) {

  document.querySelector("#dialog1").close();



  let customer = {};
  
  await fetch(`http://localhost:8080/api/customers/${CustomerID}`)
  .then((response) => response.json())
  .then((json) => {
    customer = json.data
  })
  .catch((response) => {      
    alert(`Response status = ${response.status}, message ${response.statusText}`);
  });

  if(customer.length == 0)
    return;


  const dialog = document.querySelector("#dialog1");

  clearList("dialogContainer");

  const container = dialog.querySelector("#dialogContainer");

  const template = document.getElementById("editCustomerMainForm-template").content.cloneNode(true);

  console.log(customer);

  template.getElementById("FirstName").value = customer[0].FirstName;

  template.getElementById("LastName").value = customer[0].LastName;

  template.getElementById("Email").value = customer[0].Email;
  


  let button = template.querySelector("#confirmBtn");

  button.setAttribute("onclick", `editCustomer('${CustomerID}')`);  
  
  button = template.querySelector("#cancelBtn");

  button.setAttribute("onclick", `document.querySelector("#dialog1").close()`);   
  

  container.appendChild(template);

  dialog.showModal(); 
  
}

async function editCustomer(CustomerID) {
  
  const dialog = document.querySelector("#dialog1");
  
  dialog.close();

  const form = document.querySelector("#editCustomerMainForm");
  console.log(form);

  // Associate the FormData object with the form element
  const formData = new FormData(form);
  console.log(formData);

  const data = JSON.stringify(Object.fromEntries(formData));

  console.log(data);
    
  try {
    const response = await fetch(`/api/customers/${CustomerID}`, {
      method: "PUT",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: data
    });
    console.log(await response.json());
  } catch (e) {
    console.error(e);
  }

  loadTables();
  
}

async function showDeleteCustomerForm(CustomerID) {

  document.querySelector("#dialog1").close();

  const dialog = document.querySelector("#dialog1");

  clearList("dialogContainer");

  const container = dialog.querySelector("#dialogContainer");

  const template = document.getElementById("confirmDeleteForm-template").content.cloneNode(true);

  let button = template.querySelector("#confirmBtn");

  button.setAttribute("onclick", `deleteCustomer('${CustomerID}')`);  
  
  button = template.querySelector("#cancelBtn");

  button.setAttribute("onclick", `document.querySelector("#dialog1").close()`);   

  container.appendChild(template);

  dialog.showModal(); 
  
}

async function deleteCustomer(CustomerID) {
  

  document.querySelector("#dialog1").close();
  
  await fetch(`http://localhost:8080/api/customers/${CustomerID}`, {
    method: "DELETE"
  })
  .then((response) => response.json())
  .catch((response) => {      
    alert(`Response status = ${response.status}, message ${response.statusText}`);
  });

  loadTables();
}

async function addCustomer(PlaceID){
  await showAddCustomerFormDIalog(PlaceID);
}



async function loadDishes(){
  
  clearList("dishesList");
  
  await fetch("http://localhost:8080/api/dishes/")
  .then((response) => response.json())
  .then((json) => {
    json.data.forEach((item) => {   
      placeDishItem(item.DishID, item.Image, item.Name, item.Description, item.Price);
    });
  })
  .catch((response) => {      
    alert(`Response status = ${response.status}, message ${response.statusText}`);
  });

}


async function placeDishItem(DishID, Image, Name, Description, Price){
  
  const template = document.querySelector("#dishCard-template").content.cloneNode(true);

  template.querySelector("#dishImg").src=Image;

  template.querySelector("#dishName").innerText=Name;

  template.querySelector("#dishDescription").innerText=Description;

  template.querySelector("#dishPrice").innerText=Price;  
  
  template.querySelector("#deleteBtn").setAttribute("onclick", `showDeleteDishForm('${DishID}')`); 
  
  template.querySelector("#editBtn").setAttribute("onclick", `showEditDishForm('${DishID}')`); 


  document.querySelector("#dishesList").appendChild(template);
}

async function showDeleteDishForm(DishID){


  const dialog = document.querySelector("#dialog1");

  clearList("dialogContainer");

  const container = dialog.querySelector("#dialogContainer");

  const template = document.getElementById("confirmDeleteForm-template").content.cloneNode(true);

  let button = template.querySelector("#confirmBtn");

  button.setAttribute("onclick", `deleteDish('${DishID}')`);  
  
  button = template.querySelector("#cancelBtn");

  button.setAttribute("onclick", `document.querySelector("#dialog1").close()`);   

  container.appendChild(template);

  dialog.showModal(); 

}

async function deleteDish(DishID) {

  document.querySelector("#dialog1").close();
  
  await fetch(`http://localhost:8080/api/dishes/${DishID}`, {
    method: "DELETE"
  })
  .then((response) => response.json())
  .catch((response) => {      
    alert(`Response status = ${response.status}, message ${response.statusText}`);
  });

  loadDishes();
}

async function showEditDishForm(DishID){

  let dish = {};
  
  await fetch(`http://localhost:8080/api/dishes/${DishID}`)
  .then((response) => response.json())
  .then((json) => {
    dish = json.data
  })
  .catch((response) => {      
    alert(`Response status = ${response.status}, message ${response.statusText}`);
  });

  if(dish.length == 0)
    return;

  const dialog = document.querySelector("#dialog1");

  clearList("dialogContainer");

  const container = dialog.querySelector("#dialogContainer");

  const template = document.getElementById("editDishForm-template").content.cloneNode(true);

  template.getElementById("Image").value = dish[0].Image;

  template.getElementById("Name").value = dish[0].Name;

  template.getElementById("Description").value = dish[0].Description;

  template.getElementById("Price").value = dish[0].Price;


  let button = template.querySelector("#confirmBtn");

  button.setAttribute("onclick", `editDish('${DishID}')`);  
  
  button = template.querySelector("#cancelBtn");

  button.setAttribute("onclick", `document.querySelector("#dialog1").close()`);   

  container.appendChild(template);

  dialog.showModal(); 

}

async function editDish(DishID){

  
  const dialog = document.querySelector("#dialog1");
  
  dialog.close();

  const form = document.querySelector("#editDishForm");

  // Associate the FormData object with the form element
  const formData = new FormData(form);

  const data = JSON.stringify(Object.fromEntries(formData));
    
  try {
    const response = await fetch(`/api/dishes/${DishID}`, {
      method: "PUT",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: data
    });
    console.log(await response.json());
  } catch (e) {
    console.error(e);
  }

  loadDishes();
}


async function loadCustomers(){
  
  clearList("customersList");
  
  await fetch("http://localhost:8080/api/customers/")
  .then((response) => response.json())
  .then((json) => {

    json.data.forEach((item) => {   
      placeCustomerItem(item.CustomerID, item.FirstName, item.LastName, item.Email);
    });
  })
  .catch((response) => {      
    alert(`Response status = ${response.status}, message ${response.statusText}`);
  });

}



async function loadOrders(){
  
  clearList("ordersList");
  
  
  await fetch("http://localhost:8080/api/orders")
  .then((response) => response.json())
  .then((json) => {
    json.data.forEach((item) => {  
      loadOrder(item.DishPlaceID);  
    });
  })
  .catch((response) => {      
    alert(`Response status = ${response.status}, message ${response.statusText}`);
  });  

}

async function loadOrder(DishPlaceID) {

  
  await fetch(`http://localhost:8080/api/orders/${DishPlaceID}?join`)
  .then((response) => response.json())
  .then((json) => {
    json.data.forEach((item) => {   

      placeOrderItem(DishPlaceID, item.Number, item.Image, item.Name);

        });
      })
      .catch((response) => {      
        alert(`Response status = ${response.status}, message ${response.statusText}`);
      });
  
}


async function placeOrderItem(DishPlaceID, TableNumber, DishImage, DishName){
  
  const template = document.querySelector("#orderCard-template").content.cloneNode(true);

  template.querySelector("#orderTableNumber").innerText=TableNumber;

  template.querySelector("#orderDishImage").src=DishImage;

  template.querySelector("#orderDishName").innerText=DishName;  

  template.querySelector("#deleteBtn").setAttribute("onclick", `showDeleteOrderForm('${DishPlaceID}')`); 
   

  document.querySelector("#ordersList").appendChild(template);
}


async function showDeleteOrderForm(DishPlaceID) {

  document.querySelector("#dialog1").close();

  const dialog = document.querySelector("#dialog1");

  clearList("dialogContainer");

  const container = dialog.querySelector("#dialogContainer");

  const template = document.getElementById("confirmDeleteForm-template").content.cloneNode(true);

  let button = template.querySelector("#confirmBtn");

  button.setAttribute("onclick", `deleteOrder('${DishPlaceID}')`);  
  
  button = template.querySelector("#cancelBtn");

  button.setAttribute("onclick", `document.querySelector("#dialog1").close()`);   

  container.appendChild(template);

  dialog.showModal(); 
  
}


async function deleteOrder(DishPlaceID) {
  

  document.querySelector("#dialog1").close();
  
  await fetch(`http://localhost:8080/api/orders/${DishPlaceID}`, {
    method: "DELETE"
  })
  .then((response) => response.json())
  .catch((response) => {      
    alert(`Response status = ${response.status}, message ${response.statusText}`);
  });

  loadOrders();
}

async function placeCustomerItem(CustomerID, FirstName, LastName, Email){
  
  const template = document.querySelector("#customerCard-template").content.cloneNode(true);

  template.querySelector("#customerFirstName").innerText=FirstName;

  template.querySelector("#customerLastName").innerText=LastName;

  template.querySelector("#customerEmail").innerText=Email;  
  

  document.querySelector("#customersList").appendChild(template);
}

async function showAddCustomerFormDIalog(PlaceID){

  const dialog = document.querySelector("#dialog1");

  clearList("dialogContainer");

  const container = dialog.querySelector("#dialogContainer");

  const template = document.getElementById("addCustomerForm-template").content.cloneNode(true);

  const button = template.querySelector("#addCustomerBtn");

  button.setAttribute("onclick", `submitAddCustomerForm('${PlaceID}')`);  

  container.appendChild(template);

  dialog.showModal(); 
}

async function submitAddCustomerForm(PlaceID){


  const dialog = document.querySelector("#dialog1");
  
  dialog.close();

  const form = document.querySelector("#addCustomerForm");

  // Associate the FormData object with the form element
  const formData = new FormData(form);

  const data = JSON.stringify({...Object.fromEntries(formData), "PlaceID" :`${PlaceID}`});
  
  try {
    const response = await fetch("/api/customers/create", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: data
    });
    console.log(await response.json());
  } catch (e) {
    console.error(e);
  }

  
  loadTables();

}


async function showAddDishFormDIalog(){

  const dialog = document.querySelector("#dialog1");

  clearList("dialogContainer");

  const container = dialog.querySelector("#dialogContainer");

  const template = document.getElementById("addDishForm-template").content.cloneNode(true);

  container.appendChild(template);

  dialog.showModal(); 
}

async function submitAddDishForm() {
  
  const dialog = document.querySelector("#dialog1");
  
  dialog.close();

  const form = document.querySelector("#addDishForm");

  // Associate the FormData object with the form element
  const formData = new FormData(form);

  const data = JSON.stringify(Object.fromEntries(formData));
    
  try {
    const response = await fetch("/api/dishes/create", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: data
    });
    console.log(await response.json());
  } catch (e) {
    console.error(e);
  }

  
  loadDishes();
}


loadTables();

loadDishes();

loadOrders();