Nexa Strategy Portfolio - V1.1 Render

Como subir no Render:

1. Envie TODOS os arquivos desta pasta para a raiz do repositório no GitHub.
   Importante: o arquivo index.html precisa ficar na raiz junto com package.json e render.yaml.

2. No Render, crie como Static Site, não como Web Service.

3. Configuração manual, se o Render pedir:
   Build Command: npm run build
   Publish Directory: dist

4. Depois faça deploy novamente.

Observação:
Esta versão cria a pasta dist automaticamente durante o build.
O Render publica o conteúdo da pasta dist.
