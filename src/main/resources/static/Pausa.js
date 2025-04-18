class PauseMenu extends Phaser.Scene {
    constructor() {
        super('PauseMenu');
    }

    init(data) {
        this.escenaPrevia = data.escenaPrevia; // Guardar el nombre de la escena en pausa
    }
    preload() {
        // Cargar imágenes necesarias
        this.load.image('Pause_fondo', 'assets/pausa/fondo_pausa.png'); // Fondo del menú
        this.load.image('Boton_volver_normal', 'assets/pausa/volver/normal.png');
        this.load.image('Boton_volver_encima', 'assets/pausa/volver/seleccionado.png');
        this.load.image('Boton_volver_pulsado', 'assets/pausa/volver/pulsado.png');

        // Cargar imágenes de la barra de volumen
        this.load.image('Barra_volumen', 'assets/pausa/barra.png');
        this.load.image('Control_deslizador', 'assets/pausa/handler_barra.png');

        this.load.audio("sonidoBoton", "assets/musica/SonidoBoton.mp3");
    }

    create() {
        // Fondo del menú de pausa
        this.add.image(600, 400, 'Pause_fondo').setScale(0.75);

        const sonidoBoton= this.sound.add("sonidoBoton", { loop: false, volume: 0.5 });

        //Texto Volumen
        this.add.text(535, 400, 'Volumen', {
            font: 'bold 34px Arial',
            color: '#313473',
            align: 'center',
        }).setOrigin(0.03);

        // Crear barra de volumen
        const barraVolumen = this.add.image(600, 450, 'Barra_volumen').setScale(0.8);
        const deslizador = this.add.image(700, 480, 'Control_deslizador').setInteractive();

        // Configuración de volumen
        let volumenActual = this.sound.volume;
        this.input.setDraggable(deslizador);

        deslizador.on('drag', (pointer, dragX) => {
            const minX = barraVolumen.x - barraVolumen.width / 4 + deslizador.width / 4;
            const maxX = barraVolumen.x + barraVolumen.width / 4 - deslizador.width / 4;

            if (dragX >= minX && dragX <= maxX) {
                deslizador.x = dragX;
                const porcentaje = (dragX - minX) / (maxX - minX);
                volumenActual = porcentaje;
                this.sound.setVolume(volumenActual);
            }
        });

        // Botón para reanudar el juego
        const botonVolver = this.add.image(600, 600, 'Boton_volver_normal').setInteractive().setScale(0.8);

        botonVolver.on('pointerover', () => {
            botonVolver.setTexture('Boton_volver_encima');
        });
        
        botonVolver.on('pointerout', () => {
            botonVolver.setTexture('Boton_volver_normal');
        });
        
        botonVolver.on('pointerdown', () => {
            botonVolver.setTexture('Boton_volver_pulsado');
            sonidoBoton.play();
        });
        
        botonVolver.on('pointerup', () => {
            botonVolver.setTexture('Boton_volver_normal');
            sonidoBoton.play();
        
            const jugadorId = this.registry.get('jugadorId');
            if (jugadorId) {
                this.registry.set('yoHeDadoAVolver', true);
                this.registry.get('socket').send('v' + jugadorId); // ← ENVÍA SOLO EL ID
            }

        });
        
        
    }
}