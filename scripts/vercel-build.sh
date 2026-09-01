#!/usr/bin/env bash
# QBLOGG dağıtım tarifi. vercel.json → buildCommand önce depoyu _src'ye
# klonlar, sonra bu betiği çalıştırır (checkout'ta varsa oradan, yoksa
# _src'den). Vercel'in 256 karakter buildCommand sınırı nedeniyle komutun
# gövdesi buradadır; kopyalanan dosya listesi değişirse burayı güncelleyin.
set -euo pipefail

git -C _src rev-parse HEAD

mkdir -p dist
cp _src/index.html _src/work.html _src/blog.html _src/post.html \
   _src/gizlilik.html _src/kosullar.html _src/kalite.html _src/ornek.html \
   _src/404.html _src/sitemap.xml _src/robots.txt _src/feed.xml dist/

mkdir -p dist/.well-known
cp _src/.well-known/security.txt dist/.well-known/

mkdir -p dist/demo
cp _src/demo/cv-action-page.html _src/demo/cv-action-page.js dist/demo/

cp -r _src/assets dist/assets
