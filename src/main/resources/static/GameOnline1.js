class GameOnline1 extends Phaser.Scene {

    constructor() {
        super({ key: "GameOnline1" }); // Nombre único de la escena
    
        // Jugadores
        this.jugadores = {
            gatoA: this.crearJugador(1, 200, 620, 'frenteA'),
            gatoB: this.crearJugador(2, 1090, 160, 'frenteB')
        };

        this.temporizadorActivo = null;

        // Referencias rápidas
        /** @type {Phaser.Physics.Arcade.Sprite|null} Jugador local */
        this.player = null;

        /** @type {Phaser.Physics.Arcade.Sprite|null} Jugador rival */
        this.otherPlayer = null;

        /** @type {'A'|'B'|null} Letra del jugador local */
        this.jugadorPropio = null;

        // === Peces ===
        /** @type {Phaser.Physics.Arcade.Group|null} */
        this.peces = null;

        /** @type {Array<Object>} */
        this.pecesGenerados = [];

        // === Tiempo y texto ===
        this.timeLeft = 90;
        this.playerText = null;

        // === Estado de juego ===
        this.playerId = null;
        this.isHost = false;
        this.gameStarted = false;
        this.ready = false;
        this.pause = false;
        this.desconectado = false;

        // === Posición última enviada ===
        this.lastSentPosition = { x: 0, y: 0 };
        this.lastUpdateTime = 0;
        this.POSITION_UPDATE_INTERVAL = 50;
        this.POSITION_THRESHOLD = 2;

        // === Zonas del mapa ===
        this.pescaZones = [];
        this.zonasProhibidas = [];
        this.agua = [];
        this.tierra = [];

        // === Estado de peces especiales ===
        this.explosionPezGlobo = false;
        this.capturaPezGlobo1 = false;
        this.capturaPezGlobo2 = false;
        this.lanzarPezGlobo1 = false;
        this.lanzarPezGlobo2 = false;

        // === Sonidos ===
        this.sonidoPesca = null;
        this.sonidoPezBueno = null;
        this.sonidoPezMalo = null;
        this.sonidoAnguila = null;
        this.sonidoLanzamiento = null;
        this.sonidoExplosion = null;

        // === Último pez generado ===
        this.pezX = 0;
        this.pezY = 0;
        this.tipoPez = '';
        this.pezAnims = '';
    }

preload() {
    // Aquí es donde normalmente cargarías imágenes, sonidos, etc.
    this.load.image("escenario", "assets/Escenario/v8/Final.png");
    
    this.load.image("inv_sinDesplegar_normal_gatoA", "assets/inventario/version_chica/salir_chico_1.png");
    this.load.image("inv_sinDesplegar_normal_gatoB", "assets/inventario/version_chica/salir_chico_2.png");
    this.load.image("inv_Desplegado_normal_gatoA", "assets/inventario/inventario_chico.png");
    this.load.image("inv_Desplegado_normal_gatoB", "assets/inventario/inventario_chico_2.png");
    this.load.image("pezGloboDesinf", "assets/sprites/pez_globo.png");
    this.load.image("pezGloboInf", "assets/sprites/pez_globo_hinchado.png");


    this.load.spritesheet("gatoB","assets/sprites/gatoB.png", { frameWidth: 280, frameHeight: 600 });
    this.load.spritesheet("gatoA","assets/sprites/gatoA.png", { frameWidth: 280, frameHeight: 600 });
    this.load.spritesheet("piraña","assets/sprites/chimuelo_HS.png", { frameWidth: 300, frameHeight: 300 });
    this.load.spritesheet("pez","assets/sprites/Nemo_HS.png", { frameWidth: 300, frameHeight: 300 });
    this.load.spritesheet("angila","assets/sprites/chispitas_HS.png", { frameWidth: 900, frameHeight: 300 });
    this.load.spritesheet("pezGlobo","assets/sprites/puffer_HS.png", { frameWidth: 300, frameHeight: 300 });

    this.load.image('Boton_pausa_normal', 'assets/Interfaces montadas/pausa/normal.png');
    this.load.image('Boton_pausa_encima', 'assets/Interfaces montadas/pausa/seleccionado.png');
    this.load.image('Boton_pausa_pulsado', 'assets/Interfaces montadas/pausa/pulsado.png');

    this.load.image('CaraGatoA', 'assets/inventario/Menta.png');
    this.load.image('CaraGatoB', 'assets/inventario/Chocolate.png');

    // Cargar la música
    //this.load.audio("backgroundMusic", "assets/musica/los-peces-en-el-mar-loop-c-16730.mp3");
    this.load.audio("sonidoBoton", "assets/musica/SonidoBoton.mp3");
    this.load.audio("sonidoPezBueno", "assets/musica/RecogerPezBueno.mp3");
    this.load.audio("sonidoPezMalo", "assets/musica/RecogerPezMalo.mp3");
    this.load.audio("sonidoAnguila", "assets/musica/RecogerAnguila.mp3");
    this.load.audio("LanzamientoPezGlobo", "assets/musica/LanzamientoPezGlobo.mp3");
    this.load.audio("ExplosionPezGlobo", "assets/musica/ExplosionPezGlobo.mp3");
    this.load.audio("Pesca", "assets/musica/Pesca.mp3");

    this.load.image('reloj', 'assets/Interfaces montadas/reloj.png');

}

// Función create para inicializar objetos una vez que se han cargado los recursos

create() {

    const background = this.add.image(config.width / 2, config.height / 2, 'escenario'); // Centrar la imagen
    background.setScale(config.width / background.width, config.height / background.height); // Escalar la imagen


    this.peces = this.physics.add.group();

    // Conexión WebSocket
    this.socket = this.registry.get("socket");
    this.setupWebSocketCompleto();
    
    if (!this.socket) {
        console.error("❌ No se encontró el WebSocket en el registry");
        return;
    }

    const initData = this.registry.get("initData");
    if (initData) {
        console.log("🧩 INIT recibido desde registry:", initData);
        this.handleInit(initData);
    }

    this.keys = {
        A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        Q: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
        E: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
        F: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F),
    };

    // Inicialización del juego 
    this.crearAnimaciones();
    this.crearUI();

    //  Gestión de entrada y eventos 
    this.registrarActividadUsuario();
    this.registrarEventos();
}

iniciarJuego(mapaId) {
    // Aquí puedes personalizar según el mapa elegido
    switch (mapaId) {
        case 1:
            console.log("🌳 Cargando mapa: Descampado");
            // Puedes cambiar fondo, zonas, música, etc.
            break;
        case 2:
            console.log("🎲 Cargando mapa: Juego de Mesa");
            break;
        case 3:
            console.log("🌀 Cargando mapa: Vórtice");
            break;
        default:
            console.warn("❓ Mapa desconocido:", mapaId);
    }

    // Aquí puedes activar banderas, zonas, añadir elementos, etc.
    this.gameStarted = true;

}

setupWebSocketCompleto() {
    this.socket = this.registry.get("socket");

    if (!this.socket) {
        console.warn("❌ WebSocket no encontrado en registry");
        return;
    }

    this.socket.onmessage = (event) => {
        console.log("📩 Mensaje recibido:", event.data);
        const raw = event.data;
        const type = raw.charAt(0);
        let data = null;
    
        try {
            data = raw.length > 1 ? JSON.parse(raw.substring(1)) : null;
        } catch (err) {
            console.error("❌ Error al parsear JSON del mensaje:", raw);
        }
    
        switch (type) {
            case MSG_TYPES.MAPASELECCIONADO:
                console.log("📨 Recibido MAPASELECCIONADO dentro de GameOnline:", data);
                break; 
    
            case MSG_TYPES.INIT:
                console.log("📨 Recibido INIT dentro de GameOnline:", data);
                this.handleInit(data);
                break;
    
            case MSG_TYPES.POS: this.handlePosition(data); break;
            case MSG_TYPES.COLLECT: this.handlePezRecogido(data); break;
            case MSG_TYPES.THROW: this.handlePezGloboThrow(data); break;
            case MSG_TYPES.TIME: this.handleTimeUpdate(data); break;
            case MSG_TYPES.OVER: this.handleGameOver(data); break;
            case MSG_TYPES.STATE: this.syncGameState(data); break;
            case MSG_TYPES.DISCONNECT: this.handlePlayerDisconnect(data); break;
            case MSG_TYPES.RECONNECT: this.handlePlayerReconnect(data); break;
            case MSG_TYPES.FISH_SPAWN: this.handleRecibirPeces(data); break;
            case MSG_TYPES.EXPLODE_PEZGLOBO: this.handlePezGloboExplosion(data); break;
            case MSG_TYPES.PAUSE_SYNC: this.handlePauseSync(data); break;
            case MSG_TYPES.RESUME_REQUEST: this.resumeGame(); break;
            default:
                console.warn("⚠️ Tipo de mensaje no reconocido en GameOnline1:", type);
        }
    };
    

    this.socket.onclose = () => {
        console.warn("🔌 WebSocket cerrado en GameOnline1");
    };
}


//Funciones para los mensjaes del servidor

/**
 * Inicializa el estado del juego con los datos recibidos del servidor.
 * @param {object} data - Datos de inicialización
 */
