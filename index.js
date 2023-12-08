$(document).ready(function () {
    $("#create-room-btn").on('click', function () {
        console.log("create room btn");
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
    });

    $("#back-btn").on('click', function () {
        console.log("back btn");
        $('.join-room-menu').hide();
        $("#room-name-input").val('');
        $('.main-menu').show();
    });
});
