class Iniciarsesion extends Phaser.Scene {
    constructor() {
        super( {key: "IniciarSesion"});
        this.isLoginMode = true; // Modo actual: true -> Login, false -> Registro
        this.isChangePassword = false; 
    }

    preload() {
        // Cargar recursos como imágenes
        this.load.image("Mapa_fondo", "assets/Mapas/fondo.png");
    }

    create() {
        // Fondo de pantalla
        const background = this.add.image(config.width / 2, config.height / 2, 'Mapa_fondo');
        background.setScale(config.width / background.width, config.height / background.height);
        // Crear formulario HTML
        this.createHTMLForms();
    }
    

    createHTMLForms() {
        this.form = document.createElement('form');
        this.form.id = 'login-form';
      
        // ----- Grupo: botones de modo -----
        const modeButtonsContainer = document.createElement('div');
        modeButtonsContainer.className = 'mode-buttons';
      
        this.toggleText = document.createElement('span');
        this.toggleText.innerText = 'REGISTRAR USUARIO';
        this.toggleText.className = 'mode-button';
        this.toggleText.onclick = () => this.toggleForm();
      
        this.deleteText = document.createElement('span');
        this.deleteText.innerText = 'ELIMINAR USUARIO';
        this.deleteText.className = 'mode-button';
        this.deleteText.onclick = () => this.activateDeleteMode();
      
        modeButtonsContainer.appendChild(this.toggleText);
        modeButtonsContainer.appendChild(this.deleteText);
        this.form.appendChild(modeButtonsContainer);
      
        // ----- Grupo: inputs -----
        this.usernameInput = document.createElement('input');
        this.usernameInput.type = 'text';
        this.usernameInput.placeholder = 'Nombre de usuario';
        this.usernameInput.classList.add('input-field');
        this.form.appendChild(this.usernameInput);
      
        this.passwordInput = document.createElement('input');
        this.passwordInput.type = 'password';
        this.passwordInput.placeholder = 'Contraseña';
        this.passwordInput.classList.add('input-field');
        this.form.appendChild(this.passwordInput);
      
        this.newPasswordInput = document.createElement('input');
        this.newPasswordInput.type = 'password';
        this.newPasswordInput.placeholder = 'Confirmar Contraseña';
        this.newPasswordInput.classList.add('input-field');
        this.newPasswordInput.style.display = 'none';
        this.form.appendChild(this.newPasswordInput);
      
        this.errorMessage = document.createElement('p');
        this.errorMessage.style.color = 'red';
        this.errorMessage.innerHTML = '';
        this.form.appendChild(this.errorMessage);
      
        // ----- Grupo: botones de acción -----
        const actionButtonsContainer = document.createElement('div');
        actionButtonsContainer.className = 'action-buttons';
      
        this.submitButton = document.createElement('button');
        this.submitButton.type = 'button';
        this.submitButton.innerText = 'Aceptar';
        this.submitButton.classList.add('submit-button');
        this.submitButton.onclick = () => this.handleSubmit();
        actionButtonsContainer.appendChild(this.submitButton);
      
        this.passwordActionButton = document.createElement('button');
        this.passwordActionButton.type = 'button';
        this.passwordActionButton.innerText = 'Cambiar Contraseña';
        this.passwordActionButton.classList.add('submit-button');
        this.passwordActionButton.style.display = 'block';
        this.passwordActionButton.onclick = () => {
            this.isLoginMode = false;
            this.isDeleteMode = false;
            this.isChangePassword = true;
            this.toggleText.style.display = 'none';
            this.deleteText.style.display = 'none';
            this.passwordInput.placeholder = 'Nueva Contraseña';
            this.newPasswordInput.style.display = 'block';
            this.passwordActionButton.style.display = 'none';
        };
        actionButtonsContainer.appendChild(this.passwordActionButton);
      
        this.deleteActionButton = document.createElement('button');
        this.deleteActionButton.type = 'button';
        this.deleteActionButton.innerText = 'Eliminar';
        this.deleteActionButton.classList.add('submit-button');
        this.deleteActionButton.style.display = 'none';
        this.deleteActionButton.onclick = () => {
            this.handleDelete(this.usernameInput.value, this.passwordInput.value);
            this.resetForm();
        };
        actionButtonsContainer.appendChild(this.deleteActionButton);
      
        this.form.appendChild(actionButtonsContainer);
      
        this.usernameInput.addEventListener('input', () => this.checkDeleteForm());
        this.passwordInput.addEventListener('input', () => this.checkDeleteForm());
      
        const gameContainer = document.getElementById('game-container');
        gameContainer.appendChild(this.form);
    }
    
    
    
    checkDeleteForm() {
        // Verificar si ambos campos (usuario y contraseña) están completos
        const isFormFilled = this.usernameInput.value.trim() !== '' && this.passwordInput.value.trim() !== '';
    
        // Mostrar el botón de eliminar solo si ambos campos están completos y si estamos en el modo de eliminación
        if (isFormFilled && this.isDeleteMode) {
        this.deleteActionButton.style.display = 'block'; // Mostrar el botón de eliminar
        } else {
        this.deleteActionButton.style.display = 'none'; // Ocultar el botón de eliminar
        }
    }

