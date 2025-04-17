class GameLocal2 extends Phaser.Scene {

    constructor() {
        super({key: "GameLocal2"}); // Nombre único de la escena
    }

preload() {
    // Aquí es donde normalmente cargarías imágenes, sonidos, etc.
    this.load.image("escenario", "assets/Escenario2/v5/Final.png");
    
    this.load.image("inv_sinDesplegar_normal_gatoA", "assets/inventario/version_chica/salir_chico_1.png");
    this.load.image("inv_sinDesplegar_normal_gatoB", "assets/inventario/version_chica/salir_chico_2.png");
    this.load.image("inv_Desplegado_normal_gatoA", "assets/inventario/inventario_chico.png");
    this.load.image("inv_Desplegado_normal_gatoB", "assets/inventario/inventario_chico_2.png");
    this.load.image("pezGloboDesinf", "assets/sprites/pez_globo.png");
    this.load.image("pezGloboInf", "assets/sprites/pez_globo_hinchado.png");


    this.load.spritesheet("gatoB","assets/sprites/gatoB.png", { frameWidth: 280, frameHeight: 600 });
    this.load.spritesheet("gatoA","assets/sprites/gatoA.png", { frameWidth: 280, frameHeight: 600 });
    this.load.spritesheet("piraña","assets/sprites/chimuelo_HS.png", { frameWidth: 300, frameHeight: 300 });
    this.load.spritesheet("pez","assets/sprites/Nemo_HS.png", { frameWidth: 300, frameHeight: 300 });
    this.load.spritesheet("angila","assets/sprites/chispitas_HS.png", { frameWidth: 900, frameHeight: 300 });
    this.load.spritesheet("pezGlobo","assets/sprites/puffer_HS.png", { frameWidth: 300, frameHeight: 300 });

    this.load.image('Boton_pausa_normal', 'assets/Interfaces montadas/pausa/normal.png');
    this.load.image('Boton_pausa_encima', 'assets/Interfaces montadas/pausa/seleccionado.png');
    this.load.image('Boton_pausa_pulsado', 'assets/Interfaces montadas/pausa/pulsado.png');

    this.load.image('CaraGatoA', 'assets/inventario/Menta.png');
    this.load.image('CaraGatoB', 'assets/inventario/Chocolate.png');

    // Cargar la música
    //this.load.audio("backgroundMusic", "assets/musica/los-peces-en-el-mar-loop-c-16730.mp3");
    this.load.audio("sonidoBoton", "assets/musica/SonidoBoton.mp3");
    this.load.audio("sonidoPezBueno", "assets/musica/RecogerPezBueno.mp3");
    this.load.audio("sonidoPezMalo", "assets/musica/RecogerPezMalo.mp3");
    this.load.audio("sonidoAnguila", "assets/musica/RecogerAnguila.mp3");
    this.load.audio("LanzamientoPezGlobo", "assets/musica/LanzamientoPezGlobo.mp3");
    this.load.audio("ExplosionPezGlobo", "assets/musica/ExplosionPezGlobo.mp3");
    this.load.audio("Pesca", "assets/musica/Pesca.mp3");

    this.load.image('reloj', 'assets/Interfaces montadas/reloj.png');

}

// Función create para inicializar objetos una vez que se han cargado los recursos
create() {
    
    //Guardado de la hora de inicio de la partida
    this.horaInicio = new Date().toISOString().replace('Z', '');

    // Crear la imagen y ajustarla al tamaño del escenario
    const background = this.add.image(config.width / 2, config.height / 2, 'escenario'); // Centrar la imagen
    background.setScale(config.width / background.width, config.height / background.height); // Escalar la imagen


    //Inventario B
    this.inventario_Pleg_B=this.add.container(33, config.height / 1.7); //Contenedor de la interfaz plegada
    this.inventario_Pleg_B.setScale(0.4, 0.4);
    const inventarioPlegadoB = this.add.image(0, 0, 'inv_sinDesplegar_normal_gatoA');   //Imagen plegada
    this.inventario_Pleg_B.add([inventarioPlegadoB]);  // Añadir imagen al container
    this.inventario_Pleg_B.setVisible(true);       //Inicialmente se ve
    
    
    this.inventario_Des_B=this.add.container(83, config.height / 1.7); //Contenedor de la interfaz plegada
    this.inventario_Des_B.setScale(0.4, 0.4);
    const inventarioDesplegadoB = this.add.image(0, 0, 'inv_Desplegado_normal_gatoA');   //Imagen plegada
    this.inventario_Des_B.add([inventarioDesplegadoB]);  // Añadir imagen al container
    this.inventario_Des_B.setVisible(false);       //Inicialmente no se ve
    this.abiertoB=false;
    

    //Pez globo inflado y desinflado en el inventario A
    this.pezGlobo_Desinf_B=this.add.image(55, 360, 'pezGloboDesinf');
    this.pezGlobo_Desinf_B.setScale(0.18,0.18);
    this.pezGlobo_Desinf_B.setVisible(false);
    this.pezGloboB=false;

   
    //Inventario A
    this.inventario_Pleg_A=this.add.container(1167, config.height / 1.7); //Contenedor de la interfaz plegada
    this.inventario_Pleg_A.setScale(0.4, 0.4);
    const inventarioPlegadoA = this.add.image(0, 0, 'inv_sinDesplegar_normal_gatoB');   //Imageneee plegada
    this.inventario_Pleg_A.add([inventarioPlegadoA]);  // Añadir imagen al container
    this.inventario_Pleg_A.setVisible(true);       //Inicialmente no se ve
    
    this.inventario_Des_A=this.add.container(1117, config.height / 1.7); //Contenedor de la interfaz plegada
    this.inventario_Des_A.setScale(0.4, 0.4);
    const inventarioDesplegadoA = this.add.image(0, 0, 'inv_Desplegado_normal_gatoB');   //Imagen plegada
    this.inventario_Des_A.add([inventarioDesplegadoA]);  // Añadir imagen al container
    this.inventario_Des_A.setVisible(false);       //Inicialmente se ve
    this.abiertoA=false;
   

    //Pez globo inflado y desinflado en el inventario B
    this.pezGlobo_Desinf_A=this.add.image(1145, 358, 'pezGloboDesinf');
    this.pezGlobo_Desinf_A.setScale(0.18,0.18);
    this.pezGlobo_Desinf_A.setVisible(false);
    this.pezGloboA=false;

    // Efectos de sonido
        const sonidoBoton= this.sound.add("sonidoBoton", { loop: false, volume: 0.5 });
        this.sonidoPezBueno = this.sound.add("sonidoPezBueno", { loop: false, volume: 0.5 });
        this.sonidoPezMalo = this.sound.add("sonidoPezMalo", { loop: false, volume: 0.5 });
        this.sonidoAnguila = this.sound.add("sonidoAnguila", { loop: false, volume: 0.5 });
        this.sonidoLanzamiento = this.sound.add("LanzamientoPezGlobo", { loop: false, volume: 0.8 });
        this.sonidoExplosion = this.sound.add("ExplosionPezGlobo", { loop: false, volume: 0.8 });
        this.sonidoPesca = this.sound.add("Pesca", { loop: false, volume: 0.8 });

        
   // Obtener las dimensiones de la cámara (tamaño de la pantalla del juego)
   const centerX = this.cameras.main.centerX;
   const centerY = this.cameras.main.centerY;

   // Crear la imagen de fondo para el temporizador en el centro de la pantalla
   this.timerBackground = this.add.image(centerX, centerY - 100, 'reloj'); // Usamos la imagen 'reloj'
   this.timerBackground.setOrigin(0.5, 3.3); // Centra la imagen
   this.timerBackground.setScale(0.35, 0.35); // Centra la imagen
   this.timerBackground.setDepth(9);         // Establecer la profundidad para asegurarse de que se dibuje encima de otros elementos

    //Puntos de los jugadores
    const caraGatoA =this.add.image(450, 50, 'CaraGatoB');
    caraGatoA.setScale(0.18, 0.18);
    textoA=this.add.text(350,30, " 0 ", {font: "30px Arial Black",color: "#000000"});      // AJUSTAR LETRA, TAMAÑO, ETC

    const caraGatoB =this.add.image(750, 50, 'CaraGatoA');
    caraGatoB.setScale(0.18, 0.18);
    textoB=this.add.text(800,30, " 0 ", {font: "30px Arial Black",color: "#000000"});      // AJUSTAR LETRA, TAMAÑO, ETC
    
    const botonPausa = this.add.image(1150, 40, 'Boton_pausa_normal').setInteractive().setScale(0.45);

botonPausa.on('pointerover', () => {
    botonPausa.setTexture('Boton_pausa_encima');
});

botonPausa.on('pointerout', () => {
    botonPausa.setTexture('Boton_pausa_normal');
});

botonPausa.on('pointerdown', () => {
    botonPausa.setTexture('Boton_pausa_pulsado');
    sonidoBoton.play();
});

botonPausa.on('pointerup', () => {
    botonPausa.setTexture('Boton_pausa_normal');
    this.scene.launch('PauseMenu', { escenaPrevia: this.scene.key });
    this.scene.pause();
});
    
    // Crear texto para mostrar el temporizador
this.timerText = this.add.text(config.width / 2, 20, "90", { 
    fontSize: "32px",       // Tamaño de la fuente
    color: "#111111",       // Color del texto
    fontWeight: "bold",     // Hacer la fuente más gruesa
    stroke: "#000000",      // Color del contorno
    strokeThickness: 2     // Grosor del contorno (más alto = más grueso)
});

this.timerText.setOrigin(0.5, -0.2); // Centrar el texto horizontalmente
this.timerText.setDepth(10);         // Establecer la profundidad para asegurarse de que se dibuje encima de otros elementos

    // Configurar el temporizador
    this.remainingTime = 90; // 90 segundos
    this.time.addEvent({
        delay: 1000, // Cada segundo
        callback: this.updateTimer,
        callbackScope: this,
        loop: true,
    });



    puntosA=0;  // Inicializar las variables de los puntos en 0
    puntosB=0;
        
    //ANIMACIONES DE LOS GATOS
    // Animación 1: Quieto mirando al frente (frames de la fila 1)
    this.anims.create({
        key: 'frenteB',
        frames: this.anims.generateFrameNumbers('gatoB', { start: 0, end: 2 }), 
        frameRate: 5,
        repeat: -1 // Repetir infinito
    });
    this.anims.create({
        key: 'frenteA',
        frames: this.anims.generateFrameNumbers('gatoA', { start: 0, end: 2 }), 
        frameRate: 5,
        repeat: -1 // Repetir infinito
    });

    // Animación 2: Quieto de espaldas (frames de la fila 2)
    this.anims.create({
        key: 'espaldasB',
        frames: this.anims.generateFrameNumbers('gatoB', { start: 8, end: 10 }), 
        frameRate: 5,
        repeat: -1
    });
    this.anims.create({
        key: 'espaldasA',
        frames: this.anims.generateFrameNumbers('gatoA', { start: 8, end: 10 }), 
        frameRate: 5,
        repeat: -1
    });

    // Animación 3: Caminando hacia la derecha (frames de la fila 3)
    this.anims.create({
        key: 'caminar_drchB',
        frames: this.anims.generateFrameNumbers('gatoB', { start: 24, end: 26 }),
        frameRate: 5, 
        repeat: -1
    });
    this.anims.create({
        key: 'caminar_drchA',
        frames: this.anims.generateFrameNumbers('gatoA', { start: 24, end: 26 }),
        frameRate: 5,
        repeat: -1
    });

    // Animación 4: Caminando hacia la izquierda (frames de la fila 4)
    this.anims.create({
        key: 'caminar_izqB',
        frames: this.anims.generateFrameNumbers('gatoB', { start: 16, end: 18 }), 
        frameRate: 5,
        repeat: -1
    });
    this.anims.create({
        key: 'caminar_izqA',
        frames: this.anims.generateFrameNumbers('gatoA', { start: 16, end: 18 }), 
        frameRate: 5,
        repeat: -1
    });

    // Animación 5: Pescar (frames de la fila 5)
    this.anims.create({
        key: 'pescar_izqB',
        frames: this.anims.generateFrameNumbers('gatoB', { start: 32, end: 34 }), 
        frameRate: 5,
        repeat: -1
    });
    this.anims.create({
        key: 'pescar_drchB',
        frames: this.anims.generateFrameNumbers('gatoB', { start: 40, end: 42 }), 
        frameRate: 5,
        repeat: -1
    });
    this.anims.create({
        key: 'pescar_izqA',
        frames: this.anims.generateFrameNumbers('gatoA', { start: 32, end: 34 }), 
        frameRate: 5,
        repeat: -1
    });
    this.anims.create({
        key: 'pescar_drchA',
        frames: this.anims.generateFrameNumbers('gatoA', { start: 40, end: 42 }), 
        frameRate: 5,
        repeat: -1
    });

    //ANIMACION DE LOS PECES
    //PIRAÑA
    this.anims.create({
        key: 'nadarP',
        frames: this.anims.generateFrameNumbers('piraña', { start: 0, end:4 }), 
        frameRate: 5,
        repeat: -1
    });
    this.anims.create({
        key: 'salirP',
        frames: this.anims.generateFrameNumbers('piraña', { start: 5, end:12 }), 
        frameRate: 5,
        repeat: -1
    });
    this.anims.create({
        key: 'idleP',
        frames: this.anims.generateFrameNumbers('piraña', { start: 13, end:17 }), 
        frameRate: 5,
        repeat: -1
    });
    this.anims.create({
        key: 'morderP',
        frames: this.anims.generateFrameNumbers('piraña', { start: 18, end:21 }), 
        frameRate: 5,
        repeat: -1
    });

    //PEZ
    this.anims.create({
        key: 'nadarE',
        frames: this.anims.generateFrameNumbers('pez', { start: 0, end:4 }), 
        frameRate: 5,
        repeat: -1
    });
    this.anims.create({
        key: 'salirE',
        frames: this.anims.generateFrameNumbers('pez', { start: 5, end:12 }), 
        frameRate: 5,
        repeat: -1
    });
    this.anims.create({
        key: 'idleE',
        frames: this.anims.generateFrameNumbers('pez', { start: 13, end:15 }), 
        frameRate: 5,
        repeat: -1
    });

    //PEZ GLOBO
    this.anims.create({
        key: 'nadarPG',
        frames: this.anims.generateFrameNumbers('pezGlobo', { start: 0, end:4 }), 
        frameRate: 5,
        repeat: -1
    });
    this.anims.create({
        key: 'salirPG',
        frames: this.anims.generateFrameNumbers('pezGlobo', { start: 5, end:13 }), 
        frameRate: 5,
        repeat: -1
    });
    this.anims.create({
        key: 'inflarPG',
        frames: this.anims.generateFrameNumbers('pezGlobo', { start: 16, end:24 }), 
        frameRate: 5,
        repeat: 0
    });
    this.anims.create({
        key: 'explotarPG',
        frames: this.anims.generateFrameNumbers('pezGlobo', { start: 25, end:29 }), 
        frameRate: 5,
        repeat: 0
    });

    //ANGILA
    this.anims.create({
        key: 'nadarA',
        frames: this.anims.generateFrameNumbers('angila', { start: 0, end:7 }), 
        frameRate: 5,
        repeat: -1
    });
    this.anims.create({
        key: 'salirA',
        frames: this.anims.generateFrameNumbers('angila', { start: 8, end:19 }), 
        frameRate: 5,
        repeat: -1
    });
    this.anims.create({
        key: 'idleA',
        frames: this.anims.generateFrameNumbers('angila', { start: 23, end:29 }), 
        frameRate: 5,
        repeat: -1
    });

    
    // Crear el gatoB
    gatoB = this.physics.add.sprite(450, 620, 'gatoB');
    gatoB.setScale(0.30).setFrame(1);
    gatoB.setSize(280, 57); // Ajusta el tamaño del área de colisión (ancho y alto)
    gatoB.setOffset(0, 453);
    gatoB.setCollideWorldBounds(true);
    gatoB.name='GatoB';
    gatoB.canMove=true;

    // Crear el gatoA
    gatoA = this.physics.add.sprite(800, 620, 'gatoA');
    gatoA.setScale(0.30).setFrame(1);
    gatoA.setSize(280, 57); // Ajusta el tamaño del área de colisión (ancho y alto)
    gatoA.setOffset(0, 453);
    gatoA.setCollideWorldBounds(true); 
    gatoA.name='GatoA';
    gatoA.canMove=true;

    
    //cursor
    cursor = this.input.keyboard.createCursorKeys();
    keys={
        A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        Q: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
        P: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P),
        E: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
        L: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L),
        F: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F),
        O: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O)
    }

    //Colision de los gatos con los peces
    this.peces = this.physics.add.group();
    this.physics.add.overlap(gatoA, this.peces,this.destruirPeces,null,this);   //Si se chocan, se llama a la funcion 
    this.physics.add.overlap(gatoB, this.peces,this.destruirPeces,null,this);   //Si se chocan, se llama a la funcion

    //temporizador
    gatoAwait=false;
    gatoBwait=false;


    //regiones 
    arbusto = {x: 0, y: 75, width: 1200, height: 560};
    zonasProhibidas=[
        { x: 0, y: 220, width: 150, height: 500 },
        { x: 150, y: 220, width: 20, height: 500 },
        { x: 170, y: 300, width: 30, height: 500 },
        { x: 200, y: 320, width: 30, height: 500 },
        { x: 230, y: 380, width: 30, height: 280 },
        { x: 260, y: 430, width: 50, height: 200 },
        { x: 310, y: 470, width: 50, height: 150 },
        { x: 360, y: 540, width: 20, height: 80 },

        { x: 530, y: 200, width: 200, height: 410 },
        { x: 480, y: 200, width: 50, height: 330 },
        { x:280, y: 190, width: 200, height: 50 },
        { x:320, y: 240, width: 160, height: 50 },
        { x:370, y: 290, width: 110, height: 60 },
        { x:410, y: 350, width: 70, height: 80 },
        { x: 730, y: 210, width: 60, height: 330 },
        { x: 790, y: 210, width: 70, height: 250 },
        { x:860, y: 310, width: 70, height: 100 },

        { x: 1020, y: 400, width:200, height: 320 },
        { x: 970, y: 450, width:50, height: 280 },
        { x: 950, y: 500, width:20, height: 250 },
        { x: 900, y: 540, width: 50, height: 100 },
        { x: 860, y: 590, width: 40, height: 50 },
    ];
    /*zonasProhibidas.forEach(region => {
        const rect = this.add.rectangle(region.x, region.y, region.width, region.height,  0x0000ff, 0.2);
        rect.setOrigin(0, 0); // Asegura que las coordenadas comiencen desde la esquina superior izquierda
    });*/
    agua=[
        { x: 510, y: 250, width: 250, height:270}, // Región 4
        { x: 110, y: 350, width: 50, height: 106}, // Región 7
        { x: 200, y: 480, width: 50, height: 106},
        { x: 1010, y: 510, width: 50, height: 200}
    ]
    /*agua.forEach(region => {
        const rect = this.add.rectangle(region.x, region.y, region.width, region.height,  0x0000ff, 0.2);
        rect.setOrigin(0, 0); // Asegura que las coordenadas comiencen desde la esquina superior izquierda
    });*/
    pesca=[
        { x: 270, y:600, width: 20, height: 150 }, 
        {x: 900, y:600, width: 20, height: 150}, 
        {x: 900, y:230, width: 20, height: 120}, 
        {x:200, y:230, width: 140, height: 120}, 
        {x:270, y:350, width: 160, height: 120},
        {x:350, y:470, width: 180, height: 120},
        {x:840, y:350, width: 200, height: 150},
        {x:750, y:500, width: 190, height: 120}, 
    ]
    /*pesca.forEach(region => {
        const rect = this.add.rectangle(region.x, region.y, region.width, region.height,  0x0000ff, 0.2);
        rect.setOrigin(0, 0); // Asegura que las coordenadas comiencen desde la esquina superior izquierda
    });*/
    
    // Crear los objetos invisibles para las zonas prohibidas
    zonasProhibidas.forEach((zona, index) => {
        // Crear un objeto de física estática para cada zona (para que no se mueva)
        var zonaProhibida = this.physics.add.staticImage(zona.x + zona.width / 2, zona.y + zona.height / 2, 'invisible');
        zonaProhibida.setSize(zona.width, zona.height); // Definir el tamaño de la zona prohibida
        zonaProhibida.setAlpha(0); // Hacer que sea invisible
        // Hacer que el gato colisione con la zona
        this.physics.add.collider(gatoA, zonaProhibida, function() {
            console.log('¡El gato chocó con la zona prohibida ' + (index + 1) + '!');
            // Aquí puedes añadir cualquier acción cuando el gato choque con una zona
        });
        this.physics.add.collider(gatoB, zonaProhibida, function() {
            console.log('¡El gato chocó con la zona prohibida ' + (index + 1) + '!');
            // Aquí puedes añadir cualquier acción cuando el gato choque con una zona
        });
    });
    tierra=[
        {x:300,y:150,width:330,height:20},
        {x:110,y:150,width:100,height:20},
        {x:700,y:180,width:330,height:20},
        {x:900,y:280,width:100,height:20},
        {x:1050,y:340,width:100,height:20},
        {x:276,y:660,width:630,height:20},
    ];
    /*tierra.forEach(region => {
        const rect = this.add.rectangle(region.x, region.y, region.width, region.height,  0x0000ff, 0.2);
        rect.setOrigin(0, 0); // Asegura que las coordenadas comiencen desde la esquina superior izquierda
    });*/
    
    let limiteDePeces = 15;
    let pecesPorRegion = Math.floor(limiteDePeces / agua.length); // Peces por región
    let pecesExtras = limiteDePeces % agua.length; // Peces sobrantes

    agua.forEach((region, index) => {
        // Determinar cuántos peces asignar a esta región
        let pecesEnEstaRegion = pecesPorRegion + (pecesExtras > 0 ? 1 : 0);
        if (pecesExtras > 0) pecesExtras--; // Reducir los peces sobrantes

        for (let i = 0; i < pecesEnEstaRegion; i++) {
            let tipoPez = Phaser.Math.RND.pick(['pez', 'piraña', 'pezGlobo', 'angila']);
            let x = Math.random() * region.width + region.x;
            let y = Math.random() * region.height + region.y;

            let nuevoPez = this.peces.create(x, y, tipoPez);

            // Configurar escala, animación de salida e idle según el tipo de pez
            if (tipoPez === 'angila') {
                nuevoPez.setScale(0.25);
                nuevoPez.anims.play('nadarA');
            } else if (tipoPez === 'pezGlobo') {
                nuevoPez.setScale(0.30);
                nuevoPez.anims.play('nadarPG');
            } else if (tipoPez === 'pez') {
                nuevoPez.setScale(0.30);
                nuevoPez.anims.play('nadarE');
            } else if (tipoPez === 'piraña') {
                nuevoPez.setScale(0.30);
                nuevoPez.anims.play('nadarP');
            }
        }
    });
}

