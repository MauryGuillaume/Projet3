//  Logs level
const LOG_LEVEL = "all";

// @modeles //////////////////////////////////////////////////////////////////////////////////
    // Requete de connexion à l'API et stockage token
    async function _login(url, email, password) {
        const rawResponse = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
            email: email,
            password: password,
            }),
            headers: {
            "Content-type": "application/json; charset=UTF-8"
            }
        });

        const content = await rawResponse.json();
        log(19,"debug",content.message);
        log(20,"debug",content.userId);
        log(21,"debug",content.token);
        // Stockage du token dans le localStorage
        window.localStorage.setItem("token", content.token);
        return content;
    }

// @routes api
    async function _Routes(object, arg1, arg2) {
        switch (object) {
            case 'login':
                log(31,"info","Connection ...");
                data = await _login("http://localhost:5678/api/users/login", arg1, arg2);
                log(33,"debug",data);
                return data;
            default:
                msg = "ERROR : No match case for " + object;
                return msg;
        }
    }

    //Création du formulaire
    function redirectByPost(url, parameters, inNewTab) {
        parameters = parameters || {};
        inNewTab = inNewTab === undefined ? true : inNewTab;
    
        var form = document.createElement("form");
        form.id = "reg-form";
        form.name = "reg-form";
        form.action = url;
        form.method = "post";
        form.enctype = "multipart/form-data";
    
        if (inNewTab) {
        form.target = "_blank";
        }
    
        Object.keys(parameters).forEach(function (key) {
        var input = document.createElement("input");
        input.type = "text";
        input.name = key;
        input.value = parameters[key];
        form.appendChild(input);
        });
    
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    
        return false;
    }


// @vues /////////////////////////////////////////////////////////////////////////////////////
    // Affichage erreur de connexion
    async function badConnection(msg) { 
        // retour reponse API stocké dans 'response'
        modal = document.getElementById("bad-connection");
        modal.style.display = "block";
    }


//  @Routes //////////////////////////////////////////////////////////////////////////////////
// @Post : Login
    // Lance la fonction login au click sur le bouton
    document.getElementById("LOGIN").addEventListener("click", () => {login()});


// @controller //////////////////////////////////////////////////////////////////////////////
    // Verifie l'email et le mot de passe et redirige si la connexion est validée
    async function login(event){
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        log(93,"debug",email);
        log(94,"debug",password);

        try {
            const LOGIN = await _Routes("login", email, password);
            if (LOGIN.token) {
                const parameters = {"token": LOGIN.token}
                log(100,"debug", parameters);
                redirectByPost("index.html", parameters, false);
            } else {
                await badConnection();
            }
        }
        catch (error) {
            // En cas d'erreur, afficher le message d'erreur
            badConnection();
    }}

    //Affiche les logs
    function log(line,level, msg) {
        switch (level) {
            case 'error':
                if (LOG_LEVEL != "none"){
                    console.error('ERROR ['+line+']: ' + msg);
                }
            break;
            case 'info':
                if (LOG_LEVEL != "none" && LOG_LEVEL == "info" || LOG_LEVEL == "all"){
                    console.log('INFO ['+line+']: ' + msg);
                }
            break;
            case 'debug':
                if (LOG_LEVEL != "none" && LOG_LEVEL == "debug" || LOG_LEVEL == "all"){
                    console.log('DEBUG ['+line+']: ' + msg);
                }
            break;
            default:
                console.error('ERROR : Log level unknown');
        }
    }
