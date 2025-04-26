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

class Partidas extends Phaser.Scene {
    constructor() {
        super('partida');

        // === WebSocket ===
        /** @type {WebSocket|null} */
        this.socket = null;
    }
  
    preload() {
      // Cargar recursos como imágenes y sonidos aquí
      this.load.image('Boton_atras_normal', 'assets/Interfaces montadas/volver/normal.png');
      this.load.image('Boton_atras_encima', 'assets/Interfaces montadas/volver/seleccionado.png');
      this.load.image('Boton_atras_pulsado', 'assets/Interfaces montadas/volver/pulsado.png');

      this.load.image("CrearPartida_normal","assets/Pantalla_inicio/Partida/normal.png")
      this.load.image("CrearPartida_seleccionado","assets/Pantalla_inicio/Partida/seleccionado.png")
      this.load.image("CrearPartida_presionado","assets/Pantalla_inicio/Partida/pulsado.png")

      this.load.image("Unirse_normal","assets/Pantalla_inicio/Unirse/normal.png")
      this.load.image("Unirse_seleccionado","assets/Pantalla_inicio/Unirse/seleccionado.png")
      this.load.image("Unirse_presionado","assets/Pantalla_inicio/Unirse/pulsado.png")

      this.load.image("Buscar_normal","assets/Pantalla_inicio/BuscarP/normal.png")
      this.load.image("Buscar_seleccionado","assets/Pantalla_inicio/BuscarP/seleccionado.png")
      this.load.image("Buscar_presionado","assets/Pantalla_inicio/BuscarP/pulsado.png")

      this.load.audio("sonidoBoton", "assets/musica/SonidoBoton.mp3");
      this.load.audio("Sonido", "assets/musica/MenuPrincipal.mp3");

    }
  
    create() {

        // Crear WebSocket solo si no existe ya
        if (!this.registry.has("socket")) {
        const socket = new WebSocket("ws://localhost:8080/ws");
        this.registry.set("socket", socket);

        this.setupWebSocket();
        
        }
      
      //this.add.text(300, 200, 'Iniciar Sesión', { fontSize: '32px', color: '#fff' });
      const background = this.add.image(config.width / 2, config.height / 2, 'fondo');
      background.setScale(config.width / background.width, config.height / background.height); // Escalar fondo

      //Musica
      this.sonido = this.sound.add("Sonido", { loop: true, volume: 0.8 });
      this.sonido.play();
      const sonidoBoton = this.sound.add("sonidoBoton", { loop: false, volume: 0.5 });

    const botonBuscarP = this.add.image(config.width / 2, 330, 'Buscar_normal')
        .setInteractive() //Hacerlo interactivo
        .setScale(0.6) // Escalado del boton

        //Insercion de los diferentes diseños de los botones segun la condicion
        .on('pointerover', () => botonBuscarP.setTexture('Buscar_seleccionado'))
        .on('pointerout', () => botonBuscarP.setTexture('Buscar_normal'))
        .on('pointerdown', () => botonBuscarP.setTexture('Buscar_presionado'))
        .on('pointerup', () => {
            botonBuscarP.setTexture('Buscar_normal');
            sonidoBoton.play();

            this.scene.start('MapaOnline');
            
        });

    const botonCrear = this.add.image(config.width / 2, 430, 'CrearPartida_normal')
        .setInteractive() //Hacerlo interactivo
        .setScale(0.6) // Escalado del boton

        //Insercion de los diferentes diseños de los botones segun la condicion
        .on('pointerover', () => botonCrear.setTexture('CrearPartida_seleccionado'))
        .on('pointerout', () => botonCrear.setTexture('CrearPartida_normal'))
        .on('pointerdown', () => botonCrear.setTexture('CrearPartida_presionado'))
        .on('pointerup', () => {
            botonCrear.setTexture('CrearPartida_normal');
            sonidoBoton.play();
            this.scene.start('mapaSalaPriv');
        });

    // Botón de "Online"
    const botonUnirse = this.add.image(config.width / 2, 530, 'Unirse_normal')
        .setInteractive() //Hacerlo interactivo
        .setScale(0.6) // Escalado del boton

        //Insercion de los diferentes diseños de los botones segun la condicion
        .on('pointerover', () => botonUnirse.setTexture('Unirse_seleccionado'))
        .on('pointerout', () => botonUnirse.setTexture('Unirse_normal'))
        .on('pointerdown', () => botonUnirse.setTexture('Unirse_presionado'))
        .on('pointerup', () => {
            botonUnirse.setTexture('Unirse_normal');
            sonidoBoton.play();
        
        });

         // BOTÓN DE RETROCEDER
        const backButton = this.add.image(0, 700, 'Boton_atras_normal')
        .setOrigin(0, 1)
        .setInteractive()
        .setScale(0.7);

        backButton.on('pointerover', () => {
            backButton.setTexture('Boton_atras_encima');
        });

        backButton.on('pointerout', () => {
            backButton.setTexture('Boton_atras_normal');
        });

        backButton.on('pointerdown', () => {
            backButton.setTexture('Boton_atras_pulsado');
        });

        backButton.on('pointerup', async () => {
            backButton.setTexture('Boton_atras_normal');
            this.scene.start('MenuPrincipal');
            
        });

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

    async checkServerStatus() {
        try {
            const response = await fetch('/api/users/status');
            const status = await response.text();
    
            if (this.botonServer) {
                this.botonServer.setTexture(status === "active" ? "botonConectado" : "botonDesconectado");
            }
        } catch (error) {
            console.error('Error al verificar el estado del servidor:', error);
            if (this.botonServer) {
                this.botonServer.setTexture("botonDesconectado");
            }
            this.scene.start('MenuPrincipal');
        }
    }
}