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
    const precioInput = parseFloat(document.getElementById('precio').value);
    const nuevoProducto = {
        id: Date.now(),
        titulo: tituloInput,
        descripcion: descripcionInput,
        precio: precioInput,
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
function renderizarTarjetas(categoria = "todos") {
    const contenedor =
        document.getElementById("CoProducto");
    if (!contenedor) return;
    contenedor.innerHTML = "";
    let productosFiltrados = productos;
    if (categoria !== "todos") {
        productosFiltrados =
            productos.filter(
                producto => producto.categoria === categoria
            );
    }
    productosFiltrados.forEach(producto => {
        const tarjetaHTML = `
    <div class="tarjeta-producto">
    <img src="${producto.url_imagen}" alt="${producto.titulo}">
        <h3>${producto.titulo}</h3>
        <span class="tarjeta-categoria">${producto.categoria}</span>
        <p>${producto.descripcion}</p>
        <h3 class="precio">
            $${producto.precio}
        </h3>
         ${JSON.parse(localStorage.getItem("usuarioActivo"))?.rol === "Vendedor"
        ? `<button onclick='agregarCarrito(${JSON.stringify(producto)})'>
             🛒 Agregar
           </button>`
        : ""
    }
        ${JSON.parse(localStorage.getItem("usuarioActivo"))?.rol === "Administrador"
                ?
                `<button onclick="editarProducto(${producto.id})">
                 ✏️ Editar
                 </button>
                 <button onclick="eliminarProducto(${producto.id})">
                  🗑️ Eliminar
                  </button>`
                : ""
            }
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

cerrarSesion.addEventListener("click", () => {
    localStorage.removeItem("usuarioActivo");
    alert("Sesión cerrada");
    window.location.reload();
});

if (abrirLogin) {
    abrirLogin.addEventListener("click", () => {
        modalLogin.showModal();
    });
}

if (cerrarLogin) {
    cerrarLogin.addEventListener("click", () => {
        modalLogin.close();
    });
}

if (formularioLogin) {
    formularioLogin.addEventListener("submit", (evento) => {
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

        if (usuarioEncontrado) {
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
            renderizarTarjetas();
        } else {
            alert(
                "Usuario o contraseña incorrectos"
            );
        }
    });
    actualizarSesion();
    renderizarTarjetas();

}

function actualizarSesion() {

    const sesion =
        JSON.parse(localStorage.getItem("usuarioActivo"));

    const botonAgregar =
        document.getElementById("AbrirM");

    const botonCarrito =
        document.getElementById("abrirCarrito");

    const botonFacturas =
        document.getElementById("verFacturas");

    if (sesion) {

        abrirLogin.style.display = "none";
        cerrarSesion.style.display = "inline-block";

        if (sesion.rol === "Administrador") {
            botonFacturas.style.display = "inline-block";
            botonAgregar.style.display = "inline-block";
            botonCarrito.style.display = "none";

        } else if (sesion.rol === "Vendedor") {
            botonFacturas.style.display = "none";
            botonAgregar.style.display = "none";
            botonCarrito.style.display = "inline-block";
        }

    } else {

        abrirLogin.style.display = "inline-block";
        cerrarSesion.style.display = "none";

        botonAgregar.style.display = "none";

        // Ocultar carrito si no hay sesión
        botonCarrito.style.display = "none";
    }
}
actualizarSesion();
renderizarTarjetas();

let carrito = JSON.parse(
    localStorage.getItem("carrito")
) || [];
let ventas = JSON.parse(
    localStorage.getItem("ventas")
) || [];
function agregarCarrito(producto) {
    let existe =
        carrito.find(p => p.id === producto.id);
    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({
            id: producto.id,
            titulo: producto.titulo,
            imagen: producto.url_imagen,
            cantidad: 1,
            precio: producto.precio
        });
    }
    guardarCarrito();
    actualizarCarrito();
}
function guardarCarrito() {
    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );
}
function actualizarCarrito() {
    const contador =
        document.getElementById("contadorCarrito");

    if (contador) {
        contador.innerHTML =
            carrito.length;
    }
    const lista =
        document.getElementById("productosCarrito");
    if (!lista) return;
    lista.innerHTML = "";
    let total = 0;
    carrito.forEach((producto, index) => {
        let subtotal =
            producto.precio *
            producto.cantidad;
        total += subtotal;
        lista.innerHTML += `
<div class="producto-carrito">

<input type="checkbox"
       class="seleccion-carrito"
       value="${index}">

<h4>${producto.titulo}</h4>

Cantidad: ${producto.cantidad}<br>
Precio Unitario: $${producto.precio}<br>
Subtotal: $${subtotal}

<button onclick="eliminarCarrito(${index})">
    🗑️ Eliminar
</button>

</div>`;
    });
    const iva = total * 0.15;
    const totalConIva = total + iva;
    const btnEliminarSeleccionados =
        document.getElementById(
            "eliminarSeleccionadosCarrito"
        );

    if (carrito.length > 1) {
        btnEliminarSeleccionados.style.display =
            "block";
    } else {
        btnEliminarSeleccionados.style.display =
            "none";
    }
    document.getElementById("totalCarrito").innerHTML = `
    <p>Subtotal: $${total.toFixed(2)}</p>
    <p>IVA (15%): $${iva.toFixed(2)}</p>
    <h3>Total a pagar: $${totalConIva.toFixed(2)}</h3>
`;
}

function eliminarCarrito(index) {

    if (carrito[index].cantidad > 1) {
        carrito[index].cantidad--;

    } else {
        carrito.splice(index, 1);
    }
    guardarCarrito();
    actualizarCarrito();
}
const abrirCarrito =
    document.getElementById("abrirCarrito");
const modalCarrito =
    document.getElementById("modalCarrito");
if (abrirCarrito) {
    abrirCarrito.addEventListener("click",
        () => {
            actualizarCarrito();
            modalCarrito.showModal();
        });
}
document.getElementById(
    "cerrarCarrito"
)
    .addEventListener(
        "click",
        () => {
            modalCarrito.close();
        });

document.getElementById(
    "realizarVenta"
)
    .addEventListener(
        "click",
        () => {
            const usuario =
                JSON.parse(
                    localStorage.getItem(
                        "usuarioActivo"
                    )
                );

            if (!usuario) {
                alert(
                    "Inicie sesión primero"
                );
                return;
            }
            console.log(usuario);
            if (usuario.rol !== "Vendedor") {
                alert(
                    "Solo el vendedor puede realizar ventas"
                );
                return;
            }
            const text =
                document.getElementById(
                    "Cliente"
                ).value;

            if (carrito.length === 0) {
                alert(
                    "El carrito está vacío"
                );
                return;
            }
            let subtotal = 0;

            carrito.forEach(producto => {
                subtotal += producto.precio * producto.cantidad;
            });

            const iva = subtotal * 0.15;
            const total = subtotal + iva;
            console.log({
                subtotal,
                iva,
                total
            });
            const venta = {
                id: Date.now(),
                vendedor: usuario.usuario,
                cliente: text,
                fecha: new Date().toLocaleDateString(),
                productos: carrito,
                subtotal: subtotal,
                iva: iva,
                total: total,
                estado: "Activa"
            };
            ventas.push(venta);
            localStorage.setItem(
                "ventas",
                JSON.stringify(ventas)
            );
            generarFactura(venta);
            carrito = [];
            guardarCarrito();
            actualizarCarrito();
        });

function generarFactura(venta) {
    console.log("Generando factura", venta);
    const modal =
        document.getElementById("modalFactura");

    let productos = "";

    venta.productos.forEach(p => {

        productos += `
        <tr>
          <td>${p.titulo}</td>
          <td>${p.cantidad}</td>
          <td>$${p.precio}</td>
          <td>$${p.precio * p.cantidad}</td>
        </tr>`;
    });
    const subtotal = venta.subtotal;
    const iva = venta.iva;
    const totalFinal = venta.total;

    document.getElementById(
        "contenidoFactura"
    ).innerHTML = `
        <h3>Factura #${venta.id}</h3>
        <p><strong>Fecha:</strong> ${venta.fecha}</p>
        <p><strong>Cliente:</strong> ${venta.cliente}</p>
        <hr>
        <table width="100%">
           <thead>
                <tr>
                 <th>Producto</th>
                 <th>Cantidad</th>
                 <th>Precio</th>
                 <th>Subtotal</th>
                </tr>
            </thead>

            <tbody>
                ${productos}
            </tbody>
        </table>
        <hr>
        <p>Subtotal: $${subtotal}</p>
        <p>IVA (15%): $${iva.toFixed(2)}</p>
        <h2>Total: $${totalFinal.toFixed(2)}</h2>
    `;
    modal.showModal();
}
function cargarPanelAdmin() {
    const usuario =
        JSON.parse(
            localStorage.getItem("usuarioActivo")
        );
    const botonFacturas =
        document.getElementById("verFacturas");

    if (usuario && usuario.rol === "Administrador") {
        botonFacturas.style.display = "inline-block";
    } else {
        botonFacturas.style.display = "none";
    }
}
cargarPanelAdmin();

function verFacturaAdmin(id) {

    const ventas =
        JSON.parse(
            localStorage.getItem("ventas")
        ) || [];

    const venta =
        ventas.find(v => v.id === id);

    console.log(venta);

    if (!venta) return;

    generarFactura(venta);
}

function anularVenta(id) {

    const usuario =
        JSON.parse(
            localStorage.getItem("usuarioActivo")
        );

    if (!usuario ||
        usuario.rol !== "Administrador") {

        alert(
            "No tienes permisos"
        );
        return;
    }

    let ventas =
        JSON.parse(
            localStorage.getItem("ventas")
        ) || [];

    ventas = ventas.map(v => {

        if (v.id === id) {
            v.estado = "Anulada";
        }
        return v;
    });

    localStorage.setItem(
        "ventas",
        JSON.stringify(ventas)
    );

    alert(
        "Factura anulada correctamente"
    );
    cargarFacturas();
}
cargarPanelAdmin();

document.getElementById("verFacturas")
    .addEventListener("click", () => {

        cargarFacturas();

        document.getElementById(
            "modalFacturas"
        ).showModal();

    });

function cargarFacturas() {

    const listaFacturas =
        document.getElementById("listaFacturas");
    listaFacturas.innerHTML = "";

    const ventas =
        JSON.parse(localStorage.getItem("ventas")) || [];

    if (ventas.length === 0) {

        listaFacturas.innerHTML =
            "<p>No hay facturas registradas.</p>";

        return;
    }

    ventas.forEach(venta => {

        listaFacturas.innerHTML += `
        <div class="factura-card">

            <h3>Factura #${venta.id}</h3>

            <p><strong>Cliente:</strong>
            ${venta.cliente}</p>

            <p><strong>Vendedor:</strong>
            ${venta.vendedor}</p>

            <p><strong>Fecha:</strong>
            ${venta.fecha}</p>

           <p><strong>Total:</strong>
$${Number(venta.total).toFixed(2)}</p>
            <p><strong>Estado:</strong>
            ${venta.estado}</p>

            <button onclick="verFacturaAdmin(${venta.id})">
                Ver Factura
            </button>

            ${venta.estado === "Activa"
                ? `<button onclick="anularVenta(${venta.id})">
                    Anular
                   </button>`
                : ""
            }

            <hr>

        </div>
        `;
    });
}
document.getElementById(
    "cerrarFactura"
)
    .addEventListener(
        "click",
        () => {

            document.getElementById(
                "modalFactura"
            ).close();

        }
    );
const btnCerrarFacturas =
    document.getElementById("cerrarFacturas");

if (btnCerrarFacturas) {

    btnCerrarFacturas.addEventListener(
        "click",
        () => {

            document.getElementById(
                "modalFacturas"
            ).close();

        }
    );
}
function editarProducto(id) {

    const usuario =
        JSON.parse(localStorage.getItem("usuarioActivo"));

    console.log(usuario);

    if (usuario?.rol !== "Administrador") {
        alert("Solo el administrador puede editar productos");
        return;
    }

    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    document.getElementById("editarId").value =
        producto.id;

    document.getElementById("editarTitulo").value =
        producto.titulo;

    document.getElementById("editarDescripcion").value =
        producto.descripcion;

    document.getElementById("editarPrecio").value =
        producto.precio;

    document.getElementById("editarImagen").value =
        producto.url_imagen;

    document.getElementById("editarCategorias").value =
        producto.categoria;

    document.getElementById("modalEditar")
        .showModal();
}

function guardarEdicion() {
    alert("Se modifico correctamente el producto");

    const id =
        Number(
            document.getElementById("editarId").value
        );
    console.log(id);
    console.log(productos);

    const producto =
        productos.find(p => p.id === id);

    if (!producto) return;

    producto.titulo =
        document.getElementById("editarTitulo").value;

    producto.descripcion =
        document.getElementById("editarDescripcion").value;

    producto.precio =
        parseFloat(
            document.getElementById("editarPrecio").value
        );

    producto.url_imagen =
        document.getElementById("editarImagen").value;

    producto.categoria =
        document.getElementById("editarCategorias").value;

    localStorage.setItem(
        "misProductos",
        JSON.stringify(productos)
    );

    renderizarTarjetas();

    document.getElementById("modalEditar")
        .close();
    console.log(
        document.getElementById("editarId").value
    );
}
document.getElementById("guardarEdicion")
    .addEventListener("click", guardarEdicion);

function eliminarProducto(id) {

    const usuario =
        JSON.parse(localStorage.getItem("usuarioActivo"));

    if (!usuario || usuario.rol !== "Administrador") {
        alert("Solo el administrador puede eliminar productos");
        return;
    }
    const confirmar = confirm(
        "¿Deseas eliminar este producto?"
    );
    if (!confirmar) return;
    productos = productos.filter(
        producto => producto.id !== id
    );

    localStorage.setItem(
        "misProductos",
        JSON.stringify(productos)
    );

    carrito = carrito.filter(
        item => item.id !== id
    );

    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );
    renderizarTarjetas();
    alert("Producto eliminado correctamente");
}

function eliminarSeleccionadosCarrito() {

    const seleccionados =
        document.querySelectorAll(
            ".seleccion-carrito:checked"
        );

    const indices = [...seleccionados]
        .map(c => Number(c.value))
        .sort((a, b) => b - a);

    indices.forEach(index => {
        carrito.splice(index, 1);
    });

    guardarCarrito();
    actualizarCarrito();
}
document.getElementById(
    "eliminarSeleccionadosCarrito"
).addEventListener(
    "click",
    eliminarSeleccionadosCarrito
);

document.querySelectorAll(
    ".navbar a"
).forEach(boton => {

    boton.addEventListener("click", e => {
        e.preventDefault();
        const categoria =
            boton.dataset.categoria;
        renderizarTarjetas(categoria);
    });

});