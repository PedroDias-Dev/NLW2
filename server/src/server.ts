import express from 'express';

import cors from 'cors';
// rota para o routes
import routes from './routes';

const app = express();

app.use(cors());

app.use(express.json());

app.use(routes);

app.listen(3333);

//GET: BUSCAR OU LISTAR UMA INFO
//POST: CRIAR
//PUT: ATUALIZAR
//DELETE: DELETAR

//CORPO
//ROUTE PARAMS - '/USERS/:ID
//QUERY PAGINAÇÃO E FILTROS


