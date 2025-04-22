class Creditos extends Phaser.Scene {
    constructor() {
        super({ key: 'creditos' }); // Nombre de la escena
    }

    preload() {
        // Cargar la imagen de fondo
        this.load.image('Creditos_fondo', 'assets/Interfaces montadas/fondo_x.png');

         // Botones con 3 estado
         this.load.image('Boton_atras_normal', 'assets/Interfaces montadas/volver/normal.png');
         this.load.image('Boton_atras_encima', 'assets/Interfaces montadas/volver/seleccionado.png');
         this.load.image('Boton_atras_pulsado', 'assets/Interfaces montadas/volver/pulsado.png');
    }

    create() {
        // Escala y centra el fondo
        const backgroundC = this.add.image(this.scale.width / 2, this.scale.height / 2, 'Creditos_fondo');
        backgroundC.setScale(
            Math.max(this.scale.width / backgroundC.width, this.scale.height / backgroundC.height)
        );

        // Crear un contenedor para los textos de los créditos
        const nombres = [
            'Grupo 10: Pawtastic Studios',
            'Isabel Sánchez Benito',
            'Jose Ignacio González Vicente'
        ];

        // Estilo de texto
        const estiloTexto = {
            fontSize: '36px', // Tamaño ajustado
            color: '#000000', // Color negro
            fontFamily: 'Arial',
            fontStyle: 'bold', // Negrita
            align: 'center',
        };

        // Crear los textos
        this.creditos = this.add.group();

        // Coordenada inicial vertical (fuera de la pantalla)
        let startY = this.scale.height + 100; // Más espacio inicial

        const espacioEntreLineas = 80; // Espaciado mayor entre las líneas

        // Crear cada texto y colocarlo centrado
        nombres.forEach((nombre, index) => {
            const texto = this.add.text(
                this.scale.width / 2,
                startY + index * espacioEntreLineas,
                nombre,
                estiloTexto
            );
            texto.setOrigin(0.5, 0.5); // Centrar
            this.creditos.add(texto); // Agregar al grupo
        });

        // Velocidad del movimiento de los créditos
        this.velocidad = 1.5;

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
            this.scene.start('MenuPrincipal'); // Vuelve al menú principal
        });
    }

    update() {
        // Desplazar los textos hacia arriba
        this.creditos.getChildren().forEach((texto) => {
            texto.y -= this.velocidad;

            // Si el texto sale por completo de la pantalla, reiniciarlo al final
            if (texto.y < -50) {
                texto.y = this.scale.height + (this.creditos.getChildren().length - 1) * 80;
            }
        });
    }
}