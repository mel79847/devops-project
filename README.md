# DevOps Project – Backend CI/CD

Este repositorio corresponde al desarrollo del pipeline CI/CD para el servicio **Backend** dentro del proyecto del primer parcial de DevOps.  
El objetivo principal es automatizar la entrega del backend hacia una instancia EC2 en AWS mediante GitHub Actions.  
La documentación está escrita en tercera persona y sin el uso de emojis, como se solicitó.

---

## 1. Contexto General del Proyecto

El proyecto DevOps se estructura en tres servidores:

- **Base de datos (PostgreSQL)**  
- **Backend (Node.js + Express)**  
- **Frontend (Nginx)**  

La responsabilidad del backend consiste en implementar un servicio básico en Node.js, subirlo al repositorio y configurar un pipeline CI/CD funcional que despliegue automáticamente cada actualización hacia la máquina EC2 correspondiente.

Este README describe:

1. La estructura del proyecto.  
2. Los pasos realizados para implementar el backend.  
3. El pipeline CI/CD utilizado.  
4. El funcionamiento verificado desde GitHub Actions y AWS EC2.  

---

## 2. Estructura del Repositorio

```
devops-project/
│
├── backend/              # Código fuente del servicio Backend
│   ├── index.js          # API con un endpoint /health
│   ├── package.json
│   └── package-lock.json
│
├── frontend/             # Pendiente para el despliegue del Frontend
│
├── scripts/              # Scripts opcionales del proyecto
│
├── docs/                 # Documentación adicional
│
└── .github/
    └── workflows/
        └── ci-cd-backend.yml   # Pipeline CI/CD para despliegue automático
```

---

## 3. Implementación del Backend en Node.js

El servicio backend consiste en una API mínima creada con Express que expone el endpoint:

```
GET /health
```

El endpoint devuelve un JSON indicando que el servicio está operativo.  
Este archivo se encuentra en `backend/index.js` y es el punto de entrada definido en el script `npm start`.

Contenido actual del backend:

```js
const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

app.get('/health', (req, res) => {
  res.json({
    status: "OK",
    message: "Backend funcionando en AWS EC2",
    timestamp: new Date().toISOString(),
    service: "DevOps Backend API"
  });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
```

Este archivo fue probado tanto localmente como dentro de la instancia EC2.

---

## 4. Pipeline CI/CD – GitHub Actions

Se implementó un workflow completo en:

```
.github/workflows/ci-cd-backend.yml
```

El pipeline realiza las siguientes acciones:

1. Recibe un push hacia la rama `main`.  
2. Instala Node.js en el runner de GitHub.  
3. Ejecuta `npm install` para verificar que el build funciona.  
4. Se conecta por SSH a la máquina EC2 asignada al backend.  
5. Limpia la carpeta de despliegue.  
6. Clona la última versión del repositorio.  
7. Copia el contenido del backend hacia `~/backend-app/`.  
8. Instala dependencias dentro de EC2.  
9. Finaliza cualquier proceso previo de Node.js.  
10. Inicia nuevamente el backend usando `nohup` para que quede corriendo en segundo plano.

Este procedimiento garantiza un despliegue automatizado y repetible.

---

## 5. Archivo del Pipeline CI/CD

A continuación se presenta el contenido actualizado del workflow:

```yaml
name: CI/CD Backend

on:
  push:
    branches: [ "main" ]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout del código
        uses: actions/checkout@v3

      - name: Instalar Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Instalar dependencias (build check)
        run: |
          cd backend
          npm install

      - name: Desplegar en servidor EC2
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.BACKEND_HOST }}
          username: ${{ secrets.BACKEND_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            rm -rf ~/backend-app || true
            mkdir -p ~/backend-app

            rm -rf ~/repo-devops || true
            git clone https://github.com/mel79847/devops-project.git ~/repo-devops

            cp -r ~/repo-devops/backend/* ~/backend-app/

            cd ~/backend-app
            npm install

            pkill -f "node index.js" || true
            nohup npm start > app.log 2>&1 &
```

---

## 6. Verificación del Funcionamiento en AWS EC2

Una vez ejecutado el pipeline, el backend queda operativo en la máquina EC2 asignada.  
La verificación se realizó accediendo desde el navegador al endpoint público:

```
http://3.238.249.159:3000/health
```

La respuesta confirmada es:

```
{
  "status": "OK",
  "message": "Backend funcionando en AWS EC2",
  "timestamp": "...",
  "service": "DevOps Backend API"
}
```

Esto demuestra que:

- El pipeline realizó el despliegue correctamente.
- El backend arrancó sin errores.
- El puerto 3000 está accesible desde Internet.
- La automatización funciona para cualquier actualización futura del código.

---

## 7. Estado Actual del Pipeline

El pipeline CI/CD se encuentra completamente operativo.  
Cada vez que se realiza un push hacia `main`, GitHub Actions ejecuta automáticamente el proceso de despliegue en AWS EC2.

Este sistema ya cumple con todos los requisitos de la Parte 2 del proyecto.

---

## 8. Conclusión

El backend está implementado y desplegado correctamente mediante un pipeline automatizado en GitHub Actions.  
La infraestructura, los archivos del proyecto, el servidor AWS y el workflow trabajan de forma conjunta para asegurar entregas continuas y consistentes.

Este README resume de manera técnica y ordenada todo el proceso realizado.

