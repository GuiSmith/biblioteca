import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";
import { readdirSync } from "fs";

// Obtém o caminho correto do diretório atual no formato ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Caminho da pasta onde os modelos estão
const modelsPath = join(__dirname, ".");

// Importar dinamicamente todos os arquivos de modelo
const modelFiles = readdirSync(modelsPath).filter(
    (file) => extname(file) === ".js" && file !== "index.js"
);

for (const file of modelFiles) {
    await import(`file://${join(modelsPath, file)}`);
}