enZonaProhibida(x, y, width, height) {
    // Verifica si el objeto está dentro de una zona prohibida
    for (const zona of zonasProhibidas) {
        if (
            x < zona.x + zona.width &&
            x + width > zona.x &&
            y < zona.y + zona.height &&
            y + height > zona.y
        ) {
            return true; // Está dentro de una zona prohibida
        }
    }
    return false; // No hay colisión
}

isInFishingZone(sprite, zones) {
    for (const zone of zones) {
        if (
            sprite.x > zone.x &&
            sprite.x < zone.x + zone.width &&
            sprite.y > zone.y &&
            sprite.y < zone.y + zone.height
        ) {
            return true;
        }
    }
    return false;
}

update(time, delta) {
    console.log(gatoA.width, gatoA.height);
    const deltaSegundos = delta / 1000;
     // MOVIMIENTO DEL GATOA
     if(gatoA.canMove==true){
        if (keys.D.isDown) {
            const nuevaX = gatoA.x + 160 * delta; // Predice nueva posición horizontal
            console.log('Intentando mover derecha a:', nuevaX, gatoA.y);
            if (!this.enZonaProhibida(nuevaX, gatoA.y, gatoA.width, gatoA.height)) {
                gatoA.setVelocityX(160);
                gatoA.anims.play('caminar_drchA', true);
                izqA = false;
                console.log('Movimiento permitido');
            } else {
                gatoA.setVelocityX(0); // Bloquear el movimiento
                console.log('Bloqueado por zona prohibida');
            }
        } else if (keys.A.isDown) {
            const nuevaX = gatoA.x - 160 * delta; // Predice nueva posición horizontal
            if (!this.enZonaProhibida(nuevaX, gatoA.y, gatoA.width, gatoA.height)) {
                gatoA.setVelocityX(-160);
                gatoA.anims.play('caminar_izqA', true);
                izqA = true;
            } else {
                gatoA.setVelocityX(0); // Bloquear el movimiento
            }
        }else{
            gatoA.setVelocityX(0);  // Detener el movimiento horizontal
        }
        if (keys.W.isDown) {
            const nuevaY = gatoA.y - 160 * delta; // Predice nueva posición horizontal
            if (!this.enZonaProhibida(nuevaY, gatoA.x, gatoA.width, gatoA.height)) {
                gatoA.setVelocityY(-160);
                gatoA.anims.play('espaldasA', true);
                arribaA = true;
            } else {
                gatoA.setVelocityY(0); // Bloquear el movimiento
            }
        } else if (keys.S.isDown) {
            const nuevaY = gatoA.y + 160 * delta; // Predice nueva posición horizontal
            if (!this.enZonaProhibida(nuevaY, gatoA.x, gatoA.width, gatoA.height)) {
                gatoA.setVelocityY(160);
                gatoA.anims.play('frenteA', true);
                arribaA = false;
            } else {
                gatoA.setVelocityY(0); // Bloquear el movimiento
            }
        } else {
            gatoA.setVelocityY(0); 
        }
    }else {
        gatoA.setVelocityX(0);
        gatoA.setVelocityY(0);
        gatoA.anims.stop();
    }
    

    // MOVIMIENTO DEL GATOB
    if(gatoB.canMove==true){
        if (cursor.right.isDown) {
            gatoB.setVelocityX(160);  // Mover a la derecha
            gatoB.play('caminar_drchB', true);  // Reproducir animación
            izqB=false;
        } else if (cursor.left.isDown) {
            gatoB.setVelocityX(-160);  // Mover a la izquierda
            gatoB.play('caminar_izqB', true);  // Reproducir animación
            izqB=true;
        } else {
            gatoB.setVelocityX(0);  // Detener el movimiento horizontal
        }
    
        if (cursor.up.isDown) {
            gatoB.setVelocityY(-160);  // Mover hacia arriba
            gatoB.play('espaldasB', true);  // Reproducir animación
            arribaB = true;
        } else if (cursor.down.isDown) {
            gatoB.setVelocityY(160);  // Mover hacia abajo
            gatoB.play('frenteB', true);  // Reproducir animación
            arribaB = false;
        } else {
            gatoB.setVelocityY(0);  // Detener el movimiento vertical
        }
    } else{
        gatoB.setVelocityX(0);
        gatoB.setVelocityY(0);
        gatoB.anims.stop();
    }

    //pesca
    if (keys.Q.isDown && !gatoAwait) {
        if (this.isInFishingZone(gatoA, pesca)) {
            // Solo pesca si está en una zona permitida
            this.sonidoPesca.play();
            gatoAwait = true;
    
            // Elegir la animación según la dirección
            if (izqA) {
                gatoA.play('pescar_izqA');
            } else {
                gatoA.play('pescar_drchA');
            }
    
            // Esperar al final de la animación para aparecer los peces
            this.time.delayedCall(2000, () => {
                this.aparecerPeces();
                gatoAwait = false; // Permitir que pesque de nuevo
            });
        }
    }
    
    // Código para gestionar la pesca de gatoB
    if (keys.P.isDown && !gatoBwait) {
        if (this.isInFishingZone(gatoB, pesca)) {
            // Solo pesca si está en una zona permitida
            this.sonidoPesca.play();
            gatoBwait = true;
    
            // Elegir la animación según la dirección
            if (izqB) {
                gatoB.play('pescar_izqB');
            } else {
                gatoB.play('pescar_drchB');
            }
    
            // Esperar al final de la animación para aparecer los peces
            this.time.delayedCall(2000, () => {
                this.aparecerPeces();
                gatoBwait = false; // Permitir que pesque de nuevo
            });
        }
    }

    //Inventario gatoA
    if (keys.E.isDown && this.abiertoA==false) {
            this.inventario_Pleg_A.setVisible(false);  // Alterna visibilidad
            this.inventario_Des_A.setVisible(true); 
            if(this.pezGloboA==true){
                this.pezGlobo_Desinf_A.setVisible(true);
            }          
            setTimeout(()=>{        //Contador necesario para que el inventario haga bien la transicion entre abierto y cerrado
                this.abiertoA=true;
            }, 500);
                
    } else if(keys.E.isDown && this.abiertoA==true){
            this.inventario_Pleg_A.setVisible(true);  // Alterna visibilidad
            this.inventario_Des_A.setVisible(false);
            this.pezGlobo_Desinf_A.setVisible(false);
            setTimeout(()=>{
                this.abiertoA=false;
            }, 500);
    }

    //Inventario gatoB
    if (keys.L.isDown && this.abiertoB==false) {
        this.inventario_Pleg_B.setVisible(false);  // Alterna visibilidad
        this.inventario_Des_B.setVisible(true);  
        if(this.pezGloboB==true){
            this.pezGlobo_Desinf_B.setVisible(true);
        }               
        setTimeout(()=>{
            this.abiertoB=true;
        }, 500);
            
    } else if(keys.L.isDown && this.abiertoB==true){
        this.inventario_Pleg_B.setVisible(true);  // Alterna visibilidad
        this.inventario_Des_B.setVisible(false);
        this.pezGlobo_Desinf_B.setVisible(false);
        setTimeout(()=>{
            this.abiertoB=false;
        }, 500);
    }

    //Lanzar pez globo para A
    if(keys.F.isDown && this.pezGloboA==true && this.abiertoA==true){
        this.sonidoLanzamiento.play();
        if (keys.D.isDown){
            let x=gatoA.x + 315;
            let y=gatoA.y;
            let lanzado = this.peces.create(x, y, 'pezGlobo');
            lanzado.setScale(0.3);
            this.pezGloboA=false;
            this.inventario_Pleg_A.setVisible(true);  // Alterna visibilidad
            this.inventario_Des_A.setVisible(false);
            this.pezGlobo_Desinf_A.setVisible(false);
            let animPezGlobo = 'inflarPG';
            lanzado.play(animPezGlobo, true);
            this.explotarPezGlobo(lanzado);
        } else if(keys.A.isDown){
            let x=gatoA.x - 315;
            let y=gatoA.y;
            let lanzado = this.peces.create(x, y, 'pezGlobo');
            lanzado.setScale(0.3);
            this.pezGloboA=false;
            this.inventario_Pleg_A.setVisible(true);  // Alterna visibilidad
            this.inventario_Des_A.setVisible(false);
            this.pezGlobo_Desinf_A.setVisible(false);
            let animPezGlobo = 'inflarPG';
            lanzado.play(animPezGlobo, true);
            this.explotarPezGlobo(lanzado);            
        } else if(keys.W.isDown){
            let x=gatoA.x;
            let y=gatoA.y - 300;
            let lanzado = this.peces.create(x, y, 'pezGlobo');
            lanzado.setScale(0.3);
            this.pezGloboA=false;
            this.inventario_Pleg_A.setVisible(true);  // Alterna visibilidad
            this.inventario_Des_A.setVisible(false);
            this.pezGlobo_Desinf_A.setVisible(false);
            let animPezGlobo = 'inflarPG';
            lanzado.play(animPezGlobo, true);
            this.explotarPezGlobo(lanzado);   
        }else if(keys.S.isDown){
            let x=gatoA.x;
            let y=gatoA.y + 300;
            let lanzado = this.peces.create(x, y, 'pezGlobo');
            lanzado.setScale(0.3);
            this.pezGloboA=false;
            this.inventario_Pleg_A.setVisible(true);  // Alterna visibilidad
            this.inventario_Des_A.setVisible(false);
            this.pezGlobo_Desinf_A.setVisible(false);
            let animPezGlobo = 'inflarPG';
            lanzado.play(animPezGlobo, true);
            this.explotarPezGlobo(lanzado);   
        }
    }
    //Lanzar pez globo para A
    if(keys.O.isDown && this.pezGloboB==true && this.abiertoB==true){
        this.sonidoLanzamiento.play();
        if (cursor.right.isDown){         
            let x=gatoB.x + 315;
            let y=gatoB.y;
            let lanzado = this.peces.create(x, y, 'pezGlobo');
            lanzado.setScale(0.3);
            this.pezGloboB=false;
            this.inventario_Pleg_B.setVisible(true);  // Alterna visibilidad
            this.inventario_Des_B.setVisible(false);
            this.pezGlobo_Desinf_B.setVisible(false);
            let animPezGlobo = 'inflarPG';
            lanzado.play(animPezGlobo, true);
            this.explotarPezGlobo(lanzado);
        } else if(cursor.left.isDown){
            let x=gatoB.x - 315;
            let y=gatoB.y;
            let lanzado = this.peces.create(x, y, 'pezGlobo');
            lanzado.setScale(0.3);
            this.pezGloboB=false;
            this.inventario_Pleg_B.setVisible(true);  // Alterna visibilidad
            this.inventario_Des_B.setVisible(false);
            this.pezGlobo_Desinf_B.setVisible(false);
            let animPezGlobo = 'inflarPG';
            lanzado.play(animPezGlobo, true);
            this.explotarPezGlobo(lanzado);
        } else if(cursor.up.isDown){
            let x=gatoB.x;
            let y=gatoB.y - 300;
            let lanzado = this.peces.create(x, y, 'pezGlobo');
            lanzado.setScale(0.3);
            this.pezGloboB=false;
            this.inventario_Pleg_B.setVisible(true);  // Alterna visibilidad
            this.inventario_Des_B.setVisible(false);
            this.pezGlobo_Desinf_B.setVisible(false);
            let animPezGlobo = 'inflarPG';
            lanzado.play(animPezGlobo, true);
            this.explotarPezGlobo(lanzado);
        }else if(cursor.down.isDown){
            let x=gatoB.x;
            let y=gatoB.y + 300;
            let lanzado = this.peces.create(x, y, 'pezGlobo');
            lanzado.setScale(0.3);
            this.pezGloboB=false;
            this.inventario_Pleg_B.setVisible(true);  // Alterna visibilidad
            this.inventario_Des_B.setVisible(false);
            this.pezGlobo_Desinf_B.setVisible(false);
            let animPezGlobo = 'inflarPG';
            lanzado.play(animPezGlobo, true);
            this.explotarPezGlobo(lanzado);
        }
    } 
    
    //RESTRICCIONES 
    //arbustos
     // Restringir a gatoA
     if (gatoA.x < arbusto.x) gatoA.x = arbusto.x;
     if (gatoA.x > arbusto.x + arbusto.width) gatoA.x = arbusto.x + arbusto.width;
     if (gatoA.y < arbusto.y) gatoA.y = arbusto.y;
     if (gatoA.y > arbusto.y + arbusto.height) gatoA.y = arbusto.y + arbusto.height;
 
     // Restringir a gatoB
     if (gatoB.x < arbusto.x) gatoB.x = arbusto.x;
     if (gatoB.x > arbusto.x + arbusto.width) gatoB.x = arbusto.x + arbusto.width;
     if (gatoB.y < arbusto.y) gatoB.y = arbusto.y;
     if (gatoB.y > arbusto.y + arbusto.height) gatoB.y = arbusto.y + arbusto.height;
}

