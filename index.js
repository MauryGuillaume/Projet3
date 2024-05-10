//////////////////////////////////////////////////////////////////
//
// CONFIG  
//  Logs level
    const LOG_LEVEL = "info";

//////////////////////////////////////////////////////////////////////////////////////////////
// @modeles //////////////////////////////////////////////////////////////////////////////////

    async function _get(url) {
        response = await fetch(url);
        var data = await response.json();
        log(13,"debug",data[0]["name"]);
        return data;
    }

// @routes api
    // Recherche des categories et des travaux
    async function _Routes(object) {
        switch (object) {
            case 'categories':
                log(22,"info","Requesting categories");
                var data = await _get("http://localhost:5678/api/categories");
                log(24,"debug",data[0]["name"]);
                return data;

            case 'works':
                log(28,"info","Requesting works");
                data = await _get("http://localhost:5678/api/works");
                log(30,"debug",data[0]["name"]);
                return data;

            default:
            msg = "ERROR : No match case for " + object;
            return msg;
        }
    }

//////////////////////////////////////////////////////////////////////////////////////////////
// @vues /////////////////////////////////////////////////////////////////////////////////////
    // Création du bouton Tous
    function generateAllButton() {
        const allButton = document.createElement('button');
        allButton.textContent = 'Tous';
        allButton.classList.add('filtres-btn');
        allButton.setAttribute('id', 'Tous');
        document.body.appendChild(allButton);
        // Ajoute le bouton "Tous" à votre élément HTML
        const divIDButton = document.getElementById('button');
        divIDButton.appendChild(allButton);
    }

    // Affichage des boutons des catégories
    function buttonListGenerator (buttons) {
        // retour reponse API stocké dans 'response'
        log(56,"debug", buttons.name); 
        for (let i = 0; i < buttons.length; i++) {
            log(58,"debug", buttons[i]["name", "id"]); 
            
            const newButton = document.createElement('button');
            newButton.textContent = buttons[i]["name"];
            newButton.id = buttons[i]["id"]
            newButton.classList.add("filtres-btn");
            newButton.addEventListener("click", handleButtonClick);  // Ajoute le gestionnaire d'événements
            let divIDButton = document.getElementById("button")
            divIDButton.appendChild(newButton);
        }
    }

    // Affichage des works
    async function workListGenerator(works) { 
        // Retour reponse API stocké dans 'response'
        const gallery = document.getElementById('gallery');
        for (let i = 0; i < works.length; i++) {
            const work = works[i];
            const workElement = document.createElement('div');
            workElement.classList.add('work-item');
            workElement.innerHTML = `
                <div class="work-image"><img src="${work.imageUrl}" alt="${work.title}"></div>
                <div class="work-title">${work.title}</div>
            `;
            gallery.appendChild(workElement);
        }
    }
    

    // Gestionnaire d'événements pour les boutons
    function handleButtonClick(event) {
        const clickedButtonId = event.target.id; // Récupère l'ID du bouton cliqué
    }

    //Remet la div à vide avant de pouvoir la remplir
    function resetDiv (divName) {      
        divName.innerHTML = "";
            return true;
    }

    //Fonction permettant de déconnecter à l'appui du bouton logout
    document.addEventListener("DOMContentLoaded", function() {
        var logoutLink = document.getElementById("logout");
    
        logoutLink.addEventListener("click", function(event) {
            event.preventDefault();
    
            // Supprime le token du stockage local
            localStorage.removeItem("token");
    
            // Redirige l'utilisateur vers la page d'accueil
            window.location.href = "index.html";
        });
    });



