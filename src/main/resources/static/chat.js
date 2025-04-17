class Chat extends Phaser.Scene {
    constructor() {
        super('Chat');
    }
    init(data) {
        this.escenaPrevia = data.escenaPrevia; // Guardar el nombre de la escena en pausa
        this.lastTimestamp = 0;
    }

    preload(){
        this.load.image("fondo", "assets/Pantalla_inicio/fondo_inicio.png");

        this.load.image('Boton_atras_normal', 'assets/Interfaces montadas/volver/normal.png');
        this.load.image('Boton_atras_encima', 'assets/Interfaces montadas/volver/seleccionado.png');
        this.load.image('Boton_atras_pulsado', 'assets/Interfaces montadas/volver/pulsado.png');
    }

    create() {
        
        const background = this.add.image(config.width / 2, config.height / 2, 'fondo');
        background.setScale(config.width / background.width, config.height / background.height); // Escalar fondo
        const sonidoBoton= this.sound.add("sonidoBoton", { loop: false, volume: 0.5 });

        // Crear chat inicialmente oculto
        // Crear un formulario de chat oculto inicialmente
        this.chatContainer = this.add.container(200, 200);

        // Fondo para el chat
        const chatBackground = this.add.rectangle(230, 100, 345, 300, 0x000000, 0.3)
        .setOrigin(0)
        .setStrokeStyle(2, 0xffffff);
        this.chatContainer.add(chatBackground);
    

        // Campo de entrada (simulado)
        const messageInput = this.add.rectangle(240, 350, 250, 30, 0xffffff, 0.9).setOrigin(0);
        this.chatContainer.add(messageInput);
        

        this.inputText = this.add.text(250,355,'',{
            font: '16px Arial',
            color: '#000'
        }).setOrigin(0);
        this.chatContainer.add(this.inputText);

        const sendButton = this.add.text(500, 350, 'Enviar', {
            font: '16px Arial',
            backgroundColor: '#92dcc0',
            padding: { left: 10, right: 10, top: 5, bottom: 5 },
            color: '#000000',
            align: 'center'
        })
        .setInteractive()
        .on('pointerover', () => sendButton.setStyle({ backgroundColor: '#82bea7' }))
        .on('pointerout', () => sendButton.setStyle({ backgroundColor: '#92dcc0' }))
        .on('pointerdown', () => {
            const message = this.inputText.text;
            if (message.trim() !== '') {
                this.sendMessage(message);
                this.inputText.setText('');
            }
        });
        this.chatContainer.add(sendButton);

        // Contenedor de mensajes
        this.messageLog = this.add.container(240, 110);
        this.chatContainer.add(this.messageLog);

        // Detectar teclas en el chat
        this.input.keyboard.on('keydown', (event) => {
            if (this.chatContainer.visible) {
                if (event.key === 'Backspace') {
                    this.inputText.setText(this.inputText.text.slice(0, -1));
                } else if (event.key === 'Enter') {
                    const message = this.inputText.text.trim();
                    if (message) {
                        this.sendMessage(message); // Pasa el mensaje a sendMessage
                        this.inputText.setText(''); // Limpia el campo
                    }
                } else if (event.key.length === 1) {
                    this.inputText.setText(this.inputText.text + event.key);
                }
                event.stopPropagation(); // ¡Evita que Phaser procese estas teclas!
            }
        });

        messageInput.on('focus', () => {
            scene.chatActivo = true; // Usa la referencia explícita a la escena
            if (scene.input) {
                scene.input.keyboard.enabled = false; // Desactiva controles del juego
            }
        });

        messageInput.on('blur', () => {
            scene.chatActivo = false; // Usa la referencia explícita a la escena
            if (scene.input) {
                scene.input.keyboard.enabled = true; // Reactiva controles del juego
            }
        });
    
        // Captura las teclas y detiene la propagación al juego
        messageInput.on('keydown', (event) => {
            event.stopPropagation(); // ¡Evita que Phaser procese estas teclas!
            if(event.key =='Enter'){
                sendMessage();
            }
        });
        
        this.fetchMessages(true);
        
        this.updateInterval = setInterval(() => {
            this.fetchMessages(false); // No es la primera carga, pasa `false`
        }, 2000); // Intervalo de 2 segundos
        this.scrollBar = this.add.rectangle(570, 110, 10, 50, 0xaaaaaa)
            .setOrigin(0)
            .setInteractive();
        this.chatContainer.add(this.scrollBar);
        this.input.setDraggable(this.scrollBar);
        this.scrollBar.on('drag', (pointer, dragX, dragY) => {
            const chatTop = 110; // Posición superior del área visible del chat
            const chatBottom = 350; // Posición inferior del área visible del chat
            const scrollHeight = this.scrollBar.height; // Altura de la scrollbar
            
            // Ajustar límites para evitar que la scrollbar salga del área visible
            const minY = chatTop;
            const maxY = chatBottom - scrollHeight;
        
            // Limitar el movimiento de la barra dentro de los límites
            if (dragY >= minY && dragY <= maxY) {
                this.scrollBar.y = dragY;
        
                // Ajustar la posición del contenedor de mensajes
                const scrollPercentage = (dragY - minY) / (maxY - minY);
                const totalHeight = this.messageLog.list.length * 20;
                const visibleHeight = chatBottom - chatTop;
                const maxScrollOffset = totalHeight - visibleHeight; // Máximo desplazamiento del contenedor

                if (maxScrollOffset <= 0) {
                    this.messageLog.y = chatTop; // Mantén la posición inicial
                } else {
                    // Desplazamiento proporcional al porcentaje de la scrollbar
                    this.messageLog.y = chatTop - (maxScrollOffset * scrollPercentage);
                }
            }
        });
        const backButton = this.add.image(config.width / 4, 630, 'Boton_atras_normal').setInteractive().setScale(0.7);

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

        this.nombre = localStorage.getItem('nombre');
        console.log('Nombre de usuario:', this.nombre);

    }

    fetchMessages(initialLoad = false) {
        console.log("Llamando al servidor para obtener mensajes...");
        $.get('/api/chat', { since: initialLoad ? 0 : this.lastTimestamp }, (data) => {
            console.log("Respuesta del servidor:", data); // Verifica qué datos devuelve el servidor
            if (data && data.messages && data.messages.length > 0) {
                data.messages.forEach((msg) => {
                    // Solo mostrar mensajes con un ID mayor al último procesado
                    if (msg.id > this.lastTimestamp) {
                        console.log("Procesando mensaje nuevo:", msg);
                        this.displayMessage(msg.username, msg.text);
                    }
                });
                // Actualizar el último timestamp al ID del último mensaje recibido
                this.lastTimestamp = data.messages[data.messages.length - 1].id;
                console.log("Nuevo lastTimestamp:", this.lastTimestamp);
            }
        }).fail((jqXHR, textStatus, errorThrown) => {
            console.error("Error fetching messages:", textStatus, errorThrown);
        });
    }

    sendMessage() {
        const message = this.inputText.text.trim();
        if (!message) return;
    
        const username = this.nombre;
        console.log(this.nombre);
        const payload = { message, username };
    
        console.log('Mensaje enviado', payload);
    
        $.post(`/api/chat`, payload)
        .done((response) => {
            console.log('Mensaje enviado al servidor:', response);
            // Ya no llamamos a displayMessage aquí
        })
        .fail((jqXHR, textStatus, errorThrown) => {
            console.error('Error al enviar mensaje:', textStatus, errorThrown);
        });
    }

    displayMessage(username, text) {
        
        const visibleHeight = 250;
        const messageSpacing = 20;

        // Crear un texto para el mensaje
        const messageText = this.add.text(0, this.messageLog.list.length * 20, `[${username}] ${text}`, {
            font: '14px Arial',
            color: '#fff',
            wordWrap: { width: 280, useAdvancedWrap: true }
        }).setOrigin(0);
    
        // Agregar el texto al contenedor de mensajes
        this.messageLog.add(messageText);

        const totalHeight = this.messageLog.list.length * messageSpacing;

        if (totalHeight > visibleHeight) {
            // Ajustar la posición del contenedor para mostrar el mensaje más reciente
            this.messageLog.y = Math.max(-(totalHeight - visibleHeight), this.messageLog.y - messageSpacing);
            const maxY = visibleHeight - 10;
            const minY = 10;
        
            const scrollPercentage = -this.messageLog.y / (totalHeight - visibleHeight);
            const scrollBarPosition = minY + scrollPercentage * (maxY - minY);
            this.scrollBar.y = minY + (maxY - minY)
        } else {
            this.scrollBar.y = 120; // Posición inicial de la barra
        }
    }

    shutdown() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval); // Detén el intervalo
        }
    }
    
}