handleInit(data) {
    console.log("🧩 INIT recibido con datos:", data);

    if (!data || typeof data.id === 'undefined') {
        console.error("❌ INIT sin ID de jugador válido:", data);
        return;
    }

    this.playerId = data.id;
    this.registry.set('jugadorId', this.playerId);
    this.registry.set('socket', this.socket);

    // Asignar jugador local y rival
    if (this.playerId === 1) {
        this.player = this.jugadores.gatoA;
        this.otherPlayer = this.jugadores.gatoB;
        this.jugadorPropio = 'A';
    } else if (this.playerId === 2) {
        this.player = this.jugadores.gatoB;
        this.otherPlayer = this.jugadores.gatoA;
        this.jugadorPropio = 'B';
    } else {
        console.error("❌ ID de jugador no reconocido:", this.playerId);
        return;
    }

    if (data.p) {
        this.initializePlayers(data.p);
    } else {
        console.warn("⚠️ INIT recibido sin datos de jugadores (data.p)");
    }

    this.gameStarted = true;

    if (data.pecesIniciales && Array.isArray(data.pecesIniciales)) {
        this.handleRecibirPecesIniciales(data.pecesIniciales);
    }

    this.registrarActividadUsuario();

    ['gatoA', 'gatoB'].forEach(jugadorKey => {
        const jugador = this.jugadores[jugadorKey];
        if (jugador?.sprite) {
            this.physics.add.overlap(
                jugador.sprite,
                this.peces,
                (jugadorSprite, pez) => {
                    console.log(`🎯 Colisión detectada entre ${jugadorKey} y un pez`);
                    this.destruirPeces(jugadorSprite, pez, jugadorKey);
                },
                null,
                this
            );
        } else {
            console.warn(`⚠️ No se encontró sprite para ${jugadorKey}`);
        }
    });

    console.log(`✅ Jugador ${this.playerId} inicializado correctamente. Juego comenzado.`);
}

/**
 * Actualiza la posición del jugador oponente.
 * @param {Array} data - Datos de posición [playerId, x, y]
 */
handlePosition(data) {
    const [playerId, x, y, animacion] = data;

    // Ignorar si es el jugador local
    if (playerId === this.playerId) return;

    const jugadorKey = playerId === 1 ? 'gatoA' : 'gatoB';
    const jugador = this.jugadores[jugadorKey];

    if (!jugador || !jugador.sprite) {
        console.warn(`⚠️ Sprite del jugador remoto ${jugadorKey} no existe.`);
        return;
    }

    jugador.sprite.setPosition(x, y);

    if (animacion && jugador.animacion !== animacion) {
        if (this.anims.exists(animacion)) {
            jugador.sprite.anims.play(animacion, true);
            jugador.animacion = animacion;
        } else {
            console.warn(`⚠️ Animación no encontrada: ${animacion}`);
        }
        
    }
}

handlePezRecogido(data) {
    const { playerId, x, y, animacion, puntos, paralizar } = data;
    const jugadorKey = playerId === 1 ? 'gatoA' : 'gatoB';
    const jugador = this.jugadores[jugadorKey];

    if (!jugador) return;

    // Aumentar puntos
    jugador.puntos += puntos;
    jugador.texto?.setText(" " + jugador.puntos);

    // Si el pez recogido es un pez globo (por la animación)
    if (animacion?.includes("pezGlobo") || animacion?.includes("inflarPG")) {
        jugador.pezGlobo = true;
        jugador.inventario = 1;

        // Mostrar icono si existe
        if (jugador.pezGloboIcono) {
            jugador.pezGloboIcono.setVisible(true);
        }

        console.log(`🎈 ${jugadorKey} ha guardado un pez globo en el inventario`);
    }

    // Paralizar si aplica
    if (paralizar) {
        jugador.canMove = false;
        jugador.paralizado = true;

        if (jugador.sprite.anims?.isPlaying) {
            jugador.sprite.anims.stop();
        }

        this.time.delayedCall(5000, () => {
            jugador.canMove = true;
            jugador.paralizado = false;

            const sufijo = jugadorKey === 'gatoA' ? 'A' : 'B';
            const animacion = `Pausa${sufijo}`;
            jugador.sprite.anims.play(animacion, true);
            jugador.animacion = animacion;
        });
    }

    // Buscar y destruir el pez recogido
    const pez = this.peces.getChildren().find(p =>
        Math.abs(p.x - x) < 5 && Math.abs(p.y - y) < 5
    );

    if (pez) {
        pez.destroy();
    
        // Si era un pez globo, se guarda en inventario, pero no se muestra el ícono aún
        if (animacion === 'inflarPG') {
            jugador.pezGlobo = true;
            jugador.inventario = 1;
    
            // Solo mostrar el ícono si el inventario está abierto
            if (jugador.inventarioAbierto && jugador.pezGloboIcono) {
                jugador.pezGloboIcono.setVisible(true);
            } else if (jugador.pezGloboIcono) {
                jugador.pezGloboIcono.setVisible(false);
            }
        }
    }
    
}

handlePezRecogido(data) {
    const { playerId, x, y, animacion, puntos, paralizar } = data;
    const jugadorKey = playerId === 1 ? 'gatoA' : 'gatoB';
    const jugador = this.jugadores[jugadorKey];

    if (!jugador) return;

    // Aumentar puntos
    jugador.puntos += puntos;
    jugador.texto?.setText(" " + jugador.puntos);

    // Si el pez recogido es un pez globo (por la animación)
    if (animacion?.includes("pezGlobo") || animacion?.includes("inflarPG")) {
        jugador.pezGlobo = true;
        jugador.inventario = 1;

        // Mostrar icono si existe
        if (jugador.pezGloboIcono) {
            jugador.pezGloboIcono.setVisible(true);
        }

        console.log(`🎈 ${jugadorKey} ha guardado un pez globo en el inventario`);
    }

    // Paralizar si aplica
    if (paralizar) {
        jugador.canMove = false;
        jugador.paralizado = true;

        if (jugador.sprite.anims?.isPlaying) {
            jugador.sprite.anims.stop();
        }

        this.time.delayedCall(5000, () => {
            jugador.canMove = true;
            jugador.paralizado = false;

            const sufijo = jugadorKey === 'gatoA' ? 'A' : 'B';
            const animacion = `Pausa${sufijo}`;
            jugador.sprite.anims.play(animacion, true);
            jugador.animacion = animacion;
        });
    }

    // Buscar y destruir el pez recogido
    const pez = this.peces.getChildren().find(p =>
        Math.abs(p.x - x) < 5 && Math.abs(p.y - y) < 5
    );

    if (pez) {
        pez.destroy();
    
        // Si era un pez globo, se guarda en inventario, pero no se muestra el ícono aún
        if (animacion === 'inflarPG') {
            jugador.pezGlobo = true;
            jugador.inventario = 1;
    
            // Solo mostrar el ícono si el inventario está abierto
            if (jugador.inventarioAbierto && jugador.pezGloboIcono) {
                jugador.pezGloboIcono.setVisible(true);
            } else if (jugador.pezGloboIcono) {
                jugador.pezGloboIcono.setVisible(false);
            }
        }
    }
    
}

/**
 * Lanza un pez globo si el jugador lo tiene y el inventario está abierto.
 * @param {Object} jugador - Jugador que lanza el pez.
 * @param {'gatoA' | 'gatoB'} jugadorKey - Clave identificadora del jugador.
 */
handlePezGloboThrow(jugador, jugadorKey) {
    if (!jugador || !jugador.sprite || !this.keys || !this.keys.F) return;

    if (this.keys.F.isDown && jugador.pezGlobo && jugador.inventarioAbierto) {
        // Dirección de lanzamiento
        const dir = { x: 0, y: 0 };
        if (this.keys.D.isDown) dir.x = 315;
        else if (this.keys.A.isDown) dir.x = -315;
        else if (this.keys.W.isDown) dir.y = -300;
        else if (this.keys.S.isDown) dir.y = 300;

        if (dir.x === 0 && dir.y === 0) return;

        this.sonidoLanzamiento?.play();

        const origenX = jugador.sprite.x;
        const origenY = jugador.sprite.y;
        const destinoX = origenX + dir.x;
        const destinoY = origenY + dir.y;

        // Crear y lanzar pez globo
        // Crear el pez y mantenerlo animado
        const pez = this.peces.create(destinoX, destinoY, 'pezGlobo');
        pez.setScale(0.3);
        pez.play('inflarPG', true);
        pez.haTocadoSuelo = true;
        pez.esLanzado = true;

        // Marcar posición y tipo para sincronización
        this.pecesGenerados.push({
            x: destinoX,
            y: destinoY,
            tipoPez: 'pezGlobo',
            animSalir: 'inflarPG',
            animIdle: 'explotarPG',
            esLanzado: true
        });


        // Actualizar estado del jugador
        jugador.pezGlobo = false;
        jugador.inventario = 0;
        jugador.lanzarPezGlobo = true;

        if (jugador.inventarioPlegado) jugador.inventarioPlegado.setVisible(true);
        if (jugador.inventarioDesplegado) jugador.inventarioDesplegado.setVisible(false);
        if (jugador.pezGloboIcono) jugador.pezGloboIcono.setVisible(false);

        // Lógica final
        this.socket.send(MSG_TYPES.FISH_SPAWN + JSON.stringify([{
            x: destinoX,
            y: destinoY,
            tipoPez: 'pezGlobo',
            animSalir: 'inflarPG',
            animIdle: 'explotarPG',
            esLanzado: true,
            lanzadoDesde: { x: origenX, y: origenY }
        }]));
        
        this.socket.send(MSG_TYPES.EXPLODE_PEZGLOBO + JSON.stringify({ x: destinoX, y: destinoY, delay: 5000 }));

    }
}

/**
 * Lógica de fin de juego y muestra del resultado.
 * @param {Array<number>} scores - [puntosJugador1, puntosJugador2]
 */
handleGameOver(data) {
    console.log("🏁 Fin del juego. Datos recibidos:", data);

    const puntosPropios = data.puntosPropios || 0;
    const puntosRival = data.puntosRival || 0;

    if (this.playerId === 1) {
        this.registry.set('puntuacionA', data.puntosPropios);
        this.registry.set('puntuacionB', data.puntosRival);
    } else {
        this.registry.set('puntuacionA', data.puntosRival);
        this.registry.set('puntuacionB', data.puntosPropios);
    }
    

    this.registry.set('esGanador', data.ganado || false);
    this.registry.set('esEmpate', data.empate || false);

    // ✅ Guardamos si fue por desconexión
    if (data.desconexion) {
        this.registry.set('finPorDesconexion', true);
    }

    this.scene.start('ResultScreen');
}




