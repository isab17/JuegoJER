// Escena 2 del tutorial
class TutorialScene2 extends Phaser.Scene {
    constructor() {
        super({key: "TutorialScene2"});
    }

    preload() {
        // Carga las imágenes que usarás en el tutorial
        this.load.image('Tutorial_fondo', 'assets/Interfaces montadas/fondo_x.png');

        this.load.spritesheet("chimuelo","assets/sprites/chimuelo_HS.png", { frameWidth: 300, frameHeight: 300 });
        this.load.spritesheet("chispitas","assets/sprites/chispitas_HS.png", { frameWidth: 900, frameHeight: 300 });
        this.load.spritesheet("nemo","assets/sprites/Nemo_HS.png", { frameWidth: 300, frameHeight: 300 });   
        this.load.spritesheet("puffer","assets/sprites/puffer_HS.png", { frameWidth: 300, frameHeight: 300 });      

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
        this.add.text(620, 100, 'Peces', {
            font: 'bold 80px Gabriola',
            color: '#000000'
        }).setOrigin(0.5);

        // Imágenes de los peces con nombres distintos

        const chimuelo = this.add.sprite(150, 200, 'chimuelo'); // Imagen piraña
        chimuelo.setScale(0.5).setFrame(15);

        const chispitas = this.add.sprite(650, 200, 'chispitas'); // Imagen anguila electrica
        chispitas.setScale(0.5).setFrame(25);

        const nemo = this.add.sprite(150, 400, 'nemo'); // Imagen pez normal
        nemo.setScale(0.5).setFrame(15);

        const puffer = this.add.sprite(640, 400, 'puffer'); // Imagen pez globo
        puffer.setScale(0.5).setFrame(15);

        const pufferI = this.add.sprite(720, 400, 'puffer'); // Imagen pez globo
        pufferI.setScale(0.5).setFrame(20);

        const pufferII = this.add.sprite(500, 550, 'puffer'); // Imagen pez globo
        pufferII.setScale(0.5).setFrame(27);

        const pufferIII = this.add.sprite(610, 550, 'puffer'); // Imagen pez globo
        pufferIII.setScale(0.5).setFrame(29);

        // Texto en el medio
        this.add.text(220, 185, 'Chimuelo te quitará 3 puntos', {
            font: 'bold 22px Arial',
            color: '#000000',
            align: 'left'
        }).setOrigin(0.03);

        this.add.text(810, 185, 'Chispitas te paraliza durante 5 seg', {
            font: 'bold 22px Arial',
            color: '#000000',
            align: 'left'
        }).setOrigin(0.03);
        
        this.add.text(220, 385, 'Nemo te dará 1 punto', {
            font: 'bold 22px Arial',
            color: '#000000',
            align: 'left'
        }).setOrigin(0.03);

        this.add.text(800, 385, 'Irá a tu inventario y te dará 2 puntos.\n¡Lanzalo a tu rival, le restará 2 puntos!', {
            font: 'bold 22px Arial',
            color: '#000000',
            align: 'justify'
        }).setOrigin(0.03);

        this.add.text(680, 550, 'Te quitará 2 puntos', {
            font: 'bold 22px Arial',
            color: '#000000',
            align: 'left'
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
            this.scene.start('TutorialScene1'); // Vuelve al menú principal
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
            this.scene.start('TutorialScene3'); // Vuelve al menú principal
        });
    }
}
