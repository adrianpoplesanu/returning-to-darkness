$(document).ready(function () {
    $("#create-room-btn").on('click', function () {
        console.log("create room btn");
        createRoom(socket);
        $('.main-menu').hide();
        $('.room-created-menu').show();
    });

    $("#join-room-btn").on('click', function () {
        console.log("join room btn");
        $('.main-menu').hide();
        $('.join-room-menu').show();
    });

    $("#how-to-play-btn").on('click', function () {
        console.log("how to play btn");
    });

    $("#join-btn").on('click', function () {
        console.log("join btn");
        joinRoom(socket, $("#room-code").val());
    });

    $("#back-btn").on('click', function () {
        console.log("back btn");
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
