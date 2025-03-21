


// Clé API Gemini pour authentifier les requêtes
  const API_KEY = "AIzaSyCK7XYZufJMARsDutiOCRWMxK6_asOuLLI";
    
  // URL de l'API Gemini avec la clé API intégrée
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
  
  // Sélection des éléments du DOM
  const promptForm = document.getElementById("prompt-form");         /* Formulaire de saisie*/
  const promptInput = document.getElementById("prompt-input");         /* Champ de saisie utilisateur*/
  const chatsContainer = document.querySelector(".chats-container");   /* Conteneur des messages du chat*/


  // Fonction pour limiter la réponse à 60 mots
  function truncateWords(text, maxWords) {
    let words = text.split(/\s+/); // Sépare la réponse en mots
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(" ") + " [...]"; // Tronque après 60 mots
    }
    return text;
  }
  
  // Écouteur d'événement sur le formulaire pour intercepter l'envoi
  promptForm.addEventListener("submit", function (event) {
    event.preventDefault(); /* Empêche l'envoi classique du formulaire*/
    
    // Récupère et nettoie le texte saisi par l'utilisateur
    const userText = promptInput.value.trim();
    if (userText === "") return; /*Ne rien faire si le champ est vide*/
    
    // Affiche le message de l'utilisateur dans le conteneur de chat
    displayMessage(userText, "user-message");
    
    // Construit un prompt composite pour limiter la réponse au paludisme en Côte d'Ivoire
    const compositePrompt = `Tu es un chatbot expert en sensibilisation et éducation sur le paludisme en Côte d'Ivoire t'appuyant sur les rapports de l'OMS. Réponds exclusivement sur ce sujet. Voici la question de l'utilisateur : ${userText}`;
    
    // Prépare les données à envoyer à l'API Gemini sous forme d'objet JSON
    const requestData = {
      contents: [
        {
          parts: [
            { text: compositePrompt }
          ]
        }
      ]
    };
    
    // Envoi de la requête à l'API Gemini via fetch
    fetch(API_URL, {
      method: "POST", /* Utilisation de la méthode POST*/
      headers: {
        "Content-Type": "application/json" /* Données envoyées en JSON*/
      },
      body: JSON.stringify(requestData) /* Conversion de l'objet en chaîne JSON*/
    })
    .then(response => response.json()) /* Conversion de la réponse en JSON*/
    .then(data => {
      // Récupère la réponse complète du bot
      let fullBotResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Désolé, je n'ai pas pu traiter votre demande.";
      // Limite la réponse à 70 lignes maximum
      let lines = fullBotResponse.split(/\r?\n/);
      if (lines.length > 70) {
        fullBotResponse = lines.slice(0, 70).join("\n") + "\n[Réponse tronquée après 70 lignes...]";
      }
      // Affiche la réponse limitée dans le conteneur de chat
      displayMessage(fullBotResponse, "bot-message");
      

    })
    .catch(error => {
      console.error("Erreur lors de la requête API :", error);
      displayMessage("Une erreur s'est produite lors de la récupération de la réponse.", "bot-message");
    });
    
    // Réinitialise le champ de saisie après envoi
    promptInput.value = "";
  });
  
  // Fonction utilitaire pour afficher un message dans le conteneur du chat
  function displayMessage(text, className) {
    // Crée un nouvel élément div pour le message
    const messageElement = document.createElement("div");
    // Ajoute les classes CSS correspondantes pour le style
    messageElement.classList.add("message", className);
    // Définit le contenu du message
    messageElement.textContent = text;
    // Ajoute le message au conteneur du chat
    chatsContainer.appendChild(messageElement);
    // Fait défiler le conteneur pour montrer le dernier message
    chatsContainer.scrollTop = chatsContainer.scrollHeight;
  }

// Ajoute des messages de démarrage au chat
displayMessage("Welcome sur le chatbot de sensibilisation sur le paludisme en Côte d'Ivoire !", "bot-message") ; 
displayMessage("Comment puis-je vous sensibiliser ? Posez vos différentes questions ?", "bot-message"); 
    



// Ajoute un écouteur d'événement sur le bouton pour charger plus de messages
const loadMoreButton = document.getElementById("load-more-button");
const chatbotInput = document.getElementById("chatbot-input");
const sendBtn = document.getElementById("send-button"); // Define and initialize sendBtn

sendBtn.addEventListener("click", sendMessage);
chatbotInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});
