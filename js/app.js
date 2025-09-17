const container = document.querySelector(".container");
const img = document.querySelector("#music-image");
const title = document.querySelector("#music-details .title");
const singer = document.querySelector("#music-details .singer");
const prev = document.querySelector("#controls #prev");
const play = document.querySelector("#controls #play");
const next = document.querySelector("#controls #next");
const duration = document.querySelector("#duration");
const currentTime = document.querySelector("#current-time");
const progressBar = document.querySelector("#progress-bar");
const volume = document.querySelector("#volume");
const volumeBar = document.querySelector("#volume-bar");
const ul = document.querySelector("ul");
const audio = document.querySelector("#audio");

const player = new MusicPlayer(musicList);

window.addEventListener('load', () => {
    let music = player.getMusic();
    displayMusic(music);
    displayMusicList(player.musicList);
    updateActiveListItem();
});

function displayMusic(music) {
    title.innerText = music.getName();
    singer.innerText = music.singer;
    img.src = "img/" + music.img;
    audio.src = "mp3/" + music.file;
    duration.textContent = "0:00";
    audio.load();
}
play.addEventListener('click', () => {
    const isMusicPlay = container.classList.contains("playing");
    isMusicPlay ? pauseMusic() : playMusic();
});

prev.addEventListener('click', () => { prevMusic(); });

next.addEventListener('click', () => { nextMusic();});

const prevMusic = () => {
    player.prev();
    let music = player.getMusic();
    displayMusic(music);
    playMusic();
    updateActiveListItem();
};

const nextMusic = () => {
    player.next();
    let music = player.getMusic();
    displayMusic(music);
    playMusic();
    updateActiveListItem();
};

const playMusic = () => {
    container.classList.add("playing");
    const icon = play.querySelector('i');
    icon.classList.replace("bi-play-fill", "bi-pause-fill");
    audio.play();
}

const pauseMusic = () => {
    container.classList.remove("playing");
    const icon = play.querySelector('i');
    icon.classList.replace("bi-pause-fill", "bi-play-fill");
    audio.pause();
};

const calculateTime = (sec) => { 
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    const updatedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    const result = `${minutes}:${updatedSeconds}`;
    return result;
}

audio.addEventListener('loadedmetadata', () => { 
    progressBar.max = Math.floor(audio.duration);
    duration.textContent = calculateTime(audio.duration);
});

audio.addEventListener('timeupdate', () => {
    progressBar.value = Math.floor(audio.currentTime);
    currentTime.textContent = calculateTime(audio.currentTime);
});

progressBar.addEventListener('input', () => {
    currentTime.textContent = calculateTime(progressBar.value);
    audio.currentTime = progressBar.value;
});

let muteState = "unmuted";

volumeBar.addEventListener('input', (e) => {
    const value = Number(e.target.value);
    console.log(value);
    audio.volume = value / 100;
    if (value === 0) {
        audio.muted = true;
        muteState = "muted";
        volume.classList.replace("bi-volume-up", "bi-volume-mute");
    } else {
        audio.muted = false;
        muteState = "unmuted";
        volume.classList.replace("bi-volume-mute", "bi-volume-up");
    }
});

volume.addEventListener('click', () => { 
    if (muteState === "unmuted") {
        audio.muted = true;
        muteState = "muted";
        volume.classList.replace("bi-volume-up", "bi-volume-mute");
        volumeBar.value = 0;
    } else {
        audio.muted = false;
        muteState = "unmuted";
        volume.classList.replace("bi-volume-mute", "bi-volume-up");
        volumeBar.value = 100;
    }
});

const displayMusicList = (list) => {
    for (let i = 0; i < list.length; i++) {
        const liTag = `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span>${list[i].getName()}</span>
                <span id="music-${i}" class="badge bg-primary rounded-pill"></span>
                <audio class="music-${i}" preload="metadata" src="mp3/${list[i].file}"></audio>
            </li>
        `;

        ul.insertAdjacentHTML("beforeend", liTag);

        const liAudioDuration = ul.querySelector(`#music-${i}`);
        const liAudioTag = ul.querySelector(`.music-${i}`);
        const liElement = ul.lastElementChild;
        if (liElement) {
            liElement.setAttribute("data-index", String(i));
            liElement.addEventListener("click", () => {
                player.index = i;
                const selected = player.getMusic();
                displayMusic(selected);
                playMusic();
                updateActiveListItem();
            });
        }
        if (liAudioTag && liAudioDuration) {
            const onLoaded = () => {
                liAudioDuration.innerText = calculateTime(liAudioTag.duration);
                liAudioTag.removeEventListener("loadedmetadata", onLoaded);
                liAudioTag.removeEventListener("loadeddata", onLoaded);
            };
            liAudioTag.addEventListener("loadedmetadata", onLoaded);
            liAudioTag.addEventListener("loadeddata", onLoaded);
        }
    }
}

const updateActiveListItem = () => {
    const items = ul.querySelectorAll('li.list-group-item');
    items.forEach((li, idx) => {
        if (idx === player.index) {
            li.classList.add('active');
        } else {
            li.classList.remove('active');
        }
    });
}