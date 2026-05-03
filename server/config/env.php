<?php
/**
 * Power Fast Runner - .env loader
 *
 * Lightweight loader for the project's .env file.
 * Use only if you decide to render the site through PHP later.
 *
 * Usage:
 *   require_once __DIR__ . '/env.php';
 *   $env = pfr_load_env(__DIR__ . '/../../.env');
 *   echo $env['SITE_URL'];
 */

if (!function_exists('pfr_load_env')) {
    function pfr_load_env(string $path): array
    {
        if (!is_readable($path)) {
            return [];
        }

        $vars = [];
        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '' || str_starts_with($line, '#')) {
                continue;
            }
            if (!str_contains($line, '=')) {
                continue;
            }

            [$key, $value] = array_map('trim', explode('=', $line, 2));

            if (preg_match('/^"(.*)"$/', $value, $m) || preg_match("/^'(.*)'$/", $value, $m)) {
                $value = $m[1];
            }

            $vars[$key] = $value;
            if (!array_key_exists($key, $_ENV)) {
                $_ENV[$key] = $value;
            }
            if (getenv($key) === false) {
                putenv("$key=$value");
            }
        }

        return $vars;
    }
}

if (!function_exists('pfr_env')) {
    function pfr_env(string $key, ?string $default = null): ?string
    {
        $value = getenv($key);
        if ($value === false) {
            $value = $_ENV[$key] ?? $default;
        }
        return $value;
    }
}
