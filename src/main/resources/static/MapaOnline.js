/**
 * Message types used for WebSocket communication.
 * These short codes optimizan el tamaño del mensaje para velocidad.
 * Usar estos tipos en cliente y servidor asegura consistencia.
 *
 * @enum {string}
 */
const MSG_TYPES = ({
    INIT:       'i', // Inicializa el estado del juego
    POS:        'p', // Actualiza posición y animación del jugador
    COLLECT:    'c', // Evento de captura de pez
    TIME:       't', // Actualización del temporizador
    OVER:       'o', // Fin del juego (game over)
    STATE:      's', // Estado completo sincronizado (respaldo)
    THROW:      'f', // Lanzamiento de pez globo
    DISCONNECT: 'u', // Jugador desconectado
    RECONNECT:  'r', // Jugador reconectado
    FISH_SPAWN: 'g',  // Peces generados por pesca
    EXPLODE_PEZGLOBO: 'x', //Explosion pez globo
    KEEP_ALIVE: 'k', //Mantener viva la sesion
    MAPASELECCIONADO: 'm',
    PAUSE_SYNC: 'z', //Pausar juego
    RESUME_REQUEST: 'v' // Solicitud de reanudar el juego

});

class MapaOnline extends Phaser.Scene {
    constructor() {
        super({ key: "MapaOnline" });

        // === WebSocket ===
        /** @type {WebSocket|null} */
        this.socket = null;

    }

    preload() {
        this.load.image("Mapa_fondo", "assets/Mapas/fondo.png");

        this.load.image("Boton_atras_normal", "assets/Interfaces montadas/volver/normal.png");
        this.load.image("Boton_atras_encima", "assets/Interfaces montadas/volver/seleccionado.png");
        this.load.image("Boton_atras_pulsado", "assets/Interfaces montadas/volver/pulsado.png");

        this.load.image("Descampado_normal", "assets/Mapas/mapas_botones/Descampado/normal.png");
        this.load.image("Descampado_seleccionado", "assets/Mapas/mapas_botones/Descampado/seleccion.png");
        this.load.image("Descampado_presionado", "assets/Mapas/mapas_botones/Descampado/pulsado.png");

        this.load.image("JuegoMesa_normal", "assets/Mapas/mapas_botones/Juego_de_mesa/normal.png");
        this.load.image("JuegoMesa_seleccionado", "assets/Mapas/mapas_botones/Juego_de_mesa/seleccionado.png");
        this.load.image("JuegoMesa_presionado", "assets/Mapas/mapas_botones/Juego_de_mesa/pulsado.png");

        this.load.image("Vortice_normal", "assets/Mapas/mapas_botones/Vortice/Vortice_normal.png");
        this.load.image("Vortice_seleccionado", "assets/Mapas/mapas_botones/Vortice/Vortice_seleccionado.png");
        this.load.image("Vortice_presionado", "assets/Mapas/mapas_botones/Vortice/Vortice_presionado.png");

        this.load.image("CaraGatoA", "assets/inventario/Menta.png");
        this.load.image("CaraGatoB", "assets/inventario/Chocolate.png");

        this.load.spritesheet("gatoA", "assets/sprites/gatoA.png", { frameWidth: 280, frameHeight: 600 });
        this.load.spritesheet("gatoB", "assets/sprites/gatoB.png", { frameWidth: 280, frameHeight: 600 });

        this.load.image("botonConectado", "assets/Pantalla_inicio/iconos/conectado.png");
        this.load.image("botonDesconectado", "assets/Pantalla_inicio/iconos/desconectado.png");
    }

