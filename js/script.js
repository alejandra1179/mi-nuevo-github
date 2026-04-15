document.addEventListener('DOMContentLoaded', () => {
    // 1. REFERENCIAS DE ELEMENTOS
    const buscador = document.getElementById('inputBusqueda');
    const tarjetas = document.querySelectorAll('.tarjeta-producto');
    const secciones = document.querySelectorAll('.contenido');
    const inicio = document.getElementById('inicio');
    const listaCarrito = document.getElementById('lista-carrito');
    const totalElemento = document.getElementById('total-precio');
    const contenedorFinalizar = document.getElementById('finalizar-compra');

    let carrito = [];

    // 2. NAVEGACIÓN (Cambiar entre Inicio, Frutas, Verduras y Carrito)
    document.querySelectorAll('nav a').forEach(enlace => {
        enlace.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Verificamos que sea un enlace interno (con #)
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);

                // Limpiar buscador al navegar
                if(buscador) buscador.value = "";

                // Cambiar estilo del botón activo en el menú
                document.querySelectorAll('nav a').forEach(l => l.classList.remove('activo'));
                this.classList.add('activo');

                // Mostrar la sección correspondiente
                secciones.forEach(sec => {
                    if (sec.id === targetId) {
                        sec.style.display = 'block';
                        // Asegurar que los productos se vean (por si venimos de una búsqueda)
                        sec.querySelectorAll('.tarjeta-producto').forEach(t => t.style.display = 'flex');
                    } else {
                        sec.style.display = 'none';
                    }
                });
                window.scrollTo(0, 0);
            }
        });
    });

    // 3. LÓGICA DEL BUSCADOR
    if (buscador) {
        buscador.addEventListener('input', (e) => {
            const texto = e.target.value.toLowerCase().trim();
            const seccionProductos = document.getElementById('frutas'); // Cambia según tu sección principal

            if (texto.length > 0) {
                if(inicio) inicio.style.display = 'none';
                // Mostramos todas las secciones de productos para que el filtro funcione globalmente
                secciones.forEach(sec => {
                    if(sec.id !== 'inicio' && sec.id !== 'carrito') {
                        sec.style.display = 'block';
                    }
                });

                tarjetas.forEach(tarjeta => {
                    const nombre = tarjeta.querySelector('h3').textContent.toLowerCase();
                    tarjeta.style.display = nombre.includes(texto) ? 'flex' : 'none'; 
                });
            }
        });
    }

    // 4. LÓGICA DEL CARRITO (Añadir productos)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-carrito') && !e.target.id.includes('whatsapp')) {
            const tarjeta = e.target.closest('.tarjeta-producto');
            if (!tarjeta) return;

            const nombre = tarjeta.querySelector('h3').textContent;
            const precioTexto = tarjeta.querySelector('.precio').textContent;
            
            // Convertimos "$2.500" en número puro (2500)
            const precio = parseInt(precioTexto.replace(/[^0-9]/g, ''));
            const imagen = tarjeta.querySelector('img').src;

            // Guardamos en el arreglo
            carrito.push({ id: Date.now(), nombre, precio, imagen });
            
            actualizarCarritoUI();
            
            // Pequeña animación en el botón para avisar que se agregó
            const btnOriginalText = e.target.innerText;
            e.target.innerText = "¡Añadido! ✅";
            setTimeout(() => { e.target.innerText = btnOriginalText; }, 800);
        }
    });

    // 5. ACTUALIZAR LA VISTA DEL CARRITO
    function actualizarCarritoUI() {
        if (!listaCarrito) return;
        
        listaCarrito.innerHTML = "";
        let total = 0;

        if (carrito.length === 0) {
            listaCarrito.innerHTML = '<p class="mensaje-vacio">Aún no has añadido productos.</p>';
            if(contenedorFinalizar) contenedorFinalizar.style.display = 'none';
        } else {
            if(contenedorFinalizar) contenedorFinalizar.style.display = 'block';
            
            carrito.forEach((prod, index) => {
                total += prod.precio;
                const div = document.createElement('div');
                div.className = 'item-carrito';
                div.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 15px; background: white; padding: 10px; margin-bottom: 10px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <img src="${prod.imagen}" width="60" height="60" style="object-fit: cover; border-radius: 5px;">
                        <div style="flex-grow: 1;">
                            <p style="font-weight: bold; margin: 0;">${prod.nombre}</p>
                            <p style="color: #e67e22; margin: 0;">$${prod.precio.toLocaleString()}</p>
                        </div>
                        <button onclick="eliminarProducto(${index})" style="background: #c0392b; color: white; border: none; padding: 8px; border-radius: 5px; cursor: pointer;">Eliminar</button>
                    </div>
                `;
                listaCarrito.appendChild(div);
            });
        }

        // Formateamos el total con puntos de miles
        if(totalElemento) totalElemento.textContent = total.toLocaleString();
    }

    // Función para eliminar un solo producto (Global para que funcione el onclick)
    window.eliminarProducto = (index) => {
        carrito.splice(index, 1);
        actualizarCarritoUI();
    };

    // 6. ENVIAR PEDIDO POR WHATSAPP
    const btnWhatsApp = document.getElementById('btn-enviar-whatsapp');
    if(btnWhatsApp) {
        btnWhatsApp.addEventListener('click', () => {
            if (carrito.length === 0) {
                alert("El carrito está vacío.");
                return;
            }

            let mensaje = "Deseas realizar este pedido";
            
            carrito.forEach(p => {
                mensaje += `• ${p.nombre} ($${p.precio.toLocaleString()})%0A`;
            });

            const totalFinal = totalElemento.textContent;
            mensaje += `*Total a pagar: $${totalFinal}*`;

            const telefono = "573128392495"; // PON AQUÍ TU NÚMERO
            window.open(`https://wa.me/${telefono}?text=${mensaje}`, '_blank');
        });
    }

    // 7. VACIAR CARRITO
    const btnVaciar = document.getElementById('btn-vaciar-carrito');
    if(btnVaciar) {
        btnVaciar.addEventListener('click', () => {
            if(confirm("¿Seguro que quieres vaciar el carrito?")) {
                carrito = [];
                actualizarCarritoUI();
            }
        });
    }
});