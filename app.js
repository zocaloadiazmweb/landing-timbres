/*
1. Esperar: La página carga. Yo me quedo atento, esperando a que el usuario interactúe con el carrusel, las tarjetas de tamaño, los filtros de forma o los enlaces de la landing.
2. Evaluar la acción: Cuando el usuario pasa el cursor o enfoca una tarjeta o filtro, yo reviso qué opción señaló leyendo su atributo data.
3. Validar casos vacíos: Si la opción viene vacía o no existe en mi lista, detengo el proceso ahí mismo para evitar errores.
4. Preparar la pantalla: Limpio la selección activa anterior y marco visualmente el enlace elegido para mostrar que el computador respondió.
5. Procesar y mostrar: Busco el texto de ayuda correspondiente a esa opción y lo muestro directo en el HTML con una transición suave.
6. Prevenir errores: Si algo falla en el proceso, atrapo el error y muestro un mensaje claro en pantalla para que el usuario no quede esperando.
*/

$(document).ready(function () {

  // Conecto los atributos de Bootstrap 4 con el motor local para que el carrusel avance solo aquí y en BSale
  const elementoCarrusel = document.getElementById("carruselTimbres");

  if (elementoCarrusel && typeof bootstrap !== "undefined" && bootstrap.Carousel) {
    const carruselInstancia = new bootstrap.Carousel(elementoCarrusel, {
      interval: 4500,
      ride: "carousel",
      pause: "hover",
      wrap: true
    });
    carruselInstancia.cycle();

    $(elementoCarrusel).on("click", "[data-slide]", function (evento) {
      evento.preventDefault();
      const direccion = $(this).data("slide");
      if (direccion === "prev") {
        carruselInstancia.prev();
      } else if (direccion === "next") {
        carruselInstancia.next();
      }
    });

    $(elementoCarrusel).on("click", "[data-slide-to]", function (evento) {
      evento.preventDefault();
      const indice = Number($(this).data("slide-to"));
      if (!Number.isNaN(indice)) {
        carruselInstancia.to(indice);
      }
    });

    $(elementoCarrusel).on("slide.bs.carousel", function (evento) {
      $(elementoCarrusel)
        .find(".carousel-indicators li")
        .removeClass("active")
        .eq(evento.to)
        .addClass("active");
    });
  }

  // Aquí guardo las recomendaciones según cada tamaño o forma que señale el usuario
  const recomendacionesTimbres = {
    pequeno: "Tamaño pequeño: ideal para textos breves como nombre, RUT o cargo profesional.",
    mediano: "Tamaño mediano: la opción más equilibrada para datos de empresa, dirección y rutinas diarias de oficina.",
    grande: "Tamaño grande: pensado para documentos con logos, varias líneas de texto o formularios completos.",
    fechadores: "Fechadores: prácticos para llevar el control diario de recepción, despacho o contabilidad.",
    redondos: "Redondos: una alternativa armónica para logotipos, timbres institucionales o certificaciones."
  };

  const $botonesTamano = $(".tamanos-timbres__tarjeta, .tamanos-timbres__filtro");
  const $mensajeTamano = $("#mensajeTamano");

  // Escucho cuando el usuario pasa el cursor o enfoca una tarjeta o filtro para dejar libre el clic hacia la colección
  $botonesTamano.on("mouseenter focus", function () {
    try {
      const $elementoActual = $(this);
      const opcionElegida = $elementoActual.data("opcion");

      if (!opcionElegida || !recomendacionesTimbres[opcionElegida]) {
        $mensajeTamano.text("No pude encontrar información para esa opción. Intenta con otro tamaño.");
        return;
      }

      $botonesTamano.removeClass("is-activo");
      $elementoActual.addClass("is-activo");

      $mensajeTamano
        .stop(true, true)
        .hide()
        .text(recomendacionesTimbres[opcionElegida])
        .fadeIn(150);
    } catch (error) {
      $mensajeTamano.text("Ocurrió un inconveniente al mostrar la recomendación. Recarga la página e intenta nuevamente.");
      console.error("Error al procesar la selección de tamaño:", error);
    }
  });

  // Mientras los enlaces tengan rutas temporales con #, evito que la pantalla salte hacia arriba sin rumbo
  $(".hero-timbres__boton, .tamanos-timbres__filtro, .tamanos-timbres__tarjeta, .marcas-timbres__enlace, .contenidos-timbres__enlace").on("click", function (evento) {
    const enlaceDestino = $(this).attr("href");

    if (enlaceDestino && enlaceDestino.startsWith("#")) {
      evento.preventDefault();
      console.info("Enlace temporal detectado. Cuando subas a BSale, reemplaza", enlaceDestino, "por la URL real del catálogo.");
    }
  });

});