moverPezParabola(pez, destinoX, destinoY, duracion = 2000) {
    const xInicio = 400; // Posición X inicial común para todos los peces (ajusta este valor)
    const yInicio = pez.scene.cameras.main.height + 50; // Posición Y inicial debajo de la pantalla

    // Configurar la posición inicial del pez
    pez.setPosition(xInicio, yInicio);

    // Asegurarse de que no haya un Tween activo antes de iniciar uno nuevo
    if (pez.hasTween) {
        return; // Si ya está en movimiento, no iniciar otro movimiento
    }

    // Marcar que el pez tiene un Tween activo
    pez.hasTween = true;

    // Crear la trayectoria parabólica utilizando un Tween de Phaser
    pez.scene.tweens.add({
        targets: pez,
        x: destinoX, // La posición X puede variar, ya que cada pez va a un destino diferente
        y: destinoY, // Posición Y final en la región
        duration: duracion, // Duración del movimiento
        ease: 'Quad.easeOut', // Suaviza el movimiento, creando la parábola
        onUpdate: (tween, target) => {
            // Ajustar la posición en Y para simular la parábola
            const progress = tween.progress; // Progreso del Tween (0 a 1)
            const alturaMax = 100; // Altura máxima de la parábola
            target.y = destinoY - alturaMax * (4 * (progress - 0.5) ** 2 - 1); // Fórmula de parábola
        },
        onComplete: () => {
            // Cuando el movimiento termina, reproducir la animación idle
            pez.hasTween = false; // Marcar que el pez ya no está en movimiento
            pez.play(pez.animIdle, true); // Usar la animación específica de cada pez
            // Una vez que el pez llegue al suelo, marcarlo como tocado
            pez.haTocadoSuelo = true;  // Marcar que el pez ha tocado el suelo
            console.log('Pez tocó el suelo');
        }
    });

    // Iniciar animación de salida mientras el pez se mueve
    pez.play(pez.animSalir, true); // Usar la animación de salida correspondiente
}

