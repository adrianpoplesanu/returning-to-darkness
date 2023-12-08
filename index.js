$(document).ready(function () {
    $("#create-room-btn").on('click', function () {
        createRoom(socket);
        $('.main-menu').hide();
        $('.room-created-menu').show();
    });

    $("#join-room-btn").on('click', function () {
        $('.main-menu').hide();
        $('.join-room-menu').show();
    });

    $("#how-to-play-btn").on('click', function () {
        //...
    });

    $("#join-btn").on('click', function () {
        joinRoom(socket, $("#room-code").val());
    });

    $("#back-btn").on('click', function () {
        $('.join-room-menu').hide();
        $("#room-code").val('');
        $('.main-menu').show();
    });
});

function startingGame() {
    $('.main-menu').hide();
    $('.join-room-menu').hide();
    $('.room-created-menu').hide();
}

function populateCode(code) {
    $('#code-display').text(roomCode);
}
