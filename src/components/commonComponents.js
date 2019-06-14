import tipInput from './tipInput/tipInput.vue';

const commonComponents = {
  install (Vue) {
    Vue.component('tip-input', tipInput);
  }
};

export default commonComponents;