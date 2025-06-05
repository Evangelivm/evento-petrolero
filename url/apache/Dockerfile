FROM httpd:2.4

# Instala Certbot y dependencias
RUN apt-get update && \
    apt-get install -y certbot python3-certbot-apache && \
    apt-get clean

# Habilita módulos de Apache (proxy y SSL)
RUN echo "LoadModule proxy_module modules/mod_proxy.so" >> /usr/local/apache2/conf/httpd.conf && \
    echo "LoadModule proxy_http_module modules/mod_proxy_http.so" >> /usr/local/apache2/conf/httpd.conf && \
    echo "LoadModule ssl_module modules/mod_ssl.so" >> /usr/local/apache2/conf/httpd.conf

# Copia configuración de Apache
COPY sites-available/000-default.conf /usr/local/apache2/conf/extra/httpd-vhosts.conf

# Copia script de inicio
COPY startup.sh /startup.sh
RUN chmod +x /startup.sh

CMD ["/startup.sh"]