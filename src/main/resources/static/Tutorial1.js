// Escena 1 del tutorial
class TutorialScene1 extends Phaser.Scene {
    constructor() {
        super({key: "TutorialScene1"});
    }

    preload() {
        // Carga las imágenes que usarás en el tutorial
        this.load.image('Tutorial_fondo', 'assets/Interfaces montadas/fondo_x.png');

        this.load.image('CaraGatoA', 'assets/inventario/Menta.png');
        this.load.image('CaraGatoB', 'assets/inventario/Chocolate.png');

        this.load.image('Flechas', 'assets/Interfaces montadas/Teclas/Chocolate/FLECHAS.png');
        this.load.image('L', 'assets/Interfaces montadas/Teclas/Chocolate/L.png');
        this.load.image('O', 'assets/Interfaces montadas/Teclas/Chocolate/O.png');
        this.load.image('P', 'assets/Interfaces montadas/Teclas/Chocolate/P.png');

        this.load.image('WASD', 'assets/Interfaces montadas/Teclas/Menta/WASD.png');
        this.load.image('E', 'assets/Interfaces montadas/Teclas/Menta/E.png');
        this.load.image('F', 'assets/Interfaces montadas/Teclas/Menta/F.png');
        this.load.image('Q', 'assets/Interfaces montadas/Teclas/Menta/Q.png');



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
        this.add.text(620, 100, 'Controles modo local', {
            font: 'bold 80px Gabriola',
            color: '#000000'
        }).setOrigin(0.5);

        // Imágenes gatos
        gatoA = this.add.image(350, 330, 'CaraGatoA'); // Imagen a la izquierda del todo
        gatoA.setScale(0.4);
        gatoB = this.add.image(870, 330, 'CaraGatoB'); // Imagen a la derecha del todo
        gatoB.setScale(0.4);

        //Imagenes Teclas
        this.WASD = this.add.image(350 , 510, 'WASD');
        this.WASD.setScale(0.4);
        this.FLECHAS = this.add.image(870, 510, 'Flechas');
        this.FLECHAS.setScale(0.4);

        this.E = this.add.image(540, 450, 'E');
        this.E.setScale(0.4);
        this.L = this.add.image(960, 450, 'L');
        this.L.setScale(0.4);

        this.F = this.add.image(500, 535, 'F');
        this.F.setScale(0.4);
        this.O = this.add.image(720, 535, 'O');
        this.O.setScale(0.4);

        this.Q = this.add.image(255, 450, 'Q');
        this.Q.setScale(0.4);
        this.P = this.add.image(775, 450, 'P');
        this.P.setScale(0.4);


        
        //Textos Menta
        this.add.text(320, 200, 'Mario', {
            font: 'bold 20px Arial',
            color: '#013220',
            align: 'center'
        }).setOrigin(0.05);

        this.add.text(225, 480, 'Pescar', {
            font: 'bold 20px Arial',
            color: '#000000',
            align: 'left'
        }).setOrigin(0.05);

        this.add.text(500, 480, 'Inventario', {
            font: 'bold 20px Arial',
            color: '#000000',
            align: 'left'
        }).setOrigin(0.05);

        this.add.text(300, 580, 'Movimiento', {
            font: 'bold 20px Arial',
            color: '#000000',
            align: 'left'
        }).setOrigin(0.05);

        this.add.text(475, 565, 'Atacar', {
            font: 'bold 20px Arial',
            color: '#000000',
            align: 'left'
        }).setOrigin(0.05);
        
        //Textos Chocolate
        this.add.text(850, 200, 'Luigi', {
            font: 'bold 20px Arial',
            color: '#013220',
            align: 'center'
        }).setOrigin(0.05);

        this.add.text(920, 480, 'Inventario', {
            font: 'bold 20px Arial',
            color: '#000000',
            align: 'left'
        }).setOrigin(0.05);

        this.add.text(690, 565, 'Atacar', {
            font: 'bold 20px Arial',
            color: '#000000',
            align: 'left'
        }).setOrigin(0.05);

        this.add.text(820 , 580, 'Movimiento', {
            font: 'bold 20px Arial',
            color: '#000000',
            align: 'left'
        }).setOrigin(0.05);

        this.add.text(745, 480, 'Pescar', {
            font: 'bold 20px Arial',
            color: '#000000',
            align: 'left'
        }).setOrigin(0.05);


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
            this.scene.start('MenuPrincipal'); // Vuelve al menú principal
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
            this.scene.start('TutorialScene4'); // Cambia a la siguiente escena
        });
    }
}