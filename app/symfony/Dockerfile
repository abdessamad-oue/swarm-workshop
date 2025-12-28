FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git unzip libicu-dev libzip-dev \
    && docker-php-ext-install intl zip

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Create Symfony project
RUN composer create-project symfony/skeleton symfony

WORKDIR /app/symfony

# Create a simple controller
RUN mkdir -p src/Controller && \
    cat << 'EOF' > src/Controller/HelloController.php
<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HelloController
{
    #[Route('/', name: 'hello')]
    public function index(): Response
    {
        return new Response('Hello from Symfony + Docker Swarm');
    }
}
EOF

# Expose Symfony local server
EXPOSE 8000

CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]
