var socket = io.socket();

$(document).ready(function(){
    var chatApp = new Chat(socket);

    socket.on('nameResult', function(result){
        var message;

        if(result.success){
            message = 'You are now known as ' +result.name + '.';

        }else{
            message = result.message;
        }

        $('messages').append(divSystemContentElement(message));
    });

    socket.on('joinResult', function(result){
        $('#room').text(result.room);
        $('#messages').append(divSystemContentElement('Room chaged.'));
    });

    socket.on('message', function(message){
        var newElement = $('<div></div>').text(message.text);
        $('#messages').append(newElement);
    });

    socket.on('rooms', function(rooms){
        $('#room-list').empty();

        for(var room in rooms){
            room = room.substring(1, room.length);
            if(room !=''){
                $('#room-list').append(divEscapedContentElement(room));
            }
        }

        $('#room-list div').click(function(){
            chatApp.processCommand(('/join' + (this).text()));
            $('#send-message').focus();
        });


    });
});

function divSystemContentElement(message) {
    return $('<div></div>').text(message);
}

function divEscapedContentElement(message) {
    return $('<div></div>').html('<i>'+message+'</i>');
}

function processUserInput(chatApp, socket){
    var message = $('#send-message').val();
    var systemMessage;

    if(message.charAt(0) == '/'){
        systemMessage =chatApp.processCommand(message);
        if(systemMessage){
            $('#message').append(divSystemContentElement(systemMessage));
        }else{
            chatApp.sendMessage($('#room').text(), message);
            $('#message').append(divEscapedContentElement(message));
            $('#message').scrollTop($('#message').prop('scrollHeight'));
        }
        $('#send-message').val(' ');
    }
}