handleMapaSeleccionado(data) {
    console.log("Mapa seleccionado (en GameOnline):", data);
}

/**
 * Sincroniza el estado completo del juego con los datos recibidos del servidor.
 * Se usa cuando un jugador se reconecta o pierde sincronía.
 * @param {Object} data - Estado completo del juego
 */
syncGameState(data) {
    if (!data || !data.player1 || !data.player2) return;

    const jugadores = {
        gatoA: data.player1.id === 1 ? data.player1 : data.player2,
        gatoB: data.player2.id === 2 ? data.player2 : data.player1
    };

    // 🧍‍♂️ Restaurar posición y puntos de cada jugador
    for (const key of ['gatoA', 'gatoB']) {
        const jugador = this.jugadores[key];
        const datos = jugadores[key];

        if (jugador?.sprite) {
            jugador.sprite.setPosition(datos.x, datos.y);
        }

        jugador.puntos = datos.score;
        jugador.texto?.setText(" " + datos.score);
    }

    // 🐟 Eliminar peces actuales y cargar nuevos
    this.peces.clear(true, true); // Destruye todos los peces

    if (Array.isArray(data.pecesGenerados)) {
        data.pecesGenerados.forEach(pezData => {
            const pez = this.peces.create(pezData.x, pezData.y, pezData.tipoPez);
            pez.setScale(pezData.tipoPez === "angila" ? 0.25 : 0.3);
            pez.play(pezData.animIdle, true);
            pez.haTocadoSuelo = true;
            pez.animSalir = pezData.animSalir;
            pez.animIdle = pezData.animIdle;
        });
    }

    // ⏱️ Actualizar temporizador
    if (typeof data.tiempo === 'number') {
        this.timeLeft = data.tiempo;
        this.timerText?.setText(this.timeLeft);
    }

    console.log("🔄 Estado del juego sincronizado con éxito.");
}

handlePlayerDisconnect(data) {
    const jugadorKey = data.playerId === 1 ? 'gatoA' : 'gatoB';
    const jugador = this.jugadores[jugadorKey];

    if (jugador && jugador.sprite) {
        jugador.sprite.setTint(0x999999); // Por ejemplo, para marcarlo como "ausente"
    }

    console.warn(`🚫 Jugador ${jugadorKey} se ha desconectado.`);
    // Podrías pausar el juego, mostrar un aviso o reconectar
}

/**
 * Restaura el estado del jugador rival tras reconectarse.
 * @param {Object} data - Estado completo reenviado por el servidor.
 */
handlePlayerReconnect(data) {
    if (!data || !data.player1 || !data.player2) return;

    console.warn("🔌 El jugador rival se ha reconectado. Restaurando estado...");

    const rivalId = this.playerId === 1 ? 2 : 1;
    const jugadorKey = rivalId === 1 ? 'gatoA' : 'gatoB';
    const rivalData = data[`player${rivalId}`];
    const jugador = this.jugadores[jugadorKey];

    // Restaurar sprite del rival
    if (jugador?.sprite) {
        jugador.sprite.setPosition(rivalData.x, rivalData.y);
        jugador.sprite.clearTint(); // Quitar gris si lo tenía
        jugador.sprite.setVisible(true);
    }

    // Restaurar puntos
    jugador.puntos = rivalData.score;
    jugador.texto?.setText(" " + rivalData.score);

    // Restaurar peces si vienen
    if (Array.isArray(data.pecesGenerados)) {
        this.peces.clear(true, true);

        data.pecesGenerados.forEach(pezData => {
            const pez = this.peces.create(pezData.x, pezData.y, pezData.tipoPez);
            pez.setScale(pezData.tipoPez === "angila" ? 0.25 : 0.3);
            pez.play(pezData.animIdle, true);
            pez.haTocadoSuelo = true;
            pez.animSalir = pezData.animSalir;
            pez.animIdle = pezData.animIdle;
        });
    }

    // Restaurar tiempo
    if (typeof data.tiempo === 'number') {
        this.timeLeft = data.tiempo;
        this.timerText?.setText(this.timeLeft);
    }

    console.log("♻️ Reconexión restaurada para", jugadorKey);
}

/**
 * Crea y anima los peces recibidos del servidor.
 * @param {Array<Object>} pecesRecibidos - Lista de peces con propiedades x, y, tipoPez, animaciones y origen.
 */
handleRecibirPeces(data) {
    if (!this.peces || !Array.isArray(data)) {
        console.warn("⚠️ No hay grupo de peces o la lista recibida es inválida.");
        return;
    }

    console.log("🐟 Recibiendo peces generados:", data);

    const posicionesExistentes = new Set(this.peces.getChildren().map(p => `${p.x},${p.y}`));

    data.forEach((pezData, index) => {
        const { x, y, tipoPez, animSalir, animIdle } = pezData;
        if (typeof x !== "number" || typeof y !== "number" || !tipoPez) {
            console.warn(`⚠️ Datos incompletos del pez en índice ${index}:`, pezData);
            return;
        }

        const key = `${x},${y}`;
        if (posicionesExistentes.has(key)) {
            console.log(`⚠️ Pez duplicado en ${key}, se ignora.`);
            return;
        }
        posicionesExistentes.add(key);

        const pez = this.peces.create(x, y, tipoPez);
        pez.setScale(0.3);
        pez.setSize(10, 10);
        pez.animSalir = animSalir || 'salirE';
        pez.animIdle = animIdle || 'idleE';
        pez.haTocadoSuelo = false;
        pez.esLanzado = true

        pez.play(pez.animSalir, true);
        if (pezData.esLanzado) {
            // No marcamos haTocadoSuelo ni nada más: esperamos mensaje 'x' para explotar
            pez.haTocadoSuelo = false; 
            // Ya está inflado, no necesita animación de entrada
            pez.play(pez.animSalir || 'inflarPG', true);
            return; // No aplicamos movimiento parabólico ni delay
        }
        
        
        if (!pezData.esLanzado) {
            this.moverPezParabola(pez, x, y, 2000);
        }
        

        const duracion = this.anims.exists(animSalir)
            ? (this.anims.get(animSalir).frames.length / this.anims.get(animSalir).frameRate) * 1000
            : 1000;

        this.time.delayedCall(duracion, () => {
            if (pez.active) {
                pez.play(animIdle, true);
                pez.haTocadoSuelo = true;
            }
        });
    });
}

handleRecibirPecesIniciales(data) {
    if (!this.peces || !Array.isArray(data)) {
        console.warn("⚠️ No hay grupo de peces o la lista recibida es inválida.");
        return;
    }

    console.log("🐟 Recibiendo peces generados:", data);

    const posicionesExistentes = new Set(this.peces.getChildren().map(p => `${p.x},${p.y}`));

    data.forEach((pezData, index) => {
        const { x, y, tipoPez, animSalir } = pezData;
        if (typeof x !== "number" || typeof y !== "number" || !tipoPez || !animSalir) {
            console.warn(`⚠️ Datos incompletos del pez en índice ${index}:`, pezData);
            return;
        }

        const key = `${x},${y}`;
        if (posicionesExistentes.has(key)) {
            console.log(`⚠️ Pez duplicado en ${key}, se ignora.`);
            return;
        }
        posicionesExistentes.add(key);

        const pez = this.peces.create(x, y, tipoPez);
        pez.setScale(0.3);
        pez.setSize(10, 10);
        pez.animSalir = animSalir;
        pez.haTocadoSuelo = false;
        pez.esLanzado = !!pezData.esLanzado;

        // Reproducir animación de salida en bucle
        pez.play(animSalir, true);

        if (!pez.esLanzado) {
            // Si no ha sido lanzado, le damos movimiento parabólico
            this.moverPezParabola(pez, x, y, 2000);
        } else {
            // Si fue lanzado, no se mueve ni se marca como tocado suelo
            pez.haTocadoSuelo = false;
        }

    });
}


handlePezGloboExplosion(data) {
    const { x, y } = data;

    const pez = this.peces.getChildren().find(p =>
        Math.abs(p.x - x) < 10 && Math.abs(p.y - y) < 10 && p.texture.key === 'pezGlobo'
    );

    if (!pez || !pez.active) {
        console.warn("⚠️ Pez globo no encontrado o ya destruido");
        return;
    }

    pez.play('explotarPG', true);

    const duracionExpl = (this.anims.get('explotarPG').frames.length / this.anims.get('explotarPG').frameRate) * 1000;

    this.time.delayedCall(duracionExpl, () => {
        if (pez.active) {
            pez.destroy();
            this.sonidoExplosion?.play();
        }
    });

    const radio = 200;
    const explosionPos = new Phaser.Math.Vector2(x, y);

    ['gatoA', 'gatoB'].forEach(key => {
        const jugador = this.jugadores[key];
        if (jugador?.sprite) {
            const dist = Phaser.Math.Distance.Between(jugador.sprite.x, jugador.sprite.y, x, y);
            if (dist <= radio) {
                jugador.puntos -= 2;
                jugador.texto?.setText(" " + jugador.puntos);
                jugador.explosion = true;
            }
        }
    });
}



/**
 * Actualiza el temporizador del juego con el tiempo recibido.
 * @param {number} data - Tiempo restante en segundos
 */
handleTimeUpdate(data) {
    console.log("⏱️ Tiempo recibido:", data);
    this.timeLeft = data;
    this.updateTimer();
}


updateTimer() {
    this.timerText?.setText(this.timeLeft);
}



/**
 * Maneja la sincronización de pausa enviada por el otro jugador.
 * Restaura el estado de juego y lanza el menú de pausa.
 * @param {Object} data - Estado del juego en pausa recibido del otro jugador.
 */