///////////////////////////////////////////////////////////
////////////////////  MODAL   /////////////////////////////
///////////////////////////////////////////////////////////
    let modal = null
    let modal2 = null

   // Ouvre la modal1
   const openModal = function (e) {
    if (e && e.target) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));

        
        target.style.display = null;
        target.removeAttribute('aria-hidden');
        target.setAttribute('aria-modal', 'true');
        modal = target;
        modal.addEventListener('click', closeModal);
        modal.querySelector('.js-close').addEventListener('click', closeModal);
        modal.querySelector('.js-stop').addEventListener('click', stopPropagation);
        addWorksToModalImg(WORKS);

        

        // Attacher l'écouteur d'événements à .btn-ajout-photo lorsque la modal 1 est affichée
        const btnAjoutPhoto = document.querySelector('.btn-ajout-photos');
        if (btnAjoutPhoto) {
            btnAjoutPhoto.addEventListener('click', function (e) {
                e.preventDefault();
                closeModal(e);
                openModal2(e);
            });
        } else {
            console.error("L'élément avec la classe '.btn-ajout-photos' n'a pas été trouvé.");
        }
    }}

    // Ouvre la modal2
    const openModal2 = async function (e) {
        e.preventDefault();
        const target = document.querySelector('#modal2');
        target.style.display = null;
        target.removeAttribute('aria-hidden');
        target.setAttribute('aria-modal', 'true');
        modal2 = target;
        modal2.addEventListener('click', closeModal2);
        modal2.querySelector('.js-close').addEventListener('click', closeModal2);
        modal2.querySelector('.js-stop').addEventListener('click', stopPropagation);

            // Récupère les catégories depuis l'API
            const categoriesSelect = modal2.querySelector('#categories');
            const categories = await _Routes("categories");

            // Efface les options précédentes
            categoriesSelect.innerHTML = '';

            // Ajoute une option vide
            categoriesSelect.appendChild(document.createElement('option'));

            // Ajoute chaque catégorie comme une option
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categoriesSelect.appendChild(option);
            });

            // Attache l'écouteur d'événements pour le bouton "Retour" (classe .js-back)
            const btnBack = modal2.querySelector('.js-back');
            if (btnBack) {
                btnBack.addEventListener('click', function (e) {
                    e.preventDefault();
                    closeModal(e);
                    openModal(e);
                });
            } else {
                console.error("L'élément avec la classe '.js-back' n'a pas été trouvé dans la modal 2.");
            }
    }

    // Sélectionne tous les champs du formulaire dans la modal 2
    const formFields = document.querySelectorAll('#modal2 input, #modal2 select, #modal2 textarea');

    // Ajoute un écouteur d'événements "input" à chaque champ
    formFields.forEach(field => {
        field.addEventListener('input', function() {
            // Vérifie si tous les champs sont remplis
            const isFormValid = Array.from(formFields).every(field => field.value.trim() !== '');
            
            // Sélectionne le bouton "Valider"
            const submitBtn = document.getElementById('SubmitBtn');
            
            // Si tous les champs sont remplis, change la couleur du bouton en vert, sinon remet sa couleur par défaut
            if (isFormValid) {
                submitBtn.style.backgroundColor = '#1D6154';
            } else {
                submitBtn.style.backgroundColor = ''; // Remet la couleur par défaut
            }
        });
    });

    // Ferme la modal1
    const closeModal = function (e) {
        if (modal === null) return
        e.preventDefault()
        modal.style.display = "none",
        modal.setAttribute('aria-hidden', 'true')
        modal.removeAttribute('aria-modal')
        modal.removeEventListener('click', closeModal)
        modal.querySelector('.js-close').removeEventListener('click', closeModal)
        modal.querySelector('.js-stop').removeEventListener('click', stopPropagation)
        modal = null
        resetDiv(gallery);
        workListGenerator(WORKS);
    }

    // Ferme la modal2
    const closeModal2 = function (e) {
        if (modal2 === null) return
        modal2.style.display = "none",
        modal2.setAttribute('aria-hidden', 'true')
        modal2.removeAttribute('aria-modal')
        modal2.removeEventListener('click', closeModal2)
        modal2.querySelector('.js-close').removeEventListener('click', closeModal2)
        modal2.querySelector('.js-stop').removeEventListener('click', stopPropagation)
        modal2 = null
    }

    // Empeche la propagation aux parents
    const stopPropagation = function (e) {
        e.stopPropagation()
    }

    // Ajoute l'écouteur d'événements au chargement du DOM pour assurer que les éléments existent avant de les cibler
    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.jsModal').forEach(a => {
            a.addEventListener('click', openModal);
        })
    });

    // Ajoutez l'écouteur d'événements pour le bouton de retour dans la modal 2
    const btnBackModal2 = document.querySelector('#modal2 .js-back');
        if (btnBackModal2) {
            btnBackModal2.addEventListener('click', function () {
                closeModal2();
                openModal();
            });
        } else {
            console.error("L'élément avec la classe '.js-back' n'a pas été trouvé dans la modal 2.");
        };

    // Permet de sortir de la modal grâce au bouton echap
    window.addEventListener('keydown', function (e) {
        if (e.key === "Escape" || e.key === "Esc")
        closeModal(e)
    })

    // Ajout des travaux à la première modal
    async function addWorksToModalImg(works) {
        const modalImg = document.getElementById('modalImg');
        
        // Rafraîchit le contenu de la modal 1 à chaque ouverture
        resetDiv(modalImg)
        
        for (let i = 0; i < works.length; i++) {
            const work = works[i];
            const workElement = document.createElement('div');
            workElement.classList.add('work-item');
            workElement.innerHTML = `
                <div class="work-image"><img src="${work.imageUrl}" alt="${work.title}"></div>
            `;
            
            const deleteIcon = document.createElement('img');
            deleteIcon.classList.add('delete-icon');
            deleteIcon.src = 'assets/icons/poubelle.png';
            deleteIcon.alt = 'Supprimer'; 
            deleteIcon.addEventListener('click', function(event) {
                event.preventDefault(); // Empêche le rechargement de la page
                const workId = work.id; // Obtient l'ID du travail à supprimer
                deleteWork(workId); // Appel de la fonction deleteWork pour supprimer le travail dans l'API
                workElement.remove(); // Supprime l'élément HTML du travail de la modal
            });
            
            workElement.appendChild(deleteIcon); // Ajoute le pictogramme de poubelle à l'élément de travail
            modalImg.appendChild(workElement);
        }
    }

    // Fonction pour supprimer un travail
    async function deleteWork(workId) {
        try {
            const token = localStorage.getItem('token');
            log(307, "debug", token)
            if (!token) {
                
                console.error("Token not found in localStorage");
                return;
            }
            
            const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
    
            if (!response.ok) {
                throw new Error('Erreur lors de la suppression de l\'élément dans l\'API');
            }
    
            console.log('Élément supprimé avec succès dans l\'API');
        WORKS = WORKS.filter(work => work.id !== workId);

        // Met à jour la galerie avec la liste WORKS mise à jour
        workListGenerator(WORKS);
        } catch (error) {
            console.error(error);
        }
    }

    //Ajout d'une photo dans l'API
    async function addPhotoToAPI(formData) {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("Token not found in localStorage");
            return;
        }
        try {
            for (const value of formData.values()) {
                log(344, "debug", value);
              }
            const response = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                body: formData,
                headers: {'Authorization': 'Bearer ' + token}
            });
            if (!response.ok) {
                throw new Error('Erreur lors de l\'envoi de la photo à l\'API');
            }
            const responseData = await response.json();
            // Récupére l'URL de l'image téléchargée à partir de la réponse de l'API
            const imageUrl = responseData.imageUrl;
            return imageUrl;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    function updateTitle(newTitle) {
        const titleElement = document.querySelector('header h1');
        const spanElement = titleElement.querySelector('span');
        spanElement.textContent = newTitle;
    }

    document.getElementById('ajout-photo').addEventListener('submit', async function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        const title = formData.get('title');
        const imageUrl = await addPhotoToAPI(formData);
        if (imageUrl) {
            // Crée un nouvel élément d'image et l'affiche dans la galerie
            const newImage = document.createElement('img');
            newImage.src = imageUrl;
            newImage.alt = "Image ajoutée";
            newImage.title = title
            works_display("Tous", true);
            updateTitle(title);

            closeModal2();
        }
    });

    // Écouteur d'événements pour le changement de fichier
    document.getElementById('images').addEventListener('change', function (e) {
        const file = e.target.files[0];
        const imgPreview = document.getElementById('img-preview');
        const dropContainer = document.getElementById('dropcontainer');
        if (file) {
            const imgUrl = URL.createObjectURL(file);
            imgPreview.src = imgUrl;
            imgPreview.style.display = 'block';
            dropContainer.style.display = 'none';
        } else {
            imgPreview.style.display = 'none';
            formContainer.style.display = 'block';
        }
    });


