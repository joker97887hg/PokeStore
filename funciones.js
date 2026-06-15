const AbrirM = document.getElementById('AbrirM');
const cerrarM = document.getElementById('subir')
const modalA = document.getElementById('agregarM')

AbrirM.addEventListener('click', () => {
    modalA.showModal();
})
cerrarM.addEventListener('click', () => {
    modalA.close()
})

modalA.addEventListener('click', (evento) => {
    if (evento.target === modalA) {
        modalA.close();
    }
})

let productos = JSON.parse(localStorage.getItem('misProductos')) || [];

renderizarTarjetas();

document.getElementById('FProducto').addEventListener('submit', function (event) {
    event.preventDefault();


    const tituloInput = document.getElementById('titulo').value;
    const descripcionInput = document.getElementById('descripcion').value;
    const urlImagenInput = document.getElementById('url_imagen').value;
    const categoriaSelect = document.getElementById('categorias').value;

    const nuevoProducto = {
        id: Date.now(),
        titulo: tituloInput,
        descripcion: descripcionInput,
        url_imagen: urlImagenInput,
        categoria: categoriaSelect
    };

    productos.push(nuevoProducto);
    localStorage.setItem('misProductos', JSON.stringify(productos));


    console.log("Producto agregado con éxito:", nuevoProducto);
    console.log("Lista completa de productos:", productos);

    document.getElementById('FProducto').reset();

    renderizarTarjetas();
})
function renderizarTarjetas() {
    const contenedor = document.getElementById('CoProducto');
    if (!contenedor) return;
    contenedor.innerHTML = '';
    productos.forEach(producto => {
        const tarjetaHTML = `
            <div class="tarjeta-producto">
                <img src="${producto.url_imagen}" alt="${producto.titulo}">
                <h3>${producto.titulo}</h3>
                <span class="tarjeta-categoria">${producto.categoria}</span>
                <p>${producto.descripcion}</p>
            </div>
        `;

        contenedor.innerHTML += tarjetaHTML;
    });
}
const usuarios = [
    {
        usuario: "admin",
        contraseña: "1234",
        rol: "Administrador"
    },

    {
        usuario: "vendedor",
        contraseña: "1234",
        rol: "Vendedor"
    }
];

const abrirLogin = document.getElementById("abrirLogin");
const modalLogin = document.getElementById("modalLogin");
const cerrarLogin = document.getElementById("cerrarLogin");
const formularioLogin = document.getElementById("login");
const cerrarSesion = document.getElementById("cerrarSesion");

if(abrirLogin){
    abrirLogin.addEventListener("click",()=>{
        modalLogin.showModal();
    });
}

if(cerrarLogin){
    cerrarLogin.addEventListener("click",()=>{
        modalLogin.close();
    });
}

if(formularioLogin){
    formularioLogin.addEventListener("submit",(evento)=>{
        evento.preventDefault();
        const usuario =
        document.getElementById("usuario").value;
        const contraseña =
        document.getElementById("contraseña").value;
        const usuarioEncontrado =
        usuarios.find(user =>
            user.usuario === usuario &&
            user.contraseña === contraseña
        );

        if(usuarioEncontrado){
            localStorage.setItem(
                "usuarioActivo",
                JSON.stringify(usuarioEncontrado)
            );
            alert(
                "Bienvenido " +
                usuarioEncontrado.rol
            );
            modalLogin.close();
            actualizarSesion();
        }else{
            alert(
                "Usuario o contraseña incorrectos"
            );
        }
    });
}

function actualizarSesion(){

    const sesion =
    JSON.parse(localStorage.getItem("usuarioActivo"));
    const botonAgregar =
    document.getElementById("AbrirM");

    if(sesion){
        abrirLogin.style.display="none";
        cerrarSesion.style.display="inline-block";

        if(sesion.rol === "Administrador"){
            botonAgregar.style.display="inline-block";
        }else{
            botonAgregar.style.display="none";
        }
    }else{
        abrirLogin.style.display="inline-block";
        cerrarSesion.style.display="none";
        botonAgregar.style.display="none";    
    }
}
actualizarSesion();

