import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { Express } from 'express';
import path from 'path';
import jsonRefs from 'json-refs';

export async function setupSwagger(app: Express) {
  const mainPath = path.join(__dirname, 'docs/openapi.yaml');
  const swaggerRaw = YAML.load(mainPath);

  const resolved = await jsonRefs.resolveRefs(swaggerRaw, {
    location: mainPath,
    loaderOptions: {
      processContent: (res: { text: string }, callback: (err: any, result: any) => void) => {
        callback(undefined, YAML.parse(res.text));
      }
    }
  });

  const swaggerDoc = resolved.resolved;

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
  // console.log('✅ Swagger loaded with paths:', Object.keys(swaggerDoc.paths || {}));
}
