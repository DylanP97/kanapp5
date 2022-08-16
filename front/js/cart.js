
//------------------------------------------------------------------- AFFICHAGE DU PANIER -------------------------------------------------------------------//

let ProductCartDisplay = document.getElementById('cart__items');
let totalQuantity = document.getElementById('totalQuantity');
let totalPrice = document.getElementById('totalPrice');
let inLocalStorage = JSON.parse(localStorage.getItem("Mon Panier"));
var arraytotalprices = [];

DisplayCart ()

function DisplayCart () {
    // Si le local storage est vide ou contient 0 objets affiché un message le panier est vide
    if (inLocalStorage == null || inLocalStorage == 0){
        document.getElementById('cartBubble').style.display = "none";
        ProductCartDisplay. innerHTML = 
        `<div class="cart__item__img__empty">
            <p class="emptycart">Le panier est vide!</p>
        </div>`
    }


    // Sinon on affiche les produits
    else {fetch('http://localhost:3000/api/products')

        .then(function(res){
            if(res.ok){
                // console.log('Connexion API :', res.ok)
                return res.json();
            }
        })

        .then(async function(res){
            for(let product of res){

                for(let article of inLocalStorage){
                    if (article.idProduitSelectionner == product._id){

                        
                        let producttotal = product.price * article.quantite

                        ProductCartDisplay.innerHTML +=`
                        <article class="cart__item" data-id="${article.idProduitSelectionner}" data-color="${article.option}">
                            <div class="cart__item__img">
                                <img src="${product.imageUrl}" alt="${product.altTxt}">
                            </div>
                            <div class="cart__item__content">
                                <div class="cart__item__content__description">
                                    <h2>${product.name}</h2>
                                    <p>Couleur : ${article.option}</p>
                                    <p id="itemTotal">${producttotal},00€</p>
                                <div class="cart__item__content__settings">
                                    <div class="cart__item__content__settings__quantity">
                                        <p>Qté : </p>
                                        <input type="number" id="itemQty" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${article.quantite}">
                                    </div>
                                    <div class="cart__item__content__settings__delete">
                                        <p class="deleteItem">Supprimer</p>
                                    </div>
                                </div>
                            </div>
                        </article>`


                        generateTotals()
                        generateFullQuantity()

                        //---------CHANGE QUANTIY---------                        

                        var allInputModify = document.querySelectorAll(`#itemQty`);

                        allInputModify.forEach(function(input, index) {
                            input.addEventListener("change", function (event) {
                                event.preventDefault();

                                let inputtoedit = event.target
                                console.log(event.target)

                                articletoedit = inputtoedit.closest("article")
                                idarticletoedit = articletoedit.dataset.id
                                colorarticletoedit = articletoedit.dataset.color
                                nodetotal = articletoedit.querySelector("#itemTotal")

                                let objecttochangeqtyv2 = inLocalStorage.find(({ idProduitSelectionner, option }) => idProduitSelectionner == articletoedit.dataset.id && option == articletoedit.dataset.color);
                                console.log("objecttochangeqtyv2:", objecttochangeqtyv2)
                                let mytotal = nodetotal.innerHTML
                                mytotal.replace(",00€", "")
                                let parsedtotal = parseFloat(mytotal);
                                let valeurDepart = objecttochangeqtyv2.quantite;
                                console.log(valeurDepart)
                                let valeurArrivee = input.valueAsNumber;
                                console.log(valeurArrivee)

                                let baseprice = parsedtotal / objecttochangeqtyv2.quantite;
                                console.log("baseprice :",baseprice)

                                objecttochangeqtyv2.quantite = valeurArrivee;
                                calcultotal = objecttochangeqtyv2.quantite * baseprice;
                                nodetotal.innerHTML = `${calcultotal},00€`

                                console.log(inLocalStorage)

                                localStorage.setItem("Mon Panier", JSON.stringify(inLocalStorage));

                                generateTotals()
                                generateFullQuantity()
                            })
                        })


                        //---------DELETE ONE PRODUCT--------- 

                        var allDeleteItemNode = document.querySelectorAll(`.deleteItem`);

                        allDeleteItemNode.forEach(function(button, index) {
                            button.addEventListener("click", function (event) {
                                event.preventDefault();

                                let correctdeleteitem = event.target
                                console.log(event.target)

                                articletodelete = correctdeleteitem.closest("article")
                                idarticletodelete = articletodelete.dataset.id
                                colorarticletodelete = articletodelete.dataset.color

                                // let objecttodelete = arrayproduct[index]
                                let objecttodeletev2 = inLocalStorage.find(({ idProduitSelectionner, option }) => idProduitSelectionner == articletodelete.dataset.id && option == articletodelete.dataset.color);

                                inLocalStorage = inLocalStorage.filter(el => el !== objecttodeletev2);
                                localStorage.setItem("Mon Panier", JSON.stringify(inLocalStorage));
                                alert("Ce produit a été supprimé du panier")

                                articletodelete.remove();

                                generateTotals()
                                generateFullQuantity()
                            })
                        })
                    }
                }
            }
        })
    }
}



