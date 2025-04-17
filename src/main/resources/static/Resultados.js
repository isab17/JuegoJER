class ResultScreen extends Phaser.Scene {
    constructor() {
        super('ResultScreen');
    }

    preload() {
        // Cargar fondos para victoria y empate dependiendo del gato
        this.load.image('fondo_victoria_gatoA', 'assets/victoria_derrota_empate/victoria_derrota_1.png');
        this.load.image('fondo_victoria_gatoB', 'assets/victoria_derrota_empate/victoria_derrota_2.png');

        // Fondo de empate
        this.load.image('fondo_empate', 'assets/victoria_derrota_empate/empate.png');

        // Botones
        this.load.image('Boton_continuar_normal', 'assets/Interfaces montadas/continuar/normal.png');
        this.load.image('Boton_continuar_encima', 'assets/Interfaces montadas/continuar/seleccionado.png');
        this.load.image('Boton_continuar_pulsado', 'assets/Interfaces montadas/continuar/pulsado.png');
    }

    create() {
        // Variables globales de puntuación
        const puntuacionA = this.registry.get('puntuacionA') || 0;
        const puntuacionB = this.registry.get('puntuacionB') || 0;

        let fondoKey = '';
        let mensaje = '';

        // Determinar el resultado y el fondo correspondiente
        if (puntosA > puntosB) {
            fondoKey = 'fondo_victoria_gatoA';  // Gato A gana
            mensaje = '¡Gato A gana!';
        } else if (puntosA < puntosB) {
            fondoKey = 'fondo_victoria_gatoB';  // Gato B gana
            mensaje = '¡Gato B gana!';
        } else {
            fondoKey = 'fondo_empate';  // Empate
            mensaje = '¡Es un empate!';
        }

        // Asignar fondo correspondiente
        this.add.image(370, 200, fondoKey).setOrigin(0.29).setScale(0.75);

        // Mostrar mensaje
        this.add.text(650, 50, mensaje, {
            font: '45px Arial',
            color: '#000000',
        }).setOrigin(0.5);

        // Mostrar puntuaciones
        this.add.text(200, 100, `Gato A: ${puntosA}\nGato B: ${puntosB}`, {
            font: '45px Arial',
            color: '#000000',
            align: 'center',
        }).setOrigin(0.5);

        // Botón para volver al inicio del juego
        // Botón de continuar
        const nextButton = this.add.image(1200, 700, 'Boton_continuar_normal').setOrigin(1, 1).setInteractive().setScale(0.7)
        nextButton.on('pointerover', () => {
            nextButton.setTexture('Boton_continuar_encima');
        });

        nextButton.on('pointerout', () => {
            nextButton.setTexture('Boton_continuar_normal');
        });

        nextButton.on('pointerdown', () => {
            nextButton.setTexture('Boton_continuar_pulsado');
        });

        nextButton.on('pointerup', () => {
            nextButton.setTexture('Boton_continuar_normal');
            this.scene.start('MenuPrincipal'); // Vuelve al menú principal
        });
    }
} 