aparecerPeces() {
    let limiteDePeces = 7;
    let pecesPorRegion = Math.floor(limiteDePeces / tierra.length); // Peces por región
    let pecesExtras = limiteDePeces % tierra.length; // Peces sobrantes

    tierra.forEach((region, index) => {
        // Determinar cuántos peces asignar a esta región
        let pecesEnEstaRegion = pecesPorRegion + (pecesExtras > 0 ? 1 : 0);
        if (pecesExtras > 0) pecesExtras--; // Reducir los peces sobrantes

        for (let i = 0; i < pecesEnEstaRegion; i++) {
            let tipoPez = Phaser.Math.RND.pick(['pez', 'piraña', 'pezGlobo', 'angila']);
            let x = Math.random() * region.width + region.x;
            let y = Math.random() * region.height + region.y;
            let nuevoPez = this.peces.create(x, y, tipoPez);

            // Agregar la propiedad haTocadoSuelo
            nuevoPez.haTocadoSuelo = false;

            // Asignar las animaciones correctas para cada pez
            let animSalir, animIdle;
            if (tipoPez === 'angila') {
                nuevoPez.setScale(0.25);
                nuevoPez.setSize(10, 10);
                animSalir = 'salirA';
                animIdle = 'idleA';
            } else if (tipoPez === 'pezGlobo') {
                nuevoPez.setScale(0.30);
                nuevoPez.setSize(5, 5);
                animSalir = 'salirPG';
                animIdle = 'inflarPG'; // Cambiar aquí según el nombre de la animación
                this.explotarPezGlobo(nuevoPez);
            } else if (tipoPez === 'pez') {
                nuevoPez.setScale(0.30);
                nuevoPez.setSize(5, 5);
                animSalir = 'salirE';
                animIdle = 'idleE';
            } else if (tipoPez === 'piraña') {
                nuevoPez.setScale(0.25);
                nuevoPez.setSize(5, 5);
                animSalir = 'salirP';
                animIdle = 'idleP';
            }

            // Asignar las animaciones específicas a las propiedades del pez
            nuevoPez.animSalir = animSalir;
            nuevoPez.animIdle = animIdle;

            // Reproducir la animación de salida mientras el pez se mueve
            nuevoPez.play(animSalir, true);

            // Llamar a moverPezParabola para que se mueva hacia su destino con la parábola
            this.moverPezParabola(nuevoPez, x, y, 2000); // Mueve el pez hacia su destino con la parábola

            // Calcular duración de la animación de salida
            let framesAnimSalir = this.anims.get(animSalir).frames.length;
            let frameRateAnimSalir = this.anims.get(animSalir).frameRate;
            let duracionSalir = (framesAnimSalir / frameRateAnimSalir) * 1000; // En milisegundos

            // Programar el cambio a la animación idle después de la duración de salir
            this.time.delayedCall(duracionSalir, () => {
                if (nuevoPez && nuevoPez.active) { // Verifica que el pez no haya sido destruido
                    nuevoPez.play(animIdle, true);
                }
            });
        }
    });

    // Reiniciar las variables de espera de los gatos después de que aparezcan los peces
    gatoAwait = false;
    gatoBwait = false;
}