//------------------------------------------------------------------- TOUT SUPPRIMER DANS LE PANIER -------------------------------------------------------------------//
    
// Fonction pour supprimer tout le panier avec localStorage.clear()
let ClearBtn = document.getElementById('cart__deleteeverything')

ClearBtn.addEventListener("click", function clear(){
    localStorage.clear();
    window.location.reload();
})



//------------------------------------------------------------------- TOTAL QUANITE -------------------------------------------------------------------//


function generateFullQuantity(){

    let fullquantity = inLocalStorage.length
    
    console.log("Sum of quantituté is " + fullquantity);
    totalQuantity.innerHTML = `${fullquantity}`    
}



//------------------------------------------------------------------- TOTAL PANIER -------------------------------------------------------------------//


function generateTotals(){

    var arraytotalprices = []
    alltotalpricesnode = document.querySelectorAll('#itemTotal');
    console.log(alltotalpricesnode)
    alltotalpricesnode.forEach(function(element) {
        let totalhtml = element.innerHTML;
        let stringfulltotal = totalhtml.replace(",00€", "");
        let parsedfulltotal = parseFloat(stringfulltotal)
        arraytotalprices.push(parsedfulltotal)
    })

    function sum(arr) { 
        let somme = 0;
        for (let m = 0; m < arr.length; m++) 
            somme += arr[m]; 
        return somme; 
    } 
    
    console.log("Sum of array is " + sum(arraytotalprices));
    totalPrice.innerHTML = `${sum(arraytotalprices)}`    
}


//------------------------------------------------------------------- FORMULAIRE COMMANDE -------------------------------------------------------------------//



//Création des Regex
let firstNameRegExp = new RegExp("^[a-zA-Zàâäéèêëïîôöùûüç ,.'-]+$");
let lastNameRegExp = new RegExp("^[a-zA-Zàâäéèêëïîôöùûüç ,.'-]+$");
let addressRegExp = new RegExp("^[0-9]{1,5}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+");
let cityRegExp = new RegExp("^[a-zA-Zàâäéèêëïîôöùûüç ,.'-]+$");
let emailRegExp = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$');

let firstName = document.getElementById('firstName')
let firstNameErrorMsg = document.getElementById('firstNameErrorMsg')
let lastName = document.getElementById('lastName')
let lastNameErrorMsg = document.getElementById('lastNameErrorMsg')
let address = document.getElementById('address')
let addressErrorMsg = document.getElementById('addressErrorMsg')
let city = document.getElementById('city')
let cityErrorMsg = document.getElementById('cityErrorMsg')
let email = document.getElementById('email')
let emailErrorMsg = document.getElementById('emailErrorMsg')
let submit = document.getElementById('order')
let formErrorMsg = document.getElementById('formErrorMsg')

