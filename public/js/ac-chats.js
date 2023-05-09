let chats = document.getElementsByClassName("chat");
let currentChat = document.getElementById("current-chat");
let sendMessage = document.getElementById("sendButton");
let chatTextBox = document.getElementById("sentMessage");
let currChatInfo;
for(let chat of chats){
    chat.addEventListener("click", async() =>{
        for(let _chat of chats){
            if(_chat != chat){
                _chat.classList.remove("toggledChat");
            }
        }
        while(currentChat.childElementCount > 0){
            currentChat.removeChild(currentChat.lastChild);
        }
        currChatInfo = chat;
        console.log(chat);
        let acid = chat.getElementsByClassName("acid");
        let uid = chat.getElementsByClassName("uid");

        let acidText = acid[0].textContent.split(" ")[1];
        console.log(acidText)
        let uidText = uid[0].textContent.split(" ")[1];

        chat.classList.add("toggledChat");

        let requestConfig = {
            method: 'GET',
            url: `/chats/acenter/${acidText}/${uidText}`,
            error: function(err){
                if(err.status === 400 || err.status === 404 || err.status === 500){
                    window.location.href = "/404Page";
                }
            }
        };
        (function ($) {
            $.ajax(requestConfig).then(function (responseMessage){
                let messages = responseMessage.messages;
                for(let message of messages){
                    if(message.senderId === acidText){
                        //console.log("Acenter: " + message.messageContent)
                        let messageDiv = document.createElement("div");
                        let timeP = document.createElement("span");
                        let messageP = document.createElement("p");
                        timeP.textContent = message.messageTime;
                        messageP.textContent = message.messageContent;
                        messageDiv.appendChild(timeP);
                        messageDiv.appendChild(messageP);
                        currentChat.appendChild(messageDiv);
                        messageDiv.classList.add("senderMessageDiv");
                        messageP.classList.add("senderMessage");
                        timeP.classList.add("senderMessageTime");
                    }else{
                        //console.log("User: " + message.messageContent);
                        let messageDiv = document.createElement("div");
                        let timeP = document.createElement("span");
                        let messageP = document.createElement("p");
                        messageP.textContent = message.messageContent;
                        timeP.textContent = message.messageTime;
                        messageDiv.appendChild(messageP);
                        messageDiv.appendChild(timeP);
                        currentChat.appendChild(messageDiv);
                        messageDiv.classList.add("receiverMessageDiv");
                        messageP.classList.add("receiverMessage");
                        timeP.classList.add("receiverMessageTime");
                    }

                }
                
                let acenterMessages = currentChat.querySelectorAll("div.senderMessageDiv");
                let userMessages = currentChat.querySelectorAll("div.receiverMessageDiv");
                if(acenterMessages[acenterMessages.length - 1] === undefined && userMessages[userMessages.length - 1] === undefined){
                    
                }else if(acenterMessages[acenterMessages.length - 1] === undefined){
                    userMessages[userMessages.length - 1].scrollIntoView({block: 'nearest', inline: 'start'});
                }else if(userMessages[userMessages.length - 1] === undefined){
                    acenterMessages[acenterMessages.length - 1].scrollIntoView({block: 'nearest', inline: 'start'});
                }else{
                    console.log(acenterMessages[acenterMessages.length - 1])
                    console.log(userMessages[userMessages.length - 1])
                    if(acenterMessages[acenterMessages.length - 1].getBoundingClientRect().top > 
                        userMessages[userMessages.length - 1].getBoundingClientRect().top){
                            acenterMessages[acenterMessages.length - 1].scrollIntoView({block: 'nearest', inline: 'start'});
                    }else{
                        userMessages[userMessages.length - 1].scrollIntoView({block: 'nearest', inline: 'start'});
                    }
                }
            })
        })(window.jQuery);
        console.log("here2");

    })
}
//add the same loading ajax request but on an interval
//this might be prone to injections
sendMessage.addEventListener("click", (event) => {
    event.preventDefault();
    let chatText = chatTextBox.value;
    console.log(chatText)
    console.log(chatTextBox)
    try{
        if(currChatInfo === undefined){
            throw "Cant send message to nothing"
        }
    }catch(e){
        console.log(e);
        return;
    }
    try{
        if(!chatText){
            throw `You must supply a message`;
        }
        if(chatText.trim().length === 0){
            throw `You must send a non-empty message`;
        }
        chatText = chatText.trim();
    }catch(e){
        console.log(e);
        return;
    }
    let acid = currChatInfo.getElementsByClassName("acid");
    let uid = currChatInfo.getElementsByClassName("uid");

    let acidText = acid[0].textContent.split(" ")[1];

    let uidText = uid[0].textContent.split(" ")[1];

    let requestConfig = {
        method: 'PUT',
        url: `/chats/acenter/${acidText}/${uidText}`,
        contentType: 'application/json',
        data: JSON.stringify({
            message: chatText,
        }),
        error: function(err){
            if(err.status === 400 || err.status === 404 || err.status === 500){
                window.location.href = "/404Page";
            }
        }
    };
    (function($){
        $.ajax(requestConfig).then(function (responseMessage) {
            console.log(responseMessage.message.messageContent);
            let messageDiv = document.createElement("div");
            let timeSpan =  document.createElement("span");
            let messageP = document.createElement("p");
            messageP.textContent = responseMessage.message.messageContent;
            timeSpan.textContent = responseMessage.message.messageTime;
            messageDiv.appendChild(timeSpan)
            messageDiv.appendChild(messageP);
            currentChat.appendChild(messageDiv);
            timeSpan.classList.add("senderMessageTime")
            messageDiv.classList.add("senderMessageDiv");
            messageP.classList.add("senderMessage");

            let acenterMessages = currentChat.querySelectorAll("div.senderMessageDiv");
            let userMessages = currentChat.querySelectorAll("div.receiverMessageDiv");
            //scroll by height;
            
            if(acenterMessages[acenterMessages.length - 1] === undefined && userMessages[userMessages.length - 1] === undefined){
                    
            }else if(acenterMessages[acenterMessages.length - 1] === undefined){
                userMessages[userMessages.length - 1].scrollIntoView({block: 'nearest', inline: 'start'});
            }else if(userMessages[userMessages.length - 1] === undefined){
                acenterMessages[acenterMessages.length - 1].scrollIntoView({block: 'nearest', inline: 'start'});
            }else{
                console.log(acenterMessages[acenterMessages.length - 1])
                console.log(userMessages[userMessages.length - 1])
                if(acenterMessages[acenterMessages.length - 1].getBoundingClientRect().top > 
                    userMessages[userMessages.length - 1].getBoundingClientRect().top){
                        acenterMessages[acenterMessages.length - 1].scrollIntoView({block: 'nearest', inline: 'start'});
                }else{
                    userMessages[userMessages.length - 1].scrollIntoView({block: 'nearest', inline: 'start'});
                }
            }
            
        })
    })(window.jQuery); 
    chatTextBox.value = "";
    
})

