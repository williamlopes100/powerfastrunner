<?php
/**
 * Site configuration helper.
 * Returns a merged config array from .env (with safe defaults).
 */

require_once __DIR__ . '/env.php';

pfr_load_env(__DIR__ . '/../../.env');

return [
    'site' => [
        'name'    => pfr_env('SITE_NAME',   'Power Fast Runner'),
        'url'     => pfr_env('SITE_URL',    'https://www.powerfastrunner.com.br'),
        'locale'  => pfr_env('SITE_LOCALE', 'pt_BR'),
        'lang'    => pfr_env('SITE_LANG',   'pt-BR'),
    ],
    'contact' => [
        'email' => pfr_env('CONTACT_EMAIL', 'powerfastrunner@gmail.com'),
        'cnpj'  => pfr_env('COMPANY_CNPJ',  '45.094.301/0001-60'),
    ],
    'sales' => [
        'checkout_url'        => pfr_env('KIWIFY_CHECKOUT_URL'),
        'price_full'          => pfr_env('PRICE_FULL'),
        'price_installment'   => pfr_env('PRICE_INSTALLMENT'),
        'price_installments'  => (int) pfr_env('PRICE_INSTALLMENT_COUNT', '12'),
        'price_cash'          => pfr_env('PRICE_CASH'),
        'currency'            => pfr_env('PRICE_CURRENCY', 'BRL'),
    ],
    'tracking' => [
        'fb_pixel_id' => pfr_env('FB_PIXEL_ID'),
        'clarity_id'  => pfr_env('CLARITY_ID'),
        'ga4_id'      => pfr_env('GA4_ID'),
        'gtm_id'      => pfr_env('GTM_ID'),
    ],
    'seo' => [
        'og_image'        => pfr_env('DEFAULT_OG_IMAGE', '/assets/images/hero-bg.webp'),
        'twitter_handle'  => pfr_env('TWITTER_HANDLE'),
    ],
    'env' => [
        'app_env'   => pfr_env('APP_ENV',   'production'),
        'app_debug' => pfr_env('APP_DEBUG', 'false') === 'true',
    ],
];
