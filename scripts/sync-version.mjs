/**
 * Synchronise la version de package.json vers le fichier PHP principal.
 * Appelé automatiquement par `changeset version` via le script `version` de package.json.
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
const version = pkg.version;

const phpFile = resolve(root, 'dcx-benchmark-luxe-plugin.php');
let php = readFileSync(phpFile, 'utf8');

// Met à jour le header "Version:"
php = php.replace(/( \* Version:\s+)[\d.]+/, `$1${version}`);

// Met à jour la constante DCX_BENCHMARK_LUXE_VERSION
php = php.replace(
	/(define\(\s*'DCX_BENCHMARK_LUXE_VERSION',\s*')[^']+(')/,
	`$1${version}$2`
);

writeFileSync(phpFile, php, 'utf8');

console.log(`Version synchronisée : ${version}`);