let allforminputs = document.querySelectorAll('.cart__order__form__question input')
console.log(allforminputs)

let allInputValid = false

let firstnregex 
firstName.addEventListener("input", (e) =>{
    firstnregex = firstNameRegExp.test(firstName.value)
    console.log("firstnregex: ", firstnregex)

    if (firstnregex == false){
        firstNameErrorMsg.innerHTML = "Votre prénom n'est pas valide.";
        allInputValid = false;
    }
    else {
        firstNameErrorMsg.innerHTML = "";
    }
})

let lastnregex
lastName.addEventListener("input", (e) =>{
    lastnregex = lastNameRegExp.test(lastName.value)
    console.log("lastnregex: ",  lastnregex)

    if (lastnregex == false){
        lastNameErrorMsg.innerHTML = "Votre nom n'est pas valide.";
        allInputValid = false;
    }
    else {
        lastNameErrorMsg.innerHTML = "";
    }
})

let addressregex
address.addEventListener("input", (e) =>{
    addressregex = addressRegExp.test(address.value)
    console.log("addressregex: ",  addressregex)

    if (addressregex == false){
        addressErrorMsg.innerHTML = "Votre addresse n'est pas valide.";
        allInputValid = false;
    }
    else {
        addressErrorMsg.innerHTML = "";
    }
})

let cityregex
city.addEventListener("input", (e) =>{
    cityregex = cityRegExp.test(city.value)
    console.log("cityregex: ",  cityregex)

    if (cityregex == false){
        cityErrorMsg.innerHTML = "Votre ville n'est pas valide.";
        allInputValid = false;
    }
    else {
        cityErrorMsg.innerHTML = "";
    }
})

let emailregex
email.addEventListener("input", (e) =>{    
    emailregex = emailRegExp.test(email.value)
    console.log("emailregex: ",  emailregex)

    if (emailregex == false){
        emailErrorMsg.innerHTML = "Votre email n'est pas valide.";
        allInputValid = false;
    }
    else {
        emailErrorMsg.innerHTML = "";
    }
})

allforminputs.forEach(function(button) {
    button.addEventListener("input", (e) =>{
        if (firstnregex == true && lastnregex == true && addressregex == true && cityregex == true && emailregex == true){
            allInputValid = true;
        }
    })
})


SubmitForm()

function SubmitForm() {
    submit.addEventListener("click", (e) =>{
        e.preventDefault();

        if (inLocalStorage != null){
            if (allInputValid && inLocalStorage.length >= 1) {  

                let arrayOfProductId = [];
    
                for (let b = 0; b < inLocalStorage.length; b++) {
                    console.log(b + " itération")
                    console.log(inLocalStorage[b].idProduitSelectionner)
                    arrayOfProductId.push(inLocalStorage[b].idProduitSelectionner)
                }
                    
    
                const order = {
                    contact : {
                        firstName: firstName.value,
                        lastName: lastName.value,
                        address: address.value,
                        city: city.value,
                        email: email.value,
                    },
                    products: arrayOfProductId,
                } 
            
                fetch('http://localhost:3000/api/products/order', {
                    method: 'POST',
                    body: JSON.stringify(order),                
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                })
                .then((response) => response.json())
                .then((data) => {
                    localStorage.clear();
                    console.log(data)
                    localStorage.setItem("orderId", data.orderId);
                    let url = new URL('front/html/confirmation.html', origin);
                    let urladd = `${data.orderId}`
                    url.search = urladd
                    document.location.href = url
                })
                
                .catch((err) => {
                    alert ("Problème avec fetch : " + err.message);
                });
            
            }

            else if (allInputValid == false) {
                formErrorMsg.innerHTML = `Le formulaire n'est pas valide`
            }

            else if (inLocalStorage == 0) {
                formErrorMsg.innerHTML = `Le panier est vide`
            }
        }
        
        else if (inLocalStorage == null ) {
            formErrorMsg.innerHTML = `Le panier est vide`
        }
    })
}
