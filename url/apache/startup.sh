#!/bin/sh

# Genera el certificado SSL si no existe
if [ ! -d "/etc/letsencrypt/live/reactivapetroltalara.online" ]; then
    certbot --apache -d reactivapetroltalara.online -d www.reactivapetroltalara.online --non-interactive --agree-tos -m tu@email.com
fi

# Inicia Apache
exec httpd-foreground