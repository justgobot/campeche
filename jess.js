(() => {
	// Secciones que pueden abrirse en pantalla completa desde la navegacion.
	const sections = new Set(
		[...document.querySelectorAll("main > section[id]")]
			.filter(section => section.classList.contains("section") || section.classList.contains("walk"))
			.map(section => section.id)
	);

	// Estado temporal para abrir y cerrar secciones ampliadas.
	let activeSection = null;
	let placeholder = null;
	let closeButton = null;
	let opener = null;
	let scrollY = 0;
	let bodyStyle = "";
	let activeAnimations = [];
	let closing = false;
	const bastionDialog = document.querySelector(".bastion-dialog");
	const bastionClose = bastionDialog?.querySelector(".bastion-dialog-close");
	// Textos e imagenes que se muestran para cada baluarte.
	const bastionData = {
		"san-carlos": {
			kicker: "1668 · El baluarte más antiguo",
			image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/BaluarteSanCarlos1.JPG?width=1800",
			source: "https://commons.wikimedia.org/wiki/File:BaluarteSanCarlos1.JPG",
			credit: "Fotografía y licencia en Wikimedia Commons",
			intro: "San Carlos forma parte del sistema de fortificaciones que protegió el puerto de Campeche. Su historia permite entender cómo la ciudad convirtió la piedra y el trazado urbano en una línea de defensa.",
			sections: [
				["Una fecha clave", "Levantado en 1668, es considerado el más antiguo de los ocho baluartes. Su nombre honra a Carlos II, monarca español durante la etapa en que se reforzó la defensa de la ciudad."],
				["Del recinto al museo", "El baluarte alberga el Museo de la Ciudad. El edificio dejó de ser únicamente una pieza militar y hoy permite acercarse a distintas etapas de la historia campechana dentro de un espacio histórico."],
				["Qué observar", "Al recorrerlo, fíjate en el volumen compacto de la construcción y en la relación entre los muros, las esquinas y el espacio interior. Su escala ayuda a imaginar cómo se vigilaban los accesos y el entorno inmediato."]
			]
		},
		"la-soledad": {
			kicker: "1690 · El baluarte de mayor tamaño",
			image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Baluarte_de_la_Soledad_Campeche.JPG?width=1800",
			source: "https://commons.wikimedia.org/wiki/File:Baluarte_de_la_Soledad_Campeche.JPG",
			credit: "Fotografía y licencia en Wikimedia Commons",
			intro: "La Soledad destaca por su tamaño y por su ubicación junto al frente marítimo. Es una de las piezas más reconocibles del circuito amurallado y conecta la historia militar con el patrimonio arqueológico de Campeche.",
			sections: [
				["Una presencia dominante", "Su construcción se sitúa en 1690 y es el mayor de los baluartes de la ciudad. El grosor de sus muros y su posición muestran la importancia de reforzar la defensa del puerto en una época de ataques y amenazas marítimas."],
				["Museo de Arquitectura Maya", "En su interior funciona el Museo de Arquitectura Maya, que reúne piezas y elementos relacionados con la arquitectura de las antiguas ciudades mayas. El uso actual da una segunda vida cultural a un edificio concebido para la defensa."],
				["La relación con el mar", "Al estar frente al mar, permite leer el vínculo entre el puerto y la muralla. Desde el exterior, compara sus proporciones con las calles y las demás estructuras del recinto: su escala sobresale en el conjunto."]
			]
		},
		"santiago": {
			kicker: "Un bastión convertido en jardín",
			image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Baluarte_de_Santiago_Campeche.JPG?width=1800",
			source: "https://commons.wikimedia.org/wiki/File:Baluarte_de_Santiago_Campeche.JPG",
			credit: "Fotografía y licencia en Wikimedia Commons",
			intro: "Santiago muestra cómo un espacio defensivo puede adquirir una nueva función sin perder su carácter histórico. Hoy su recinto alberga el Jardín Botánico Xmuch'haltun.",
			sections: [
				["La fortificación", "Como parte del perímetro amurallado, Santiago contribuía a proteger la ciudad y a cubrir uno de sus ángulos. Su forma responde a la lógica de los baluartes: abrir un campo de observación y defensa hacia el exterior de la muralla."],
				["Jardín Botánico Xmuch'haltun", "El interior se transformó en un jardín botánico dedicado a la vegetación de la región. Esa convivencia entre piedra histórica y naturaleza distingue a Santiago de otros espacios del circuito."],
				["Una visita distinta", "Recorre el patio con calma y observa el contraste de la vegetación con los muros. El sitio permite acercarse tanto a la historia urbana como al paisaje natural de Campeche, dentro de un mismo recinto."]
			]
		},
		"san-francisco": {
			kicker: "Uno de los ocho baluartes históricos",
			image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Baluarte_San_francisco2.JPG?width=1800",
			source: "https://commons.wikimedia.org/wiki/File:Baluarte_San_francisco2.JPG",
			credit: "Fotografía y licencia en Wikimedia Commons",
			intro: "El Baluarte de San Francisco es una pieza del conjunto que convirtió el centro de Campeche en una ciudad fortificada. Su interés está en leerlo como parte de un sistema, no como una construcción aislada.",
			sections: [
				["Una defensa conectada", "Los baluartes se distribuían en puntos clave de la muralla para cubrir los ángulos del recinto. San Francisco formaba parte de esa cadena de puestos defensivos que se apoyaban entre sí alrededor de la ciudad."],
				["Piedra y diseño", "La geometría angular y los muros macizos responden a la arquitectura militar de la época. Al mirar el edificio, piensa en su conexión con las cortinas de muralla y en cómo el trazado protegía los accesos terrestres."],
				["Cómo entender el conjunto", "Combina la visita con un tramo de muralla cercano. Ver el baluarte desde distintos lados ayuda a reconocer su forma, su escala y la manera en que el sistema defensivo se integró al tejido urbano."]
			]
		},
		"san-juan": {
			kicker: "Parte del perímetro amurallado",
			image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Baluarte_de_San_Juan.JPG?width=1800",
			source: "https://commons.wikimedia.org/wiki/File:Baluarte_de_San_Juan.JPG",
			credit: "Fotografía y licencia en Wikimedia Commons",
			intro: "San Juan integra el grupo de ocho baluartes que reforzaron el perímetro histórico de Campeche. Su valor se entiende al observar la continuidad entre las torres, los muros y las puertas de la ciudad.",
			sections: [
				["Una pieza de un sistema", "La defensa no dependía de un solo fuerte: cada baluarte cubría un sector y enlazaba con la muralla. San Juan formaba parte de esa secuencia de puntos elevados que permitían vigilar el entorno y resguardar el recinto."],
				["Arquitectura funcional", "Sus muros expresan una construcción pensada para resistir y proteger. La forma del bastión ampliaba la observación hacia el exterior, mientras que la conexión con la muralla mantenía cerrado el perímetro de la ciudad."],
				["En el recorrido", "Al visitarlo, busca la unión entre el baluarte y los tramos de muralla. Esa transición es la clave para leer la fortificación como una obra continua que acompañaba las calles y la vida cotidiana del centro histórico."]
			]
		},
		"santa-rosa": {
			kicker: "Arquitectura militar en el corazón histórico",
			image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/BaluarteSantaRosa1.JPG?width=1800",
			source: "https://commons.wikimedia.org/wiki/File:BaluarteSantaRosa1.JPG",
			credit: "Fotografía y licencia en Wikimedia Commons",
			intro: "Santa Rosa conserva el carácter de las fortificaciones que protegieron Campeche durante siglos. Sus muros son testimonio de una ciudad que organizó su defensa como parte de la propia trama urbana.",
			sections: [
				["El contexto defensivo", "Los baluartes permitían vigilar los accesos y responder desde distintos puntos del perímetro. Santa Rosa era uno de los elementos que completaban esa protección, junto con las puertas y los tramos de muralla."],
				["Un patrimonio que permanece", "La conservación de estos recintos deja ver los materiales, las formas y la escala de la ingeniería militar histórica. A diferencia de un objeto de museo, el baluarte sigue ocupando su lugar en las calles de la ciudad."],
				["Qué mirar", "Detente en los cambios de nivel y en el espesor de los muros. Esos rasgos revelan que el espacio fue diseñado para la vigilancia y la defensa, aunque hoy forme parte de un recorrido cultural y cotidiano."]
			]
		},
		"san-pedro": {
			kicker: "Uno de los ocho bastiones de Campeche",
			image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Campeche_-_Baluarte_de_San_Pedro_1.jpg?width=1800",
			source: "https://commons.wikimedia.org/wiki/File:Campeche_-_Baluarte_de_San_Pedro_1.jpg",
			credit: "Fotografía y licencia en Wikimedia Commons",
			intro: "San Pedro completa una parte esencial de la línea defensiva de Campeche. Su historia forma parte de un paisaje urbano donde las fortificaciones, las plazas y las viviendas coloniales conviven muy cerca.",
			sections: [
				["El perímetro", "La muralla y sus baluartes formaban un circuito para proteger el asentamiento y el puerto. San Pedro era uno de esos puntos de apoyo: su posición permitía observar el exterior y reforzar la defensa de los muros cercanos."],
				["Memoria de la ciudad", "Hoy el baluarte es una huella material de la importancia estratégica de Campeche en el Golfo de México. Su presencia permite imaginar cuánto condicionó la fortificación la forma y los límites del centro histórico."],
				["Durante la visita", "Mira cómo el volumen del bastión sobresale respecto a la muralla. Esa diferencia no es decorativa: ayuda a comprender por qué se construían puntos reforzados en los cambios de dirección del recinto."]
			]
		},
		"san-jose": {
			kicker: "Baluarte de San José · Recinto amurallado",
			image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Baluarte_de_San_Jos%C3%A9_%282%29.JPG?width=1800",
			source: "https://commons.wikimedia.org/wiki/File:Baluarte_de_San_Jos%C3%A9_(2).JPG",
			credit: "Fotografía y licencia en Wikimedia Commons",
			intro: "El Baluarte de San José es uno de los ocho bastiones del Centro Histórico de Campeche. Su nombre puede confundirse con el Fuerte de San José el Alto, pero son recintos diferentes y cumplen papeles distintos dentro del paisaje histórico.",
			sections: [
				["Parte de la muralla", "Este baluarte pertenecía al sistema que protegía el antiguo puerto y el núcleo urbano. Integrado a los muros de la ciudad, reforzaba el perímetro y contribuía a vigilar los alrededores desde una posición protegida."],
				["No confundir con el fuerte", "El Baluarte de San José forma parte de la muralla del centro. El Fuerte de San José el Alto, en cambio, es una fortificación extramuros que hoy alberga el Museo de Barcos y Armas. Ambos aparecen en el recorrido, pero son lugares distintos."],
				["Una mirada al conjunto", "Observa el encuentro entre sus muros y la muralla, así como la solidez de la piedra. El baluarte ayuda a imaginar la defensa de la ciudad desde dentro del recinto, antes de continuar hacia los fuertes construidos fuera de él."]
			]
		}
	};
	let activeBastion = null;
	let bastionBodyOverflow = "";
	let bastionClosing = false;
	let bastionDialogFallback = false;

	// Asigna a cada tarjeta la imagen correspondiente como fondo.
	document.querySelectorAll(".bastion[data-bastion]").forEach(card => {
		const detail = bastionData[card.dataset.bastion];
		if (detail) card.style.setProperty("--bastion-card-image", `url("${detail.image}")`);
	});

	// Rellena el dialogo con la informacion del baluarte seleccionado.
	function renderBastion(card) {
		const detail = bastionData[card.dataset.bastion];
		if (!detail || !bastionDialog) return false;

		bastionDialog.style.setProperty("--bastion-image", `url("${detail.image}")`);
		bastionDialog.querySelector(".bastion-dialog-kicker").textContent = detail.kicker;
		bastionDialog.querySelector("#bastion-dialog-title").textContent = card.querySelector("h3").textContent;
		bastionDialog.querySelector(".bastion-dialog-intro").textContent = detail.intro;
		const detailGrid = bastionDialog.querySelector(".bastion-detail-grid");
		detailGrid.replaceChildren();

		detail.sections.forEach(([title, text]) => {
			const section = document.createElement("section");
			section.className = "bastion-detail";
			const heading = document.createElement("h3");
			heading.textContent = title;
			const paragraph = document.createElement("p");
			paragraph.textContent = text;
			section.append(heading, paragraph);
			detailGrid.append(section);
		});

		const credit = bastionDialog.querySelector(".bastion-photo-credit");
		credit.href = detail.source;
		credit.textContent = detail.credit;
		return true;
	}

	// Abre el dialogo y anima su entrada desde la tarjeta seleccionada.
	async function openBastion(card) {
		if (!bastionDialog || activeBastion || !renderBastion(card)) return;

		activeBastion = card;
		bastionClosing = false;
		bastionBodyOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		card.setAttribute("aria-expanded", "true");
		bastionDialogFallback = typeof bastionDialog.showModal !== "function";
		if (bastionDialogFallback) {
			bastionDialog.classList.add("is-fallback-open");
			bastionDialog.setAttribute("open", "");
			bastionDialog.setAttribute("aria-modal", "true");
		} else {
			bastionDialog.showModal();
		}

		const rect = card.getBoundingClientRect();
		const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (typeof bastionDialog.animate === "function") {
			const animation = bastionDialog.animate([
				{ opacity: 0.8, transform: `translate(${rect.left}px, ${rect.top}px) scale(${rect.width / window.innerWidth}, ${rect.height / window.innerHeight})` },
				{ opacity: 1, transform: "translate(0, 0) scale(1)" }
			], { duration: reducedMotion ? 1 : 520, easing: "cubic-bezier(.22, .61, .36, 1)", fill: "both" });
			await animation.finished.catch(() => {});
			animation.cancel();
		}

		if (activeBastion === card && !bastionClosing) bastionClose?.focus({ preventScroll: true });
	}

	// Cierra el dialogo y devuelve el foco a la tarjeta que lo abrio.
	async function closeBastion() {
		if (!activeBastion || bastionClosing) return;

		bastionClosing = true;
		const card = activeBastion;
		const rect = card.getBoundingClientRect();
		const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (typeof bastionDialog.animate === "function") {
			const animation = bastionDialog.animate([
				{ opacity: 1, transform: "translate(0, 0) scale(1)" },
				{ opacity: 0.8, transform: `translate(${rect.left}px, ${rect.top}px) scale(${rect.width / window.innerWidth}, ${rect.height / window.innerHeight})` }
			], { duration: reducedMotion ? 1 : 420, easing: "cubic-bezier(.4, 0, .2, 1)", fill: "both" });
			await animation.finished.catch(() => {});
			animation.cancel();
		}

		if (bastionDialogFallback) {
			bastionDialog.removeAttribute("open");
			bastionDialog.removeAttribute("aria-modal");
			bastionDialog.classList.remove("is-fallback-open");
			bastionDialogFallback = false;
		} else {
			bastionDialog.close();
		}
		card.setAttribute("aria-expanded", "false");
		document.body.style.overflow = bastionBodyOverflow;
		activeBastion = null;
		bastionClosing = false;
		card.focus({ preventScroll: true });
	}

	bastionClose?.addEventListener("click", closeBastion);
	bastionDialog?.addEventListener("cancel", event => {
		event.preventDefault();
		closeBastion();
	});
	bastionDialog?.addEventListener("click", event => {
		if (event.target === bastionDialog) closeBastion();
	});

	// Anima la expansion o contraccion de una seccion y su contenido.
	function playSectionAnimations(section, reverse = false) {
		if (typeof section.animate !== "function") return Promise.resolve();

		const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const duration = reducedMotion ? 1 : 440;
		const contentDuration = reducedMotion ? 1 : 360;
		const contentDelay = reverse || reducedMotion ? 0 : 40;
		const easing = reverse ? "cubic-bezier(.4, 0, 1, 1)" : "cubic-bezier(.22, .61, .36, 1)";
		const sectionFrames = [
			{ opacity: 0, transform: "translateY(16px)" },
			{ opacity: 1, transform: "translateY(0)" }
		];
		const content = section.querySelector(".section-inner");
		const contentFrames = [
			{ opacity: 0, transform: "translateY(8px)" },
			{ opacity: 1, transform: "translateY(0)" }
		];
		const frames = reverse ? sectionFrames.slice().reverse() : sectionFrames;
		const innerFrames = reverse ? contentFrames.slice().reverse() : contentFrames;
		const animations = [section.animate(frames, {
			duration,
			easing,
			fill: "both"
		})];

		if (content) {
			animations.push(content.animate(innerFrames, {
				duration: contentDuration,
				delay: contentDelay,
				easing,
				fill: "both"
			}));
		}

		activeAnimations = animations;
		const finished = Promise.all(animations.map(animation => animation.finished.catch(() => {})));
		const fallbackDelay = Math.max(duration, content ? contentDuration + contentDelay : 0) + 60;
		const fallback = new Promise(resolve => window.setTimeout(resolve, fallbackDelay));
		return Promise.race([finished, fallback]).then(() => {
			animations.forEach(animation => animation.cancel());
			if (activeAnimations === animations) activeAnimations = [];
		});
	}

	// Fija el desplazamiento y expande una seccion a toda la pantalla.
	async function openSection(section, source) {
		if (activeSection) return;

		activeSection = section;
		closing = false;
		opener = source;
		scrollY = window.scrollY;
		bodyStyle = document.body.getAttribute("style") || "";

		const start = section.getBoundingClientRect();
		placeholder = document.createElement("div");
		placeholder.setAttribute("aria-hidden", "true");
		placeholder.style.height = `${start.height}px`;
		section.before(placeholder);

		document.body.style.position = "fixed";
		document.body.style.top = `-${scrollY}px`;
		document.body.style.width = "100%";
		section.classList.add("section-expanded");

		closeButton = document.createElement("button");
		closeButton.className = "section-close";
		closeButton.type = "button";
		closeButton.setAttribute("aria-label", "Cerrar apartado y volver a la página");
		closeButton.textContent = "×  Cerrar";
		closeButton.addEventListener("click", closeSection);
		document.body.append(closeButton);
		source.setAttribute("aria-expanded", "true");

		await playSectionAnimations(section);
		if (activeSection === section && !closing) closeButton.focus({ preventScroll: true });
	}

	// Restaura la posicion, el diseno y el foco al cerrar la seccion.
	async function closeSection() {
		if (!activeSection || !placeholder || closing) return;

		closing = true;
		activeAnimations.forEach(animation => animation.cancel());
		activeAnimations = [];
		const section = activeSection;
		const close = closeButton;
		await playSectionAnimations(section, true);
		section.classList.remove("section-expanded");
		placeholder.replaceWith(section);

		if (bodyStyle) document.body.setAttribute("style", bodyStyle);
		else document.body.removeAttribute("style");
		window.scrollTo(0, scrollY);

		opener?.setAttribute("aria-expanded", "false");
		close.remove();
		activeSection = null;
		placeholder = null;
		closeButton = null;
		closing = false;
		opener?.focus({ preventScroll: true });
		opener = null;
	}

	// Gestiona clics en tarjetas de baluartes y enlaces internos.
	document.addEventListener("click", event => {
		if (!(event.target instanceof Element)) return;
		const bastion = event.target.closest(".bastion[data-bastion]");
		if (bastion) {
			event.preventDefault();
			openBastion(bastion);
			return;
		}

		const link = event.target.closest("a[href^='#']");
		if (!link) return;
		if (link.hasAttribute("data-scroll")) return;

		const id = decodeURIComponent(link.hash.slice(1));
		if (!sections.has(id)) return;

		const section = document.getElementById(id);
		if (!section) return;
		event.preventDefault();
		openSection(section, link);
	});

	// Permite abrir tarjetas con Enter o Espacio y cerrar con Escape.
	document.addEventListener("keydown", event => {
		if ((event.key === "Enter" || event.key === " ") && event.target instanceof Element) {
			const bastion = event.target.closest(".bastion[data-bastion]");
			if (bastion) {
				event.preventDefault();
				openBastion(bastion);
			}
		}

		if (event.key === "Escape" && bastionDialog?.open) {
			event.preventDefault();
			closeBastion();
			return;
		}

		if (event.key === "Escape" && activeSection) closeSection();
	});

	// Carrusel manual de la portada: botones, indicadores y gesto tactil.
	const carousel = document.querySelector(".hero-carousel");
	if (carousel) {
		const track = carousel.querySelector(".hero-slides");
		const slides = [...carousel.querySelectorAll(".hero-slide")];
		const dots = [...carousel.querySelectorAll(".hero-carousel-dot")];
		const previous = carousel.querySelector(".hero-carousel-control--previous");
		const next = carousel.querySelector(".hero-carousel-control--next");
		let currentSlide = 0;
		let touchStart = null;

		const showSlide = index => {
			currentSlide = (index + slides.length) % slides.length;
			track.style.transform = `translateX(-${currentSlide * 100}%)`;
			slides.forEach((slide, slideIndex) => {
				const isActive = slideIndex === currentSlide;
				slide.setAttribute("aria-hidden", String(!isActive));
				slide.inert = !isActive;
			});
			dots.forEach((dot, dotIndex) => {
				dot.setAttribute("aria-current", String(dotIndex === currentSlide));
			});
		};

		previous?.addEventListener("click", () => showSlide(currentSlide - 1));
		next?.addEventListener("click", () => showSlide(currentSlide + 1));
		dots.forEach((dot, index) => dot.addEventListener("click", () => showSlide(index)));
		carousel.addEventListener("touchstart", event => {
			const touch = event.changedTouches[0];
			touchStart = { x: touch.clientX, y: touch.clientY };
		}, { passive: true });
		carousel.addEventListener("touchend", event => {
			if (!touchStart) return;
			const touch = event.changedTouches[0];
			const deltaX = touch.clientX - touchStart.x;
			const deltaY = touch.clientY - touchStart.y;
			touchStart = null;
			if (Math.abs(deltaX) < 45 || Math.abs(deltaX) < Math.abs(deltaY)) return;
			showSlide(currentSlide + (deltaX < 0 ? 1 : -1));
		}, { passive: true });
		showSlide(0);
	}
})();
