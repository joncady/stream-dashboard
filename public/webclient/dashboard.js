'use strict';

let doubles = false;
let useTwitters = false;
let tournamentId;
let players;
let phase;
let lastRankings;
let socket;

$(function () {
    socket = io(window.location.hostname + ':8889');
    socket.on('update', function (data) {
        let overlayContent = data.gameInfo;
        setContent(overlayContent);
        let commentary = data.commInfo;
        setContent(commentary);
        doubles = overlayContent.doubles;
        useTwitters = overlayContent.useTwitters;
        document.getElementById("doubles-check").checked = doubles;
        document.getElementById("twitter-check").checked = useTwitters;
        if (doubles) {
            $(".doubles").show();
            setContent({ player3: overlayContent.player3, player4: overlayContent.player4 });
            $(".twitters").hide();
        } else {
            $(".twitters").show();
            $(".doubles").hide();
        }
    });
});

function sendData(event) {
    event.preventDefault();
    let player1 = $("#player1").val();
    let sponsor1 = $("#sponsor1").val();
    let player2 = $("#player2").val();
    let sponsor2 = $("#sponsor2").val();
    let player3 = $("#player3").val();
    let player4 = $("#player4").val();
    let twitter1 = $("#twitter1").val();
    let twitter2 = $("#twitter2").val();
    let score1 = $("#score1").val();
    let score2 = $("#score2").val();
    let link = $("#link").val();
    let bracket = $("#bracket").val();
    let date = $("#date").val();
    let location = $("#location").val();
    let comm1 = $("#commName1").val();
    let commTwit1 = $("#commTwitter1").val();
    let comm2 = $("#commName2").val();
    let commTwit2 = $("#commTwitter2").val();
    socket.emit('update', {
        gameInfo: {
            player1: player1,
            sponsor1: sponsor1,
            player2: player2,
            sponsor2: sponsor2,
            player3: player3,
            player4: player4,
            score1: score1,
            score2: score2,
            bracket: bracket,
            link: link,
            date: date,
            location: location,
            doubles: doubles,
            twitter1: twitter1,
            twitter2: twitter2,
            useTwitters: useTwitters
        },
        commInfo: {
            commName1: comm1,
            commTwitter1: commTwit1,
            commName2: comm2,
            commTwitter2: commTwit2
        }
    });
}

function setContent(obj) {
    let keys = Object.keys(obj);
    keys.forEach((key) => {
        let value = obj[key];
        let currentVal = $(`#${key}`).val();
        if (currentVal !== value) {
            $(`#${key}`).val(value);
        }
    });
}

function doSwapNames(type) {
    if (type === "info") {
        swap("player1", "player2");
        swap("player3", "player4");
        swap("score1", "score2");
        swap("twitter1", "twitter2");
    } else {
        swap("commName1", "commName2");
        swap("commTwitter1", "commTwitter2");
    }
}

function swap(id1, id2) {
    let value1 = $(`#${id1}`).val();
    let value2 = $(`#${id2}`).val();
    $(`#${id1}`).val(value2);
    $(`#${id2}`).val(value1);
}

function setScoreboard() {
    players.forEach((element, i) => {
        $(`#player${i + 1}`).val(element);
    });
    $('#bracket').val(phase);
}

function show(type) {
    if (type === 'doubles') {
        doubles = !doubles;
        if (doubles) {
            $(".twitters").hide();
        } else {
            $(".twitters").show();
        }
        $(".doubles").toggle();
    } else {
        useTwitters = !useTwitters;
        if (useTwitters && !doubles) {
            $(".twitters").show();
        }
    }

}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var src = document.getElementById(ev.dataTransfer.getData("text"));
    var tgt = ev.currentTarget;
    let temp = ev.target.value;
    ev.target.value = src.value;
    src.value = temp;
}