// Escalabilidad con clusters (clase 5): un worker por core de la CPU
import cluster from 'cluster';
import os from 'os';
import http from 'http';

if (cluster.isPrimary) {
    const numCPUs = os.cpus().length;
    console.log(`Número de cores del CPU: ${numCPUs}`);
    console.log('Generando clusters');

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} ha finalizado. Creando uno nuevo`);
        cluster.fork();
    });
} else {
    const server = http.createServer((req, res) => {
        res.writeHead(200);
        res.end(`Identificador del worker secundario: ${process.pid}`);
    });

    server.listen(3000, () => {
        console.log(`Servidor escuchando en puerto 3000, manejado por el worker: ${process.pid}`);
    });
}
