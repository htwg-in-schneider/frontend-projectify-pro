<template>
  <div class="login-background-wrapper"> 
    <div class="login-card p-4 p-md-5">
      
      <h4 class="text-center mb-4 login-title">Login Daten eingeben</h4> 

      <form @submit.prevent>
        <div class="mb-3">
          <label for="username" class="form-label">Benutzername</label>
          <input 
            type="text" 
            class="form-control" 
            id="username" 
            v-model="username"  placeholder="" 
          />
        </div>

        <div class="mb-4"> 
          <label for="password" class="form-label">Passwort</label>
          <input 
            type="password"  
            class="form-control" 
            id="password" 
            v-model="password"  placeholder="" 
          />
        </div>
        
        <div class="d-grid gap-2 mb-4"> 
          <button type="submit" class="btn btn-primary">Anmelden</button>
        </div>
        </form>

      <p class="text-center mt-3">
        Noch kein Account?
        <a href="#" class="text-decoration-none">Registrieren</a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'; 

const username = ref('annemarie.schuler');
const password = ref('passwort'); 
</script>

<style scoped>
.login-background-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%; 
  position: relative;
  overflow: hidden;

  font-family: 'Montserrat', sans-serif; 

  background-image: url('../assets/img/hintergrund.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-repeat: no-repeat;
}


.login-title {
    font-size: 1.5rem; 
    font-weight: 500;
}


.login-card {
  width: 100%;
  max-width: 400px; 
  background: rgba(255, 255, 255, 0.85); 
  backdrop-filter: blur(10px); 
  border-radius: 1rem; 
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.1); 
  z-index: 10; 
}
</style>