// Escena 3 del tutorial
class TutorialScene3 extends Phaser.Scene {
    constructor() {
        super({key: "TutorialScene3"});
    }

    preload() {
        // Carga las imágenes que usarás en el tutorial
        this.load.image('Tutorial_fondo', 'assets/Interfaces montadas/fondo_x.png');

        this.load.image('Escenario1', 'assets/Escenario/Zonas de Pesca/Escenario 1 Zona de Pesca.png');
        this.load.image('Escenario2', 'assets/Escenario2/Zonas de Pesca/Escenario 2 Zonas de Pesca.png');

        // Botones con 3 estados
        this.load.image('Boton_continuar_normal', 'assets/Interfaces montadas/continuar/normal.png');
        this.load.image('Boton_continuar_encima', 'assets/Interfaces montadas/continuar/seleccionado.png');
        this.load.image('Boton_continuar_pulsado', 'assets/Interfaces montadas/continuar/pulsado.png');

        this.load.image('Boton_atras_normal', 'assets/Interfaces montadas/volver/normal.png');
        this.load.image('Boton_atras_encima', 'assets/Interfaces montadas/volver/seleccionado.png');
        this.load.image('Boton_atras_pulsado', 'assets/Interfaces montadas/volver/pulsado.png');

        this.load.audio("sonidoBoton", "assets/musica/SonidoBoton.mp3");
    }

    create() {
        // Fondo del tutorial
        this.add.image(400, 300, 'Tutorial_fondo');

        //Sonido botones
        const sonidoBoton= this.sound.add("sonidoBoton", { loop: false, volume: 0.5 });

        // Título
        this.add.text(620, 100, 'Zonas de Pesca', {
            font: 'bold 80px Gabriola',
            color: '#000000'
        }).setOrigin(0.5);

        //Escenarios
        const Escenario1 = this.add.image(300 , 350, 'Escenario1');
        Escenario1.setScale(0.3);
        const Escenario2 = this.add.image(900, 350, 'Escenario2');
        Escenario2.setScale(0.3);

        // Texto central
        this.add.text(300, 550, 'Para pescar, debes colocarte en las zonas destacadas\ny pulsar la respectiva tecla', {
            font: 'bold 24px Arial',
            color: '#000000',
            align: 'center',
        }).setOrigin(0.03);

        // Botón de retroceder en la esquina inferior izquierda
        const backButton = this.add.image(0, 700, 'Boton_atras_normal').setOrigin(0, 1).setInteractive().setScale(0.7);

        backButton.on('pointerover', () => {
            backButton.setTexture('Boton_atras_encima');
        });

        backButton.on('pointerout', () => {
            backButton.setTexture('Boton_atras_normal');
        });

        backButton.on('pointerdown', () => {
            backButton.setTexture('Boton_atras_pulsado');
        });

        backButton.on('pointerup', () => {
            backButton.setTexture('Boton_atras_normal');
            sonidoBoton.play();
            this.scene.start('TutorialScene2');
        });

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
            sonidoBoton.play();
            this.scene.start('MenuPrincipal');
        });
    }
}