    create() {
        
        // Crear WebSocket solo si no existe ya
        if (!this.registry.has("socket")) {
        const socket = new WebSocket("ws://localhost:8080/ws");
        this.registry.set("socket", socket);

        this.setupWebSocket();

        }

        const fondo = this.add.image(this.scale.width / 2, this.scale.height / 2, "Mapa_fondo");
        fondo.setScale(
            Math.max(this.scale.width / fondo.width, this.scale.height / fondo.height)
        );

        const texto = this.add.text(390, 50, "TU PERSONAJE ES:", { font: "30px Arial Black" });
        this.botonServer = this.add.image(config.width - 70, 50, "botonDesconectado").setScale(0.04);


        // Ocultar gatos hasta cambiar de escena
        gatoA = this.physics.add.sprite(200, 620, 'gatoA');
        gatoA.setVisible(false);

        gatoB = this.physics.add.sprite(1090, 160, 'gatoB');
        gatoB.setVisible(false);

        this.crearBotonMapa('Descampado', 1, config.width / 6, config.height / 2);
        this.crearBotonMapa('JuegoMesa', 2, config.width / 2, config.height / 2);
        this.crearBotonMapa('Vortice', 3, this.scale.width * 0.85, this.scale.height * 0.52, -90, 0.2);


        this.checkServerStatus();

        this.time.addEvent({
            delay: 5000,
            callback: this.checkServerStatus,
            callbackScope: this,
            loop: true,
        });
    }
    setupWebSocket() {
        this.socket = this.registry.get("socket");
    
        this.socket.onopen = () => {
            console.log('✅ Conectado al servidor WebSocket');
            this.socketListo = true;
        };
    
        this.socket.onmessage = (event) => {
            const type = event.data.charAt(0);
            const data = event.data.length > 1 ? JSON.parse(event.data.substring(1)) : null;
        
            switch (type) {
                case 'm': // mapa confirmado por servidor
                    console.log("🗺️ Recibido mensaje 'm':", data);
                    this.mapaConfirmado = data?.mapa;
                    break;
        
                case 'i': // INIT del juego
                    console.log("✅ Recibido INIT:", data);
                    if (!data?.id) {
                        console.error("❌ INIT sin ID de jugador válido:", data);
                        return;
                    }
                
                    this.registry.set('jugadorId', data.id);
                    this.registry.set('socket', this.socket);
                    this.registry.set('initData', data); 
                
                    if (this.mapaConfirmado) {
                        this.scene.start('GameOnline1');
                    }
                    break;
                
            }
        };
        
        
    
        this.socket.onclose = () => {
            console.warn("⚠️ Conexión cerrada desde MapaOnline");
        };
    }
    
    
    
    crearBotonMapa(nombre, id, x, y, rotacion = 0, escala = 0.7) {
        const normal = `${nombre}_normal`;
        const seleccionado = `${nombre}_seleccionado`;
        const presionado = `${nombre}_presionado`;
    
        const btn = this.add.image(x, y, normal).setInteractive().setScale(escala);
        btn.setInteractive({ useHandCursor: true }).disableInteractive();

        btn.angle = rotacion;
    
        btn.on('pointerover', () => btn.setTexture(seleccionado));
        btn.on('pointerout', () => btn.setTexture(normal));
        btn.on('pointerdown', () => {
            btn.setTexture(presionado);
            this.seleccionarMapa(id);
        });
        btn.on('pointerup', () => {
            btn.setTexture(normal);
        });

        this.time.addEvent({
            delay: 100, // comprueba cada 100ms
            loop: true,
            callback: () => {
                if (this.socketListo) {
                    this.children.list.forEach(obj => {
                        if (obj.input && obj.texture && obj.texture.key.includes("_normal")) {
                            obj.setInteractive();
                        }
                    });
                }
            }
        });
        
    }
    

    seleccionarMapa(id) {
        const socket = this.registry.get("socket");
    
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            console.warn("❌ No se puede enviar mapa: socket no conectado aún.");
            return;
        }
    
        socket.send("m" + JSON.stringify({ mapa: id }));
    
        this.add.text(390, 650, "Esperando al otro jugador...", { font: "30px Arial Black" });
    }
    
    
    async checkServerStatus() {
        try {
            const response = await fetch('/api/users/status');
            const status = await response.text();

            if (status === "active") {
                this.botonServer.setTexture("botonConectado");
            } else {
                this.botonServer.setTexture("botonDesconectado");
            }
        } catch (error) {
            console.error('Error al verificar el estado del servidor:', error);
            this.botonServer.setTexture("botonDesconectado");
            this.scene.start('MenuPrincipal');
        }
    }
}