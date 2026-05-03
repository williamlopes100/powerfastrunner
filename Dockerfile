# syntax=docker/dockerfile:1.6
FROM php:8.2-apache

# Modules required by .htaccess (rewrite, headers, expires, deflate)
RUN a2enmod rewrite headers expires deflate

# Allow .htaccess overrides on the docroot
RUN sed -ri 's!AllowOverride None!AllowOverride All!g' /etc/apache2/apache2.conf

# Behind Render's proxy the request arrives as HTTP with X-Forwarded-Proto: https.
# Setting HTTPS=on here lets the existing "%{HTTPS} off" rewrite rule work
# correctly and prevents an infinite redirect loop.
RUN printf 'SetEnvIf X-Forwarded-Proto "https" HTTPS=on\n' \
      > /etc/apache2/conf-available/render-proxy.conf \
    && a2enconf render-proxy

# Copy site into Apache docroot
COPY . /var/www/html/
RUN chown -R www-data:www-data /var/www/html

# Render injects $PORT at runtime; default to 80 for local builds
ENV PORT=80
EXPOSE 80

# Substitute $PORT into Apache config at container start, then run Apache
COPY <<'EOF' /usr/local/bin/start-apache.sh
#!/bin/sh
set -e
PORT="${PORT:-80}"
sed -i "s/^Listen .*/Listen ${PORT}/" /etc/apache2/ports.conf
sed -i "s|<VirtualHost \*:[0-9]\+>|<VirtualHost *:${PORT}>|" /etc/apache2/sites-available/000-default.conf
exec apache2-foreground
EOF
RUN chmod +x /usr/local/bin/start-apache.sh

CMD ["/usr/local/bin/start-apache.sh"]
