
const getExtension = (url) => { return url.split('?').shift().split('#').shift().split('.').pop() }

function playM3u8(url) {
  console.log('playing m3u8:', url)
  if (Hls.isSupported()) {
    var video = document.getElementById('video');
    video.volume = 1.0;
    var hls = new Hls();
    var m3u8Url = decodeURIComponent(url)
    hls.loadSource(m3u8Url);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      video.play();
    });
  }
}

function playMp4(url) {
  console.log('playing mp4:', url)
  var video = document.getElementById('video');
  video.volume = 1.0;
  video.src = url;
  video.load();
  video.play();

}

function playVideo(url) {
  document.title = url;
  switch (getExtension(url)) {
    case 'mp4':
      playMp4(url);
      break;
    case 'm3u8':
      playM3u8(url);
      break;
  }
}

playVideo(window.location.href.split("#")[1])
