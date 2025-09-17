class Music {
    constructor(title, singer, img, file) {
        this.title = title;
        this.singer = singer;
        this.img = img;
        this.file = file;
    } 
    getName() {
        return this.title + " - " + this.singer;
    }
};

const musicList = [
    new Music("Meftun", "Sagopa Kajmer", "1.jpg", "1.mp3"),
    new Music("Sen Beni Unutamazsın", "Emre Aydın", "2.jpg", "2.mp3"),
    new Music("Lingo Lingo Şişeler", "Barabar", "3.jpg", "3.mp3")
];