handlePauseSync(data) {
    if (data.pause) {
        console.log("⏸️ Pausa activada");
        this.scene.launch('PauseMenu', { escenaPrevia: this.scene.key });
        if (this.scene.isActive(this.escenaPrevia)) {
            this.scene.pause(this.escenaPrevia);
            console.log("⏸️ Pausa activada");
        }
    } else {
        console.log("▶️ Reanudando juego");
        this.pause = false;

        // Reanudar peces
        this.peces?.getChildren()?.forEach(pez => pez.anims?.resume());

        // Reanudar animación del jugador
        const jugadorKey = this.playerId === 1 ? 'gatoA' : 'gatoB';
        const jugador = this.jugadores[jugadorKey];
        if (jugador?.sprite?.anims) jugador.sprite.anims.resume();

        this.scene.resume(); // Reactivar la escena si aún no está activa
    }
}

resumeGame() {
    const yoHeDadoAVolver = this.registry.get('yoHeDadoAVolver');

    if (yoHeDadoAVolver) {
        console.log("✅ Ambos jugadores listos, reanudando...");

        this.registry.set('yoHeDadoAVolver', false); // Limpiamos flag
        this.pause = false;

        if (this.scene.isActive('PauseMenu')) {
            this.scene.stop('PauseMenu'); // Cerrar menú
        }

        this.scene.resume(); // Reanudar juego

        if (this.temporizadorActivo) {
            this.temporizadorActivo.paused = false;
        }

        this.peces?.getChildren()?.forEach(pez => pez.anims?.resume());

        const jugadorKey = this.playerId === 1 ? 'gatoA' : 'gatoB';
        this.jugadores[jugadorKey]?.sprite?.anims?.resume();
    } else {
        console.log("📥 El otro jugador está listo, pero aún no has pulsado 'Volver'");
        // Aquí podrías mostrar algo tipo “Falta que tú pulses volver”
    }
}




crearAnimaciones() {
    ['gatoA', 'gatoB'].forEach(jugadorKey => {
        const sufijo = jugadorKey === 'gatoA' ? 'A' : 'B';

        // Pausa
        this.anims.create({
            key: `Pausa${sufijo}`,
            frames: this.anims.generateFrameNumbers(jugadorKey, { start: 1, end: 1 }),
            frameRate: 5,
            repeat: -1
        });

        // Frente
        this.anims.create({
            key: `frente${sufijo}`,
            frames: this.anims.generateFrameNumbers(jugadorKey, { start: 0, end: 2 }),
            frameRate: 5,
            repeat: -1
        });

        // Espaldas
        this.anims.create({
            key: `espaldas${sufijo}`,
            frames: this.anims.generateFrameNumbers(jugadorKey, { start: 8, end: 10 }),
            frameRate: 5,
            repeat: -1
        });

        // Caminar derecha
        this.anims.create({
            key: `caminar_drch${sufijo}`,
            frames: this.anims.generateFrameNumbers(jugadorKey, { start: 24, end: 26 }),
            frameRate: 5,
            repeat: -1
        });

        // Caminar izquierda
        this.anims.create({
            key: `caminar_izq${sufijo}`,
            frames: this.anims.generateFrameNumbers(jugadorKey, { start: 16, end: 18 }),
            frameRate: 5,
            repeat: -1
        });

        // Pescar izquierda
        this.anims.create({
            key: `pescar_izq${sufijo}`,
            frames: this.anims.generateFrameNumbers(jugadorKey, { start: 32, end: 34 }),
            frameRate: 5,
            repeat: -1
        });

        // Pescar derecha
        this.anims.create({
            key: `pescar_drch${sufijo}`,
            frames: this.anims.generateFrameNumbers(jugadorKey, { start: 40, end: 42 }),
            frameRate: 5,
            repeat: -1
        });
    });

    // === Animaciones de peces ===

    // PIRAÑA
    this.anims.create({ key: 'nadarP', frames: this.anims.generateFrameNumbers('piraña', { start: 0, end: 4 }), frameRate: 5, repeat: -1 });
    this.anims.create({ key: 'salirP', frames: this.anims.generateFrameNumbers('piraña', { start: 5, end: 12 }), frameRate: 5, repeat: -1 });
    this.anims.create({ key: 'idleP', frames: this.anims.generateFrameNumbers('piraña', { start: 13, end: 17 }), frameRate: 5, repeat: -1 });
    this.anims.create({ key: 'morderP', frames: this.anims.generateFrameNumbers('piraña', { start: 18, end: 21 }), frameRate: 5, repeat: -1 });

    // PEZ
    this.anims.create({ key: 'nadarE', frames: this.anims.generateFrameNumbers('pez', { start: 0, end: 4 }), frameRate: 5, repeat: -1 });
    this.anims.create({ key: 'salirE', frames: this.anims.generateFrameNumbers('pez', { start: 5, end: 12 }), frameRate: 5, repeat: -1 });
    this.anims.create({ key: 'idleE', frames: this.anims.generateFrameNumbers('pez', { start: 13, end: 15 }), frameRate: 5, repeat: -1 });

    // PEZ GLOBO
    this.anims.create({ key: 'nadarPG', frames: this.anims.generateFrameNumbers('pezGlobo', { start: 0, end: 4 }), frameRate: 5, repeat: -1 });
    this.anims.create({ key: 'salirPG', frames: this.anims.generateFrameNumbers('pezGlobo', { start: 5, end: 13 }), frameRate: 5, repeat: -1 });
    this.anims.create({ key: 'inflarPG', frames: this.anims.generateFrameNumbers('pezGlobo', { start: 16, end: 24 }), frameRate: 10, repeat: 0 });
    this.anims.create({ key: 'explotarPG', frames: this.anims.generateFrameNumbers('pezGlobo', { start: 25, end: 29 }), frameRate: 1, repeat: 0 });

    // ANGILA
    this.anims.create({ key: 'nadarA', frames: this.anims.generateFrameNumbers('angila', { start: 0, end: 7 }), frameRate: 5, repeat: -1 });
    this.anims.create({ key: 'salirA', frames: this.anims.generateFrameNumbers('angila', { start: 8, end: 19 }), frameRate: 5, repeat: -1 });
    this.anims.create({ key: 'idleA', frames: this.anims.generateFrameNumbers('angila', { start: 23, end: 29 }), frameRate: 5, repeat: -1 });
}
crearJugador(id, x, y, animacion) {
    return {
        id,
        x,
        y,
        sprite: null,
        puntos: 0,
        pezGlobo: false,
        paralizado: false,
        explosion: false,
        inventario: 0,
        inventarioAbierto: false,
        colision: false,
        ganado: false,
        perdido: false,
        canMove: true,
        animacion,
        texto: null,
        pezGloboIcono: null,
        inventarioPlegado: null,
        inventarioDesplegado: null
    };
}

registrarActividadUsuario() {
    const INTERVALO_MANTENIMIENTO = 5000;

    // === Mantener la sesión viva ===
    this.time.addEvent({
        delay: INTERVALO_MANTENIMIENTO,
        callback: () => {
            if (typeof this.keepAlive === 'function') {
                this.keepAlive();
            } else {
                console.warn("⚠️ Función keepAlive no está definida.");
            }
        },
        callbackScope: this,
        loop: true
    });

}

keepAlive() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send('ping'); // puedes usar también {tipo: 'k'} si quieres usar el enum
        console.log("📡 Ping enviado al servidor.");
    }
}

registrarEventos() {
    const boton = this.add.image(1150, 40, 'Boton_pausa_normal')
        .setInteractive()
        .setScale(0.45);

    // Cambios de textura al pasar el ratón
    boton.on('pointerover', () => boton.setTexture('Boton_pausa_encima'));
    boton.on('pointerout', () => boton.setTexture('Boton_pausa_normal'));

    // Cambios al hacer clic
    boton.on('pointerdown', () => boton.setTexture('Boton_pausa_pulsado'));
    boton.on('pointerup', () => {
        boton.setTexture('Boton_pausa_normal');
    
        this.PausarJuego?.();
    
        this.scene.launch('PauseMenu', { escenaPrevia: this.scene.key });
        if (this.scene.isActive(this.escenaPrevia)) {
            this.scene.pause(this.escenaPrevia);
            console.log("⏸️ Pausa activada");
        }
    });
    
}

enviarPosicion() {
    if (!this.player || !this.socket || this.socket.readyState !== WebSocket.OPEN) return;

    const { x, y } = this.player;
    const ahora = Date.now();

    // Solo enviamos si ha pasado el intervalo y se ha movido suficiente
    if (
        ahora - this.lastUpdateTime > this.POSITION_UPDATE_INTERVAL &&
        Phaser.Math.Distance.Between(x, y, this.lastSentPosition.x, this.lastSentPosition.y) > this.POSITION_THRESHOLD
    ) {
        const mensaje = 'p' + JSON.stringify([x, y]);
        this.socket.send(mensaje);
        this.lastSentPosition = { x, y };
        this.lastUpdateTime = ahora;
    }

}

/**
 * Inicializa los jugadores en el campo de juego.
 * @param {Array} players - Lista de jugadores: [x, y, id, color]
 */
