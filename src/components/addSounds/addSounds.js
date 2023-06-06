import startSound from '../../assets/audio/start.mp3';
import clickSound from '../../assets/audio/click.mp3';
import winSound from '../../assets/audio/win.mp3';
import loseSound from '../../assets/audio/lose.mp3';

function addSounds() {
  const sounds = {
    startSound,
    clickSound,
    winSound,
    loseSound,
  };
  let isMute = false;

  Object.keys(sounds).forEach((key) => {
    const audio = document.createElement('audio');
    audio.id = key;
    audio.src = sounds[key];
    document.body.append(audio);
  });

  const header = document.querySelector('.header');
  const soundsVolume = document.createElement('button');
  soundsVolume.classList.add('btn', 'sound');

  soundsVolume.addEventListener('click', () => {
    isMute = !isMute;
    if (isMute) {
      soundsVolume.classList.add('sound_mute');
    } else {
      soundsVolume.classList.remove('sound_mute');
    }
    Object.keys(sounds).forEach((key) => {
      const audio = document.getElementById(key);
      audio.volume = isMute ? 0 : 1;
    });
  });

  header.append(soundsVolume);
}

export default addSounds;
