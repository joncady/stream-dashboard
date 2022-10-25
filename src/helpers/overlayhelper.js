export const createComponent = (type) => {
    return {
        // Make the editor understand when to bind `my-input-type`
        isComponent: el => {
            if (el.tagName === "DIV") { return { type, content: el.innerHTML } }
        },
        model: {
            // Default properties
            defaults: {
                tagName: 'div',
                extend: "text",
                draggable: 'div',
                droppable: false,
                attributes: {
                    id: type
                },
                components: [{
                    type: 'textnode',
                    content: ''
                }],
                style: {
                    width: '100px',
                    height: '30px'
                }
            }
        }
    }
}

export const createBlock = (name) => {
    return {
        id: name,
        label: name,
        media: ``,
        content: `<div id="${name}" data-gjs-type="text">${name}</div>`
    }
}

// Injects HTML with necessary JS files for stream dashboard (jquery, socket.io), plus adds in CSS file
export const transformHtml = (name, body) => {
    return `
    <!DOCTYPE html>
        <html>
        <head>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.js"></script>
            <script src="https://code.jquery.com/jquery-1.11.1.js"></script>
            ${!body.includes(name + ".css") ? `<link href="./${name}.css" rel="stylesheet"></link>` : ""}
            <!-- inject dashboard js-->
            <script>
                let firstTime = true;

                const socket = io.connect('http://localhost:8889', { reconnection: true, reconnectionDelay: 1000 });
                socket.on('update', function (data) {
                    if (firstTime) {
                        firstTime = false;
                        setTimeout(() => {
                            setContent(data.gameInfo)
                            setContent(data.commInfo)
                        }, 1000);
                    } else {
                        setContent(data.gameInfo);
                    }
                })
                
                function setContent(obj) {
                    let keys = Object.keys(obj);
                    keys.forEach((key) => {
                        let value = obj[key];
                        let currentVal = $(\`#\${key}\`).text();
                        if (currentVal !== value) {                           
                            $(\`#\${key}\`).fadeOut(400, () => {
                                $(\`#\${key}\`).text(value);
                            });
                            setTimeout(() => {
                                $(\`#\${key}\`).fadeIn();
                            }, 700);
                        }
                    });
                }
            </script>
        </head>
        <body>
            ${body}
        </body>
    </html>
    `
}