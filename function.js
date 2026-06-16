 const imagenes = {
        normal: "Piskel-Tukita-/Iconos/Solo Tuktia.png",
        feliz: "Piskel-Tukita-/Tukita Feliz.png",
        cansado: "Piskel-Tukita-/Tukita Cansado.png",
        enojado: "Piskel-Tukita-/Tukita enojado.png",
        enfermo: "Piskel-Tukita-/Tukita enfermo.png",

        especial: "Piskel-Tukita-/palanquita.gif",
        comer: "Piskel-Tukita-/Manzanita Tukitata.gif",
        banar: "Piskel-Tukita-/Jaboncin.gif",
        curar: "Piskel-Tukita-/pociaunn.gif",
        pelo: "Piskel-Tukita-/Tijeritas.gif"
    };

    const estadoInicial = {
        hambre: 50,
        energia: 70,
        felicidad: 75,
        salud: 85,
        higiene: 80,
        pelo: 75,
        estaDormida: false,
        sala: "cocina"
    };

    let estado = cargarEstado();
    let accionBloqueada = false;
    let intervaloVida = null;
    let timeoutReaccion = null;


    const DURACION_ANIMACION = 3050;

    const acciones = {
        comida: {
            mensaje: "¡Ñam! Tukita comió y ahora tiene menos hambre.",
            animacion: imagenes.comer,
            clase: "animacion-comer",
            cambios: {
                hambre: -20,
                felicidad: 4,
                salud: 2
            }
        },

        dormir: {
            mensaje: "Tukita descansó. Ahora tiene más energía.",
            animacion: imagenes.cansado,
            clase: "animacion-dormir",
            cambios: {
                energia: 22,
                hambre: 6,
                felicidad: 2
            },
            dormir: true
        },

        jugar: {
            mensaje: "¡Tukita se divirtió jugando videojuegos!",
            animacion: imagenes.especial,
            clase: "animacion-jugar",
            cambios: {
                felicidad: 20,
                energia: 10,
                hambre: 6,
                higiene: -4
            }
        },

        banar: {
            mensaje: "Tukita quedó limpiecita.",
            animacion: imagenes.banar,
            clase: "animacion-banar",
            cambios: {
                higiene: 24,
                salud: 3,
                felicidad: 2
            }
        },

        curar: {
            mensaje: "La poción curativa mejoró la salud de Tukita.",
            animacion: imagenes.curar,
            clase: "animacion-curar",
            cambios: {
                salud: 25,
                felicidad: 3
            }
        },

        cortarPelo: {
            mensaje: "Tukita se ve más ordenada con su corte de pelo.",
            animacion: imagenes.pelo,
            clase: "animacion-pelo",
            cambios: {
                pelo: 25,
                higiene: 5,
                felicidad: 4
            }
        }
    };

    const elementos = {
        hambre: {
            label: "lblHambre",
            barra: "barHambre",
            invertida: true
        },
        energia: {
            label: "lblEnergia",
            barra: "barEnergia"
        },
        felicidad: {
            label: "lblFelicidad",
            barra: "barFelicidad"
        },
        salud: {
            label: "lblSalud",
            barra: "barSalud"
        },
        higiene: {
            label: "lblHigiene",
            barra: "barHigiene"
        },
        pelo: {
            label: "lblPelo",
            barra: "barPelo"
        }
    };

    function cargarEstado() {
        const guardado = localStorage.getItem("estadoTukita");

        if (guardado) {
            return {
                ...estadoInicial,
                ...JSON.parse(guardado)
            };
        }

        return {
            ...estadoInicial
        };
    }

    function guardarEstado() {
        localStorage.setItem("estadoTukita", JSON.stringify(estado));
    }

    function limitar(valor) {
        return Math.max(0, Math.min(100, Math.round(valor)));
    }

    function dragstartHandler(event) {
        event.dataTransfer.setData("text/plain", event.currentTarget.id);
        event.dataTransfer.effectAllowed = "move";
    }

    function dragoverHandler(event) {
        event.preventDefault();
    }

    function dragenterHandler(event) {
        event.preventDefault();
        document.getElementById("zonaMascota").classList.add("arrastrando");
    }

    function dragleaveHandler(event) {
        const zona = document.getElementById("zonaMascota");

        if (!zona.contains(event.relatedTarget)) {
            zona.classList.remove("arrastrando");
        }
    }

    function dropHandler(event) {
        event.preventDefault();

        document.getElementById("zonaMascota").classList.remove("arrastrando");

        const idObjeto = event.dataTransfer.getData("text/plain");
        aplicarAccion(idObjeto);
    }

    function aplicarAccion(idObjeto) {
        if (accionBloqueada || !acciones[idObjeto]) {
            return;
        }

        const accion = acciones[idObjeto];
        accionBloqueada = true;

        Object.keys(accion.cambios).forEach(stat => {
            estado[stat] = limitar(estado[stat] + accion.cambios[stat]);
        });

        estado.estaDormida = accion.dormir === true;

        corregirEstadoGeneral();
        guardarEstado();
        actualizarInterfaz(false);
        mostrarAnimacion(accion);

        /*
            La acción se desbloquea hasta que la animación termina.
            Así no se corta la animación si se arrastra otro objeto demasiado rápido.
        */
        setTimeout(() => {
            accionBloqueada = false;
            estado.estaDormida = false;
            guardarEstado();
            actualizarInterfaz(true);
        }, DURACION_ANIMACION + 300);
    }

    function corregirEstadoGeneral() {
        if (estado.hambre >= 80) {
            estado.salud = limitar(estado.salud - 4);
            estado.felicidad = limitar(estado.felicidad - 5);
        }

        if (estado.higiene <= 20) {
            estado.salud = limitar(estado.salud - 3);
            estado.felicidad = limitar(estado.felicidad - 2);
        }

        if (estado.energia <= 20) {
            estado.felicidad = limitar(estado.felicidad - 3);
        }

        if (estado.salud <= 20) {
            estado.felicidad = limitar(estado.felicidad - 4);
        }

        if (
            estado.hambre <= 45 &&
            estado.energia >= 45 &&
            estado.higiene >= 45 &&
            estado.salud >= 45
        ) {
            estado.felicidad = limitar(estado.felicidad + 1);
        }
    }

    function iniciarVidaAutomatica() {
        clearInterval(intervaloVida);

        intervaloVida = setInterval(() => {
            if (accionBloqueada) {
                return;
            }

            estado.hambre = limitar(estado.hambre + 2);
            estado.energia = limitar(estado.energia - 1);
            estado.felicidad = limitar(estado.felicidad - 1);
            estado.higiene = limitar(estado.higiene - 1);
            estado.pelo = limitar(estado.pelo - 1);

            corregirEstadoGeneral();
            guardarEstado();
            actualizarInterfaz(true);
        }, 9000);
    }

    function obtenerEstadoAnimo() {
        if (estado.salud <= 25) {
            return {
                nombre: "enferma",
                imagen: imagenes.enfermo,
                mensaje: "Tukita se siente enferma. Necesita la poción curativa."
            };
        }

        if (estado.energia <= 25) {
            return {
                nombre: "cansada",
                imagen: imagenes.cansado,
                mensaje: "Tukita está cansada. Necesita dormir."
            };
        }

        if (estado.hambre >= 75) {
            return {
                nombre: "hambrienta",
                imagen: imagenes.enojado,
                mensaje: "Tukita tiene mucha hambre. Dale comida."
            };
        }

        if (estado.felicidad <= 25) {
            return {
                nombre: "triste",
                imagen: imagenes.cansado,
                mensaje: "Tukita está triste. Juega con ella."
            };
        }

        if (estado.higiene <= 25) {
            return {
                nombre: "sucia",
                imagen: imagenes.enojado,
                mensaje: "Tukita necesita un baño. Usa el jabón."
            };
        }

        if (
            estado.felicidad >= 80 &&
            estado.salud >= 70 &&
            estado.hambre <= 40
        ) {
            return {
                nombre: "feliz",
                imagen: imagenes.feliz,
                mensaje: "Tukita está feliz y bien cuidada."
            };
        }

        return {
            nombre: "normal",
            imagen: imagenes.normal,
            mensaje: "Tukita está tranquila. Sigue cuidándola."
        };
    }

    function mostrarAnimacion(accion) {
        clearTimeout(timeoutReaccion);

        const zona = document.getElementById("zonaMascota");
        const img = document.getElementById("tukitaImg");
        const mensaje = document.getElementById("mensajeMascota");

        zona.classList.remove(
            "animacion-comer",
            "animacion-dormir",
            "animacion-jugar",
            "animacion-banar",
            "animacion-curar",
            "animacion-pelo"
        );

        zona.classList.add(accion.clase);

        /*
            CAMBIO IMPORTANTE:
            Esto reinicia el GIF desde el primer frame.
            El Date.now() evita que el navegador use el GIF desde caché.
        */
        img.src = "";
        img.src = accion.animacion + "?v=" + Date.now();

        mensaje.textContent = accion.mensaje;

        /*
            Aquí se mantiene la animación visible más tiempo.
            Antes se quitaba muy rápido.
        */
        timeoutReaccion = setTimeout(() => {
            zona.classList.remove(accion.clase);
            actualizarInterfaz(true);
        }, DURACION_ANIMACION);
    }

    function claseBarra(stat, valor) {
        if (stat === "hambre") {
            if (valor >= 75) {
                return "peligro";
            }

            if (valor >= 50) {
                return "medio";
            }

            return "bien";
        }

        if (valor <= 25) {
            return "peligro";
        }

        if (valor <= 50) {
            return "medio";
        }

        return "bien";
    }

    function actualizarInterfaz(cambiarImagen) {
        Object.keys(elementos).forEach(stat => {
            const valor = estado[stat];
            const label = document.getElementById(elementos[stat].label);
            const barra = document.getElementById(elementos[stat].barra);

            label.textContent = valor + "%";
            barra.style.width = valor + "%";
            barra.className = "relleno " + claseBarra(stat, valor);
        });

        const estadoAnimo = obtenerEstadoAnimo();

        document.getElementById("estadoTexto").textContent =
            "Estado actual: " + estadoAnimo.nombre;

        document.getElementById("mensajeMascota").textContent =
            estadoAnimo.mensaje;

        document.body.dataset.sala = estado.sala;

        if (cambiarImagen) {
            document.getElementById("tukitaImg").src = estadoAnimo.imagen;
        }
    }

    function cambiarSala(sala) {
        estado.sala = sala;
        guardarEstado();
        actualizarInterfaz(true);
    }

    function reiniciarJuego() {
        estado = {
            ...estadoInicial
        };

        guardarEstado();
        actualizarInterfaz(true);
    }

    window.addEventListener("DOMContentLoaded", () => {
        actualizarInterfaz(true);
        iniciarVidaAutomatica();
    });