destruirPeces(gato, pez) {
    console.log('Entra en el colisionador');

    // Verificar si el pez ha tocado el suelo antes de permitir que el gato lo capture
    if (!pez.haTocadoSuelo) {
        // Si el pez no ha tocado el suelo, no hacer nada (no permitir capturarlo)
        console.log('El pez aún no ha tocado el suelo, no puede ser capturado.');
        return;
    }

    // Si el pez ha tocado el suelo, permitir la captura

    if (pez.anims.currentAnim.key === 'idleE'){     // Pez normal
        console.log('Pez identificado: nemo');
        if(gato.name == 'GatoA'){ 
            puntosA = puntosA + 1;
            textoA.setText(" " + puntosA);
            this.sonidoPezBueno.play();
        } else if(gato.name == 'GatoB'){
            puntosB = puntosB + 1;
            textoB.setText(" " + puntosB);
            this.sonidoPezBueno.play();
        }
    } else if(pez.anims.currentAnim.key === 'idleP'){   // Piraña
        console.log('Pez identificado: piraña');
        if(gato.name == 'GatoA'){ 
            puntosA = puntosA - 3;
            textoA.setText(" " + puntosA);
            this.sonidoPezMalo.play();
        } else if(gato.name == 'GatoB'){
            puntosB = puntosB - 3;
            textoB.setText(" " + puntosB);
            this.sonidoPezMalo.play();
        }
    } else if(pez.anims.currentAnim.key === 'idleA'){   // Anguila
        console.log('Pez identificado: anguila');
        this.sonidoAnguila.play();
        gato.canMove = false;
        setTimeout(() => {
            console.log('Movimiento restaurado');
            gato.canMove = true;
        }, 5000);
    } else if(pez.anims.currentAnim.key === 'inflarPG' || pez.anims.currentAnim.key === 'salirPG'){   // Pez Globo
        if(gato.name == 'GatoA'){ 
            this.pezGloboA = true;
            puntosA = puntosA + 2;
            textoA.setText(" " + puntosA);
            this.sonidoPezBueno.play();
        } else if(gato.name == 'GatoB'){
            this.pezGloboB = true;
            puntosB = puntosB + 2;
            textoB.setText(" " + puntosB);
            this.sonidoPezBueno.play();
        }    
    }

    pez.destroy();  // El pez se destruye cuando uno de los jugadores lo toca
}

