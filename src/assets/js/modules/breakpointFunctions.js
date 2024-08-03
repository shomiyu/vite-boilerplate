import { observerStartBody } from '@js/libs/breakpoints';

const funcPc = () => {
  console.log('pc eventが発火した！');
};

const func = () => {
  console.log('sp eventが発火した！');
};

observerStartBody({
  pc: {
    add: () => {
      // PC表示注に適用したい処理
      window.addEventListener('scroll', funcPc);
    },
    remove: () => {
      // PC表示以外になったときに解除したい処理
      window.removeEventListener('scroll', funcPc);
    },
  },
  sp: {
    add: () => {
      // スマホ表示中に適用したい処理
      window.addEventListener('click', func);
    },
    remove: () => {
      // スマホ表示以外になったときに解除したい処理
      window.removeEventListener('click', func);
    },
  },
});
