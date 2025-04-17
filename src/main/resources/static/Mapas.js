class Mapa extends Phaser.Scene {
    constructor() {
        super( {key: "Mapas"}); // Nombre de la escena
    }

    preload() {

         // Botones con 3 estado
         this.load.image("Mapa_fondo","assets/Mapas/fondo.png")

         this.load.image('Boton_atras_normal', 'assets/Interfaces montadas/volver/normal.png');
         this.load.image('Boton_atras_encima', 'assets/Interfaces montadas/volver/seleccionado.png');
         this.load.image('Boton_atras_pulsado', 'assets/Interfaces montadas/volver/pulsado.png');

         this.load.image('Descampado_normal', 'assets/Mapas/mapas_botones/Descampado/normal.png');
         this.load.image('Descampado_seleccionado', 'assets/Mapas/mapas_botones/Descampado/seleccion.png');
         this.load.image('Descampado_presionado', 'assets/Mapas/mapas_botones/Descampado/pulsado.png');

         this.load.image('JuegoMesa_normal', 'assets/Mapas/mapas_botones/Juedo de mesa/normal.png');
         this.load.image('JuegoMesa_seleccionado', 'assets/Mapas/mapas_botones/Juedo de mesa/seleccionado.png');
         this.load.image('JuegoMesa_presionado', 'assets/Mapas/mapas_botones/Juedo de mesa/pulsado.png');

         this.load.image('Vortice_normal', 'assets/Mapas/mapas_botones/Vortice/bloqueado.png');
         this.load.image('Vortice_seleccionado', 'assets/Mapas/mapas_botones/Vortice/seleccionado.png');
    }

    create() {
        // Escala y centra el fondo
        const backgroundC = this.add.image(this.scale.width / 2, this.scale.height / 2, 'Mapa_fondo');
        backgroundC.setScale(
            Math.max(this.scale.width / backgroundC.width, this.scale.height / backgroundC.height)
        );
        
        let mapaElegido = null; 
    
        // MAPA DESCAMPADO
        const DescampadoButton = this.add.image(config.width / 6, config.height / 2, 'Descampado_normal')
            .setInteractive()
            .setScale(0.7);
    
        DescampadoButton.on('pointerover', () => {
            DescampadoButton.setTexture('Descampado_seleccionado');
        });
    
        DescampadoButton.on('pointerout', () => {
            DescampadoButton.setTexture('Descampado_normal');
        });
    
        DescampadoButton.on('pointerdown', () => {
            DescampadoButton.setTexture('Descampado_presionado');
        });
    
        DescampadoButton.on('pointerup', async () => {
            DescampadoButton.setTexture('Descampado_normal');
            this.scene.start('GameLocal1');
        });

    
        // MAPA JUEGO DE MESA
        const JuegoMButton = this.add.image(config.width / 2, config.height / 2, 'JuegoMesa_normal')
            .setInteractive()
            .setScale(0.7);
    
        JuegoMButton.on('pointerover', () => {
            JuegoMButton.setTexture('JuegoMesa_seleccionado');
        });
    
        JuegoMButton.on('pointerout', () => {
            JuegoMButton.setTexture('JuegoMesa_normal');
        });
    
        JuegoMButton.on('pointerdown', () => {
            JuegoMButton.setTexture('JuegoMesa_presionado');
        });
    
        JuegoMButton.on('pointerup', async () => {
            JuegoMButton.setTexture('JuegoMesa_normal');
            this.scene.start('GameLocal2');
           
        });

        //MAPA DE VORTICE
        const VorticeButton = this.add.image(config.width-config.width/6, config.height / 2, 'Vortice_normal').setInteractive().setScale(0.7);
        VorticeButton.on('pointerover', () => {
            VorticeButton.setTexture('Vortice_seleccionado');
        });

        VorticeButton.on('pointerout', () => {
            VorticeButton.setTexture('Vortice_normal');
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