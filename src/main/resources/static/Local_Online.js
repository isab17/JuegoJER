class local_online_scene extends Phaser.Scene {
    constructor() {
        super('local_online_scene');
    }
  
    preload() {
      // Cargar recursos como imágenes y sonidos aquí
      this.load.image("Local_normal","assets/Pantalla_inicio/Local/normal.png")
      this.load.image("Local_seleccionado","assets/Pantalla_inicio/Local/seleccionado.png")
      this.load.image("Local_presionado","assets/Pantalla_inicio/Local/presionado.png")

      this.load.image("Online_normal","assets/Pantalla_inicio/Online/normal.png")
      this.load.image("Online_seleccionado","assets/Pantalla_inicio/Online/seleccionado.png")
      this.load.image("Online_presionado","assets/Pantalla_inicio/Online/presionado.png")

    }
  
    create() {
      //this.add.text(300, 200, 'Iniciar Sesión', { fontSize: '32px', color: '#fff' });
      const background = this.add.image(config.width / 2, config.height / 2, 'fondo');
      background.setScale(config.width / background.width, config.height / background.height); // Escalar fondo

      //Musica
    if(!this.game.globalMusic){
        this.game.globalMusic=this.sound.add("backgroundMusic", { loop: true, volume: 0.5 });
        this.game.globalMusic.play();
    }

    const sonidoBoton= this.sound.add("sonidoBoton", { loop: false, volume: 0.5 });

      const botonLocal = this.add.image(config.width / 2, 430, 'Local_normal')
        .setInteractive() //Hacerlo interactivo
        .setScale(0.6) // Escalado del boton

        //Insercion de los diferentes diseños de los botones segun la condicion
        .on('pointerover', () => botonLocal.setTexture('Local_seleccionado'))
        .on('pointerout', () => botonLocal.setTexture('Local_normal'))
        .on('pointerdown', () => botonLocal.setTexture('Local_presionado'))
        .on('pointerup', () => {
            botonLocal.setTexture('Local_normal');
            sonidoBoton.play();
            console.log('Botón Local clickeado');
            // Aquí puedes agregar la acción para el botón de Tutorial

            this.scene.start('Mapa');
            
        });

    // Botón de "Online"
    const botonOnline = this.add.image(config.width / 2, 530, 'Online_normal')
        .setInteractive() //Hacerlo interactivo
        .setScale(0.6) // Escalado del boton

        //Insercion de los diferentes diseños de los botones segun la condicion
        .on('pointerover', () => botonOnline.setTexture('Online_seleccionado'))
        .on('pointerout', () => botonOnline.setTexture('Online_normal'))
        .on('pointerdown', () => botonOnline.setTexture('Online_presionado'))
        .on('pointerup', () => {
            botonOnline.setTexture('Online_normal');
            sonidoBoton.play();
            console.log('Botón Online clickeado');

            // Al hacer click, muestra los creditos (nombres de los integrantes y el equipo)
            this.scene.start('Iniciarsesion');
        
        });

    }
}