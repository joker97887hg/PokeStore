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

const productos = [];

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

    console.log("Producto agregado con éxito:", nuevoProducto);
    console.log("Lista completa de productos:", productos);

    document.getElementById('FProducto').reset();

    renderizarTarjetas();
})
function renderizarTarjetas() {
    const contenedor = document.getElementById('CoProducto');
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