initializePlayers(players) {
    players.forEach(p => {
        const [x, y, id] = p;

        let jugadorKey;
        if (id === 1) {
            jugadorKey = 'gatoA';
        } else if (id === 2) {
            jugadorKey = 'gatoB';
        } else {
            console.warn("⚠️ ID de jugador desconocido:", id);
            return;
        }

        if (!this.jugadores[jugadorKey]) {
            this.jugadores[jugadorKey] = {};
        }

        const sprite = this.physics.add.sprite(x, y, jugadorKey);
        sprite.setScale(0.25);
        sprite.setCollideWorldBounds(true);
        sprite.setSize(280, 57);
        sprite.setOffset(0, 453);
        sprite.name = jugadorKey;
        sprite.canMove = true;

        this.jugadores[jugadorKey].sprite = sprite;
        this.jugadores[jugadorKey].x = x;
        this.jugadores[jugadorKey].y = y;

        if (id === this.playerId) {
            this.player = sprite;
            this.jugadorPropio = jugadorKey;
            this.lastSentPosition = { x, y };
        } else {
            this.otherPlayer = sprite;
            sprite.setDepth(2); // Asegura que el rival esté por delante si hay solapamientos
            sprite.setVisible(true); // Asegura que el rival sea visible
        }
        
    });

    // === Definir zonas ===
    this.arbusto = { x: 153, y: 75, width: 885, height: 565 };

    this.zonasProhibidas = [
        { x: 295, y: 600, width: 603, height: 120 },
        { x: 295, y: 160, width: 196, height: 380 },
        { x: 491, y: 180, width: 150, height: 330 },
        { x: 766, y: 160, width: 140, height: 90 },
        { x: 860, y: 250, width: 45, height: 200 },
        { x: 766, y: 450, width: 140, height: 96 },
        { x: 641, y: 200, width: 20, height: 290 }
    ];

    this.pescaZones = [
        { x: 250, y: 600, width: 20, height: 150 },
        { x: 930, y: 600, width: 20, height: 150 },
        { x: 250, y: 160, width: 20, height: 380 },
        { x: 930, y: 160, width: 20, height: 380 },
        { x: 680, y: 250, width: 170, height: 200 }
    ];
    this.tierra = [
        {x:153,y:126,width:97,height:570},
        {x:945,y:126,width:97,height:570},
        {x:276,y:126,width:630,height:20},
        {x:276,y:562,width:630,height:20},
        {x:730,y:280,width:85,height:160},
    ];

    this.agua=[
        { x: 370, y:650, width: 503, height: 50 }, // Región 2
        { x: 370,y: 0, width: 503, height:50}, // Región 3
        { x: 370, y: 210, width: 250, height:270}, // Región 4
        
    ]

    // === Crear zonas físicas invisibles y colisiones ===
    this.zonasProhibidas.forEach((zona, index) => {
        const zonaProhibida = this.physics.add.staticImage(
            zona.x + zona.width / 2,
            zona.y + zona.height / 2,
            'invisible'
        );
        zonaProhibida.setSize(zona.width, zona.height);
        zonaProhibida.setAlpha(0);

        ['gatoA', 'gatoB'].forEach(jugadorKey => {
            const jugador = this.jugadores[jugadorKey];
            if (jugador?.sprite?.body) {
                this.physics.add.collider(jugador.sprite, zonaProhibida, () => {
                    console.log(`🛑 ${jugadorKey} chocó con la zona prohibida ${index + 1}`);
                });
            } else {
                console.warn(`⚠️ El sprite de ${jugadorKey} aún no está listo para colisión.`);
            }
        });
    });
}

crearUI() {

    // === Temporizador visual ===
    this.timerText = this.add.text(config.width / 2, 20, "90", {
        fontSize: "32px",
        color: "#111111",
        fontWeight: "bold",
        stroke: "#000000",
        strokeThickness: 2
    }).setOrigin(0.5, -0.2).setDepth(10);

    this.timerBackground = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY - 100, 'reloj')
        .setOrigin(0.5, 3.3)
        .setScale(0.35)
        .setDepth(9);
        
    // === UI individual para cada jugador ===
    this._crearUIJugador('gatoA', 33, 83, 55, 170, 220);
    this._crearUIJugador('gatoB', 1167, 1117, 1145, 1030, 945);

    // === Botón de pausa ===
    const botonPausa = this.add.image(1150, 40, 'Boton_pausa_normal')
        .setInteractive()
        .setScale(0.45);

    const sonidoBoton = this.sound.add("sonidoBoton", {
        loop: false,
        volume: 0.5
    });

    botonPausa.on('pointerover', () => {
        botonPausa.setTexture('Boton_pausa_encima');
    });

    botonPausa.on('pointerout', () => {
        botonPausa.setTexture('Boton_pausa_normal');
    });

    botonPausa.on('pointerdown', () => {
        botonPausa.setTexture('Boton_pausa_pulsado');
        sonidoBoton.play();
    });

    botonPausa.on('pointerup', () => {
        botonPausa.setTexture('Boton_pausa_normal');
        this.PausarJuego();
        this.scene.launch('PauseMenu', { escenaPrevia: this.scene.key });
        if (this.scene.isActive(this.escenaPrevia)) {
            this.scene.pause(this.escenaPrevia);
            console.log("⏸️ Pausa activada");
        }
    });
}

/**
 * Crea la UI asociada a un jugador (inventarios, íconos, texto).
 * @param {'gatoA' | 'gatoB'} jugadorKey - Clave del jugador
 * @param {number} xPleg - Posición X del inventario plegado
 * @param {number} xDes - Posición X del inventario desplegado
 * @param {number} xIcono - Posición X del icono de pez globo
 * @param {number} xCara - Posición X del rostro del jugador
 * @param {number} xTexto - Posición X del texto de puntos
 */
_crearUIJugador(jugadorKey, xPleg, xDes, xIcono, xCara, xTexto) {
    const jugador = this.jugadores[jugadorKey];

    if (!jugador) {
        console.error(`❌ Jugador ${jugadorKey} no está inicializado correctamente.`);
        return;
    }

    const sufijo = jugadorKey === "gatoA" ? "A" : "B";
    const invPlegadoKey = `inv_sinDesplegar_normal_${jugadorKey}`;
    const invDesplegadoKey = `inv_Desplegado_normal_${jugadorKey}`;
    const caraKey = `Cara${jugadorKey.charAt(0).toUpperCase() + jugadorKey.slice(1)}`;

    // === Contenedor del inventario PLEGADO
    const contenedorPlegado = this.add.container(xPleg, config.height / 2)
        .setScale(0.4)
        .setVisible(true);
    const imagenPlegada = this.add.image(0, 0, invPlegadoKey).setOrigin(0.5);
    contenedorPlegado.add(imagenPlegada);

    // === Contenedor del inventario DESPLEGADO
    const contenedorDesplegado = this.add.container(xDes, config.height / 2)
        .setScale(0.4)
        .setVisible(false);
    const imagenDesplegada = this.add.image(0, 0, invDesplegadoKey).setOrigin(0.5);
    contenedorDesplegado.add(imagenDesplegada);

    // === Ícono del pez globo
    const iconoPezGlobo = this.add.image(xIcono, 360, 'pezGloboDesinf')
        .setScale(0.18)
        .setVisible(false)
        .setDepth(10);

    // === Cara del jugador
    this.add.image(xCara, 35, caraKey).setScale(0.15).setDepth(5);

    // === Texto de puntuación
    const textoPuntos = this.add.text(xTexto, 13, " 0 ", {
        font: "30px Arial Black",
        color: "#ffffff"
    });

    // Guardar todo en el jugador
    jugador.inventarioPlegado = contenedorPlegado;
    jugador.inventarioDesplegado = contenedorDesplegado;
    jugador.pezGloboIcono = iconoPezGlobo;
    jugador.texto = textoPuntos;
    jugador.inventarioAbierto = false;
    jugador._inventarioCooldown = false;
}

handleDesconexion() {
    // Avisar al servidor si la conexión está abierta
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send('u'); // 'u' es el mensaje de desconexión
        console.log("👋 Enviando desconexión al servidor.");
    }

    // Capturar el evento de cerrar o recargar la página
    window.addEventListener("beforeunload", (event) => {
        event.preventDefault();
        this.handleDesconexion();
        event.returnValue = ''; 
    });

    this.registry.set('finPorDesconexion', true);

}

enviarEstadoFinal() {
    const jugadorKey = this.isHost ? 'gatoA' : 'gatoB';
    const jugador = this.jugadores[jugadorKey];

    if (!jugador || !jugador.sprite) {
        console.warn(`⚠️ Jugador ${jugadorKey} o su sprite no están definidos.`);
        return;
    }

    const estado = {
        ready: this.isHost ? gatoAHasSelected : gatoBHasSelected,
        x: jugador.sprite.x,
        y: jugador.sprite.y,
        pescar: this.isHost ? pescarGatoA : pescarGatoB,
        animacionGato: jugador.animacion || null,
        Time: typeof Time !== 'undefined' ? Time : this.timeLeft,
        xPez: this.pezX,
        yPez: this.pezY,
        pezTipo: this.tipoPez,
        animacionPez: this.pezAnims,
        pezGloboExplotando: this.explosionPezGlobo,
        pezGloboCapturado: this.isHost ? capturaPezGlobo1 : capturaPezGlobo2,
        pezGloboLanzado: this.isHost ? lanzarPezGlobo1 : lanzarPezGlobo2,
        jugadorParalizado: jugador.paralizado,
        jugadorExplosion: jugador.explosion,
        inventario: jugador.inventario,
        inventarioAbierto: jugador.inventarioAbierto,
        puntos: jugador.puntos,
        hasCollidedFish: this.isHost ? colisionPez1 : colisionPez2,
        ganado: jugador.ganado,
        perdido: jugador.perdido,
        pause: this.isHost ? gameOnPause1 : gameOnPause2,
        desconectado: this.isHost ? userDesconectado1 : userDesconectado2,
        map: this.isHost ? mapa1 : mapa2,
        pecesGenerados: this.pecesGenerados || []
    };

    if (typeof connection !== 'undefined' && connection.readyState === WebSocket.OPEN) {
        connection.send(JSON.stringify(estado));
    } else {
        console.warn("⚠️ No se pudo enviar el estado final: conexión no activa.");
    }
}

