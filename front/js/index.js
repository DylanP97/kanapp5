




let inLocalStorage = JSON.parse(localStorage.getItem("Mon Panier"));
// if (inLocalStorage != null || inLocalStorage != []) {
//     document.getElementById('cartBubble').style.display = "block";
// }


const Catalogue = document.getElementById('items');

//on récupère les données de l'API 
fetch('http://localhost:3000/api/products')
    .then(function(res){
        if(res.ok){
            console.log(res.ok)
            return res.json();
        }
    })
    .then(function(res){
        console.log(res.length)

        //on fait une boucle qui va afficher la div de chaque produit sur le html
        for(let product of res){
        Catalogue.innerHTML +=
        
         `<a href='product.html?id=${product._id}'>
                <article>
                  <img src="${product.imageUrl}" alt="${product.altTxt}"></img>
                  <h3 class="productName">${product.name}</h3>
                  <p class="productDescription">${product.description}</p>
                  <p class="productPrice">${product.price} euros</p>
                </article>
            </a> `
        }
    })
    .catch(function(){
        console.log('Erreur de chargement');
    })
