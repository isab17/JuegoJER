package com.example.demo;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.*;

@Component
public class WebsocketHandler extends TextWebSocketHandler {
    private final Map<String, Player> players = new ConcurrentHashMap<>();  //Crear jugadores
    private final Map<String, Game> games = new ConcurrentHashMap<>(); //Crear sesiones de juegos
    private final Map<String, Sala> salasPrivadas = new ConcurrentHashMap<>();
    private final Map<Integer, Queue<WebSocketSession>> waitingByMap = new ConcurrentHashMap<>();
    private final ObjectMapper mapper = new ObjectMapper(); //Leer y escribir JSON
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1); //Ejecutar tareas programadas o periódicas

    private static class Player {
        WebSocketSession session;
        double x;
        double y;
        int score;
        int playerId;
        String animacionGato;
        int map; // Mapa seleccionado por el jugador

        
        // Nuevas propiedades del jugador
        boolean pezGlobo;
        boolean paralizado;
        boolean explosion;
        int inventario;
        boolean inventarioAbierto;
        boolean colision;
        boolean ganado;
        boolean perdido;
        boolean canMove;
        Object texto;  // Dependiendo de tu implementación, podrías cambiarlo a un tipo adecuado
        Object pezGloboIcono;  // Igualmente, dependiendo del tipo de tu icono
        Object inventarioPlegado;
        Object inventarioDesplegado;
    
        // Constructor
        Player(WebSocketSession session) {
            this.session = session;
            this.x = 0;
            this.y = 0;
            this.score = 0;
            this.playerId = 1;
            this.animacionGato = "";

            this.pezGlobo = false;
            this.paralizado = false; 
            this.explosion = false;
            this.inventario = 0;
            this.inventarioAbierto = false;
            this.colision = false;
            this.ganado = false;
            this.perdido = false;
            this.canMove = true;
            this.texto = "";
            this.pezGloboIcono = "";
            this.inventarioPlegado = "";
            this.inventarioDesplegado = "";
        }
    }
    

    private static class Game {
        Player player1;
        Player player2;
        int timeLeft = 90;
        ScheduledFuture<?> timerTask;
        boolean paused = false;
        List<Map<String, Object>> pecesGenerados = new ArrayList<>();
        public List<Map<String, Object>> pecesIniciales = new ArrayList<>();
    
        Game(Player player1, Player player2) {
            this.player1 = player1;
            this.player2 = player2;
        }
        boolean player1EnPausa = false;
        boolean player2EnPausa = false;
        boolean juegoPausado = false;



    }

    private static class Sala {
        Player jugador1;
        Player jugador2;
        boolean iniciada = false;
        Game game; // Se crea cuando están los dos
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        players.put(session.getId(), new Player(session));
    }

    private void startGame(Game game) {
        // Datos de jugadores
        List<List<Object>> playersData = Arrays.asList(
            Arrays.asList(game.player1.x, game.player1.y, 1, 0xff0000),
            Arrays.asList(game.player2.x, game.player2.y, 2, 0x0000ff)
        );
    
        // Generar peces iniciales
        generarPecesIniciales(game);
    
        // Enviar a los jugadores
        Map<String, Object> initData1 = Map.of(
            "id", 1,
            "p", playersData,
            "pecesIniciales", game.pecesIniciales
        );
        Map<String, Object> initData2 = Map.of(
            "id", 2,
            "p", playersData,
            "pecesIniciales", game.pecesIniciales
        );
    
        sendToPlayer(game.player1, "i", initData1);
        sendToPlayer(game.player2, "i", initData2);
        
    
        // Iniciar temporizador
        game.timerTask = scheduler.scheduleAtFixedRate(() -> {
            gameLoop(game);
        }, 0, 1, TimeUnit.SECONDS);
    }
    

    private void gameLoop(Game game) {
        if (game.paused || game.juegoPausado) return;
    
        game.timeLeft--;
        sendTimeUpdate(game);
    
        if (game.timeLeft <= 0) {
            endGame(game);
        }
    }
    
    
    private void endGame(Game game) {
        if (game.timeLeft <= 0) {
            int puntos1 = game.player1.score;
            int puntos2 = game.player2.score;
    
            boolean empate = puntos1 == puntos2;
    
            Map<String, Object> resultado1 = Map.of(
                "ganado", puntos1 > puntos2,
                "perdido", puntos1 < puntos2,
                "puntosPropios", puntos1,
                "puntosRival", puntos2,
                "empate", empate
            );
    
            Map<String, Object> resultado2 = Map.of(
                "ganado", puntos2 > puntos1,
                "perdido", puntos2 < puntos1,
                "puntosPropios", puntos2,
                "puntosRival", puntos1,
                "empate", empate
            );
    
            sendToPlayer(game.player1, "o", resultado1);
            sendToPlayer(game.player2, "o", resultado2);
    
            if (game.timerTask != null) game.timerTask.cancel(false);
            games.remove(game.player1.session.getId());
            games.remove(game.player2.session.getId());
        }
    }
    
    private void sendTimeUpdate(Game game) {
        sendToPlayer(game.player1, "t", game.timeLeft);
        sendToPlayer(game.player2, "t", game.timeLeft);
    }
    

    private void sendToPlayer(Player player, String type, Object data) {
        try {
            String json = mapper.writeValueAsString(data);
            String message = type + json;
            synchronized (player.session) {
                player.session.sendMessage(new TextMessage(message));
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    
    
    

    @Override
protected void handleTextMessage(WebSocketSession session, TextMessage message) {
    
    System.out.println("📩 Mensaje recibido: " + message.getPayload());
    try {

        Player currentPlayer = players.get(session.getId());
        Game game = games.get(session.getId());

        String payload = message.getPayload();
        char type = payload.charAt(0);
        String data = payload.length() > 1 ? payload.substring(1) : "";

        if (game == null && type != 'm' && type != 'l') return;

        Player otherPlayer = (game != null) ? ((game.player1 == currentPlayer) ? game.player2 : game.player1) : null;

        System.out.println("📩 Mensaje recibido: " + payload);

        switch (type) {
            case 'p': { // POS - posición con animación
                // Reenviar exactamente lo que se recibe (posición + animación)
                sendRawToPlayer(otherPlayer, payload);
                break;
            }

            case 'c': { // COLLECT - pez recogido
                Map<String, Object> collectData = mapper.readValue(data, Map.class);
                int playerId = (int) collectData.get("playerId");
                String animacion = (String) collectData.get("animacion");
            
                int puntos = 0;
                boolean paralizar = false;
                boolean esLanzado = collectData.containsKey("esLanzado") && Boolean.TRUE.equals(collectData.get("esLanzado"));

                switch (animacion) {
                    case "idleE": puntos = 1; break;
                    case "idleP": puntos = -3; break;
                    case "idleA": paralizar = true; break;
                
                    case "salirPG":
                    case "inflarPG":
                        puntos = esLanzado ? -2 : 2; // si fue lanzado, resta puntos
                        break;

                    case "explotarPG":
                        puntos = -2;
                        break;
                }
            
                collectData.put("puntos", puntos);
                collectData.put("paralizar", paralizar);
            
                currentPlayer.score += puntos;
            
                sendToPlayer(otherPlayer, "c", collectData);
                sendToPlayer(currentPlayer, "c", collectData);
                break;
            }
            
            

            case 'f': { // THROW - pez globo lanzado
                Map<String, Object> throwData = mapper.readValue(data, Map.class);
                sendToPlayer(otherPlayer, "f", throwData); // reenviar al otro jugador
                break;
            }

            case 's': { // STATE - estado completo
                Map<String, Object> stateData = createFullGameState(game);
                sendToPlayer(currentPlayer, "s", stateData);
                break;
            }

            case 'u': { // DISCONNECT
                sendToPlayer(otherPlayer, "u", Map.of("playerId", currentPlayer.playerId));
                break;
            }

            case 'r': { // RECONNECT
                // Simplemente reenviamos el estado actual
                Map<String, Object> stateData = createFullGameState(game);
                sendToPlayer(currentPlayer, "r", stateData);
                break;
            }
            case 'g': { // FISH_SPAWN - aparición de peces
                try {
                    List<Map<String, Object>> peces = mapper.readValue(data, List.class);
                    sendToPlayer(otherPlayer, "g", peces);
                } catch (Exception e) {
                    System.err.println("❌ Error al procesar peces:");
                    e.printStackTrace();
                }
                break;
            }

            case 'x': { // EXPLODE_PEZGLOBO
                try {
                    Map<String, Object> explosionData = mapper.readValue(data, Map.class);
                    int delay = 7000;
            
                    if (explosionData.containsKey("delay")) {
                        Object delayObj = explosionData.get("delay");
                        if (delayObj instanceof Number) {
                            delay = ((Number) delayObj).intValue();
                        }
                    }
            
                    System.out.println("💣 Programando explosión en " + delay + " ms para coordenadas: "
                            + explosionData.get("x") + "," + explosionData.get("y"));
            
                    scheduler.schedule(() -> {
                        try {
                            String explosionMsg = "x" + mapper.writeValueAsString(explosionData);
            
                            if (currentPlayer != null && currentPlayer.session != null && currentPlayer.session.isOpen()) {
                                currentPlayer.session.sendMessage(new TextMessage(explosionMsg));
                                System.out.println("📤 Enviada explosión al jugador actual");
                            }
            
                            if (otherPlayer != null && otherPlayer.session != null && otherPlayer.session.isOpen()) {
                                otherPlayer.session.sendMessage(new TextMessage(explosionMsg));
                                System.out.println("📤 Enviada explosión al otro jugador");
                            }
            
                        } catch (Exception e) {
                            System.err.println("❌ Error al enviar explosión sincronizada:");
                            e.printStackTrace();
                        } catch (Throwable t) {
                            System.err.println("💥 Excepción crítica en el hilo de explosión:");
                            t.printStackTrace();
                        }
                    }, delay, TimeUnit.MILLISECONDS);
            
                } catch (Exception e) {
                    System.err.println("❌ Error al procesar mensaje de explosión (x):");
                    e.printStackTrace();
                }
                break;
            }
            

            case 'k': { // KEEP_ALIVE
            
                break;
            }
            case 'v': { // Volver del menú de pausa
                try {
                    int playerId = Integer.parseInt(data.trim());
                    System.out.println("📦 Reanudación solicitada por jugador: " + playerId);
            
                    if (playerId == 1) {
                        game.player1EnPausa = false;
                    } else {
                        game.player2EnPausa = false;
                    }
            
                    if (!game.player1EnPausa && !game.player2EnPausa) {
                        game.juegoPausado = false;
                        game.paused = false;
                        System.out.println("✅ Ambos jugadores han vuelto. Reanudando juego.");
                        sendToPlayer(game.player1, "v", null);
                        System.out.println("📤 Enviando mensaje 'v' a Player1 y Player2");
                        sendToPlayer(game.player2, "v", null);
                        System.out.println("📤 Enviando mensaje 'v' a Player2 y Player1");

                    }
                } catch (NumberFormatException e) {
                    System.err.println("❌ Error al parsear playerId en mensaje 'v': " + data);
                    e.printStackTrace();
                }
                break;
                
            }

            case 'm': {
                Map<String, Object> mapData = mapper.readValue(data, Map.class);
                int mapa = (int) mapData.get("mapa");
                currentPlayer.map = mapa;
            
                // Añadir jugador a cola del mapa
                waitingByMap.putIfAbsent(mapa, new ConcurrentLinkedQueue<>());
                Queue<WebSocketSession> cola = waitingByMap.get(mapa);
                cola.add(session);
            
                System.out.println("📨 Jugador " + session.getId() + " seleccionó mapa " + mapa);
                System.out.println("🧾 Tamaño de cola para mapa " + mapa + ": " + cola.size());
            
                synchronized (cola) {
                    if (cola.size() >= 2) {
                        WebSocketSession s1 = cola.poll();
                        WebSocketSession s2 = cola.poll();
            
                        if (s1 == null || s2 == null) return;
            
                        Player p1 = players.get(s1.getId());
                        Player p2 = players.get(s2.getId());
            
                        p1.playerId = 1;
                        p2.playerId = 2;
                        p1.x = 200; p1.y = 620;
                        p2.x = 1090; p2.y = 160;
            
                        Game newGame = new Game(p1, p2);
                        games.put(s1.getId(), newGame);
                        games.put(s2.getId(), newGame);
            
                        sendToPlayer(p1, "m", Map.of("start", true, "mapa", mapa));
                        sendToPlayer(p2, "m", Map.of("start", true, "mapa", mapa));
            
                        System.out.println("🎮 Partida creada para mapa " + mapa + " entre " + s1.getId() + " y " + s2.getId());
            
                        startGame(newGame);
                    } else {
                        sendToPlayer(currentPlayer, "m", Map.of("start", false, "mapa", mapa));
                    }


                    System.out.println("📩 Mensaje recibido: " + message.getPayload());

                }
                break;
            }
            
            case 'z': { // PAUSE_SYNC
                try {
                    int playerId = Integer.parseInt(data.trim());
                    System.out.println("⏸ Pausa solicitada por jugador: " + playerId);
            
                        game.player1EnPausa = true;
                        game.player2EnPausa = true;
                    
            
                    game.juegoPausado = true;
                    game.paused = true;
            
                    // Enviar señal a ambos jugadores para abrir el menú
                    Map<String, Object> pauseData = Map.of("pause", true);
                    sendToPlayer(game.player1, "z", pauseData);
                    sendToPlayer(game.player2, "z", pauseData);
            
                } catch (NumberFormatException e) {
                    System.err.println(" Error al parsear playerId en mensaje 'z': " + data);
                    e.printStackTrace();
                }
                break;
            }

            case 'l': {
                Map<String, Object> lobbyData = mapper.readValue(data, Map.class);
                int mapaRecibido = (int) lobbyData.get("mapa");
                String codigo = (String) lobbyData.get("codigo");
            
                if (codigo == null || codigo.isEmpty()) {
                    System.out.println("❌ Código de sala inválido.");
                    sendToPlayer(currentPlayer, "error", Map.of("mensaje", "Código inválido"));
                    return;
                }
            
                Sala sala = salasPrivadas.get(codigo);
            
                if (sala == null) {
                    // No existe sala => crearla
                    sala = new Sala();
                    sala.jugador1 = currentPlayer;
                    salasPrivadas.put(codigo, sala);
            
                    currentPlayer.playerId = 1;
                    currentPlayer.x = 200;
                    currentPlayer.y = 620;
                    currentPlayer.map = mapaRecibido; //  Guardar mapa solo en jugador1
            
                    System.out.println(" Sala creada con código: " + codigo + ", esperando jugador 2...");
                    sendToPlayer(currentPlayer, "m", Map.of("start", false)); // opcional
                    return;
                }
            
                if (sala.iniciada || sala.jugador2 != null) {
                    System.out.println(" Sala " + codigo + " llena");
                    sendToPlayer(currentPlayer, "error", Map.of("mensaje", "Sala llena"));
                    return;
                }
            
                //  Ya existe el primer jugador
                sala.jugador2 = currentPlayer;
                sala.iniciada = true;
            
                currentPlayer.playerId = 2;
                currentPlayer.x = 1090;
                currentPlayer.y = 160;
                currentPlayer.map = sala.jugador1.map; // Copiar el mapa del jugador1
            
                Game newGame = new Game(sala.jugador1, sala.jugador2);
                sala.game = newGame;
                games.put(sala.jugador1.session.getId(), newGame);
                games.put(sala.jugador2.session.getId(), newGame);
            
                int mapaSala = sala.jugador1.map; // El mapa elegido
            
                System.out.println(" Partida iniciada para sala " + codigo + " en mapa " + mapaSala);
            
                sendToPlayer(sala.jugador1, "m", Map.of("start", true, "mapa", mapaSala));
                sendToPlayer(sala.jugador2, "m", Map.of("start", true, "mapa", mapaSala));
            
                startGame(newGame);
                break;
            }
            
        }
    } catch (IOException e) {
        e.printStackTrace();
    }
}

private void sendRawToPlayer(Player player, String rawMessage) throws IOException {
    if (player != null && player.session != null && player.session.isOpen()) {
        player.session.sendMessage(new TextMessage(rawMessage));
    }
}

private Map<String, Object> createFullGameState(Game game) {
    return Map.of(
        "player1", Map.of(
            "x", game.player1.x,
            "y", game.player1.y,
            "score", game.player1.score,
            "id", game.player1.playerId
        ),
        "player2", Map.of(
            "x", game.player2.x,
            "y", game.player2.y,
            "score", game.player2.score,
            "id", game.player2.playerId
        ),
        "pecesGenerados", game.pecesGenerados,
        "tiempo", game.timeLeft
    );
}



@Override
public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
    System.out.println("🔌 Conexión cerrada: " + session.getId());

    Player currentPlayer = players.remove(session.getId());

    Game game = games.remove(session.getId());
    if (game != null) {
        Player otherPlayer = (game.player1.session == session) ? game.player2 : game.player1;

        if (otherPlayer.session != null && otherPlayer.session.isOpen()) {
            System.out.println("✅ Notificando fin de partida por desconexión al jugador " + otherPlayer.playerId);

            int puntosCurrent = currentPlayer.score;
            int puntosOther = otherPlayer.score;

            boolean empate = puntosCurrent == puntosOther;
            boolean ganado = puntosOther > puntosCurrent;
            boolean perdido = puntosOther < puntosCurrent;

            sendToPlayer(otherPlayer, "o", Map.of(
                "ganado", ganado,
                "perdido", perdido,
                "puntosPropios", puntosOther,
                "puntosRival", puntosCurrent,
                "empate", empate,
                "desconexion", true
            ));
        }

        // Cancelar temporizador del juego si existe
        if (game.timerTask != null) {
            game.timerTask.cancel(false);
        }

        // Limpiar ambos jugadores del mapa de juegos
        games.remove(game.player1.session.getId());
        games.remove(game.player2.session.getId());
    }
}

private void generarPecesIniciales(Game game) {
    Random rand = new Random();

    List<Map<String, Object>> peces = new ArrayList<>();
    String[] tipos = {"pez", "piraña", "pezGlobo", "angila"};

    // Zonas de agua equivalentes a las usadas en Phaser
    int[][] zonasAgua = {
        {370, 650, 503, 50},
        {370, 0, 503, 50},
        {370, 210, 250, 270}
    };

    int total = 8;
    int zonas = zonasAgua.length;
    int pecesPorZona = total / zonas;
    int extras = total % zonas;

    for (int i = 0; i < zonas; i++) {
        int cantidad = pecesPorZona + (extras-- > 0 ? 1 : 0);

        int xZona = zonasAgua[i][0];
        int yZona = zonasAgua[i][1];
        int wZona = zonasAgua[i][2];
        int hZona = zonasAgua[i][3];

        for (int j = 0; j < cantidad; j++) {
            int x = xZona + rand.nextInt(wZona);
            int y = yZona + rand.nextInt(hZona);
            String tipo = tipos[rand.nextInt(tipos.length)];

            String animSalir = switch (tipo) {
                case "piraña" -> "salirP";
                case "pez" -> "salirE";
                case "pezGlobo" -> "salirPG";
                case "angila" -> "salirA";
                default -> "salirE";
            };

            String animIdle = switch (tipo) {
                case "piraña" -> "idleP";
                case "pez" -> "idleE";
                case "pezGlobo" -> "inflarPG";
                case "angila" -> "idleA";
                default -> "idleE";
            };

            Map<String, Object> pez = Map.of(
                "x", x,
                "y", y,
                "tipoPez", tipo,
                "animSalir", animSalir,
                "animIdle", animIdle
            );

            peces.add(pez);
        }
    }

    game.pecesIniciales = peces;
    }
}