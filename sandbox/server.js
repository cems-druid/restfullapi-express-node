const http = require('http');

const todos = [
    {id: 1, text: 'Todo 1'},
    {id: 2, text: 'Todo 2'},
    {id: 3, text: 'Todo 3'}  
];

const server = http.createServer((req, res) => {
    const {method, url} = req;
    let body = [];

    req.on('data', chunk =>{
        body.push(chunk);
    }).on('end', ()=>{
        body = Buffer.concat(body).toString();

        let status = 404;
        const response = {
            success: false,
            data: null,
            error: null
        }

        if(method === 'GET' && url === '/todos'){
            status = 200;
            response.success = true;
            response.data = todos;
        }
        else if(method === 'POST' && url === '/todos'){
            const {id, text} = JSON.parse(body);
            todos.push({id, text});

            if(!id || !text){
                status = 400;
                response.error = "ID and text are required."
            }else{
                status = 201;
                response.success = true;
                response.data = todos;
            }
        }
        res.writeHead(status, {
            'Content-Type': 'application/json',
            'X-Powered-By': 'Node.js'
        });
        res.end(JSON.stringify(response));
    });


});

const PORT = 5000;

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));