# Instrucciones para Usar Apache para Proxy Inverso y Certificado SSL con Certbot

Estos pasos son muy importantes para poder implementar el proxy inverso, ya que no es recomendable colocar el frontend en el puerto 80 (el que se accede por defecto al entrar a una pagina)

# Requisitos

- Apache.
- Debian.
- Certbot.
- Un correo (certbot lo pide).
- Una dirección que ya se le haya hecho DNS inverso.

## 1. Instalar Apache

Instalar **Apache** con los siguiente comandos:

## 2. Instalar módulos para el Proxy Inverso

    sudo a2enmod proxy
    sudo a2enmod proxy_http
    sudo systemctl restart apache2

## 3. Editar la configuración de Apache

Generalmente en `/etc/apache2/sites-available/000-default.conf` o un archivo similar colocar:

    <VirtualHost *:80>
        ServerName <direccion sin www>
        ServerAlias <direccion con www>

        ProxyPreserveHost On
        ProxyPass / <direccion de frontend>
        ProxyPassReverse / <direccion de frontend>

        ErrorLog ${APACHE_LOG_DIR}/error.log
        CustomLog ${APACHE_LOG_DIR}/access.log combined
    </VirtualHost>

Como este ejemplo **(seguir las indicaciones)**:

    <VirtualHost *:80>
        ServerName reactivapetroltalara.online
        ServerAlias www.reactivapetroltalara.online

        ProxyPreserveHost On
        ProxyPass / http://localhost:3001/
        ProxyPassReverse / http://localhost:3001/

        ErrorLog ${APACHE_LOG_DIR}/error.log
        CustomLog ${APACHE_LOG_DIR}/access.log combined
    </VirtualHost>

| Nombre           | Que colocar                                                             |
| ---------------- | ----------------------------------------------------------------------- |
| ServerName       | La dirección sin **www** (Ejemplo: **reactivapetroltalara.online**)     |
| ServerAlias      | La dirección con **www** (Ejemplo: **www.reactivapetroltalara.online**) |
| ProxyPass        | La dirección del frontend (Ejemplo: **http://localhost:3001/**)         |
| ProxyPassReverse | La dirección del frontend (Ejemplo: **http://localhost:3001/**)         |

## 4. Reiniciar Apache

    sudo systemctl restart apache2

## 5. Instalar Certbot y el plugin de Apache

Ejecuta los siguientes comandos para instalar **Certbot** y su complemento para **Apache**:

    sudo apt update
    sudo apt install certbot python3-certbot-apache -y

## 6. Obtener el certificado SSL para tu dominio

Ejecuta **Certbot** para obtener e instalar automáticamente el certificado SSL en **Apache**:

    sudo certbot --apache -d <direccion sin www> -d <direccion con www>

Como en este ejemplo:

    sudo certbot --apache -d reactivapetroltalara.online -d www.reactivapetroltalara.online

**Notas:**

- Asegúrate de que tu dominio (Ejemplo:`reactivapetroltalara.online`) ya esté configurado en Apache y apunte correctamente a tu servidor (Ejemplo:`161.132.45.199`).
- Certbot modificará automáticamente tu configuración de Apache para usar HTTPS.
- Cabe señalar de que se te pedirá un correo para notificaciones del certificado SSL.

## 7. Verificar que la redirección HTTPS funcione

**Certbot** configurará automáticamente:

- Un certificado SSL de **Let's Encrypt**.
- Una redirección de HTTP → HTTPS.
- Renovación automática del certificado.

Puedes probar tu sitio como en este ejemplo:

    https://reactivapetroltalara.online

## 8. Verificar la renovación automática

Let's Encrypt expira cada 90 días, pero Certbot renueva automáticamente. Puedes probar la renovación manual con:

    sudo certbot renew --dry-run

Si no hay errores, el certificado se renovará solo cuando falten 30 días o menos.