/**
 * Envía una señal al backend para mantener viva la sesión del jugador.
 */
async keepAlive() {
    if (!this.playerId) {
        console.warn('[⚠️ keepAlive] No hay playerId definido para mantener la sesión activa.');
        return;
    }

    try {
        const response = await fetch('/api/users/seen', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ playerId: this.playerId })
        });

        if (!response.ok) {
            console.warn(`[⚠️ keepAlive] Error del servidor: ${response.status} (${response.statusText})`);
        }
    } catch (error) {
        console.error('[❌ keepAlive] Fallo en la solicitud:', error.message);
    }
}

/**
 * Notifica al backend que el jugador se ha desconectado.
 */
async disconnectedUser() {
    if (!this.playerId) {
        console.warn('[⚠️ disconnectedUser] No se especificó un nombre de usuario.');
        return;
    }

    try {
        const response = await fetch('/api/users/disconnect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ playerId: this.playerId })
        });

        if (!response.ok) {
            console.warn(`[⚠️ disconnectedUser] Respuesta del servidor no válida: ${response.status} (${response.statusText})`);
        }
    } catch (error) {
        console.error('[❌ disconnectedUser] Error al desconectarse:', error.message);
    }
}

/**
 * Actualiza la lista de usuarios conectados desde el backend.
 */
async updateConnectedUsers() {
    const defaultDelay = 5000;
    const thresholdMs = Date.now() - (this.threshold || defaultDelay);

    if (isNaN(thresholdMs)) {
        console.error("[❌ updateConnectedUsers] El valor de threshold no es válido:", thresholdMs);
        return;
    }

    try {
        const response = await fetch(`/api/users/connected-since/${thresholdMs}`);

        if (!response.ok) {
            console.warn(`[⚠️ updateConnectedUsers] Error del servidor: ${response.status} (${response.statusText})`);
            return;
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            console.warn("[⚠️ updateConnectedUsers] Se esperaba una lista de usuarios:", data);
            return;
        }

        // Saltamos el primero si es necesario (por ejemplo, sistema o admin)
        const usuarios = data.slice(1);
        this.connectedUsers = usuarios;

        if (this.connectedUsersText) {
            this.connectedUsersText.setText("Usuarios conectados:\n" + usuarios.join("\n"));
        } else {
            console.warn("[⚠️ updateConnectedUsers] No se definió 'connectedUsersText' en la escena.");
        }

    } catch (error) {
        console.error('[❌ updateConnectedUsers] Fallo en la solicitud:', error.message);
    }
}

/**
 * Verifica si una posición y tamaño se solapan con alguna zona prohibida.
 * @param {number} x - Coordenada X del objeto
 * @param {number} y - Coordenada Y del objeto
 * @param {number} width - Ancho del objeto
 * @param {number} height - Alto del objeto
 * @returns {boolean} - True si hay colisión con una zona prohibida
 */
enZonaProhibida(x, y, width, height) {
    if (!Array.isArray(this.zonasProhibidas) || this.zonasProhibidas.length === 0) {
        console.warn('[⚠️ enZonaProhibida] No hay zonas prohibidas definidas.');
        return false;
    }

    return this.zonasProhibidas.some(zona =>
        x < zona.x + zona.width &&
        x + width > zona.x &&
        y < zona.y + zona.height &&
        y + height > zona.y
    );
}

/**
 * Alterna el estado de pausa del juego y envía el estado actualizado al servidor.
 */
PausarJuego(reanudar = false) {
    const jugadorKey = this.playerId === 1 ? 'gatoA' : 'gatoB';
    const jugador = this.jugadores[jugadorKey];

    this.pause = reanudar ? false : !this.pause;

    // Pausar o reanudar animaciones
    this.peces?.getChildren()?.forEach(pez => {
        pez.anims?.[this.pause ? "pause" : "resume"]();
    });

    if (jugador.sprite?.anims) {
        jugador.sprite.anims[this.pause ? "pause" : "resume"]();
    }

    this.socket.send(MSG_TYPES.PAUSE_SYNC + this.playerId);

    // Si se está pausando, mostrar menú
    if (!reanudar && this.pause) {
        this.scene.launch('PauseMenu', { escenaPrevia: this.scene.key });
        if (this.scene.isActive(this.escenaPrevia)) {
            this.scene.pause(this.escenaPrevia);
            console.log("⏸️ Pausa activada");
        }
    }

    // Si se está reanudando desde el botón atrás
    if (reanudar) {
        this.scene.resume();
    }
}

/**
 * Verifica si un sprite está dentro de una de las zonas de pesca.
 * @param {Phaser.GameObjects.Sprite} sprite - El sprite a verificar.
 * @param {Array<Object>} zones - Lista de zonas con x, y, width, height.
 * @returns {boolean} - True si el sprite está dentro de alguna zona.
 */
isInFishingZone(sprite, zones) {
    if (!sprite || typeof sprite.x !== 'number' || typeof sprite.y !== 'number') {
        console.warn("⚠️ isInFishingZone: Sprite no válido o sin coordenadas.");
        return false;
    }

    if (!Array.isArray(zones) || zones.length === 0) {
        console.warn("⚠️ isInFishingZone: No hay zonas de pesca definidas.");
        return false;
    }

    console.log("✅ Dentro de la zona de pesca");

    return zones.some(zone =>
        sprite.x >= zone.x &&
        sprite.x <= zone.x + zone.width &&
        sprite.y >= zone.y &&
        sprite.y <= zone.y + zone.height
    );

    

}

update(time, delta) {
    if (!this.gameStarted || !this.playerId) return;

    const jugadorKey = this.playerId === 1 ? 'gatoA' : 'gatoB';
    const jugador = this.jugadores[jugadorKey];

    if (!jugador || !jugador.sprite) {
        console.error(`❌ Error: Jugador '${jugadorKey}' o su sprite no están definidos.`);
        return;
    }

    // Aplicar restricciones de movimiento (colisiones, límites, zonas)
    this.restriccionesMovimiento(jugador);

    // Ejecutar lógica de control principal del jugador
    this.handleMovement(jugador, jugadorKey);
    this.handlePositionUpdates();
    this.handleFishing(jugador, jugadorKey);
    this.handlePezGloboThrow(jugador, jugadorKey);
    this.handleInventory(jugador, jugadorKey);


    
    if (this.pecesGenerados.length > 0 && this.debugPeces) {
        console.log("🐟 Peces generados:", this.pecesGenerados);
    }
}

/**
 * Controla el movimiento y la animación del jugador según la entrada del teclado.
 * @param {Object} jugador - Objeto del jugador (gatoA o gatoB).
 * @param {'gatoA' | 'gatoB'} jugadorKey - Clave identificadora del jugador.
 */
handleMovement(jugador, jugadorKey) {
    if (!jugador || !jugador.sprite) return;

    if (!jugador.canMove) {
        jugador.sprite.setVelocity(0, 0);
        return;
    }

    const sprite = jugador.sprite;
    let movX = 0;
    let movY = 0;
    let nuevaAnimacion = null;

    const sufijo = jugadorKey === 'gatoA' ? 'A' : 'B';

    if (this.keys?.D?.isDown) {
        movX = 160;
        nuevaAnimacion = `caminar_drch${sufijo}`;
        jugador.izquierda = false;
    } else if (this.keys?.A?.isDown) {
        movX = -160;
        nuevaAnimacion = `caminar_izq${sufijo}`;
        jugador.izquierda = true;
    }

    if (this.keys?.W?.isDown) {
        movY = -160;
        nuevaAnimacion = `espaldas${sufijo}`;
        jugador.arriba = true;
    } else if (this.keys?.S?.isDown) {
        movY = 160;
        nuevaAnimacion = `frente${sufijo}`;
        jugador.arriba = false;
    }

    sprite.setVelocity(movX, movY);

    // Detectar cambio de animación
    if ((movX !== 0 || movY !== 0) && nuevaAnimacion !== jugador.animacion) {
        jugador.animacion = nuevaAnimacion;
        sprite.anims.play(nuevaAnimacion, true);
        this.sendPosition(); // ← Envía si cambia la animación
    } else if (movX === 0 && movY === 0 && sprite.anims.isPlaying) {
        sprite.anims.stop();
        const pausaAnim = `Pausa${sufijo}`;
        sprite.anims.play(pausaAnim, true);
        jugador.animacion = pausaAnim;
        this.sendPosition(); // ← Envía también si cambia a pausa
    }
}

/**
 * Verifica si la posición ha cambiado lo suficiente como para enviarla al servidor.
 */
handlePositionUpdates() {
    const currentTime = Date.now();

    if (!this.player || !this.socket || this.socket.readyState !== WebSocket.OPEN) return;

    if (currentTime - this.lastUpdateTime >= this.POSITION_UPDATE_INTERVAL) {
        const dx = Math.abs(this.player.x - this.lastSentPosition.x);
        const dy = Math.abs(this.player.y - this.lastSentPosition.y);

        if (dx > this.POSITION_THRESHOLD || dy > this.POSITION_THRESHOLD) {
            this.sendPosition();
            this.lastUpdateTime = currentTime;
            this.lastSentPosition = { x: this.player.x, y: this.player.y };
        }
    }
}

sendPosition() {
    const jugadorKey = this.playerId === 1 ? 'gatoA' : 'gatoB';
    const anim = this.jugadores[jugadorKey]?.animacion || null;

    if (!this.player || !this.socket || this.socket.readyState !== WebSocket.OPEN) return;

    const mensaje = MSG_TYPES.POS + JSON.stringify([
        this.playerId,
        Math.round(this.player.x),
        Math.round(this.player.y),
        anim
    ]);
    this.socket.send(mensaje);
}



/**
 * Controla la lógica de pesca para un jugador cuando presiona la tecla Q.
 * @param {Object} jugador - El jugador que pesca (gatoA o gatoB).
 * @param {'gatoA' | 'gatoB'} jugadorKey - Clave del jugador.
 */