    activateDeleteMode() {
        this.isDeleteMode = true; // Activar el modo de eliminación
        this.isLoginMode = false; // Desactivar el modo de inicio de sesión/registro
        this.isChangePassword = false;
    
        // Ocultar los botones de iniciar sesión/registrar
        this.submitButton.style.display = 'none';
        this.passwordActionButton.style.display = 'none';
        this.toggleText.style.display = 'none';
        this.deleteText.style.display = 'none'; // Ocultar los botones de modo
    
        // Llamar a checkDeleteForm para verificar si los campos están completos
        this.checkDeleteForm();
    }
    
    
    async activateChangePassword() {
        
        const username = this.usernameInput.value;
        const newpassword = this.passwordInput.value;
        const confirmPassword = this.newPasswordInput.value;
        
        if(newpassword!==confirmPassword){
            this.errorMessage.innerHTML='Las contraseñas no coinciden';
        }else{
            this.errorMessage.innerHTML='';
            const user= await this.getUser(username);
            if(user==null){
                this.errorMessage.innerHTML="Usuario incorrecto";
            }else{
                await this.handleChangePassword(user, newpassword);
            }
        }
    }
    resetForm() {
        // Restaurar estado de modo
        this.isLoginMode = true;
        this.isDeleteMode = false;
        this.isChangePassword = false;
    
        // Reset inputs
        this.usernameInput.value = '';
        this.passwordInput.value = '';
        this.newPasswordInput.value = '';
    
        // Reset estilos
        this.newPasswordInput.style.display = 'none';
        this.submitButton.style.display = 'block';
        this.deleteActionButton.style.display = 'none';
        this.passwordActionButton.style.display = 'block';
    
        // Reset botones de modo
        this.toggleText.style.display = 'block';
        this.deleteText.style.display = 'block';
    
        // Restaurar textos por si cambiaron
        this.toggleText.innerText = 'REGISTRAR USUARIO';
        this.deleteText.innerText = 'ELIMINAR USUARIO';
        this.submitButton.innerText = 'Aceptar';
    
        // Limpia errores
        this.errorMessage.innerHTML = '';
    }
    
    toggleForm() {
        // Cambia entre el modo de inicio de sesión y el modo de registro
        this.isLoginMode = !this.isLoginMode;
        this.submitButton.innerText = this.isLoginMode ? 'Iniciar sesión' : 'Registrar';
        this.toggleText.style.display = 'none';
        this.passwordActionButton.style.display = 'none';
        this.deleteText.style.display = 'none';
        // Restaura el formulario a su estado inicial
        if (this.isLoginMode) {
            // Restablece el estado si estamos en modo de inicio de sesión o registro
            this.submitButton.style.display = 'block';  // Muestra el botón de aceptar
            this.passwordActionButton.style.display = 'none';
            this.deleteActionButton.style.display = 'none'; // Oculta el botón de eliminar
            this.isDeleteMode = false;
            // Vuelve a mostrar los botones de modo (Registrar/Eliminar)
            this.toggleText.style.display = 'block';
            this.deleteText.style.display = 'block';
        }
    }
    
   
    async handleSubmit() {
        const username = this.usernameInput.value;
        const password = this.passwordInput.value;
        console.log(username, password);

        if (!username || !password) {
            this.errorMessage.innerHTML="Por favor, completa ambos campos.";
            return;
        }

        if(this.isChangePassword){
            await this.activateChangePassword();
            this.resetForm();
        }else if (this.isLoginMode) {
            const user = await this.getUser(username);
            if(user==null){
                this.errorMessage.innerHTML="Usuario incorrecto";
            }else{
                if(password!=user.password){
                    this.errorMessage.innerHTML="Contraseña incorrecta";
                }else{
                    this.errorMessage.innerHTML="";
                    await this.handleLogin(username, password);
                    this.startGame();   
                }
            }
        } else {
            await this.handleRegister(username, password);
            this.resetForm();
        }
    }

    async getUser(username){
        try {
            const response = await fetch(`/api/users/${username}`);
            console.log(response);
            if (!response.ok) {
                return null;
            }else{
                return response.json();
            }
        } catch (error) {
            this.errorMessage.innerHTML=error.message;
        }
    }    
    
    async handleDelete(username, password) {
        try {
            const response = await fetch(`/api/users/${username}/${password}`, {
            method: 'DELETE',
            });
    
            // Limpiar los campos del formulario
            this.usernameInput.value = '';
            this.passwordInput.value = '';
        } catch (error) {
            console.error(`Error al eliminar el usuario ${username}:`, error.message);
            alert('Error al eliminar usuario.');
        }
    }
     
    async handleLogin(username, password) {
        try {
            const body = {
                username: username,
                password: password
            };
            const response = await fetch("/api/users/login", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            //addPlayer devuelve el usuario entero porque si no es imposible acceder a las id para obtener la lista de usuarios mas adelante
            const user = await response.json();
            this.nombre = localStorage.setItem('nombre',username);
        } catch (error) {
            this.errorMessage.innerHTML='Contraseña incorrecta';
        }
    }

    async handleRegister(username, password) {
        try {
            const body = {
                username: username,
                password: password
            };
            const response = await fetch("/api/users", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const user = await response.json();
            this.nombre = localStorage.setItem('nombre',username);
            console.log(user); 
        } catch (error) {
            console.error('Error al registrar usuario:', error.message);
            alert('Error al registrar usuario.');
        }
    }
    
    async handleChangePassword(user, newPassword){
        try{
            if(user==null){
                return;
            }
            const newUserData = {
                id : user.id,
                username: user.username,
                password: newPassword,
                score: user.score
            };
    
            const username = user.username;  
        
            const response = await fetch(`/api/users/${username}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUserData)
            });
            console.log('Jugador actualizado:', newUserData);
            this.nombre = localStorage.setItem('nombre',username);
        } catch (error) {
            // Manejar errores de red o del servidor
            console.error("Error al actualizar jugador:", error.message);
            return null;
        }
    }

    startGame() {
        this.form.remove();
        this.scene.start('MenuPrincipal'); // Cambia a la escena de menu principal
    }

    shutdown() {
        if (this.form) {
            this.form.remove();
        }
    }

}
