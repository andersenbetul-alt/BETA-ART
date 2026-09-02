#!/usr/bin/env bash
# QBLOGG Vercel derlemesi — vercel.json buildCommand'ı depo klonundan sonra bunu çağırır.
# Neden ayrı dosya: Vercel şeması buildCommand'ı 256 karakterle sınırlar (git
# entegrasyonlu projeler bu sınırı doğrular); kopya listesi burada yaşar.
# Çalışma dizini: derleme kökü (_src = main dalının klonu).
set -euo pipefail
git -C _src rev-parse HEAD
mkdir -p dist/.well-known
cp _src/index.html _src/work.html _src/blog.html _src/post.html \
   _src/gizlilik.html _src/kosullar.html _src/kalite.html _src/ornek.html \
   _src/404.html _src/sitemap.xml _src/robots.txt _src/feed.xml dist/
cp _src/.well-known/security.txt dist/.well-known/
mkdir -p dist/demo
cp _src/demo/cv-action-page.html _src/demo/cv-action-page.js \
   _src/demo/q-work-audit.html _src/demo/q-work-audit.js dist/demo/
cp -r _src/assets dist/assets
