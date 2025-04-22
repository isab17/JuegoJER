class MenuPrincipal extends Phaser.Scene {
    constructor() {
        super( {key: "MenuPrincipal"});
        this.connectedUsers = [];
        this.serverActive = false;
        this.threshold = 5000;
        this.connectedUsersText="";
    }

    // Función preload para cargar recursos antes de iniciar el juego
    preload() {
        this.load.image("fondo", "assets/Pantalla_inicio/fondo_inicio.png"); // Fondo del menú

        // Botones con tres imágenes para cada uno: normal, seleccionado y pulsado
        this.load.image("botonInicioNormal", "assets/Pantalla_inicio/jugar/Normal.png");
        this.load.image("botonInicioEncima", "assets/Pantalla_inicio/jugar/Seleccionado.png");
        this.load.image("botonInicioPulsado", "assets/Pantalla_inicio/jugar/pulsado.png");

        this.load.image("botonTutorialNormal", "assets/Pantalla_inicio/Tutorial/Normal.png");
        this.load.image("botonTutorialEncima", "assets/Pantalla_inicio/Tutorial/Seleccionado.png");
        this.load.image("botonTutorialPulsado", "assets/Pantalla_inicio/Tutorial/pulsado.png");

        this.load.image("botonCreditosNormal", "assets/Pantalla_inicio/Creditos/normal.png");
        this.load.image("botonCreditosEncima", "assets/Pantalla_inicio/Creditos/seleccionado.png");
        this.load.image("botonCreditosPulsado", "assets/Pantalla_inicio/Creditos/pulsado.png");

        this.load.image("botonSalirNormal", "assets/Pantalla_inicio/salir/normal.png");
        this.load.image("botonSalirEncima", "assets/Pantalla_inicio/salir/seleccionado.png");
        this.load.image("botonSalirPulsado", "assets/Pantalla_inicio/salir/pulsado.png");

        this.load.image("botonConectado", "assets/Pantalla_inicio/iconos/conectado.png");
        this.load.image("botonDesconectado", "assets/Pantalla_inicio/iconos/desconectado.png");
        this.load.image("botonChat", "assets/Pantalla_inicio/iconos/chat.png");


        this.load.audio("sonidoBoton", "assets/musica/SonidoBoton.mp3");
        this.load.audio("Sonido", "assets/musica/MenuPrincipal.mp3");
    }

    // Función create para inicializar objetos una vez que se han cargado los recursos
    create() {
        this.createUI();
        this.sonido = this.sound.add("Sonido", { loop: true, volume: 0.8 });
        this.sonido.play();

        this.time.addEvent({ delay: 5000, callback: this.keepAlive, callbackScope: this, loop: true });
        this.time.addEvent({ delay: 5000, callback: this.updateConnectedUsers, callbackScope: this, loop: true });
        this.time.addEvent({ delay: 5000, callback: this.checkServerStatus, callbackScope: this, loop: true });

        window.addEventListener("beforeunload", (event) => {
            event.preventDefault();
            setTimeout(() => {
                if (event.defaultPrevented) this.disconnectedUser();
            }, 0);
        });
    }

    createUI() {
        const background = this.add.image(config.width / 2, config.height / 2, 'fondo');
        background.setScale(config.width / background.width, config.height / background.height);

        this.connectedUsersText = this.add.text(20, 20, "Usuarios conectados:", { font: "16px Arial", fill: "#ffffff" });
        this.botonServer = this.add.image(config.width - 50, 50, "botonDesconectado").setScale(0.05);

        const sonidoBoton = this.sound.add("sonidoBoton", { loop: false, volume: 0.5 });

        const botonInicio = this.add.image(config.width / 2, 300, 'botonInicioNormal').setInteractive().setScale(0.5)
            .on('pointerover', () => botonInicio.setTexture('botonInicioEncima'))
            .on('pointerout', () => botonInicio.setTexture('botonInicioNormal'))
            .on('pointerdown', () => botonInicio.setTexture('botonInicioPulsado'))
            .on('pointerup', () => {
                botonInicio.setTexture('botonInicioNormal');
                sonidoBoton.play();
                this.scene.start('MapaOnline');
            });

        const botonTutorial = this.add.image(config.width / 2, 430, 'botonTutorialNormal').setInteractive().setScale(0.6)
            .on('pointerover', () => botonTutorial.setTexture('botonTutorialEncima'))
            .on('pointerout', () => botonTutorial.setTexture('botonTutorialNormal'))
            .on('pointerdown', () => botonTutorial.setTexture('botonTutorialPulsado'))
            .on('pointerup', () => {
                botonTutorial.setTexture('botonTutorialNormal');
                sonidoBoton.play();
                this.scene.start('TutorialScene1');
            });

        const botonCreditos = this.add.image(config.width / 2, 530, 'botonCreditosNormal').setInteractive().setScale(0.6)
            .on('pointerover', () => botonCreditos.setTexture('botonCreditosEncima'))
            .on('pointerout', () => botonCreditos.setTexture('botonCreditosNormal'))
            .on('pointerdown', () => botonCreditos.setTexture('botonCreditosPulsado'))
            .on('pointerup', () => {
                botonCreditos.setTexture('botonCreditosNormal');
                sonidoBoton.play();
                this.scene.start('creditos');
            });

        const botonSalir = this.add.image(config.width / 2, 630, 'botonSalirNormal').setInteractive().setScale(0.6)
            .on('pointerover', () => botonSalir.setTexture('botonSalirEncima'))
            .on('pointerout', () => botonSalir.setTexture('botonSalirNormal'))
            .on('pointerdown', () => botonSalir.setTexture('botonSalirPulsado'))
            .on('pointerup', () => {
                botonSalir.setTexture('botonSalirNormal');
                sonidoBoton.play();
                window.location.replace("https://www.google.com");
            });

        const botonChat = this.add.image(config.width / 4, 630, 'botonChat').setInteractive().setScale(0.05)
            .on('pointerup', () => {
                sonidoBoton.play();
                this.scene.start('Chat', { escenaPrevia: this.scene.key });
            });
    }

    update(time, delta) {}

    async keepAlive() {
        fetch('/api/users/seen', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: this.username })
        }).catch(error => console.error('Error:', error));
    }

    async disconnectedUser() {
        fetch('/api/users/disconnect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: this.username })
        }).catch(error => console.error('Error:', error));
    }

    async updateConnectedUsers() {
        const threshold = Date.now() - this.threshold;
        fetch(`/api/users/connected-since/${threshold}`)
            .then(response => response.json())
            .then(data => {
                data.shift();
                this.connectedUsers = data;
                if (this.connectedUsersText && this.connectedUsersText.setText) {
                    if (this.connectedUsersText?.setText) {
                        this.connectedUsersText.setText("Usuarios conectados:\n" + this.connectedUsers.join("\n"));
                    }
                    
                }
            })
            .catch(error => console.error('Error al obtener usuarios conectados:', error));
    }

    async checkServerStatus() {
        fetch('/api/users/status')
            .then(response => {
                if (!response.ok) throw new Error('El servidor no está activo');
                return response.text();
            })
            .then(status => {
                this.serverActive = status === "active";
                if (this.botonServer?.setTexture) {
                    this.botonServer.setTexture(this.serverActive ? "botonConectado" : "botonDesconectado");
                }
            })
            .catch(error => {
                console.error('Error al verificar el estado del servidor:', error);
                this.serverActive = false;
                if (this.botonServer?.setTexture) {
                    this.botonServer.setTexture("botonDesconectado");
                }
            });
            
    }
}