# Purrfect Catch - Game Design Document (GDD)

## Índice
- [Introducción](#1-introducción)
  - [Concepto del juego](#11-concepto-del-juego)
  - [Características principales](#12-características-principales)
  - [Género](#13-género)
  - [Propósito y público objetivo](#14-propósito-y-público-objetivo)
  - [Jugabilidad](#15-jugabilidad)
  - [Estilo visual](#16-estilo-visual)
  - [Alcance](#17-alcance)
  - [Plataforma](#18-plataforma)
  - [Categoría](#19-categoría)
  - [Licencia](#110-licencia)
- [Niveles](#2-niveles)
  - [Objetivo](#21-objetivo)
  - [Fin de Partida](#22-fin-de-partida)
  - [Escenario 1 – Descampado](#23-escenario-1--descampado)
  - [Escenario 2 – Juego de Mesa](#24-escenario-2--juego-de-mesa)
  - [Escenario 3 – Vórtice](#25-escenario-3--vórtice)
- [Personajes – Ítems](#3-personajes--ítems)
  - [Personajes](#31-personajes)
  - [Ítems](#32-ítems)
    - [Nemo](#321-nemo)
    - [Chimuelo](#322-chimuelo)
    - [Puffer](#323-puffer)
    - [Chispitas](#324-chispitas)
- [Mecánicas - Diagrama de Flujo](#4-mecánicas---diagrama-de-flujo)
  - [Jugabilidad](#41-jugabilidad)
  - [Flujo del Juego](#42-flujo-del-juego)
  - [Movimientos y Físicas](#43-movimientos-y-físicas)
    - [Mecánica de Movimiento](#431-mecánica-de-movimiento)
    - [Mecánica de Pesca](#432-mecánica-de-pesca)
    - [Mecánica de Pérdida de Tiempo / Movilidad](#433-mecánica-de-pérdida-de-tiempo--movilidad)
    - [Mecánica de Ataque](#434-mecánica-de-ataque)
    - [Mecánica de Inventario](#435-mecánica-de-inventario)
    - [Mecánica de Desaparición de Obstáculos](#436-mecánica-de-desaparición-de-obstáculos)
    - [Mecánica Competitiva](#437-mecánica-competitiva)
    - [Mecánica de Tiempo](#438-mecánica-de-tiempo)
    - [Mecánica de Selección de Nivel y Tutorial](#439-mecánica-de-selección-de-nivel-y-tutorial)
- [Estados e Interfaces](#5-estados-e-interfaces)
  - [Diagrama de Estados](#51-diagrama-de-estados)
  - [Pantallas e Interfaces](#52-pantallas-e-interfaces)
- [Música y Sonido](#6-música-y-sonido)
- [Comunicación en Red](#7-comunicación-en-red)
- [Compilación](#8-compilación)


## 1. Introducción
Este documento, acerca del videojuego Purrfect Catch, contiene todas las características y especificaciones del videojuego ideado para la asignatura de Juegos en Red y preparado para PC.

### 1.1. Concepto del juego
**Purrfect Catch**  es un videojuego competitivo para dos jugadores en el que cada uno asume el rol de un gato pescador. El objetivo es obtener el mayor puntaje posible capturando peces en un tiempo limitado. La pesca se desarrolla en la misma pantalla, donde cada jugador debe competir por su espacio, luchando simultáneamente por la victoria.

### 1.2. Características principales
Dentro de Purrfect Catch, los jugadores se encuentran con diferentes tipos de peces, cada uno con un valor de puntaje único y características que ofrecen ventajas o desventajas. El tiempo de juego se mantiene constante en todas las partidas.

Para sacar peces del agua se usa la mecánica de pescar, basta con pulsar la Q (Jugador 1) o la P (Jugador 2) para ello. Al tocar el pez correcto, automáticamente se sumará la puntuación correspondiente al marcador del jugador. 
El personaje tiene libertad de movimiento en todas direcciones, lo que permite esquivar fácilmente los peces malos. Estos peces, si no son capturados, desaparecen de la pantalla automáticamente después de unos segundos, evitando la acumulación de obstáculos en la escena y el consumo innecesario de recursos.

Hay un pez especial que si es capturado puede ser lanzado al jugador contrario para atacarle. Esta mecánica equilibra el desafío, permitiendo a los jugadores concentrarse tanto en la recolección de peces buenos como en atacar al jugador contrario, mientras se evitan los malos.

### 1.3. Género
El género del juego se clasifica como party game y competitivo.

### 1.4. Propósito y público objetivo
El propósito principal del juego es ofrecer una experiencia divertida, accesible y competitiva para dos jugadores. A través de mecánicas simples con diferentes puntajes. Fomenta la competencia amistosa entre los jugadores.
Está pensado para todos los públicos, desde niños y familias hasta jugadores casuales y grupos de amigos.

### 1.5. Jugabilidad
Como ya se ha mencionado anteriormente, Purrfect Catch se compone de diferentes escenarios donde el jugador debe pescar el mayor número de peces posible. El juego se divide en tres escenarios y cada partida tiene una duración un minuto y medio.
Sin embargo, cada pez presenta características únicas que afectan de diferentes formas al jugador:
- Pez Común: Este es el pez más básico y suma 1 punto al marcador del jugador cada vez que es atrapado.
- Piraña: Es un pez peligroso. Si el jugador lo captura por accidente, se le restan 3 puntos del marcador.
- Pez Globo: Este pez tiene dos posibles efectos, dependiendo de su estado:
  - Si el jugador lo captura antes de que se infle, obtiene 2 puntos. Además de poder usarlo para atacar al jugador contrario.
  - Si el pez ya está inflado cuando es atrapado, el jugador pierde 2 puntos al igual si es atacado por un pez globo.
- Anguila: Al capturarla, la anguila tiene un efecto negativo, ya que detiene al personaje durante 5 segundos.

### 1.6. Estilo visual
Se ha optado por un estilo en 2D cartoon-estilizado con colores vivos y sombras planas. En cuanto a los personajes, estos son mezclas de gatos humanizados, es decir, son gatos con una movilidad bípeda y con vestimenta de pescador. El fondo va cambiando, dependiendo del nivel. Visto desde fuera con una perspectiva cenital. Las referencias que hemos escogido para el estilo son: Mario Party, Talking Tom y Wii Party . Hemos optado por este estilo visual porque resulta más atractivo para nuestro público objetivo. Además, el estilo cartoon 2D nos permite mayor libertad y facilidad a la hora de crear los personajes y fondos.

### 1.7. Alcance
En un principio será un único juego, pero no se descarta crear una segunda parte o ampliar el juego a otras plataformas como por ejemplo la Nintendo Switch.

### 1.8. Plataforma
El juego está desarrollado para ordenador siguiendo nuestro objetivo de que se pueda jugar con amigos desde cualquier lugar.

### 1.9. Categoría
Competitivo, casual y accesible.

Análisis DAFO:
## Análisis DAFO

|                       | **De origen interno**                           | **De origen externo**                          |
|-----------------------|-------------------------------------------------|------------------------------------------------|
| **Negativos**         | **Debilidades:**                                | **Amenazas:**                                  |
|                       | - Falta de profundidad a largo plazo.           | - Competencia con otros party games.           |
|                       | - Limitado a multijugador local.                | - Riesgo de saturación del mercado de juegos casuales. |
|                       | - Rejugabilidad condicionada.                   | - Desinterés de jugadores hardcore.            |
|                       |                                                 | - Dependencia de las interacciones locales.    |
|                       |                                                 |                                                |
| **Positivos**         | **Fortalezas:**                                 | **Oportunidades:**                             |
|                       | - Accesibilidad.                                | - Expansión de contenido.                      |
|                       | - Temática amigable.                            | - Multijugador en línea.                       |
|                       | - Competitividad multijugador local.            | - Merchandising.                               |
|                       | - Duración corta de las partidas.               | - Compatibilidad multiplataforma.              |
|                       | - Varios Escenarios.                            | - Eventos y torneos.                           |


### 1.10. Licencia
Nuestro juego es puramente original, por lo que no está basado en ninguna otra franquicia ni es una adaptación de otro tipo de producto multimedia. Se desconocen los planes a futuro de este juego, por lo que no se puede determinar si será una franquicia, probablemente se crearán contenidos adicionales para esta entrega.


## 2. Niveles
### 2.1. Objetivo
En los niveles, el objetivo es recoger el mayor número de peces para conseguir mayor
puntuación que el jugador rival.

### 2.2. Fin de Partida
Para completar la partida y desbloquear los diferentes escenarios hace falta cumplir una condición de puntaje, gana el jugador con más puntos.
Si al terminar el nivel, ambos jugadores quedan con 0 puntos o ambos jugadores tienen el mismo número de puntos, el juego acaba en empate.


### 2.3. Escenario 1 – Descampado
El primer escenario está orientado en un descampado, los jugadores deberán cruzar puentes y las tablas para pasar a la parte central del mapa y de una orilla del río a la otra. Todo ello para recoger los peces que saltan del agua y caen en el suelo. 

![Final](https://github.com/user-attachments/assets/eeec2830-ba1b-4c83-b3a2-7394c742a195)

### 2.4. Escenario 2 – Juego de Mesa
El segundo escenario está orientado en una mesa en la que se ha vertido agua. Los jugadores deben usar las plataformas y moverse por los elementos de la mesa mientras recogen peces que salen del agua vertida en ella.

![Final](https://github.com/user-attachments/assets/a38337bf-e218-47b8-86a7-7d550538b429)

### 2.5. Escenario 3 – Vórtice
El último escenario está orientado en un vórtice, con varias islas alrededor y un acantilado. En este caso los peces nadan siguiendo el giro del vórtice y salen de él para caer en los puentes colgantes que hay entre las islas y en las islas mismas.

![Escenario 3 - Fondo Blanco](https://github.com/user-attachments/assets/c907e746-bbf2-475d-a274-5f55ad04c18b)


## 3. Personajes – Ítems
### 3.1. Personajes
Menta y Chocolate son un par de gatos que son controlados por el jugador, los cuales tienen como objetivo capturar peces. Menta es un gato naranja de ojos verdes con un traje de pescador de colores cálidos. Mientras que chocolate es un gato blanco con manchas negras y ojos amarillos con un traje con una paleta de color más oscura.
| ![gatoA](https://github.com/user-attachments/assets/088e5be3-8536-44ee-a72f-9a378535dac2) |  ![gatoB](https://github.com/user-attachments/assets/5f012cf8-9cf6-496f-bf13-b5628572e516) |
|-------------------------------------|-------------------------------------|

### 3.2. Ítems
#### 3.2.1. Nemo
Perca dorada que le da un punto al jugador que la capture.
![Nemo_HS](https://github.com/user-attachments/assets/32eb8d4b-030a-4e0e-bef9-5bdd8cdd0e9c)

#### 3.2.2. Chimuelo
Piraña con una paleta oscura donde predominan los colores negro y rojo. El cual, si llega a chocar con el jugador, le morderá y le hará perder 3 puntos.
![chimuelo_HS](https://github.com/user-attachments/assets/394e5f7d-a37c-43e6-bad0-fd64fefcd3c5)

#### 3.2.3. Puffer
Pez globo que se puede presentar como un pez pequeño amarillo con manchas o hinchado con púas. Si el jugador lo atrapa en su primera forma obtendrá 2 puntos y podrá usarlo para atacar al jugador contrario. Pero si lo atrapa en su segunda forma perderá 2 puntos.
![puffer_HS](https://github.com/user-attachments/assets/72770046-f621-4e0f-8155-303c78c8551c)

#### 3.2.4. Chispitas
Anguila morada, la cual al chocar con el jugador le dará un choque eléctrico lo que lo inmovilizará durante 5 segundos.
![chispitas_HS](https://github.com/user-attachments/assets/904cd39d-93fc-44dc-9293-633d65fd3949)


## 4. Mecánicas - Diagrama de Flujo
Las mecánicas de Purrfect Catch se pueden dividir en varios aspectos clave que afectan tanto el control del personaje como la interacción con los elementos del juego.

![Diagramas - Frame 2](https://github.com/user-attachments/assets/9211c485-58af-4686-a979-21952e6b8f84)

### 4.1. Jugabilidad
El jugador asume el rol de un gato pescador que debe capturar peces en un entorno de multijugador local. La jugabilidad es sencilla y accesible, enfocada en la competencia rápida y divertida entre dos jugadores. Los jugadores deben moverse libremente por su área, recogiendo peces buenos, atacando al otro jugador y evitando peces malos en un tiempo limitado (1:30 minutos por partida).

### 4.2. Flujo del Juego
Cada partida sigue un flujo simple: los jugadores comienzan seleccionando un escenario y luego entran en acción. Los gatos pueden moverse libremente para capturar peces buenos, atacar y esquivar los malos. Cada partida termina cuando se agota el tiempo, y se calculan los puntajes según los peces capturados. El juego cuenta con tres escenarios.

### 4.3. Movimientos y Físicas
#### 4.3.1 Mecánica de Movimiento
**Controles**: El jugador 1 utiliza las teclas W, A, S, D y el jugador 2 las flechas de dirección para mover al personaje dentro del área de juego. Para pescar, el jugador 1 utiliza la tecla Q y el jugador 2 utiliza la tecla P.
**Movimiento Libre**: El personaje tiene la libertad de moverse en cualquier dirección para esquivar peces malos (pirañas, peces globo hinchados y anguilas) y recoger peces buenos.

#### 4.3.2 Mecánica de Pesca
**Captura de peces**: El jugador puede pescar peces con su tecla correspondiente para sacarlos del agua y capturarlos simplemente tocándolos. No se necesita una acción adicional más allá de mover al personaje y la pesca.
**Valor de peces**: Cada tipo de pez tiene un valor de puntos único o efecto especial:
- Pez común: +1 punto.
- Piraña: -3 puntos.
- Pez globo: +2 puntos si se captura antes de que se hinche; -2 puntos y ralentiza al personaje si ya está hinchado. Además, permite usarse como arma para atacar a otros jugadores.
- Anguila: Detiene al personaje durante 5 segundos si es tocada.

#### 4.3.3 Mecánica de Pérdida de Tiempo / Movilidad
Efectos de los peces malos:
- **Pirañas**: Resta puntos (-3), sin afectar la movilidad del jugador.
- **Pez globo**: Si se captura cuando está hinchado, el jugador no solo pierde 2 puntos, sino que su personaje también se ve ralentizado por un tiempo limitado.
- **Anguila**: Paraliza al personaje durante 5 segundos, impidiendo que se mueva o capture más peces.

#### 4.3.4 Mecánica de Ataque
El jugador puede usar los peces globo capturados para atacar al jugador contrario y hacerle perder 2 puntos si consigue darle. Para atacar hay que estar frente al enemigo y usar la tecla F en el caso del jugador 1 y la tecla O en el caso del jugador 2.
Para acertar con el golpe basta con que el enemigo este en un rango específico al pulsar la tecla.

#### 4.3.5 Mecánica de Inventario
Cada jugador, tiene un inventario en su lateral de la pantalla con dos espacios para almacenar los peces capturables y que muestra el número de peces que posee. Después de capturar cualquier pez, se guardan en este inventario para su futuro uso.
Para abrir el inventario el jugador 1 usa la tecla E y el jugador 2 la tecla L.

#### 4.3.6 Mecánica de Desaparición de Obstaculos
Los peces peligrosos (como las pirañas y los peces globo) desaparecen de la pantalla automáticamente después de un breve período de tiempo si no son capturados, evitando que se acumulen demasiados obstáculos.

#### 4.3.7 Mecánica de Competitiva
**Puntaje final**: Al final de cada partida, se calcula el puntaje acumulado de cada jugador. El objetivo es sumar más puntos que el contrincante en el tiempo establecido, pescando la mayor cantidad de peces buenos y evitando los malos.

#### 4.3.8 Mecánica de Tiempo
**Tiempo limitado**: Cada nivel tiene un límite de tiempo de 1:30 minutos. Los jugadores deben maximizar su puntaje dentro de ese tiempo.
**Tiempo constante**: El tiempo por partida permanece igual, lo que añade presión para conseguir la mayor cantidad de puntos en menos tiempo.

#### 4.3.9 Mecánica de Selección de Nivel y Tutorial
**Menú de selección de escenario**: Antes de comenzar la partida, los jugadores pueden elegir entre los tres escenarios disponibles.disponibles.
**Tutorial**: El juego incluye un tutorial explicativo que detalla los diferentes tipos de peces y sus efectos, lo que ayuda a los jugadores a entender rápidamente la mecánica de pesca y evitar penalizaciones.

## 5. Estados e Interfaces
### 5.1. Diagrama de Estados
![Estados](https://github.com/user-attachments/assets/287067ba-5bb2-450a-85d0-5df5159e049c)

### 5.2. Pantallas e Interfaces
Pantalla de inicio con un botón de jugar, tutorial, chat, créditos y otro para salir al escritorio. Además, incluye un indicador de estado de conexión.
![Menú Inicio](https://github.com/user-attachments/assets/a7f46d32-f54e-40fe-a49a-0f28eed24164)

Pantalla de selección de juego local / online

<img src="https://github.com/user-attachments/assets/532064f8-88f3-4488-8655-ed6d2500a7b8" alt="Local-Online" width="1200" height="720">

Pantalla de chat con una interfaz y un botón de enviar mensajes. Tiene persistencia y permite ver el nombre del usuario que ha escrito.
![Chat](https://github.com/user-attachments/assets/bec528c1-6871-4ab9-824f-85e0427edb5b)

Pantalla de pausa con opciones para ir a la pantalla de inicio o la pantalla de juego. Además, incluye una slider para cambiar el volumen del juego.
![pausa_montada](https://github.com/user-attachments/assets/dc81782e-7b6e-494b-9d7c-f924c6857d0b)

Pantalla de créditos con los autores del juego y un botón de regreso a la pantalla de inicio.
![Captura de pantalla 2024-11-24 190111](https://github.com/user-attachments/assets/a8f9b407-3e63-40d8-ba8b-d5b88d5d6fa2)

Interfaz de inventario con un hueco para cada almacenar peces.

![inventario_chico_2](https://github.com/user-attachments/assets/ba798d54-b2f0-412f-8c01-2c3fe12f5ad2)

Interfaz de tiempo con un contador de 90 segundos.

![reloj](https://github.com/user-attachments/assets/9b0e35b4-170b-4abc-b5bf-2bb22d500573)

Pantalla de selección de escenario con 3 posibles opciones desbloqueables con el tiempo.
![Escenarios](https://github.com/user-attachments/assets/91c29fd6-2344-4539-aa83-9f2c8752f722)

Pantalla de inicio de sesión y de registro (Intercambiables) para jugar online en el servidor. Además, de dos pantallas de eliminar usuario y cambio de contraseña, también intercambiables y accesibles.
![Inicio de Sesión](https://github.com/user-attachments/assets/96036bb2-5c1d-4d6b-98f3-fcdcabd1d72f)
![Registro](https://github.com/user-attachments/assets/70550e27-863a-4386-92e1-11449201c087)
![Cambio de Contraseña](https://github.com/user-attachments/assets/4070b0bb-f360-4587-afad-afc7da3c8ef9)
![Eliminar Usuario](https://github.com/user-attachments/assets/86ada251-9036-4d05-979e-9b2b2b8b5fdd)

Pantalla de tutorial con los controles del juego y un botón de regreso a la pantalla de inicio.
![Tutorial 1](https://github.com/user-attachments/assets/830b0f3e-4f7b-4f57-ad46-1415b995f49a)
![Tutorial 2](https://github.com/user-attachments/assets/cf8e0bf3-f148-446f-af5c-daaef0367724)
![Tutorial 3](https://github.com/user-attachments/assets/4037d273-14bd-4689-913c-3a2064407986)

Pantalla victoria / derrota / empate para el final del juego.
![victoria_derrota_2](https://github.com/user-attachments/assets/806e2e58-1661-462c-b0f6-8c94d709178e)
![empate](https://github.com/user-attachments/assets/fdc23d37-4a4b-43af-aadf-0a886cafc813)
![victoria_derrota_1](https://github.com/user-attachments/assets/8820a084-99d6-4e0e-9a1a-72791ca9f347)

## 6. Música y Sonido
Música:
- ♪	General: música de aventura relajada y con ambientación acuática de pesca. Corresponde a los escenarios.
- ♪	Victoria: pieza breve, alegre y motivadora que suena cuando gana el jugador
- ♪	Derrota: pieza breve, alegre y motivadora que suena cuando gana el jugador

Efectos de Sonido:
- ♫	Pesca: sonido de sedal al realizar la acción de pescar
- ♫	Lanzamiento de pez globo: sonido de agua al usar la tecla de ataque
- ♫	Botón de pausa: sonido de clic sobre el botón del menú de pausa
- ♫	Botón de salida: sonido de clic sobre el botón de salir del juego
- ♫	Explosión de pez globo: sonido de explosión
- ♫	Recogida de carpa: sonido de recoger a la carpa
- ♫	Recogida de pez globo: sonido de recoger al pez globo sin explotar
- ♫	Recogida de piraña: sonido de error por recoger a un pez malo
- ♫	Recogida de anguila: sonido eléctrico por recoger a la anguila

## 7. Comunicación en Red
Será un juego competitivo para dos jugadores que funcionará a través de la red de ordenadores del aula de la universidad.
El juego se ejecuta en una arquitectura cliente-servidor, el cliente se programará en JavaScript, mientras que el servidor en Java. 
Cada jugador podrá jugar en un ordenador distinto del aula mientras estén conectados a la misma red local y las acciones que haga se verán reflejadas en el dispositivo contrario en tiempo real. Los datos transmitidos son:
- Posiciones de los personajes
- Acciones de los jugadores (movimiento, recolección de peces)
- Eventos del juego (inicio de una nueva partida, finalización de la partida, actualización del puntaje)

## 8. Compilación
Para la compilación del .jar, es necesario poner: java -jar target/purrfectCatch-0.0.1-SNAPSHOT.jar en visual studio estando en el directorio raíz del proyecto. Esto lanza el servidor y a partir de ahí se puede obtener la IP usando la consola de windows, más el puerto q es el 8080 por defecto.

Las clases de Purrfect Catch se pueden dividir en 4 grupos, clases @Service, @Controller, Modelo y de iniciación de aplicación, en este diagrama se incluye la relación entre ellas:

![Clases](https://github.com/user-attachments/assets/813b508e-df52-443f-bc19-d782c9aeb06d)