// Método para explotar el pez globo
explotarPezGlobo(pez) {
    if (!pez.active) {
        console.log("El pez ya ha sido destruido o no está activo.");
        return;
    }

    let tiempo = 7000; // Duración de la animación de explosión en milisegundos

    // Guardamos las posiciones iniciales de los gatos al momento de aparecer el pez
    let coordA = new Phaser.Math.Vector2(gatoA.x, gatoA.y);
    let coordB = new Phaser.Math.Vector2(gatoB.x, gatoB.y);
    
    // Creamos un objeto para almacenar las posiciones dinámicas de los gatos
    let posicionesGatos = { gatoA: coordA, gatoB: coordB };

    // Función que actualiza las posiciones de los gatos en tiempo real
    const actualizarPosiciones = () => {
        posicionesGatos.gatoA.set(gatoA.x, gatoA.y);
        posicionesGatos.gatoB.set(gatoB.x, gatoB.y);
    };

    // Establecemos un temporizador que actualiza las posiciones de los gatos cada frame
    let actualizarPosicionesEvent = this.time.addEvent({
        delay: 100,  // Cada 100ms actualizamos las posiciones
        callback: actualizarPosiciones,
        loop: true
    });

    // Establecemos el retraso de 7 segundos para la animación de la explosión
    this.time.delayedCall(tiempo, () => {
        // Detenemos solo el evento de actualización de posiciones (no todos los eventos)
        actualizarPosicionesEvent.remove();

        // Verificamos si el pez sigue activo antes de proceder
        if (!pez || !pez.active) {
            console.log('El pez no está disponible o ya ha sido destruido.');
            return;
        }

        // Iniciar la animación de explosión solo si el pez está activo
        pez.play('explotarPG', true);

        // Calculamos la duración de la animación de explosión
        let framesAnim = this.anims.get('explotarPG').frames.length;
        let frameRateAnim = this.anims.get('explotarPG').frameRate;
        let duracion = (framesAnim / frameRateAnim) * 1000; // Duración en milisegundos

        // Configuramos el retraso para destruir el pez después de que termine la animación
        this.time.delayedCall(duracion, () => {
            if (pez.active) {  // Asegurarnos de que el pez esté activo antes de destruirlo
                pez.destroy();  // Destruir el pez cuando la animación haya terminado
                this.sonidoExplosion.play();
                console.log("Pez destruido por explosión");
            }
        });

        // Posición de la explosión
        let explosion = new Phaser.Math.Vector2(pez.x, pez.y);

        // Usamos las posiciones más actualizadas de los gatos
        let coordAActualizada = posicionesGatos.gatoA;
        let coordBActualizada = posicionesGatos.gatoB;

        // Define el radio de la explosión
        let radioExplosion = 200; // En píxeles

        // Comprobar si Gato A está dentro del rango de la explosión
        if (coordAActualizada.distance(explosion) <= radioExplosion) {
            puntosA = puntosA - 2;
            textoA.setText("Puntos: " + puntosA);
            console.log("Gato A recibió daño. Puntos: " + puntosA);
        }

        // Comprobar si Gato B está dentro del rango de la explosión
        if (coordBActualizada.distance(explosion) <= radioExplosion) {
            puntosB = puntosB - 2;
            textoB.setText("Puntos: " + puntosB);
            console.log("Gato B recibió daño. Puntos: " + puntosB);
        }
    }); // Retraso de 7 segundos antes de ejecutar la explosión
}


updateTimer() {
    this.remainingTime -= 1; // Decrementar el tiempo restante

    // Actualizar el texto con el nuevo tiempo
    this.timerText.setText(this.remainingTime);

    // Verificar si el tiempo ha llegado a cero
    if (this.remainingTime <= 0) {
        this.timeUp(); // Llamar a la función para manejar el fin del tiempo
    }
}

timeUp() {
    this.scene.start("ResultScreen"); // Cambiar a la escena ResultScreen
}


} 