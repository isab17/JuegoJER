// Configuración básica del juego en Phaser
const config = {
    type: Phaser.AUTO,
    parent: 'container',  // Asegúrate de que Phaser se dibuje en el contenedor con id="container"
    width: 1200,  // Usamos un tamaño fijo de 600px para el ancho
    height:720,  // Usamos el mismo valor para la altura
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH, // Centra el juego automáticamente
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }, // Sin gravedad
            debug: false // Desactivar el modo de depuración
        }
    },

    scene: [Iniciarsesion, MapaOnline, MenuPrincipal, Chat, TutorialScene1, TutorialScene2, TutorialScene3, TutorialScene4, Creditos, GameOnline1,Mapa, GameLocal1, GameLocal2, PauseMenu, ResultScreen], // Scene que contiene la lógica del juego

    audio: {
        disableWebAudio: false // Configuración para el audio
    }
};


// Creación del juego usando la configuración definida
const game = new Phaser.Game(config);

// Variables globales para los gatos y controles
let gatoA, gatoB;

let cursor,keys,izqA,izqB,arribaA,arribaB,peces,gatoAwait,gatoBwait, puntosA=0, puntosB=0, textoA, 
textoB,arbusto,pez,zonasProhibidas,tierra,pesca,mapa, abiertoA, abiertoB, pezGloboA, 
pezGloboB,agua,mapaElegido, gameID, nombreA, nombreB,botonServer;



//Variables para websockets
let pescarGatoA=false,pescarGatoB=false,explosionPezGlobo=false, gatoAexplosion=false,gatoBexplosion=false,
capturaPezGlobo1=false,capturaPezGlobo2=false,lanzarPezGlobo1=false,lanzarPezGlobo2=false,gatoAParalizado=false,
gatoBParalizado=false,inventarioA=0,inventarioB=0,inventarioAbierto1=false,inventarioAbierto2=false,
ganarA=false,ganarB=false,perderA=false,perderB=false,mapa1=0,mapa2=0,Time=0;
var conexionIniciada=false, gatoAHasSelected=false, gatoBHasSelected=false,host = null, connection, 
gameOnPause1=false,gameOnPause2=false,userDesconectado1=false,userDesconectado2=false,colisionPez1=false,
colisionPez2=false;

var pezX=0, pezY =0;
let tipoPez = " ";
let animacionPez = "";
let pezAnims = " ";
let gato1Anims = " ";
let gato2Anims = " ";
let pecesGenerados = [];
let pecesLanzados = [];