setInterval(getMessageAjax, 10000);

function getMessageAjax(){
    console.log("firing interval");
    console.log(currentChat.childElementCount)
    if(currChatInfo === undefined){
        return;
    }

    let acid = currChatInfo.getElementsByClassName("acid");
    let uid = currChatInfo.getElementsByClassName("uid");

    let acidText = acid[0].textContent.split(" ")[1];

    let uidText = uid[0].textContent.split(" ")[1];

    let requestConfig = {
        method: 'GET',
        url: `/chats/acenter/${acidText}/${uidText}`,
        error: function(err){
            if(err.status === 400 || err.status === 404 || err.status === 500){
                window.location.href = "/404Page";
            }
        }
    };
    (function ($) {
        $.ajax(requestConfig).then(function (responseMessage){
            console.log(responseMessage);
            let messages = responseMessage.messages;
            if(messages.length > currentChat.childElementCount){
                for(let i = currentChat.childElementCount; i < messages.length; i++){
                    if(messages[i].senderId === acidText){
                    //console.log("User: " + message.messageContent)
                        let messageDiv = document.createElement("div");
                        let timeP = document.createElement("span");
                        let messageP = document.createElement("p");
                        timeP.textContent = messages[i].messageTime;
                        messageP.textContent = messages[i].messageContent;
                        
                        messageDiv.appendChild(timeP);
                        messageDiv.appendChild(messageP);
                        currentChat.appendChild(messageDiv);
                        messageDiv.classList.add("senderMessageDiv");
                        messageP.classList.add("senderMessage");
                        timeP.classList.add("senderMessageTime");
                    }else{
                    //console.log("Acenter: " + message.messageContent);
                        let messageDiv = document.createElement("div");
                        let timeP = document.createElement("span");
                        let messageP = document.createElement("p");
                        messageP.textContent = messages[i].messageContent;
                        timeP.textContent = messages[i].messageTime;

                        messageDiv.appendChild(messageP);
                        messageDiv.appendChild(timeP);
                        currentChat.appendChild(messageDiv);
                        messageDiv.classList.add("receiverMessageDiv");
                        messageP.classList.add("receiverMessage");
                        timeP.classList.add("receiverMessageTime");
                    }
                }
            }
            
        })
    })(window.jQuery);

}