handleFishing(jugador, jugadorKey) {
    if (!this.keys || !this.keys.Q) {
        console.error("❌ Las teclas no están inicializadas correctamente.");
        return;
    }

    if (!jugador || !jugador.sprite) {
        console.warn(`⚠️ El jugador ${jugadorKey} o su sprite no están definidos.`);
        return;
    }

    if (this.keys.Q.isDown && !jugador.waiting && !jugador.pescar) {
        console.log("🎣 Tecla Q presionada, intentando pescar...");

        if (this.isInFishingZone(jugador.sprite, this.pescaZones)) {
            jugador.pescar = true;
            jugador.wait = true;
            jugador.canMove = false;

            this.sonidoPesca?.play();

            const direccion = jugador.izquierda ? 'izq' : 'drch';
            const sufijo = jugadorKey === 'gatoA' ? 'A' : 'B'; // 👈 Evita usar "gatoA" como sufijo
            const animacion = `pescar_${direccion}${sufijo}`; // Ej: pescar_izqA o pescar_drchB

            jugador.sprite.anims.play(animacion, true);
            jugador.animacion = animacion;
            this.sendPosition();

            this.time.delayedCall(2000, () => {
                console.log("🕒 Delay completado. Ejecutando aparecerPeces...");
                this.aparecerPeces();
                jugador.wait = false;
                jugador.pescar = false;
                jugador.canMove = true;
                this.sendPosition();
            }, [], this); 
        }
    }
}


/**
 * Maneja la apertura y cierre del inventario del jugador.
 * @param {Object} jugador - Objeto del jugador (gatoA o gatoB).
 * @param {'gatoA' | 'gatoB'} jugadorKey - Clave del jugador.
 */
handleInventory(jugador, jugadorKey) {
    if (!this.keys || !this.keys.E || !jugador || !jugador.inventarioPlegado || !jugador.inventarioDesplegado) {
        return;
    }

    if (!jugador._inventarioCooldown && Phaser.Input.Keyboard.JustDown(this.keys.E)) {
        const abrir = !jugador.inventarioAbierto;

        // Mostrar u ocultar contenedores del inventario
        jugador.inventarioPlegado.setVisible(!abrir);
        jugador.inventarioDesplegado.setVisible(abrir);
        jugador.inventarioAbierto = abrir;

        // Solo mostrar el ícono si tiene un pez globo Y el inventario está abierto
        if (jugador.pezGloboIcono) {
            jugador.pezGloboIcono.setVisible(abrir && jugador.pezGlobo);
        }

        console.log(`🎒 Inventario ${abrir ? "abierto" : "cerrado"} para ${jugadorKey}`);

        jugador._inventarioCooldown = true;
        this.time.delayedCall(300, () => {
            jugador._inventarioCooldown = false;
        });
    }
}

/**
 * Restringe al jugador dentro del área jugable del arbusto.
 * @param {Object} jugador - El jugador cuyo movimiento se restringe.
 */
restriccionesMovimiento(jugador) {
    if (!jugador || !jugador.sprite) {
        console.error("❌ restriccionesMovimiento: El jugador o su sprite no están definidos.");
        return;
    }

    const sprite = jugador.sprite;
    const limites = this.arbusto;

    if (!limites) {
        console.warn("⚠️ restriccionesMovimiento: Zona 'arbusto' no definida.");
        return;
    }

    // Limitar dentro del área definida por el arbusto
    if (sprite.x < limites.x) sprite.x = limites.x;
    if (sprite.x > limites.x + limites.width) sprite.x = limites.x + limites.width;
    if (sprite.y < limites.y) sprite.y = limites.y;
    if (sprite.y > limites.y + limites.height) sprite.y = limites.y + limites.height;
}

getJugadorProp(jugadorKey, propA, propB) {
    return jugadorKey === 'gatoA' ? propA : propB;
}


/**
 * Envía el estado actual del jugador al servidor mediante WebSocket.
 * @param {'gatoA' | 'gatoB'} jugadorKey - Clave del jugador que envía el estado.
 */
sendStateToServer(jugadorKey, opciones = { soloPosicion: true }) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
        console.warn("⚠️ No se pudo enviar el estado: WebSocket no está conectado.");
        return;
    }

    const jugador = this.jugadores[jugadorKey];
    if (!jugador || !jugador.sprite) {
        console.warn(`⚠️ Jugador ${jugadorKey} o su sprite no están disponibles para enviar estado.`);
        return;
    }

    const ahora = Date.now();
    const { x, y } = jugador.sprite;

    const haPasadoTiempo = ahora - this.lastUpdateTime > this.POSITION_UPDATE_INTERVAL;
    const seHaMovido = Phaser.Math.Distance.Between(x, y, this.lastSentPosition.x, this.lastSentPosition.y) > this.POSITION_THRESHOLD;

    // === Enviar solo posición ===
    if (opciones.soloPosicion && haPasadoTiempo && seHaMovido) {
        const mensaje = 'p' + JSON.stringify([x, y]);
        this.socket.send(mensaje);

        this.lastSentPosition = { x, y };
        this.lastUpdateTime = ahora;
        return; // Salimos aquí porque ya enviamos solo posición
    }

    // === Enviar estado completo (cuando se especifique) ===
    if (!opciones.soloPosicion) {
        const estado = {
            type: "state",
            playerId: jugador.id,
            x,
            y,
            animacionGato: jugador.animacion || null,
            puntos: jugador.puntos || 0,
            Time: this.timeLeft || 0,
            pecesGenerados: this.pecesGenerados || [],
            ready: jugador.ready || false,

            pezGloboExplotando: this.explosionPezGlobo || false,
            pezGloboCapturado: jugador.pezGloboCapturado || false,
            pezGloboLanzado: jugador.lanzarPezGlobo || false,

            jugadorParalizado: jugador.paralizado || false,
            jugadorExplosion: jugador.explosion || false,
            inventario: jugador.inventario || 0,
            inventarioAbierto: jugador.inventarioAbierto || false,
            hasCollidedFish: jugador.colision || false,
            ganado: jugador.ganado || false,
            perdido: jugador.perdido || false
        };

        this.socket.send('s' + JSON.stringify(estado));
    }
}


/**
 * Mueve un pez desde fuera de la pantalla hasta un punto del mapa con una trayectoria parabólica.
 * @param {Phaser.GameObjects.Sprite} pez - El pez que se moverá.
 * @param {number} destinoX - Coordenada X de destino.
 * @param {number} destinoY - Coordenada Y de destino.
 * @param {number} duracion - Duración del movimiento en milisegundos (por defecto: 2000).
 * @param {number} xInicio - Coordenada X inicial desde donde cae el pez (por defecto: 400).
 */
moverPezParabola(pez, destinoX, destinoY, duracion = 2000, xInicio = 400) {
    if (!pez || typeof destinoX !== 'number' || typeof destinoY !== 'number') {
        console.warn("⚠️ Parámetros inválidos para moverPezParabola.");
        return;
    }

    const yInicio = pez.scene.cameras.main.height + 50; // Aparece debajo del mapa

    if (pez.hasTween) return;

    pez.setPosition(xInicio, yInicio);
    pez.hasTween = true;

    // Animación de salida durante el vuelo
    if (pez.animSalir) {
        pez.play(pez.animSalir, true);
    }

    pez.scene.tweens.add({
        targets: pez,
        x: destinoX,
        y: destinoY,
        duration: duracion,
        ease: 'Quad.easeOut',
        onUpdate: (tween, target) => {
            const progress = tween.progress;
            const alturaMax = 100; // Altura máxima de la parábola
            target.y = destinoY - alturaMax * (4 * (progress - 0.5) ** 2 - 1);
        },
        onComplete: () => {
            pez.hasTween = false;
            pez.haTocadoSuelo = true;
            console.log('🐟 Pez tocó el suelo');

            if (pez.animIdle) {
                pez.play(pez.animIdle, true);
            }
        }
    });
}


aparecerPeces() {
    console.log("🐟 Generando peces...");

    const limiteDePeces = 3;
    this.pecesGenerados = [];

    const zonas = this.tierra; // <- Usa las zonas de tierra definidas en initializePlayers

    if (!zonas || zonas.length === 0) {
        console.warn("⚠️ No hay zonas de tierra disponibles.");
        return;
    }

    let pecesPorRegion = Math.floor(limiteDePeces / zonas.length);
    let pecesExtras = limiteDePeces % zonas.length;

    zonas.forEach(region => {
        const cantidad = pecesPorRegion + (pecesExtras-- > 0 ? 1 : 0);

        for (let i = 0; i < cantidad; i++) {
            const tipoPez = Phaser.Math.RND.pick(['pez', 'piraña', 'pezGlobo', 'angila']);
            const x = Phaser.Math.Between(region.x, region.x + region.width);
            const y = Phaser.Math.Between(region.y, region.y + region.height);

            const pez = this.peces.create(x, y, tipoPez).setScale(0.3);
            let animSalir = '', animIdle = '';

            switch (tipoPez) {
                case 'angila':
                    pez.setSize(10, 10);
                    animSalir = 'salirA';
                    animIdle = 'idleA';
                    break;
                case 'pezGlobo':
                    pez.setSize(5, 5);
                    animSalir = 'salirPG';
                    animIdle = 'inflarPG';
                    this.socket.send(MSG_TYPES.EXPLODE_PEZGLOBO + JSON.stringify({ x, y, delay: 5000 }));
                    break;
                case 'pez':
                    pez.setSize(5, 5);
                    animSalir = 'salirE';
                    animIdle = 'idleE';
                    break;
                case 'piraña':
                    pez.setSize(5, 5);
                    animSalir = 'salirP';
                    animIdle = 'idleP';
                    break;
            }

            pez.animSalir = animSalir;
            pez.animIdle = animIdle;

            pez.play(animSalir, true);
            this.moverPezParabola(pez, x, y, 2000);

            this.pecesGenerados.push({
                x, y, tipoPez, animSalir, animIdle,
                esLanzado: false
            });

            const frames = this.anims.get(animSalir)?.frames.length || 1;
            const frameRate = this.anims.get(animSalir)?.frameRate || 10;
            const duracion = (frames / frameRate) * 1000;

            this.time.delayedCall(duracion, () => {
                if (pez.active) pez.play(animIdle, true);
            });
        }
    });

    this.enviarPeces();
}


