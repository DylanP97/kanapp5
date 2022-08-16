
const productImgDisplay = document.getElementById('product_img')
const productTitleDisplay = document.getElementById('title')
const productTitleMetaDisplay = document.getElementById('titlemeta')
const productPriceDisplay = document.getElementById('price')
const productDescriptionDisplay = document.getElementById('description')
const productSKUDisplay = document.getElementById('sku')
const productColorsDisplay = document.getElementById('colors')
let colorChoice    

const quantityNumber = document.getElementById('quantity')
const quantityNotification = document.getElementById('notificationQuantity')
let quantityProducts
let quantite

const addToCartBtn = document.getElementById("addToCart")
const ATCConfirmationText = document.getElementById("confirmationaddToCart")


//on récupère l'ID dans l'URL
let parametresUrl = new URLSearchParams(window.location.search);
let produitId = parametresUrl.get("id");
console.log(`Id du produit :`, produitId)


// On déclare en amont la variable inLocalStorage pour pouvoir récupérer les keys et values plus tard en objet JS
let inLocalStorage = JSON.parse(localStorage.getItem("Mon Panier"));
// if (inLocalStorage != null || inLocalStorage.length != 0) {
//     document.getElementById('cartBubble').style.display = "block";
// }
 



//on récupère les données de l'API 
fetch('http://localhost:3000/api/products')

    .then(function(res){
        if(res.ok){
            console.log('Connexion API :', res.ok)
            return res.json();
        }
    })

    //on fait une boucle qui va scanner tout les produits et détecter lequel à l'id correspondant 
    .then(function(res){
        for(let product of res){
            if (product._id == produitId) {
                
                //on va afficher les données sur le html
                console.log(product)
                productImgDisplay.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}"></img>` 
                productTitleDisplay.innerHTML = `${product.name}`
                productTitleMetaDisplay.innerHTML = `${product.name}`
                productPriceDisplay.innerHTML = `${product.price}`
                productDescriptionDisplay.innerHTML = `${product.description}`
                productSKUDisplay.innerHTML = `${product._id}`

                console.log("couleurs parmi les variantes : " + product.colors)

                //on fait une boucle pour afficher les variantes sur le dropdown autant qu'il y en a
                for(let _color of product.colors) {
                    productColorsDisplay.innerHTML +=
                    `<option value="${_color}">${_color}</option>`
                }

                productColorsDisplay.addEventListener('change', (event) => {
                    colorChoice = `${event.target.value}`;
                });

                addToCartBtn.addEventListener("click", function(e){
                    e.preventDefault()
                    
                    //on récupére la couleur dès que l'utilisateur clique, on s'assure avec une condition qu'elle n'est pas nulle              
                    if (colorChoice == undefined || colorChoice == ''){
                        ATCConfirmationText.innerHTML = "*Attention! Vous devez ajouter une couleur!"
                    }

                    else if (colorChoice != undefined || colorChoice != ''){

                        //on récupére la quantité dès que l'utilisateur clique, on s'assure avec une condition qu'elle est entre 1 et 100                                  
                        if (quantityNumber.value < 1 || quantityNumber.value > 100){
                            ATCConfirmationText.innerHTML = "**Attention! La quantité doit être comprise entre 1 et 100!"
                        }
                        
                        //la quantité correct, on créer le panier dans le local storage 
                        else if (quantityNumber.value >= 1 && quantityNumber.value <= 100 && colorChoice != undefined){

                            //texte et notification pour dire au client que son produit a bien été ajouté 
                            ATCConfirmationText.innerHTML = "Votre produit à bien été ajouté au panier!";

                            // On crée l'objet du produit en amont
                            quantityProducts = quantityNumber.value
                            total = product.price*quantityProducts

                            let productObject = {
                                idProduitSelectionner : product._id,
                                // nomProduitSelectionner :  product.name,
                                // prix : product.price,
                                option : colorChoice,
                                quantite : quantityProducts,
                                // total : total,
                                // image : product.imageUrl,
                                // imageAlt : product.altTxt,
                                // description : product.description
                            }

                            // on créer une fonction pour ajouté un nouveau objet dans le LS
                            function PushNewObject(){
                                inLocalStorage.push(productObject);
                                localStorage.setItem("Mon Panier", JSON.stringify(inLocalStorage))
                            }

                            let shouldIPush

                            if (inLocalStorage == undefined || inLocalStorage === null){
                                inLocalStorage = [];
                                PushNewObject()
                                console.log("new ls")
                            }

                            else if (inLocalStorage != undefined || inLocalStorage !== null) {
                                for (let i = 0; i < inLocalStorage.length; i++) {
                                    console.log(i + " itération")

                                        if (productObject.idProduitSelectionner == inLocalStorage[i].idProduitSelectionner && productObject.option == inLocalStorage[i].option) {
                                            
                                            let parsechooseqty =  parseFloat(productObject.quantite);
                                            let parsecurrentqty =  parseFloat(inLocalStorage[i].quantite);
                                            let parseprice = parseFloat(product.price);
                                            
                                            let editqty = parsechooseqty + parsecurrentqty;
                                            // let edittotal = editqty * parseprice;

                                            inLocalStorage[i].quantite = editqty;
                                            // inLocalStorage[i].total = edittotal;
                                            localStorage.setItem("Mon Panier", JSON.stringify(inLocalStorage));

                                            console.log("increasing quantity " + i + " should be right index");
                                            shouldIPush = false
                                        }

                                        else if (shouldIPush = null || shouldIPush == undefined || shouldIPush != false) {
                                            shouldIPush = true
                                            console.log("par là")
                                        }
                                        console.log(shouldIPush)                                            


                                    }
                                    
                                }
                        if (shouldIPush){
                            PushNewObject()
                            console.log("push new object to existing ls")
                        }    
                        }
                    }
                    }
                )    
            }
        }
    })    
    
    .catch(function(){
        console.log('Erreur de chargement');
    })



