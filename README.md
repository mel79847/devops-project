
# DevOps Project – CI/CD Backend y Frontend

Este documento describe el proceso completo de integración y despliegue continuo implementado para el **Backend** y el **Frontend** del proyecto DevOps del primer parcial.  
La documentación está escrita en tercera persona y organizada en secciones claras que reflejan los pasos realizados.

---

## 1. Contexto General del Proyecto

El proyecto está basado en una arquitectura distribuida con tres servidores independientes:

- **Servidor de Base de Datos (PostgreSQL)**  
- **Servidor Backend (Node.js + Express)**  
- **Servidor Frontend (Nginx)**  

El objetivo fue implementar pipelines CI/CD separados para backend y frontend, ambos mediante GitHub Actions, asegurando que cualquier cambio enviado a la rama `main` se despliegue automáticamente en sus respectivas máquinas EC2 en AWS.

---

## 2. Estructura del Repositorio

```
devops-project/
│
├── backend/                     # Servicio Backend (Node.js)
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/                    # Aplicación Frontend (estática)
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── test.js
│
├── scripts/
│
├── docs/
│
└── .github/
    └── workflows/
        ├── ci-cd-backend.yml
        └── ci-cd-frontend.yml
```

---

# 3. Implementación del Backend

El backend consiste en un servicio simple construido con **Express**, expuesto en el puerto 3000.  
Incluye un endpoint de verificación:

```
GET /health
```

Este endpoint devuelve un JSON indicando que el servicio está operativo.  
El archivo principal se encuentra en `backend/index.js`.

---

# 4. Pipeline CI/CD del Backend

El pipeline realiza:

1. Instalación de Node.js.  
2. Verificación de dependencias.  
3. Conexión SSH a la EC2 del backend.  
4. Copia del código actualizado.  
5. Instalación de dependencias dentro de la EC2.  
6. Reinicio del servicio backend mediante `nohup`.

Se ubica en:

```
.github/workflows/ci-cd-backend.yml
```

---

# 5. Implementación del Frontend

El frontend consiste en una página estática ubicada en:

```
frontend/public/index.html
```

La página permite:

- Ver el estado del sistema  
- Visualizar mensajes almacenados  
- Publicar nuevos mensajes  
- Ver estadísticas básicas del backend  

El servidor frontend funciona sobre **Nginx** y se encuentra desplegado en una instancia EC2 distinta.

---

# 6. Pruebas del Frontend

Para cumplir con los requisitos del proyecto se creó:

```
frontend/test.js
```

Esta prueba verifica:

- La existencia del archivo `index.html`
- La presencia del texto esperado dentro del HTML

---

# 7. Pipeline CI/CD del Frontend

El archivo se encuentra en:

```
.github/workflows/ci-cd-frontend.yml
```

Este pipeline:

1. Ejecuta pruebas del frontend.  
2. Se conecta por SSH a la máquina EC2.  
3. Copia el contenido de `frontend/public/` a:

```
/var/www/html/
```

4. Recarga Nginx para aplicar los cambios.  
5. Utiliza triggers basados en rutas para evitar que se ejecute cuando cambian archivos del backend.

### Configuración adicional en la EC2:

```bash
sudo chown -R ubuntu:ubuntu /var/www/html
sudo chmod -R 755 /var/www/html
```

---

# 8. Verificación del Despliegue

### Backend:

```
http://3.238.249.159:3000/health
```

Devuelve un JSON confirmando el estado del servicio.

### Frontend:

```
http://98.93.4.174
```

El sitio permite interactuar con el backend y visualizar información obtenida desde la base de datos.

---

# 9. Estado de los Pipelines

Ambos pipelines se encuentran configurados con triggers independientes:

- `backend/**` → CI/CD Backend  
- `frontend/**` → CI/CD Frontend  

Esto asegura ejecuciones ordenadas y evita despliegues innecesarios.

---
