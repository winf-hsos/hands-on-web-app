// A YouTube video, loaded only when the learner presses play (pages.mjs,
// videoBlock): the button gives way to the player, which starts at once.
for (const frame of document.querySelectorAll('[data-video]')) {
  frame.querySelector('.video-play').addEventListener('click', () => {
    const player = Object.assign(document.createElement('iframe'), {
      src: frame.dataset.video,
      title: frame.dataset.videoTitle,
      allow: 'autoplay; encrypted-media; picture-in-picture; fullscreen',
      allowFullscreen: true,
    });
    frame.replaceChildren(player);
    player.focus();
  });
}
