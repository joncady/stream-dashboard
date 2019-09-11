let twitterInterval;
let tag1, tag2, twitter1, twitter2;
let which = true;

$(function () {
    var socket = io.connect('http://localhost:8889', { reconnection: true, reconnectionDelay: 1000 });
    socket.on('update', function (data) {
        let overlayContent = data.gameInfo;
        if (overlayContent.useTwitters) {
            tag1 = overlayContent.player1;
            tag2 = overlayContent.player2;
            twitter1 = overlayContent.twitter1;
            twitter2 = overlayContent.twitter2;
            alternate();
        } else {
            if (twitterInterval) {
                clearInterval(twitterInterval);
            }
        }
        setContent(overlayContent);
        if (data.gameInfo.doubles) {
            $(".doubles").show();
            let dubsEl = data.doubles.content;
            setContent(dubsEl);
        } else {
            $(".doubles").hide();
            $(".doubles").text("");
        }
    });
});

function alternate() {
    twitterInterval = setInterval(() => {
        if (which) {
            $("#player1").fadeOut(400, () => {
                $("#player1").text(twitter1);
            });
            setTimeout(() => {
                $("#player1").fadeIn();
            }, 500);
            $("#player2").fadeOut(400, () => {
                $("#player2").text(twitter2);
            });
            setTimeout(() => {
                $("#player2").fadeIn();
            }, 500);
        } else {
            $("#player1").fadeOut(400, () => {
                $("#player1").text(tag1);
            });
            setTimeout(() => {
                $("#player1").fadeIn();
            }, 500);
            $("#player2").fadeOut(400, () => {
                $("#player2").text(tag2);
            });
            setTimeout(() => {
                $("#player2").fadeIn();
            }, 500);
        }
        which = !which;
    }, 10000);
}

function setContent(obj) {
    let keys = Object.keys(obj);
    keys.forEach((key) => {
        let value = obj[key];
        let currentVal = $(`#${key}`).text();
        if (currentVal !== value) {
            $(`#${key}`).fadeOut(400, () => {
                $(`#${key}`).text(value);
            });
            setTimeout(() => {
                $(`#${key}`).fadeIn();
            }, 500);
        }
    });
}