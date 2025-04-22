class Partidas extends Phaser.Scene {
    constructor() {
        super('partida');
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

    }
}