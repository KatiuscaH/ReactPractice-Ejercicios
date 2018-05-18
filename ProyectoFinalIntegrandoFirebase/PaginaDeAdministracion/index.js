var config = {
    apiKey: "AIzaSyDvjMMCfTa76r0hl0D12y5S3YFwenKVReE",
    authDomain: "administracion-7113b.firebaseapp.com",
    databaseURL: "https://administracion-7113b.firebaseio.com",
    projectId: "administracion-7113b",
    storageBucket: "administracion-7113b.appspot.com",
    messagingSenderId: "730981297008"
};
firebase.initializeApp(config);

/**
 * 1. Crear Platillos
 * 2. Leer nuestros platillos
 * 3. Eliminar nuestros platillos
 */

//1. Crear platillos
var database = firebase.database();//referencia a db de firebase
var escribirPlatillos = function (pNombre, pDescripcion, pPrecio, pDireccion) {
    database.ref('alimentos/').push({
        nombre: pNombre,
        descripcion: pDescripcion,
        precio: pPrecio,
        cantidad: 0,
        direccion: pDireccion
    })
}

//2. Leer nuestros platillos

var imprimirPlatillos = function () {
    var query = database.ref('alimentos/');
    query.on('value', function (snapshot) {
       
       var ul = document.getElementById("lista");
        snapshot.forEach(function(childSnapshot){
            console.log(childSnapshot.key);
            console.log(childSnapshot.val());

            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();

            var li = document.createElement("li");
            var div = document.createElement("div");
            var img = document.createElement("img");
            var br = document.createElement("br");

            img.src= childData.direccion;
            img.height = 200;
            img.width = 200;
            img.alt = "Imagen del platillo";

            div.appendChild(img);
            div.style.float = "right";
            li.setAttribute("class","list-group-item");
            li.appendChild(div);
            li.appendChild(document.createTextNode("Nombre: " + childData.nombre));
            li.appendChild(br);
            li.appendChild(document.createTextNode("Descripcion: " + childData.descripcion));
            li.appendChild(br);
            li.appendChild(document.createTextNode("Precio: " + childData.precio));


            ul.appendChild(li);
        })
    })
}


function funcionDeLaForma() {
    var nombre = document.getElementById("nombre").value;
    var descripcion = document.getElementById("descripcion").value;
    var precio = document.getElementById("precio").value;
    var imagen = document.getElementById("imgDir").value;


    //alert(nombre + descripcion + precio);
    escribirPlatillos(nombre, descripcion, precio, imagen);
}


//Visualizar imagen
var storage = firebase.storage();//para guardar las imagenes en firebase
var storageRef = storage.ref();


function visualizarArchivo() {
    var preview = document.querySelector('img');//selecciona la imagen
    var archivo = document.querySelector('input[type=file]').files[0];//el archivo
    var lector = new FileReader();//nuevo lector de archivo

    lector.onloadend = function () {
        preview.src = lector.result;//cuando finalice la carga se va a leer el archivo
    }

    if (archivo) {
        lector.readAsDataURL(archivo);
        //put
        var subirImagen = storageRef.child('platillos/' + archivo.name).put(archivo);
        subirImagen.on('state_changed', function (snapshot) {

        }, function (error) {
            console.log("Error en la carga de la imagen" + error);
        }, function () {
            console.log(subirImagen.snapshot.downloadURL + " se subio");
            document.getElementById("imgDir").value = subirImagen.snapshot.downloadURL;

        })
    } else {
        preview.src = "";
    }
}