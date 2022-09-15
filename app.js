var buttonContact = document.getElementById("boton-contacto");

function GotoContacts() {
    window.location.pathname = ('/users.html')
}

buttonContact.addEventListener("click", GotoContacts);


//Evento submit
let formulario = document.getElementById("form")

formulario.addEventListener('submit', datosForm)

function datosForm(e){
    //cancelamos por las dudas 
    e.preventDefault();

   //capturar los datos de los input
   let datos = e.target
   //obtenemos los datos ingresados e enviados en el evento
 
   //cargo los datos en las variables datos que vienen del index
   let Nombre = document.getElementById("CNombreCompleto").value;
   let Correo = document.getElementById("CCorreo").value;
   let NumeroTarjeta = document.getElementById("CNumeroTarjeta").value;
   let todoBien = true;

   let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

   //Realizo las validaciones de los tres campos del formulario
   if( Correo == null || Correo.length == 0 || !isNaN(Correo) && Correo.match(regexEmail)) {
       todoBien=false;
       swal("Datos Incompletos ", "Correo no es valido (@) o (.) ", "error")
   }

   if( Nombre == null || Nombre.length == 0 || /^\s+$/.test(Nombre) || !isNaN(Nombre)) {
       todoBien=false;
       swal("Datos Incompletos ", "No Ingreso el nombre", "error")
   }

   if( NumeroTarjeta.length == 0 || NumeroTarjeta=="" || isNaN(NumeroTarjeta) ) {
       todoBien=false;
       swal("Datos Incompletos ", "No Ingreso EL Numero de Tarjeta ", "error")
   }

   // Si todo esta correcto presento esta SweetAlert y confirmo que la orden se proceso sin problema
if (todoBien == true){   
    swal("Gracias por su Compra ", "Gracias por su compra, enviamos un correo a su cuenta. Orden de Compra 125487", "success")
}

}

//Crear contenedorProductos
const contenedorProductos = document.getElementById('contenedor-productos')

//Crear contenedorCarrito
const contenedorCarrito = document.getElementById('carrito-contenedor')

// Creacion de botones
const botonVaciar = document.getElementById('vaciar-carrito')
const botonProcesar = document.getElementById('procesar-carrito')

//Modificamos el contador del carrito
const contadorCarrito = document.getElementById('contadorCarrito')

// Calculos Matematicos 
const cantidad = document.getElementById('cantidad')
const precioTotal = document.getElementById('precioTotal')
const precioTotalIva = document.getElementById('precioTotalIva')
const cantidadTotal = document.getElementById('cantidadTotal')
const precioTransporte = document.getElementById('preciotransporte')
const preciofinal = document.getElementById('preciofinal')
var changedText = document.getElementById('changed');

let carrito = []
document.addEventListener('DOMContentLoaded', () => {
   if (localStorage.getItem('carrito')){
       carrito = JSON.parse(localStorage.getItem('carrito'))
       actualizarCarrito()
   }
})

// Vaciar Carrito
botonVaciar.addEventListener('click', () => {
   carrito.length = 0
   actualizarCarrito()

   swal("Vaciar Orden ", "No hay mas Articulos en la orden", "success")

})

//Inyectamos el HTML
stockProductos.forEach((producto) => {
    

    const {img, nombre, desc, PosicionC, precio, id} = producto 

 


    const div = document.createElement('div')
    div.classList.add('producto')

    div.innerHTML = `
    <img src=${img} alt= "">
    <h3>${nombre}</h3>
    <p>${desc}</p>
    <p>Posicion: ${PosicionC}</p>
    <p class="precioProducto">Precio:$ ${precio}</p>
    <button id="agregar${id}" class="boton-agregar">Agregar <i class="fas fa-shopping-cart"></i></button>

    `
    // Agregamos el boton de Agregar
    contenedorProductos.appendChild(div)
    const boton = document.getElementById(`agregar${id}`)
   
    boton.addEventListener('click', () => {
        //esta funcion ejecuta el agregar el carrito con la id del producto
        agregarAlCarrito(id)
        //
    })
 
})

//Agregar al carrito
const agregarAlCarrito = (prodId) => {
   //proceso para aumentar cantidad y que no se repita
   //comprobar si el elemento ya existe en el carro
   const existe = carrito.some (prod => prod.id == prodId) 
   if (existe){ 
       // Si el ID ya existe , actulizamos la cantidad
       const prod = carrito.map (prod => { 
           //creamos un nuevo arreglo e repetimos sobre cada ID y cuando
           // map encuentre cual es el q igual al que está agregado, le suma la cantidad
           if (prod.id === prodId){
               prod.cantidad++
           }
       })
   } else { 
       // si NO Existe , agregamos el ID al Carrito
       const item = stockProductos.find((prod) => prod.id === prodId)
       //Una vez obtenida la ID, lo que haremos es hacerle un push para agregarlo al carrito
       carrito.push(item)
   }
   //Va a buscar el item, agregarlo al carrito y llama a la funcion actualizarCarrito, que recorre
   actualizarCarrito() 
}

// eliminar Item del Carrito
const eliminarDelCarrito = (prodId) => {
   const item = carrito.find((prod) => prod.id === prodId)
   //Busca el elemento y devuelve su indice.
   const indice = carrito.indexOf(item) 
   //Le pasamos el indice y borramos 
   carrito.splice(indice, 1) 
   // un elemento 
   actualizarCarrito() 

   swal("Eliminar", "El Item se elimino de la Orden de Compra", "success")


}

// Actualizar Carrito
const actualizarCarrito = () => {
   //Vamos Agregando los productos al carrito
   contenedorCarrito.innerHTML = "" 
   //actualizarCarrito , 1 borrar el nodo, 2 recorro el array lo actualizo de nuevo y lo rellena con la info
   //actualizado, Agregar al modal, Recorremos sobre el array de carrito.
   //Por cada producto creamos un div con esta estructura y le hacemos un append al contenedorCarrito (el modal)
   carrito.forEach((producto) => {

    const { nombre, precio, id, cantidad} = producto 


       const div = document.createElement('div')
       div.className = ('productoEnCarrito')

       div.innerHTML = `<p>${nombre}</p>
       <p>Precio:$${precio}</p>
       <p>Cantidad: <span id="cantidad">${cantidad}</span></p>
       <button onclick="eliminarDelCarrito(${id})" class="boton-eliminar"><i class="fas fa-trash-alt"></i></button>`

       contenedorCarrito.appendChild(div)
       localStorage.setItem('carrito', JSON.stringify(carrito))

   })

   // actualizamos el Tamaño del carrito.
   contadorCarrito.innerText = carrito.length 

   precioTotal.innerText = carrito.reduce((accumulador, prod) => accumulador + prod.cantidad * prod.precio, 0)
   precioTotalIva.innerText = carrito.reduce((accumulador, prod) =>    accumulador + (prod.cantidad * prod.precio ) *0.13   , 0)
   
   // Transporte es costo Fijo 2000
   precioTransporte.innerText = 2000
   preciofinal.innerText = 2000 + carrito.reduce((accumulador, prod) => accumulador + prod.cantidad * prod.precio, 0) + carrito.reduce((acc, prod) =>    acc + (prod.cantidad * prod.precio ) *0.13   , 0)
   //Por cada producto en el carrito el acumulador le suma precio, Iva, Precio Final + Transporte, en base al acumulador
   
}