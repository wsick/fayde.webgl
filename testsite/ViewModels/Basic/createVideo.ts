function createVideo(src: string, onloaded: () => void): HTMLVideoElement {
    var video = document.createElement('video');
    video.addEventListener('canplaythrough', () => {
        video.play();
        onloaded();
    }, true);
    video.addEventListener('ended', () => video.load(), true);
    video.preload = "auto";
    video.src = src;
    return video;
}
export = createVideo;