/**
 * Envía los peces generados al otro jugador mediante WebSocket.
 * Utiliza el tipo de mensaje 'g' para sincronizar peces entre pantallas.
 */
enviarPeces() {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
        console.warn("⚠️ WebSocket no conectado, no se pueden enviar peces.");
        return;
    }

    if (!this.pecesGenerados || this.pecesGenerados.length === 0) {
        console.warn("⚠️ No hay peces generados para enviar.");
        return;
    }

    const data = this.pecesGenerados.map(p => ({
        x: p.x,
        y: p.y,
        tipoPez: p.tipoPez,
        animSalir: p.animSalir,
        animIdle: p.animIdle
    }));

    this.socket.send(MSG_TYPES.FISH_SPAWN + JSON.stringify(data));
    console.log("📤 Enviando peces generados al otro jugador:", data);
}


/**
 * Notifica la recogida del pez al servidor, que validará el tipo y aplicará la puntuación.
 * @param {Phaser.Physics.Arcade.Sprite} jugadorSprite - El sprite del jugador (gatoA o gatoB).
 * @param {Phaser.GameObjects.Sprite} pez - El pez que colisionó.
 */
destruirPeces(jugadorSprite, pez, jugadorKey) {
    if (!pez || pez.recogido) return;

    if (!pez.haTocadoSuelo) {
        console.log("🛑 Intento de recoger un pez que aún no ha tocado suelo.");
        return;
    }

    const jugador = this.jugadores[jugadorKey];
    if (!jugador) {
        console.warn(`⚠️ No se encontró jugador ${jugadorKey}`);
        return;
    }

    const animKey = pez.anims?.currentAnim?.key || '';
    if (!animKey) {
        console.warn("⚠️ El pez no tiene animación activa.");
        return;
    }

    // 🛑 Marcar el pez como ya recogido (anti doble colisión)
    pez.recogido = true;

    // Enviar al servidor la recogida
    this.socket.send(MSG_TYPES.COLLECT + JSON.stringify({
        playerId: this.playerId,
        x: pez.x,
        y: pez.y,
        animacion: animKey,
        esLanzado: pez.esLanzado
    }));

    console.log(`🎯 Pez recogido por ${jugadorKey}: animación ${animKey}`);
}

// Método para explotar el pez globo
/**
 * Maneja la explosión de un pez globo, afectando a jugadores cercanos y sincronizando el estado.
 * @param {Phaser.GameObjects.Sprite} pez - El pez globo que explotará.
 */
explotarPezGlobo(pez) {
    if (!pez?.active) return;

    const tiempoExplosion = 5000;
    const radio = 200;

    const posiciones = {
        gatoA: new Phaser.Math.Vector2(this.jugadores.gatoA.sprite.x, this.jugadores.gatoA.sprite.y),
        gatoB: new Phaser.Math.Vector2(this.jugadores.gatoB.sprite.x, this.jugadores.gatoB.sprite.y)
    };

    const actualizarCoords = () => {
        posiciones.gatoA.set(this.jugadores.gatoA.sprite.x, this.jugadores.gatoA.sprite.y);
        posiciones.gatoB.set(this.jugadores.gatoB.sprite.x, this.jugadores.gatoB.sprite.y);
    };

    const actualizarUI = () => {
        this.jugadores.gatoA.texto?.setText(" " + this.jugadores.gatoA.puntos);
        this.jugadores.gatoB.texto?.setText(" " + this.jugadores.gatoB.puntos);
        this.jugadores.gatoA.sprite.anims.play(this.jugadores.gatoA.animacion, true);
        this.jugadores.gatoB.sprite.anims.play(this.jugadores.gatoB.animacion, true);
    };

    const eventoCoords = this.time.addEvent({ delay: 100, callback: actualizarCoords, loop: true });
    const eventoAnim = this.time.addEvent({ delay: 100, callback: actualizarUI, loop: true });

    this.time.delayedCall(tiempoExplosion, () => {
        eventoCoords.remove();
        eventoAnim.remove();

        if (!pez.active) return;

        // 🔄 Sincronizar explosión con el otro jugador
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send('x' + JSON.stringify({ x: pez.x, y: pez.y }));
        }

        // 💥 Reproducir animación localmente
        pez.play('explotarPG', true);

        const duracionExpl = (this.anims.get('explotarPG').frames.length / this.anims.get('explotarPG').frameRate) * 1000;

        this.time.delayedCall(duracionExpl, () => {
            if (pez.active) {
                pez.destroy();
                this.sonidoExplosion?.play();
            }
        });

        const explosionPos = new Phaser.Math.Vector2(pez.x, pez.y);
        const distA = posiciones.gatoA.distance(explosionPos);
        const distB = posiciones.gatoB.distance(explosionPos);

        this.explosionPezGlobo = true;

        if (distA <= radio) {
            this.jugadores.gatoA.explosion = true;
            this.jugadores.gatoA.puntos -= 2;
            this.jugadores.gatoA.texto?.setText(" " + this.jugadores.gatoA.puntos);
        }

        if (distB <= radio) {
            this.jugadores.gatoB.explosion = true;
            this.jugadores.gatoB.puntos -= 2;
            this.jugadores.gatoB.texto?.setText(" " + this.jugadores.gatoB.puntos);
        }

        // ⚙️ Estado sincronizado (opcional, para resync completo)
        const jugadorKey = this.isHost ? 'gatoA' : 'gatoB';
        const jugador = this.jugadores[jugadorKey];

        const estado = {
            type: "state",
            playerId: jugador.id,
            ready: jugador.ready || false,
            x: jugador.sprite.x,
            y: jugador.sprite.y,
            pescar: jugador.pescar || false,
            animacionGato: jugador.animacion || null,
            Time: this.timeLeft,
            xPez: this.pezX,
            yPez: this.pezY,
            pezTipo: this.tipoPez,
            animacionPez: this.pezAnims,
            pezGloboExplotando: this.explosionPezGlobo,
            pezGloboCapturado: jugador.pezGloboCapturado || false,
            pezGloboLanzado: jugador.lanzarPezGlobo || false,
            jugadorParalizado: jugador.paralizado || false,
            jugadorExplosion: jugador.explosion || false,
            inventario: jugador.inventario || 0,
            inventarioAbierto: jugador.inventarioAbierto || false,
            puntos: jugador.puntos || 0,
            hasCollidedFish: jugador.colision || false,
            ganado: jugador.ganado || false,
            perdido: jugador.perdido || false,
            pause: jugador.pause || false,
            desconectado: jugador.desconectado || false,
            map: this.isHost ? mapa1 : mapa2,
            pecesGenerados: this.pecesGenerados || []
        };

        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(estado));
        }
    });
}


/**
 * Determina el jugador ganador y envía el estado final por WebSocket.
 */
infoGanador() {
    const jugadorA = this.jugadores.gatoA;
    const jugadorB = this.jugadores.gatoB;

    if (!jugadorA || !jugadorB) {
        console.error("❌ Error: jugadorA o jugadorB no están definidos.");
        return;
    }

    // Comparar puntuaciones y establecer estados
    if (jugadorA.puntos > jugadorB.puntos) {
        jugadorA.ganado = true;
        jugadorA.perdido = false;
        jugadorB.ganado = false;
        jugadorB.perdido = true;
    } else if (jugadorB.puntos > jugadorA.puntos) {
        jugadorA.ganado = false;
        jugadorA.perdido = true;
        jugadorB.ganado = true;
        jugadorB.perdido = false;
    } else {
        jugadorA.ganado = true;
        jugadorA.perdido = false;
        jugadorB.ganado = true;
        jugadorB.perdido = false;
    }

    // Enviar estado final del jugador local (host o no)
    const jugadorKey = this.isHost ? 'gatoA' : 'gatoB';
    const jugador = this.jugadores[jugadorKey];

    const data = {
        type: "state",
        playerId: jugador.id,
        ready: jugador.ready || false,
        x: jugador.sprite?.x || jugador.x,
        y: jugador.sprite?.y || jugador.y,
        pescar: jugador.pescar || false,
        animacionGato: jugador.animacion || null,
        Time: this.timeLeft || 0,
        xPez: this.pezX,
        yPez: this.pezY,
        pezTipo: this.tipoPez,
        animacionPez: this.pezAnims,
        pezGloboExplotando: this.explosionPezGlobo,
        pezGloboCapturado: jugador.pezGloboCapturado || false,
        pezGloboLanzado: jugador.lanzarPezGlobo || false,
        jugadorParalizado: jugador.paralizado || false,
        jugadorExplosion: jugador.explosion || false,
        inventario: jugador.inventario || 0,
        inventarioAbierto: jugador.inventarioAbierto || false,
        puntos: jugador.puntos || 0,
        hasCollidedFish: jugador.colision || false,
        ganado: jugador.ganado,
        perdido: jugador.perdido,
        pause: jugador.pause || false,
        desconectado: jugador.desconectado || false,
        map: this.isHost ? mapa1 : mapa2,
        pecesGenerados: this.pecesGenerados || []
    };

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify(data));
        console.log("📤 Estado final enviado:", data);
    } else {
        console.warn("⚠️ WebSocket no conectado. No se pudo enviar estado final.");
    }
}

} 