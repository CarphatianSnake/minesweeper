class Modal {
  constructor(callback) {
    this.wrapper = document.createElement('div');
    this.modal = document.createElement('div');
    this.callback = callback;
  }

  init = () => {
    const { modal, wrapper } = this;
    wrapper.classList.add('modal__wrapper', 'opacity-zero');
    modal.classList.add('modal', 'scale-zero');

    const closeButton = document.createElement('button');
    closeButton.classList.add('btn', 'btn_close');
    closeButton.textContent = '✘';

    const content = this.callback();

    modal.append(closeButton);
    modal.append(content);
    wrapper.append(modal);
    document.body.append(wrapper);

    setTimeout(() => {
      modal.classList.remove('scale-zero');
      wrapper.classList.remove('opacity-zero');
    }, 15);

    wrapper.addEventListener('click', (e) => {
      const isWrapper = e.target.classList.contains('modal__wrapper');
      const isCloseButton = e.target.classList.contains('btn_close');
      if (isWrapper || isCloseButton) {
        this.close();
      }
    });
  };

  close = () => {
    const { wrapper, modal } = this;
    wrapper.classList.add('opacity-zero');
    modal.classList.add('scale-zero');

    setTimeout(() => {
      wrapper.remove();
    }, 200);
  };
}

export default Modal;
