document.addEventListener('DOMContentLoaded', () => {
    const buscador = document.getElementById('inputBusqueda');
    const tarjetas = document.querySelectorAll('.tarjeta-producto');
    const secciones = document.querySelectorAll('.contenido');
    const titulosH2 = document.querySelectorAll('.contenido h2');
    const inicio = document.getElementById('inicio');

    buscador.addEventListener('input', (e) => {
        const texto = e.target.value.toLowerCase().trim();

        if (texto.length > 0) {
            // Ocultamos inicio y títulos para mostrar resultados mezclados
            if(inicio) inicio.style.display = 'none';
            titulosH2.forEach(h2 => h2.style.display = 'none');

            secciones.forEach(sec => {
                if(sec.id !== 'inicio') {
                    sec.style.display = 'block';
                    sec.style.padding = '0px';
                    const grid = sec.querySelector('.contenedor-grid');
                    // Mantiene el diseño de 3 columnas iguales incluso al buscar
                    if(grid) grid.classList.add('modo-busqueda-horizontal');
                }
            });

            tarjetas.forEach(tarjeta => {
                const nombre = tarjeta.querySelector('h3').textContent.toLowerCase();
                // Filtramos: si coincide se muestra, si no se oculta
                tarjeta.style.display = nombre.includes(texto) ? 'flex' : 'none'; 
            });
            
            // Ocultar secciones que quedaron vacías tras el filtro
            secciones.forEach(sec => {
                if(sec.id !== 'inicio') {
                    const hayVisibles = Array.from(sec.querySelectorAll('.tarjeta-producto'))
                                             .some(t => t.style.display === 'flex');
                    if(!hayVisibles) sec.style.display = 'none';
                }
            });

        } else {
            // Cuando borras el buscador, regresamos a la sección "Inicio"
            secciones.forEach(sec => sec.style.display = 'none');
            if(inicio) inicio.style.display = 'block';
            titulosH2.forEach(h2 => h2.style.display = 'block');
            
            // Quitamos clases de búsqueda
            document.querySelectorAll('.contenedor-grid').forEach(grid => {
                grid.classList.remove('modo-busqueda-horizontal');
            });

            // Reseteamos todas las tarjetas para que vuelvan a ser visibles
            tarjetas.forEach(t => t.style.display = 'flex');

            // Quitamos el estado "activo" de los enlaces de las otras secciones
            document.querySelectorAll('nav a').forEach(l => l.classList.remove('activo'));
            document.querySelector('nav a[href="#inicio"]')?.classList.add('activo');
        }
    });

    // Navegación por clics
    document.querySelectorAll('nav a').forEach(enlace => {
        enlace.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            if(!targetId) return; // Evita errores si el href está vacío

            e.preventDefault();
            buscador.value = ""; // Limpiamos buscador al navegar
            
            document.querySelectorAll('nav a').forEach(l => l.classList.remove('activo'));
            this.classList.add('activo');

            secciones.forEach(sec => {
                sec.style.display = (sec.id === targetId) ? 'block' : 'none';
                // Aseguramos que las tarjetas dentro de la sección elegida sean visibles
                sec.querySelectorAll('.tarjeta-producto').forEach(t => t.style.display = 'flex');
            });
            window.scrollTo(0, 0);
        });
    });
});