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
        this.load.image("Local_normal","assets/Pantalla_inicio/Local/normal.png")
        this.load.image("Local_seleccionado","assets/Pantalla_inicio/Local/seleccionado.png")
        this.load.image("Local_presionado","assets/Pantalla_inicio/Local/presionado.png")

        this.load.image("Online_normal","assets/Pantalla_inicio/Online/normal.png")
        this.load.image("Online_seleccionado","assets/Pantalla_inicio/Online/seleccionado.png")
        this.load.image("Online_presionado","assets/Pantalla_inicio/Online/presionado.png")
        this.load.image("Online_bloqueado","assets/Pantalla_inicio/Online/bloqueado.png")

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
        // Fondo del menú
        const background = this.add.image(config.width / 2, config.height / 2, 'fondo');
        background.setScale(config.width / background.width, config.height / background.height); // Escalar fondo

        //Musica
        this.sonido = this.sound.add("Sonido", { loop: true, volume: 0.8 });
        this.sonido.play();
        const sonidoBoton = this.sound.add("sonidoBoton", { loop: false, volume: 0.5 });

        this.botonServer = this.add.image(config.width - 50, 50, "botonDesconectado").setScale(0.05);
        // Crear texto para mostrar usuarios conectados
        this.connectedUsersText = this.add.text(10, 10, "Usuarios conectados:", {
            font: "16px Arial",
            fill: "#ffffff",
        });
        this.connectedUsersText.setPosition(20, 20);
        const botonLocal = this.add.image(config.width / 2, 250, 'Local_normal').setInteractive().setScale(0.6)
            .on('pointerover', () => botonLocal.setTexture('Local_seleccionado'))
            .on('pointerout', () => botonLocal.setTexture('Local_normal'))
            .on('pointerdown', () => botonLocal.setTexture('Local_presionado'))
            .on('pointerup', () => {
                botonLocal.setTexture('Local_normal');
                sonidoBoton.play();
                this.scene.start('Mapas');
            });
        this.botonOnline = this.add.image(config.width / 2, 350, 'Online_normal').setInteractive().setScale(0.6)
            .on('pointerover', () => this.botonOnline.setTexture('Online_seleccionado'))
            .on('pointerout', () => this.botonOnline.setTexture('Online_normal'))
            .on('pointerdown', () => this.botonOnline.setTexture('Online_presionado'))
            .on('pointerup', () => {
                if (this.serverActive) {
                    this.botonOnline.setTexture('Online_normal');
                    sonidoBoton.play();
                    this.scene.start('partida');
                }
            });
        

        const botonTutorial = this.add.image(config.width / 2, 450, 'botonTutorialNormal').setInteractive().setScale(0.6)
            .on('pointerover', () => botonTutorial.setTexture('botonTutorialEncima'))
            .on('pointerout', () => botonTutorial.setTexture('botonTutorialNormal'))
            .on('pointerdown', () => botonTutorial.setTexture('botonTutorialPulsado'))
            .on('pointerup', () => {
                botonTutorial.setTexture('botonTutorialNormal');
                sonidoBoton.play();
                this.scene.start('TutorialScene1');
            });

        const botonCreditos = this.add.image(config.width / 2, 550, 'botonCreditosNormal').setInteractive().setScale(0.6)
            .on('pointerover', () => botonCreditos.setTexture('botonCreditosEncima'))
            .on('pointerout', () => botonCreditos.setTexture('botonCreditosNormal'))
            .on('pointerdown', () => botonCreditos.setTexture('botonCreditosPulsado'))
            .on('pointerup', () => {
                botonCreditos.setTexture('botonCreditosNormal');
                sonidoBoton.play();
                this.scene.start('creditos');
            });

        const botonSalir = this.add.image(config.width / 2, 650, 'botonSalirNormal').setInteractive().setScale(0.6)
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

        this.checkServerStatus();

        //Registrar actividad del usuario
        this.time.addEvent({
            delay:5000,
            callback:this.keepAlive,
            callbackScope:this,
                loop: true
        })
        // Consultar usuarios conectados
        this.time.addEvent({
            delay: 5000,
            callback: this.updateConnectedUsers,
            callbackScope: this,
            loop: true,
        });

        // Verificar estado del servidor
        this.time.addEvent({
            delay: 5000,
            callback: this.checkServerStatus,
            callbackScope: this,
            loop: true,
        });

        // Listener para detener el bucle cuando la pestaña no está visible
        window.addEventListener("beforeunload", (event) => {
            // Mostrar un mensaje genérico de confirmación
            event.preventDefault(); // Esto activa el mensaje de confirmación del navegador
        
            // Registrar un evento para capturar la respuesta del usuario
            setTimeout(() => {
                if (event.defaultPrevented) {
                    // Si el usuario decide cerrar la pestaña
                    this.disconnectedUser();
                }
            }, 0);
        });
    }

    async keepAlive(){
        fetch('/api/users/seen',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username:this.username
            })
        })
        .then(response=>{
            if(!response.ok){
                throw new Error('Network response was not ok');
            }
        })
        .catch(error => console.error('Error:', error));
    }

    async disconnectedUser(){
        fetch('/api/users/disconnect',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username:this.username })
        })
        .then(response=>{
            if(!response.ok){
                throw new Error('Network response was not ok');
            }
        })
        .catch(error => console.error('Error:', error));
    }
    
    async updateConnectedUsers() {
        const threshold = Date.now() - this.threshold;
        console.log(threshold.toString());
        fetch(`/api/users/connected-since/${threshold}`)
            .then(response => response.json())
            .then(data => {
                data.shift();
                this.connectedUsers = data;
                console.log(data);
                this.connectedUsersText.setText("Usuarios conectados:\n" + this.connectedUsers.join("\n"));
            })
            .catch(error => console.error('Error al obtener usuarios conectados:', error));
    }

    async checkServerStatus() {
        fetch('/api/users/status')
            .then(response => {
                if (!response.ok) {
                    throw new Error('El servidor no está activo');
                }
                return response.text();
            })
            .then(status => {
                if (status === "active") {
                    this.serverActive = true;
                    this.botonServer.setTexture("botonConectado");
                }
            })
            .catch(error => {
                console.error('Error al verificar el estado del servidor:', error);
                this.serverActive = false;
                this.botonServer.setTexture("botonDesconectado");
                this.botonOnline.setTexture("Online_bloqueado");
                this.botonOnline.disableInteractive();
            });
    }
}