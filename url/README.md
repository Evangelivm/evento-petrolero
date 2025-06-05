## **Pasos para ejecutar**

### **1. Crea la red compartida**

    docker network create shared_network

### **2. Inicia el frontend React**

    cd frontend
    docker-compose up -d

### **3. Inicia Apache + Certbot**

    cd ..
    docker-compose -f docker-compose.apache.yml up -d

### **4. Genera el certificado SSL (primera vez)**

    docker-compose -f docker-compose.apache.yml run --rm certbot certbot --apache -d reactivapetroltalara.online -d www.reactivapetroltalara.online --non-interactive --agree-tos -m tu@email.com

Reemplazar tu@email.com con un correo valido

### **5. Reinicia Apache**

    docker-compose -f docker-compose.apache.yml restart apache

## **Verificación**

- Accede a `https://reactivapetroltalara.online` (debe mostrar tu Frontend con SSL).
- Verifica la red Docker:

`docker network inspect shared_network`

(Debes ver los contenedores `apache` y del frontend conectados).
