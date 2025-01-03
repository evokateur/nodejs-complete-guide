const handleRequest = (request, response) => {
    const url = request.url;
    const method = request.method;

    if (url === '/' && method === 'GET') {
        response.write('<html>');
        response.write('<head><title>Create a User</title></head>');
        response.write(
            '<body><form action="/create-user" method="POST"><input type="text" name="username"><button type="submit">Create User</button></form></body>'
        );
        response.write('</html>');

        return response.end();
    }

    if (url === '/users' && method === 'GET') {
        response.write('<html>');
        response.write('<head><title>Users</title></head>');
        response.write('<body>');
        response.write('<ul>');
        response.write('<li>catbutt</li>');
        response.write('<li>frobozz</li>');
        response.write('<li>floosnab</li>');
        response.write('</ul>');
        response.write('</body>');
        response.write('</html>');

        return response.end();
    }

    if (url === '/create-user' && method === 'POST') {
        const body = [];
        request.on('data', chunk => {
            console.log(chunk);
            body.push(chunk);
        });

        return request.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const username = parsedBody.split('=')[1];
            console.log('new username = ' + username);
            response.statusCode = 302;
            response.setHeader('Location', '/');
            return response.end();
        });
    }
};

exports.handleRequest = handleRequest;