//////////////////////////////////////////////////////////////////////////////////////////////
//  @Routes //////////////////////////////////////////////////////////////////////////////////
    // @Get : filtered catégories
    document.getElementById("button").addEventListener('click', function(event) {works_display(event, false);});


//////////////////////////////////////////////////////////////////////////////////////////////
//  @controller //////////////////////////////////////////////////////////////////////////////
    // Construit la page
    async function constructor(){
        // Vérifie si un token est présent dans le localStorage
        const token = localStorage.getItem('token');
        log(417, "debug", token)

        if (token !== null) {
            // Affiche des éléments supplémentaires sur la page index si le token est trouvé
            const elementToShow1 = document.getElementById('hidden-modifier');
            const elementToShow2 = document.getElementById('hidden-logout');
            const elementToHide = document.getElementById('hidden-login');
            elementToShow1.classList.add("visible-connect");
            elementToShow2.classList.add("visible-connect");
            elementToHide.style.display = "none";
        }

        // Récupération des data depuis l'API
        CATEGORIES = await _Routes("categories");
        WORKS = await _Routes("works");
        log(432,"debug", CATEGORIES);
        log(433,"debug", WORKS);
        
        // Génération des vues 
        generateAllButton();
        buttonListGenerator(CATEGORIES);
        workListGenerator(WORKS);
    }

    // Tri des travaux en fonction de leur categorie
    async function works_display(event, standAlone) {
        log(443, "debug", event);
        CATEGORIES = await _Routes("categories");
        WORKS = await _Routes("works");
        var FILTERED_WORKS = [];
    
        gallery = document.getElementById("gallery");
        resetDiv(gallery);
    
        if (standAlone == false) {
            idcategory = event.target.id;
            log(453, "debug", idcategory);
        }
        else {
            idcategory = event;
        }
        
    
        switch (idcategory) {
            case 'Tous':
                // Remplissage de la DIV Gallery avec tous les travaux
                await workListGenerator(WORKS);
                break;
    
            default:
                if (idcategory > 0 && idcategory <= CATEGORIES.length && idcategory !== "Tous") {
                    // Filtrage des travaux selon la catégorie
                    for (let i = 0; i < WORKS.length; i++) {
                        if (WORKS[i]["categoryId"] == idcategory) {
                            FILTERED_WORKS.push(WORKS[i]);
                        }
                    }
    
                    log(475, "debug", FILTERED_WORKS);
                    // Ajout de tous les travaux filtrés à la galerie
                    await workListGenerator(FILTERED_WORKS);
                }
                break;
        }
    }

    // Permet de gérer les logs
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


//////////////////////////////////////////////////////////////////////////
//
// EXECUTE ZONE
// 
//////////////////////////////////////////////////////////////////////////
    // Lance le constructeur
    document.addEventListener("DOMContentLoaded", function() {
        constructor();
    });