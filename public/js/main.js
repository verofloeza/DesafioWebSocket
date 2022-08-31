const socket = io();

// Productos
socket.on('from-server-producto', data => {
   if(data.DB_PRODUCTOS.length == 0){
    renderSinProd()
   }else{
    render(data.DB_PRODUCTOS)
   }
    
});

function render(data){
      const htmlCuerpo = data.map(prod =>{
          return `<tr>
          <td>${prod.title}</td>
          <td>${prod.price}</td>
          <td><img src=${prod.thumbnail} width="30"></td>
        </tr>`;
        
      })

      const table = '<div class="table-responsive"><table class="table table-dark"><tr style="color: yellow;"> <th>Nombre</th> <th>Precio</th> <th>Imagen</th> </tr>'+htmlCuerpo+'</table></div>'

      document.querySelector('#productos').innerHTML =table;
      
      document.querySelector('#title').value= "";
      document.querySelector('#price').value= "";
      document.querySelector('#thumbnail').value= "";

  }

  function renderSinProd(){
     const htmlCuerpo = '<h3 class="alert alert-warning">No hay productos</h3>';
     document.querySelector('#productos').innerHTML = htmlCuerpo;

  }

  function agregarProductos(){
    const title = document.querySelector('#title');
    const price = document.querySelector('#price');
    const thumbnail = document.querySelector('#thumbnail');
    
    const producto = {
      title: title.value,
      price: price.value,
      thumbnail: thumbnail.value
    }

    socket.emit('from-client-producto', producto);
  }

// Chat
function habilitarButton(){

  var texto = document.getElementById("email").value;
  var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
  if (!regex.test(texto)) {
    document.getElementById('buttonMensaje').disabled = 'disabled'
  } else {
    document.getElementById('buttonMensaje').removeAttribute('disabled');
  }
  
}

socket.on('from-server-mensajes', data => {
  renderMensaje(data.DB_MENSAJE);
});

function renderMensaje(mensajes) {

  const cuerpoMensajesHTML = mensajes.map((msj)=>{
      return `<div class="col-12 cont"><b class="colorBlue">${msj.email}</b><p class="colorBrown">[${msj.date}]:</p> <span class="textMessage">${msj.text}</span></div><br><br>`;
  });  

  document.querySelector('#historial').innerHTML = cuerpoMensajesHTML;
  document.querySelector('#message').value = "";
}

function enviarMensaje() {
  const inputEmail = document.querySelector('#email');
  const inputMessage = document.querySelector('#message');
  
  var date = new Date();
  const mensaje = {
      email: inputEmail.value,
      date: date.toLocaleString(),
      text: inputMessage.value
  }

  socket.emit('from-client-mensaje', mensaje);
}
