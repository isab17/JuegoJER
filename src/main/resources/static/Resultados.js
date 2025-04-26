class ResultScreen extends Phaser.Scene {
    constructor() {
        super('ResultScreen');
    }

    preload() {
        this.load.image('fondo_victoria_gatoA', 'assets/victoria_derrota_empate/victoria_derrota_1.png');
        this.load.image('fondo_victoria_gatoB', 'assets/victoria_derrota_empate/victoria_derrota_2.png');
        this.load.image('fondo_empate', 'assets/victoria_derrota_empate/empate.png');

        this.load.image('Boton_continuar_normal', 'assets/Interfaces montadas/continuar/normal.png');
        this.load.image('Boton_continuar_encima', 'assets/Interfaces montadas/continuar/seleccionado.png');
        this.load.image('Boton_continuar_pulsado', 'assets/Interfaces montadas/continuar/pulsado.png');

        this.load.image('CaraGatoA', 'assets/inventario/Menta.png');
        this.load.image('CaraGatoB', 'assets/inventario/Chocolate.png');
    }

    create() {
        const puntosA = this.registry.get('puntuacionA') || 0;
        const puntosB = this.registry.get('puntuacionB') || 0;
        const esGanador = this.registry.get('esGanador');
        const esEmpate = this.registry.get('esEmpate');
        const jugadorId = this.registry.get('jugadorId');

            const finPorDesconexion = this.registry.get('finPorDesconexion');
            console.log("🏁 Resultado por desconexión:", finPorDesconexion);
        
            if (finPorDesconexion) {
                this.add.text(this.cameras.main.centerX, 40, "Fin de la partida por desconexión del jugador", {
                    font: "28px Arial Black",
                    color: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 4,
                    align: "center"
                }).setOrigin(0.5);
            }

        let fondoKey = '';
        let mensaje = '';

        if (esEmpate) {
            fondoKey = 'fondo_empate';
            mensaje = '¡Es un empate!';
        } else if (esGanador) {
            fondoKey = jugadorId === 1 ? 'fondo_victoria_gatoA' : 'fondo_victoria_gatoB';
            mensaje = '¡Has ganado!';
        } else {
            fondoKey = jugadorId === 1 ? 'fondo_victoria_gatoB' : 'fondo_victoria_gatoA';
            mensaje = '¡Has perdido!';
        }

        // Fondo
        this.add.image(370, 200, fondoKey).setOrigin(0.29).setScale(0.75);

        // Mensaje principal
        this.add.text(650, 630, mensaje, {
            font: '48px Arial',
            color: '#FFFFFF',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6,
        }).setOrigin(0.5);

        // Caras de gato
        const caraGatoA = this.add.image(300, 690, 'CaraGatoA');
        caraGatoA.setScale(0.1, 0.1);
        caraGatoA.setOrigin(0.5);

        const textoPuntosA = this.add.text(370, 690, `${puntosA}`, {
            font: '48px Arial',
            color: '#FFFFFF',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6,
        }).setOrigin(0.5);

        // Separador
        this.add.text(650, 690, '|', {
            font: '48px Arial',
            color: '#FFFFFF',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6,
        }).setOrigin(0.5);

        // Caras de gato
        const caraGatoB = this.add.image(930, 690, 'CaraGatoB');
        caraGatoB.setScale(0.1, 0.1);
        caraGatoB.setOrigin(0.5);

        const textoPuntosB = this.add.text(860, 690, `${puntosB}`, {
            font: '48px Arial',
            color: '#FFFFFF',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6,
        }).setOrigin(0.5);


        // Botón para volver al menú
        const nextButton = this.add.image(1200, 700, 'Boton_continuar_normal')
            .setOrigin(1, 1)
            .setInteractive()
            .setScale(0.7);

        nextButton.on('pointerover', () => nextButton.setTexture('Boton_continuar_encima'));
        nextButton.on('pointerout', () => nextButton.setTexture('Boton_continuar_normal'));
        nextButton.on('pointerdown', () => nextButton.setTexture('Boton_continuar_pulsado'));
        nextButton.on('pointerup', () => {
            nextButton.setTexture('Boton_continuar_normal');
            this.scene.start('MenuPrincipal');
        });

        if (finPorDesconexion) {
            this.add.text(config.width / 2, 40, "Fin de la partida por desconexión del jugador", {
                font: "28px Arial Black",
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 4,
                align: "center"
            }).setOrigin(0.5).setDepth(10);
            this.registry.set('finPorDesconexion', false);

        }

    }
}
